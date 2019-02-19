MODULES["buildings"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["buildings"].nursCostRatio = 0.05; //nursery to warpstation/collector cost ratio. Also for extra gems.
MODULES["buildings"].storageMainCutoff = 0.85; //when to buy more storage. (85% )
MODULES["buildings"].storageLowlvlCutoff1 = 0.7; //when to buy more storage at zone 1
MODULES["buildings"].storageLowlvlCutoff2 = 0.5; //when to buy more storage from zone 2-10   (more leeway so it doesnt fill up)

var housingList = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation'];

//An error-resilient function that will actually purchase buildings and return a success status
function safeBuyBuilding(building) {
    if (isBuildingInQueue(building))
        return false;
    //check if building is locked, or else it can buy 'phantom' buildings and is not exactly safe.
    if (game.buildings[building].locked)
        return false;
    var oldBuy = preBuy2();
    //build 10 or 2 at a time if we have the mastery for it.
    //Note: Bypasses any "Max" caps by 1 if they are odd numbers and we can afford the 2nd one.//@todo #24
    if (game.talents.deciBuild.purchased) {//@todo refactor without this horrendous nested ifs and code duplication
        game.global.buyAmt = 10;
        if (!canAffordBuilding(building)) {
            game.global.buyAmt = 2;
            if (!canAffordBuilding(building)) {
                game.global.buyAmt = 1;
                if (!canAffordBuilding(building)) {
                    postBuy2(oldBuy);
                    return false;
                }
            }
        }
    } else if (game.talents.doubleBuild.purchased) {
        game.global.buyAmt = 2;
        if (!canAffordBuilding(building)) {
            game.global.buyAmt = 1;
            if (!canAffordBuilding(building)) {
                postBuy2(oldBuy);
                return false;
            }
        }
    } else {
        game.global.buyAmt = 1;
        if (!canAffordBuilding(building)) {
            postBuy2(oldBuy);
            return false;
        }
    }
    game.global.firing = false;
    if (building == 'Gym' && getPageSetting('GymWall')) {
        game.global.buyAmt = 1;
    }
    //buy max warpstations when we own <2 (ie: after a new giga)
    //thereafter, buy only 1 warpstation
    if (building == 'Warpstation') {
        if (game.buildings.Warpstation.owned < 2) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
        } else {
            game.global.buyAmt = 1;
        }
        buyBuilding(building, true, true);
        debug('Building ' + game.global.buyAmt + ' ' + building + 's', "buildings", '*rocket');
        postBuy2(oldBuy);
        return;
    }
    debug('Building ' + building, "buildings", '*hammer2');
    buyBuilding(building, true, true);
    postBuy2(oldBuy);
    return true;
}

//Decision function to buy best "Food" Buildings
function buyFoodEfficientHousing() {
    var foodHousing = ["Hut", "House", "Mansion", "Hotel", "Resort"];
    var unlockedHousing = [];
    for (var house in foodHousing) {
        if (game.buildings[foodHousing[house]].locked === 0) {
            unlockedHousing.push(foodHousing[house]);
        }
    }
    var buildorder = [];
    for (var house in unlockedHousing) {
        var building = game.buildings[unlockedHousing[house]];
        var cost = getBuildingItemPrice(building, "food", false, 1);
        var ratio = cost / building.increase.by;
        buildorder.push({
            'name': unlockedHousing[house],
            'ratio': ratio
        });
        document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
    }
    buildorder.sort(function (a, b) {
        return a.ratio - b.ratio;
    });
    var bestfoodBuilding = null;
    //if this building is first, its best.
    var bb = buildorder[0];
    var max = getPageSetting('Max' + bb.name);
    if (game.buildings[bb.name].owned < max || max == -1) {
        bestfoodBuilding = bb.name;
    }
    //if we found something make it green and buy it
    if (bestfoodBuilding) {
        document.getElementById(bestfoodBuilding).style.border = "1px solid #00CC01";
        safeBuyBuilding(bestfoodBuilding);
    }
}

