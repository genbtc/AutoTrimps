MODULES["equipment"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["equipment"].numHitsSurvived = 10;   //survive X hits in D stance or not enough Health.
MODULES["equipment"].numHitsSurvivedScry = 80;
MODULES["equipment"].enoughDamageCutoff = 4; //above this the game will buy attack equipment

var equipmentList = {
    'Dagger': {
        Upgrade: 'Dagadder',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Mace': {
        Upgrade: 'Megamace',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Polearm': {
        Upgrade: 'Polierarm',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Battleaxe': {
        Upgrade: 'Axeidic',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Greatsword': {
        Upgrade: 'Greatersword',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Boots': {
        Upgrade: 'Bootboost',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Helmet': {
        Upgrade: 'Hellishmet',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Pants': {
        Upgrade: 'Pantastic',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shoulderguards': {
        Upgrade: 'Smoldershoulder',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Breastplate': {
        Upgrade: 'Bestplate',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Arbalest': {
        Upgrade: 'Harmbalest',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Gambeson': {
        Upgrade: 'GambesOP',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shield': {
        Upgrade: 'Supershield',
        Stat: 'health',
        Resource: 'wood',
        Equip: true
    },
    'Gym': {
        Upgrade: 'Gymystic',
        Stat: 'block',
        Resource: 'wood',
        Equip: false
    }
};
var mapresourcetojob = {"food": "Farmer", "wood": "Lumberjack", "metal": "Miner", "science": "Scientist"};  //map of resource to jobs

//Returns the amount of stats that the equipment (or gym) will give when bought.
function equipEffect(gameResource, equip) {
    if (equip.Equip) {
        return gameResource[equip.Stat + 'Calculated'];
    } else {
        //That be Gym
        var oldBlock = gameResource.increase.by * gameResource.owned;
        var Mod = game.upgrades.Gymystic.done ? (game.upgrades.Gymystic.modifier + (0.01 * (game.upgrades.Gymystic.done - 1))) : 1;
        var newBlock = gameResource.increase.by * (gameResource.owned + 1) * Mod;
        return newBlock - oldBlock;
    }
}
//Returns the cost after Artisanistry of a piece of equipment.
function equipCost(gameResource, equip) {
    var price = parseFloat(getBuildingItemPrice(gameResource, equip.Resource, equip.Equip, 1));
    if (equip.Equip)
        price = Math.ceil(price * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
    else
        price = Math.ceil(price * (Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level)));
    return price;
}
//Returns the amount of stats that the prestige will give when bought.
function PrestigeValue(what) {
    var name = game.upgrades[what].prestiges;
    var equipment = game.equipment[name];
    var stat;
    if (equipment.blockNow) stat = "block";
    else stat = (typeof equipment.health !== 'undefined') ? "health" : "attack";
    var toReturn = Math.round(equipment[stat] * Math.pow(1.19, ((equipment.prestige) * game.global.prestige[stat]) + 1));
    return toReturn;
}


//evaluateEquipmentEfficiency: Back end function for autoLevelEquipment to determine most cost efficient items, and what color they should be.
function evaluateEquipmentEfficiency(equipName) {
    var equip = equipmentList[equipName];
    var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
    if (equipName == 'Shield') {
        if (gameResource.blockNow) {
            equip.Stat = 'block';
        } else {
            equip.Stat = 'health';
        }
    }
    var Effect = equipEffect(gameResource, equip);
    var Cost = equipCost(gameResource, equip);
    var Factor = Effect / Cost;
    var StatusBorder = 'white';
    var Wall = false;

    if (!game.upgrades[equip.Upgrade].locked) {
        //Evaluating upgrade!
        var CanAfford = canAffordTwoLevel(game.upgrades[equip.Upgrade]);
        if (equip.Equip) {
            var NextEffect = PrestigeValue(equip.Upgrade);
            //Scientist 3 and 4 challenge: set metalcost to Infinity so it can buy equipment levels without waiting for prestige. (fake the impossible science cost)
            //also Fake set the next cost to infinity so it doesn't wait for prestiges if you have both options disabled.
            if ((game.global.challengeActive == "Scientist" && getScientistLevel() > 2) || ((!getPageSetting('BuyArmorUpgrades') && !getPageSetting('BuyWeaponUpgrades'))))
                var NextCost = Infinity;
            else
                var NextCost = Math.ceil(getNextPrestigeCost(equip.Upgrade) * Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level));
            Wall = (NextEffect / NextCost > Factor);
        }

        //white - Upgrade is not available
        //yellow - Upgrade is not affordable
        //orange - Upgrade is affordable, but will lower stats
        //red - Yes, do it now!

        if (!CanAfford) {
            StatusBorder = 'yellow';
        } else {
            if (!equip.Equip) {
                //Gymystic is always cool, f*** shield - lol
                StatusBorder = 'red';
            } else {
                var CurrEffect = gameResource.level * Effect;
                var NeedLevel = Math.ceil(CurrEffect / NextEffect);
                var Ratio = gameResource.cost[equip.Resource][1];
                var NeedResource = NextCost * (Math.pow(Ratio, NeedLevel) - 1) / (Ratio - 1);
                if (game.resources[equip.Resource].owned > NeedResource) {
                    StatusBorder = 'red';
                } else {
                    StatusBorder = 'orange';
                }
            }
        }
    }
    //what this means:
    //wall (don't buy any more equipment, buy prestige first)
    //Factor = 0 sets the efficiency to 0 so that it will be disregarded. if not, efficiency will still be somenumber that is cheaper,
    //      and the algorithm will get stuck on whatever equipment we have capped, and not buy other equipment.
    if (game.jobs[mapresourcetojob[equip.Resource]].locked && (game.global.challengeActive != 'Metal')){
        //cap any equips that we haven't unlocked metal for (new/fresh game/level1/no helium code)
        Factor = 0;
        Wall = true;
    }
    if (getPageSetting('CapEquip2') > 0 && gameResource.level >= getPageSetting('CapEquip2')) {
        Factor = 0;
        Wall = true;
    }
    if (equipName != 'Gym' && game.global.world >= 58 && game.global.world < 60 && getPageSetting('WaitTill60')){
        Wall = true;
    }
    if (gameResource.level < 2 && equip.Stat == 'health' && getPageSetting('AlwaysArmorLvl2')){
        Factor = 9999 - gameResource.prestige;
    }
    //skip buying shields (w/ shieldblock) if we need gymystics
    //getPageSetting('BuyShieldblock') && getPageSetting('BuyArmorUpgrades') &&
    if (equipName == 'Shield' && gameResource.blockNow &&
        game.upgrades['Gymystic'].allowed - game.upgrades['Gymystic'].done > 0)
        {
            needGymystic = true;
            Factor = 0;
            Wall = true;
            StatusBorder = 'orange';
        }
    return {
        Stat: equip.Stat,
        Factor: Factor,
        StatusBorder: StatusBorder,
        Wall: Wall,
        Cost: Cost
    };
}

var resourcesNeeded;
var Best;
//autoLevelEquipment = "Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"
function autoLevelEquipment() {
    if (!(baseDamage > 0)) return;  //if we have no damage, why bother running anything? (this fixes weird bugs)
    //if((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist"))
        //return;
    resourcesNeeded = {"food": 0, "wood": 0, "metal": 0, "science": 0, "gems": 0};  //list of amount of resources needed for stuff we want to afford
    Best = {};
    var keys = ['healthwood', 'healthmetal', 'attackmetal', 'blockwood'];
    for (var i = 0; i < keys.length; i++) {
        Best[keys[i]] = {
            Factor: 0,
            Name: '',
            Wall: false,
            StatusBorder: 'white',
            Cost: 0
        };
    }
    var enemyDamage = getEnemyMaxAttack(game.global.world + 1, 50, 'Snimp', 1.2);
    enemyDamage = calcDailyAttackMod(enemyDamage); //daily mods: badStrength,badMapStrength,bloodthirst
    var enemyHealth = getEnemyMaxHealth(game.global.world + 1);
    //Take Spire as a special case.
    var spirecheck = isActiveSpireAT();
    if (spirecheck) {
        var exitcell = getPageSetting('ExitSpireCell');
        var cell = (!game.global.mapsActive && !game.global.preMapsActive) ? game.global.lastClearedCell : 50;
        if (exitcell > 1)
            cell = exitcell;
        enemyDamage = getSpireStats(cell, "Snimp", "attack");
        enemyDamage = calcDailyAttackMod(enemyDamage); //daily mods: badStrength,badMapStrength,bloodthirst
        enemyHealth = getSpireStats(cell, "Snimp", "health");
    }

    //below challenge multiplier not necessarily accurate, just fudge factors
    if(game.global.challengeActive == "Toxicity") {
        //ignore damage changes (which would effect how much health we try to buy) entirely since we die in 20 attacks anyway?
        if(game.global.world < 61)
            enemyDamage *= 2;
        enemyHealth *= 2;
    }
    if(game.global.challengeActive == 'Lead') {
        enemyDamage *= 2.5;
        enemyHealth *= 7;
    }
    var pierceMod = (game.global.brokenPlanet && !game.global.mapsActive) ? getPierceAmt() : 0;
    //change name to make sure these are local to the function
    var enoughHealthE,enoughDamageE;
    const FORMATION_MOD_1 = game.upgrades.Dominance.done ? 2 : 1;
    //const FORMATION_MOD_2 = game.upgrades.Dominance.done ? 4 : 1;
    var numHits = MODULES["equipment"].numHitsSurvived;    //this can be changed.
    var numHitsScry = MODULES["equipment"].numHitsSurvivedScry;
    var min_zone = getPageSetting('ScryerMinZone');
    var max_zone = getPageSetting('ScryerMaxZone');
    var valid_min = game.global.world >= min_zone;
    var valid_max = max_zone <= 0 || game.global.world < max_zone;
    //asks if we can survive x number of hits in either D stance or X stance.
    enoughHealthE = !(doVoids && voidCheckPercent > 0) &&
        (baseHealth/FORMATION_MOD_1 > numHits * (enemyDamage - baseBlock/FORMATION_MOD_1 > 0 ? enemyDamage - baseBlock/FORMATION_MOD_1 : enemyDamage * pierceMod)) &&
        (!(valid_min && valid_max) || (baseHealth/2 > numHitsScry * (enemyDamage - baseBlock/2 > 0 ? enemyDamage - baseBlock/2 : enemyDamage * pierceMod)));
    enoughDamageE = (baseDamage * MODULES["equipment"].enoughDamageCutoff > enemyHealth);
    
//PRESTIGE and UPGRADE SECTION:
    for (var equipName in equipmentList) {
        var equip = equipmentList[equipName];
        // debug('Equip: ' + equip + ' EquipIndex ' + equipName);
        var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
        // debug('Game Resource: ' + gameResource);
        if (!gameResource.locked) {
            var $equipName = document.getElementById(equipName);
            $equipName.style.color = 'white';   //reset
            var evaluation = evaluateEquipmentEfficiency(equipName);
            // debug(equipName + ' evaluation ' + evaluation.StatusBorder);
            var BKey = equip.Stat + equip.Resource;
            // debug(equipName + ' bkey ' + BKey);

            if (Best[BKey].Factor === 0 || Best[BKey].Factor < evaluation.Factor) {
                Best[BKey].Factor = evaluation.Factor;
                Best[BKey].Name = equipName;
                Best[BKey].Wall = evaluation.Wall;
                Best[BKey].StatusBorder = evaluation.StatusBorder;
            }
            Best[BKey].Cost = evaluation.Cost;
            //Apply colors from before:
            //white - Upgrade is not available
            //yellow - Upgrade is not affordable (or capped)
            //orange - Upgrade is affordable, but will lower stats
            //red - Yes, do it now!

            $equipName.style.border = '1px solid ' + evaluation.StatusBorder;
            var $equipUpgrade = document.getElementById(equip.Upgrade);
            if (evaluation.StatusBorder != 'white' && evaluation.StatusBorder != 'yellow') {
                if ($equipUpgrade)
                    $equipUpgrade.style.color = evaluation.StatusBorder;
            }
            if (evaluation.StatusBorder == 'yellow') {
                $equipUpgrade.style.color = 'white';
            }
            if (evaluation.Wall) {
                $equipName.style.color = 'yellow';
            }
            if (equipName == 'Gym' && needGymystic) {
                $equipName.style.color = 'white';
                $equipName.style.border = '1px solid white';
                $equipUpgrade.style.color = 'red';
                $equipUpgrade.style.border = '2px solid red';
            }
            //add up whats needed:
            resourcesNeeded[equip.Resource] += Best[BKey].Cost;

            //Code is Spaced This Way So You Can Read It:
            if (evaluation.StatusBorder == 'red' && !(game.global.world >= 58 && game.global.world < 60 && getPageSetting('WaitTill60'))) {
                var BuyWeaponUpgrades = getPageSetting('BuyWeaponUpgrades');
                var BuyArmorUpgrades = getPageSetting('BuyArmorUpgrades');
                var DelayArmorWhenNeeded = getPageSetting('DelayArmorWhenNeeded');
                if
                (
                    ( BuyWeaponUpgrades && equipmentList[equipName].Stat == 'attack' )
                    ||
                    ( BuyWeaponUpgrades && equipmentList[equipName].Stat == 'block' )
                    ||
                    ( BuyArmorUpgrades && equipmentList[equipName].Stat == 'health' &&
                //Only buy Armor prestiges when 'DelayArmorWhenNeeded' is on, IF:
                        (
                            ( DelayArmorWhenNeeded && !shouldFarm)  // not during "Farming" mode
                            ||                                                       //     or
                            ( DelayArmorWhenNeeded && enoughDamageE) //  has enough damage (not in "Wants more Damage" mode)
                            ||                                                       //     or
                            ( DelayArmorWhenNeeded && !enoughDamageE && !enoughHealthE) // if neither enough dmg or health, then tis ok to buy.
                            ||
                            ( DelayArmorWhenNeeded && equipmentList[equipName].Resource == 'wood')
                            ||
                            ( !DelayArmorWhenNeeded) //or when its off.
                        )
                    )
                )
                {
                    var upgrade = equipmentList[equipName].Upgrade;
                    if (upgrade != "Gymystic")
                        debug('Upgrading ' + upgrade + " - Prestige " + game.equipment[equipName].prestige, "equips", '*upload');
                    else
                        debug('Upgrading ' + upgrade + " # " + game.upgrades[upgrade].allowed, "equips", '*upload');
                    buyUpgrade(upgrade, true, true);
                }
                else {
                    $equipName.style.color = 'orange';
                    $equipName.style.border = '2px solid orange';
                }
            }
        }
    }

//LEVELING EQUIPMENT SECTION
    preBuy();
    game.global.buyAmt = 1; //needed for buyEquipment()
    for (var stat in Best) {
        var eqName = Best[stat].Name;
        var $eqName = document.getElementById(eqName);
        if (eqName !== '') {
            var DaThing = equipmentList[eqName];
            if (eqName == 'Gym' && needGymystic) {
                $eqName.style.color = 'white';
                $eqName.style.border = '1px solid white';
                continue;
            } else {
                $eqName.style.color = Best[stat].Wall ? 'orange' : 'red';
                $eqName.style.border = '2px solid red';
            }
            //If we're considering an attack item, we want to buy weapons if we don't have enough damage, or if we don't need health (so we default to buying some damage)
            if (getPageSetting('BuyWeapons') && DaThing.Stat == 'attack' && (!enoughDamageE || enoughHealthE)) {
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(eqName, null, null, true)) {
                    debug('Leveling equipment ' + eqName, "equips", '*upload3');
                    buyEquipment(eqName, null, true);
                }
            }
            //If we're considering a health item, buy it if we don't have enough health, otherwise we default to buying damage
            if (getPageSetting('BuyArmor') && (DaThing.Stat == 'health' || DaThing.Stat == 'block') && !enoughHealthE) {
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(eqName, null, null, true)) {
                    debug('Leveling equipment ' + eqName, "equips", '*upload3');
                    buyEquipment(eqName, null, true);
                }
            }
            var aalvl2 = getPageSetting('AlwaysArmorLvl2') || (spirecheck);
            if (getPageSetting('BuyArmor') && (DaThing.Stat == 'health') && aalvl2 && game.equipment[eqName].level < 2){
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(eqName, null, null, true)) {
                    debug('Leveling equipment ' + eqName + " (AlwaysArmorLvl2)", "equips", '*upload3');
                    buyEquipment(eqName, null, true);
                }
            }
        }
    }
    postBuy();
}

function areWeAttackLevelCapped() {
    //check if we have cap to 10 equip on, and we are capped for all attack weapons
    var attack = [];
    for (var equipName in equipmentList) {
        var equip = equipmentList[equipName];
        var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
        if (!gameResource.locked) {
            var evaluation = evaluateEquipmentEfficiency(equipName);
            if (evaluation.Stat == "attack")
                attack.push(evaluation);
        }
    }
    return attack.every(evaluation => (evaluation.Factor == 0 && evaluation.Wall == true));
}