function buyGemEfficientHousing() {
    var gemHousing = ["Hotel", "Resort", "Gateway", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (var house in gemHousing) {
        if (game.buildings[gemHousing[house]].locked === 0) {
            unlockedHousing.push(gemHousing[house]);
        }
    }
    var obj = {};
    for (var house in unlockedHousing) {
        var building = game.buildings[unlockedHousing[house]];
        var cost = getBuildingItemPrice(building, "gems", false, 1);
        var ratio = cost / building.increase.by;
        //don't consider Gateway if we can't afford it right now - hopefully to prevent game waiting for fragments to buy gateway when collector could be bought right now
        if (unlockedHousing[house] == "Gateway" && !canAffordBuilding('Gateway'))
            continue;
        obj[unlockedHousing[house]] = ratio;
        document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
    }
    var keysSorted = Object.keys(obj).sort(function (a, b) {
            return obj[a] - obj[b];
        });
    bestBuilding = null;
    //loop through the array and find the first one that isn't limited by max settings
    for (var best in keysSorted) {
        var max = getPageSetting('Max' + keysSorted[best]);
        if (max === false) max = -1;
        if (game.buildings[keysSorted[best]].owned < max || max == -1) {
            bestBuilding = keysSorted[best];
            document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
            //WarpStation Cap:
            var skipWarp = false;
            if (getPageSetting('WarpstationCap') && bestBuilding == "Warpstation") {
                //Warpstation Cap - if we are past the basewarp+deltagiga level, "cap" and just wait for next giga.
                if (game.buildings.Warpstation.owned >= (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')))
                    skipWarp = true;
            }
            //WarpStation Wall:
            var warpwallpct = getPageSetting('WarpstationWall3');
            if (warpwallpct > 1 && bestBuilding == "Warpstation") {
                //Warpstation Wall - allow only warps that cost 1/n'th less then current metal (try to save metal for next prestige)
                if (getBuildingItemPrice(game.buildings.Warpstation, "metal", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.metal.owned / warpwallpct))
                    skipWarp = true;
            }
            if (skipWarp)
                bestBuilding = null;
            //'Buy Warp to Hit Coord': (override Cap/Wall)
            var getcoord = getPageSetting('WarpstationCoordBuy');
            if (getcoord && skipWarp) {
                var toTip = game.buildings.Warpstation;
/*
                //calc Cost
                var warpMetalOK = getBuildingItemPrice(toTip, "metal", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) / game.resources.metal.owned;
                var warpGemsOK = getBuildingItemPrice(toTip, "gems", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) / game.resources.gems.owned;
                //var afford = Math.floor(Math.min(warpMetalOK,warpGemsOK));
                if (warpMetalOK <= 1 && warpGemsOK <= 1) {
*/
                if (canAffordBuilding("Warpstation")) {
                    var howMany = calculateMaxAfford(game.buildings["Warpstation"], true);
                    //calc trimps needed to next Coord
                    var needCoord = game.upgrades.Coordination.allowed - game.upgrades.Coordination.done > 0;
                    var coordReplace = (game.portal.Coordinated.level) ? (25 * Math.pow(game.portal.Coordinated.modifier, game.portal.Coordinated.level)).toFixed(3) : 25;
                    if (!canAffordCoordinationTrimps()){
                        var nextCount = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : game.resources.trimps.maxSoldiers;
                        var amtToGo = ((nextCount * 3) - game.resources.trimps.realMax());
                        //calc amount of trimps that warpstation increases by
                        var increase = toTip.increase.by;
                        if (game.portal.Carpentry.level && toTip.increase.what == "trimps.max") increase *= Math.pow(1.1, game.portal.Carpentry.level);
                        if (game.portal.Carpentry_II.level && toTip.increase.what == "trimps.max") increase *= (1 + (game.portal.Carpentry_II.modifier * game.portal.Carpentry_II.level));
                        //do it
                        if (amtToGo < increase*howMany)
                            bestBuilding = "Warpstation";
                    }
                }
            }
            break;
        }
    }
    //if we found something make it green and buy it
    if (bestBuilding) {
        safeBuyBuilding(bestBuilding);
    }
}

//Main Decision Function that determines cost efficiency and Buys all housing (gems), or calls buyFoodEfficientHousing, and also non-storage buildings (Gym,Tribute,Nursery)s
function buyBuildings() {
    if ((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist"))
        return;
    var customVars = MODULES["buildings"];
    var oldBuy = preBuy2();
    game.global.buyAmt = 1;
    buyFoodEfficientHousing();  //["Hut", "House", "Mansion", "Hotel", "Resort"];
    buyGemEfficientHousing();   //["Hotel", "Resort", "Gateway", "Collector", "Warpstation"];
    //WormHoles:
    if (getPageSetting('MaxWormhole') > 0 && game.buildings.Wormhole.owned < getPageSetting('MaxWormhole') && !game.buildings.Wormhole.locked) {
        safeBuyBuilding('Wormhole');
    }
    //Buy non-housing buildings:
    //Gyms:
    if (!game.buildings.Gym.locked && (getPageSetting('MaxGym') > game.buildings.Gym.owned || getPageSetting('MaxGym') == -1)) {
        var skipGym = false;
        if (getPageSetting('DynamicGyms')) {
            //getBattleStats calculation comes from battlecalc.js and shows the tooltip-table block amount. calcBadGuyDmg is in that file also
            if (!game.global.preMapsActive && getBattleStats("block", true) > calcBadGuyDmg(getCurrentEnemy(), null, true,true))
                skipGym = true;
        }
        //still buy gyms if we are farming for voids
        if (doVoids && voidCheckPercent > 0)
            skipGym = false;
        //(unless gymwall; thats why its after. debateable.)
        var gymwallpct = getPageSetting('GymWall');
        if (gymwallpct > 1) {
            //Gym Wall - allow only gyms that cost 1/n'th less then current wood (try to save wood for nurseries for new z230+ Magma nursery strategy)
            if (getBuildingItemPrice(game.buildings.Gym, "wood", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.wood.owned / gymwallpct))
                skipGym = true;
        }
        //ShieldBlock cost Effectiveness:
        if (game.equipment['Shield'].blockNow) {
            var gymEff = evaluateEquipmentEfficiency('Gym');
            var shieldEff = evaluateEquipmentEfficiency('Shield');
            if ((gymEff.Wall) || (gymEff.Factor <= shieldEff.Factor && !gymEff.Wall))
                skipGym = true;
        }
        //needGymystic is eval'ed by equipment.js line 204, Which is called AFTER buildings.js (spans two cycles)
        if (needGymystic) skipGym = true;
        if (!skipGym)
            safeBuyBuilding('Gym');
        needGymystic = false;  //needs reset after buyBuildings
    }
    //Tributes:
    if (!game.buildings.Tribute.locked && (getPageSetting('MaxTribute') > game.buildings.Tribute.owned || getPageSetting('MaxTribute') == -1)) {
        safeBuyBuilding('Tribute');
    }
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
//NURSERIES:
    //NoNurseriesUntil', 'No Nurseries Until z', 'For Magma z230+ purposes. Nurseries get shut down, and wasting nurseries early on is probably a bad idea. Might want to set this to    230+ as well.'
    var nursminlvl = getPageSetting('NoNurseriesUntil');
    //Activate dynamic Nurseries to buy nurseries from NoNurseriesUntilZone up to portal before zone.
    function dynamicNurseries() {
        var maxNursery = getPageSetting('MaxNursery');
        var finalZone = getPageSetting('HeHrDontPortalBefore')
        var numZ = finalZone - nursminlvl;
        var perZ = maxNursery / ((numZ / 10 + 1));
        return perZ;
    }
    var dynNursStop = 0;
    if (getPageSetting('DynamicNurseries')) {
        dynNursStop = dynamicNurseries();
    }
    var preSpireOverride = getPageSetting('PreSpireNurseries');
    //override NoNurseriesUntil and MaxNursery if on a Spire >= IgnoreSpiresUntil, or on a world zone < 200 when IgnoreSpiresUntil is set to <= 200
    var overrideNurseries = preSpireOverride >= 0 && (isActiveSpireAT() || (game.global.world < 200 && getPageSetting('IgnoreSpiresUntil') <= 200));
    if (game.global.world < nursminlvl && !overrideNurseries) {
        postBuy2(oldBuy);
        return;
    }
    var maxNursery = overrideNurseries ? preSpireOverride : getPageSetting('MaxNursery');
    if (dynNursStop > 0)
        maxNursery = dynNursStop;
    //only buy nurseries if enabled,   and we need to lower our breed time, or our target breed time is 0, or we aren't trying to manage our breed time before geneticists, and they aren't locked
    //even if we are trying to manage breed timer pre-geneticists, start buying nurseries once geneticists are unlocked AS LONG AS we can afford a geneticist (to prevent nurseries from outpacing geneticists soon after they are unlocked)
    if ((targetBreed < getBreedTime() || targetBreed <= 0 ||
        (targetBreed < getBreedTime(true) && game.global.challengeActive == 'Watch') ||
        (!game.jobs.Geneticist.locked && canAffordJob('Geneticist', false, 1))) && !game.buildings.Nursery.locked) {
        var nwr = customVars.nursCostRatio; //nursery to warpstation/collector cost ratio. Also for extra gems.
        var nursCost = getBuildingItemPrice(game.buildings.Nursery, "gems", false, 1);
        var warpCost = getBuildingItemPrice(game.buildings.Warpstation, "gems", false, 1);
        var collCost = getBuildingItemPrice(game.buildings.Collector, "gems", false, 1);
        var resomod = Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level); //need to apply the resourceful mod when comparing anything other than building vs building.
        //buy nurseries irrelevant of warpstations (after we unlock them) - if we have enough extra gems that its not going to impact anything. note:(we will be limited by wood anyway - might use a lot of extra wood)
        var buyWithExtraGems = (!game.buildings.Warpstation.locked && nursCost * resomod < nwr * game.resources.gems.owned);
        if ((maxNursery > game.buildings.Nursery.owned || maxNursery == -1) &&
            (buyWithExtraGems ||
             ((nursCost < nwr * warpCost || game.buildings.Warpstation.locked) &&
              (nursCost < nwr * collCost || game.buildings.Collector.locked || !game.buildings.Warpstation.locked)))) {
               safeBuyBuilding('Nursery');
        }
    }
    postBuy2(oldBuy);
}

//Buys more storage if resource is over 85% full (or 50% if Zone 2-10) (or 70% if zone==1)
function buyStorage() {
    var customVars = MODULES["buildings"];
    var packMod = 1 + game.portal.Packrat.level * game.portal.Packrat.modifier;
    var Bs = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };
    for (var B in Bs) {
        var jest = 0;
        var owned = game.resources[Bs[B]].owned;
        var max = game.resources[Bs[B]].max * packMod;
        max = calcHeirloomBonus("Shield", "storageSize", max);
        if (game.global.mapsActive && game.unlocks.imps.Jestimp) {
            jest = simpleSeconds(Bs[B], 45);
            jest = scaleToCurrentMap(jest);
        }
        if ((game.global.world == 1 && owned > max * customVars.storageLowlvlCutoff1) ||
            (game.global.world >= 2 && game.global.world < 10 && owned > max * customVars.storageLowlvlCutoff2) ||
            (owned + jest > max * customVars.storageMainCutoff)) {
            // debug('Buying ' + B + '(' + Bs[B] + ') at ' + Math.floor(game.resources[Bs[B]].owned / (game.resources[Bs[B]].max * packMod * 0.99) * 100) + '%');
            if (canAffordBuilding(B) && game.triggers[B].done) {
                safeBuyBuilding(B);
            }
        }
    }
}
