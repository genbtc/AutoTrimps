// ==UserScript==
// @name         AutoTrimpsV2+genBTC
// @namespace    http://tampermonkey.net/
// @version      2.1.3.1-genbtc-11-23-2016+AutoPerks
// @description  try to take over the world!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

////////////////////////////////////////
//Variables/////////////////////////////
////////////////////////////////////////
var ATversion = '2.1.3.1-genbtc-11-23-2016+AutoPerks';
var AutoTrimpsDebugTabVisible = true;
var enableDebug = true; //Spam console
var autoTrimpSettings = {};
var bestBuilding;
var scienceNeeded;
var breedFire = false;
var shouldFarm = false;
var enoughDamage = true;
var enoughHealth = true;
var stopScientistsatFarmers;

var baseDamage = 0;
var baseBlock = 0;
var baseHealth = 0;

var preBuyAmt;
var preBuyFiring;
var preBuyTooltip;
var preBuymaxSplit;

////////////////////////////////////////
//Magic Numbers/////////////////////////
////////////////////////////////////////
var runInterval = 100;      //How often to loop through logic
var startupDelay = 2000;    //How long to wait for everything to load

////////////////////////////////////////
//List Variables////////////////////////
////////////////////////////////////////
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

var upgradeList = ['Miners', 'Scientists', 'Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm', 'Gigastation', 'Shieldblock', 'Potency', 'Magmamancers'];
var housingList = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation'];


////////////////////////////////////////
//Utility Functions/////////////////////
////////////////////////////////////////
//polyfill for includes function
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

//Loads the automation settings from browser cache
function loadPageVariables() {
    var tmp = JSON.parse(localStorage.getItem('autoTrimpSettings'));
    if (tmp !== null) {
        autoTrimpSettings = tmp;
    }
}

function getCorruptScale(type) {
    switch (type) {
        case "attack":
            return mutations.Corruption.statScale(3);

        case "health":
            return mutations.Corruption.statScale(10);
    }
}

//Saves automation settings to browser cache
function saveSettings() {
    // debug('Saved');
    localStorage.setItem('autoTrimpSettings', JSON.stringify(autoTrimpSettings));
}

//Grabs the automation settings from the page

function getPageSetting(setting) {
    if (autoTrimpSettings.hasOwnProperty(setting) == false) {
        return false;
    }
    if (autoTrimpSettings[setting].type == 'boolean') {
        // debug('found a boolean');
        return autoTrimpSettings[setting].enabled;
    } else if (autoTrimpSettings[setting].type == 'value') {
        // debug('found a value');
        return parseFloat(autoTrimpSettings[setting].value);
    } else if (autoTrimpSettings[setting].type == 'multitoggle') {
        // debug('found a multitoggle');
        return parseInt(autoTrimpSettings[setting].value);
    }
}

//programmatically sets the underlying variable of the UI Setting and the appropriate Button CSS style&color
function setPageSetting(setting, value) {
    if (autoTrimpSettings.hasOwnProperty(setting) == false) {
        return false;
    }
    if (autoTrimpSettings[setting].type == 'boolean') {
        // debug('found a boolean');
        autoTrimpSettings[setting].enabled = value;
        document.getElementById(setting).setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[setting].enabled);
    } else if (autoTrimpSettings[setting].type == 'value') {
        // debug('found a value');
        autoTrimpSettings[setting].value = value;
    } else if (autoTrimpSettings[setting].type == 'multitoggle') {
        // debug('found a value');
        autoTrimpSettings[setting].value = value;
        document.getElementById(setting).setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[setting].value);
    } else if (autoTrimpSettings[setting].type == 'dropdown') {
        // debug('found a dropdown');
        autoTrimpSettings[setting].selected = value;
    }
    updateCustomButtons();
    saveSettings();
    checkSettings();
}

//Global debug message
function debug(message, type, lootIcon) {
    var buildings = getPageSetting('SpamBuilding');
    var jobs = getPageSetting('SpamJobs');
    var upgrades = getPageSetting('SpamUpgrades');
    var equips = getPageSetting('SpamEquipment');
    var maps = getPageSetting('SpamMaps');
    var other = getPageSetting('SpamOther');
    var general = getPageSetting('SpamGeneral');
    var output = true;
    switch (type) {
        case null:
            break;
        case "buildings":
            output = buildings;
            break;
        case "jobs":
            output = jobs;
            break;
        case "upgrades":
            output = upgrades;
            break;
        case "equips":
            output = equips;
            break;
        case "maps":
            output = maps;
            break;
        case "other":
            output = other;
            break;
        case "general":
            output = general;
            break;            
    }
    if (enableDebug && output) {
        console.log(timeStamp() + ' ' + message);
        message2(message, "AutoTrimps", lootIcon, type);
    }
}

//Simply returns a formatted text timestamp
function timeStamp() {
    var now = new Date();

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return time.join(":");
}

function getPerSecBeforeManual(job) {
    var perSec = 0;
    if (game.jobs[job].owned > 0){
        perSec = (game.jobs[job].owned * game.jobs[job].modifier);
        if (game.portal.Motivation.level > 0) perSec += (perSec * game.portal.Motivation.level * game.portal.Motivation.modifier);
        if (game.portal.Motivation_II.level > 0) perSec *= (1 + (game.portal.Motivation_II.level * game.portal.Motivation_II.modifier));
        if (game.portal.Meditation.level > 0) perSec *= (1 + (game.portal.Meditation.getBonusPercent() * 0.01)).toFixed(2);
        if (game.global.challengeActive == "Meditate") perSec *= 1.25;
        else if (game.global.challengeActive == "Size") perSec *= 1.5;
        if (game.global.challengeActive == "Toxicity"){
            var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
            perSec *= (1 + toxMult);
        }
        if (game.global.challengeActive == "Balance"){
            perSec *= game.challenges.Balance.getGatherMult();
        }
        if (game.global.challengeActive == "Watch") perSec /= 2;
        if (game.global.challengeActive == "Lead" && ((game.global.world % 2) == 1)) perSec*= 2;
        perSec = calcHeirloomBonus("Staff", job + "Speed", perSec);
    }
    return perSec;
}

function checkJobPercentageCost(what, toBuy) {
    var costItem = "food";
    var job = game.jobs[what];
    var cost = job.cost[costItem];
    var price = 0;
    if (!toBuy) toBuy = game.global.buyAmt;
    if (typeof cost[1] !== 'undefined')
        price =  Math.floor((cost[0] * Math.pow(cost[1], job.owned)) * ((Math.pow(cost[1], toBuy) - 1) / (cost[1] - 1)));
    else
        price = cost * toBuy;
    var percent;
    if (game.resources[costItem].owned < price){
        var thisPs = getPsString(costItem, true);
        if (thisPs > 0)
            percent = calculateTimeToMax(null, thisPs, (price - game.resources[costItem].owned));
            //console.log("time");
        return [false,percent];
    }
    else
        percent = (game.resources[costItem].owned > 0) ? ((price / game.resources[costItem].owned) * 100).toFixed(1) : 0;
        //console.log("percent");
    return [true,percent];
}

//Called before buying things that can be purchased in bulk
function preBuy() {
    preBuyAmt = game.global.buyAmt;
    preBuyFiring = game.global.firing;
    preBuyTooltip = game.global.lockTooltip;
    preBuymaxSplit = game.global.maxSplit;
}

//Called after buying things that can be purchased in bulk
function postBuy() {
    game.global.buyAmt = preBuyAmt;
    game.global.firing = preBuyFiring;
    game.global.lockTooltip = preBuyTooltip;
    game.global.maxSplit = preBuymaxSplit;
}

function safeBuyJob(jobTitle, amount) {
    if (amount === undefined) amount = 1;
    if (amount === 0) return false;
    preBuy();
    if (amount < 0) {
        amount = Math.abs(amount);
        game.global.firing = true;
        game.global.buyAmt = amount;
    } else{
        game.global.firing = false;
        game.global.buyAmt = amount;
        //if can afford, buy what we wanted,
        if (!canAffordJob(jobTitle, false)){
            game.global.buyAmt = 'Max'; //if we can't afford it, just use 'Max'. -it will always succeed-
            game.global.maxSplit = 1;
        }
    }
    debug((game.global.firing ? 'Firing ' : 'Hiring ') + prettify(game.global.buyAmt) + ' ' + jobTitle + 's', "jobs", "*users");
    buyJob(jobTitle, true, true);
    postBuy();
    return true;
}

function getScienceCostToUpgrade(upgrade) {
    var upgradeObj = game.upgrades[upgrade];
    if (upgradeObj.cost.resources.science !== undefined ? upgradeObj.cost.resources.science[0] !== undefined : false) {
        return Math.floor(upgradeObj.cost.resources.science[0] * Math.pow(upgradeObj.cost.resources.science[1], (upgradeObj.done)));
    } else if (upgradeObj.cost.resources.science !== undefined && upgradeObj.cost.resources.science[0] == undefined){
        return upgradeObj.cost.resources.science;
    } else {
        return 0;
    }
}

function setScienceNeeded() {
    scienceNeeded = 0;
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        if (game.upgrades[upgrade].allowed > game.upgrades[upgrade].done) { //If the upgrade is available
            if (game.global.world == 1 && game.global.totalHeliumEarned<=300 && upgrade.startsWith("Speed")) continue;  //skip speed upgrades on fresh game until level 2
            scienceNeeded += getScienceCostToUpgrade(upgrade);
        }
    }
}

function setTitle() {
    document.title = '(' + game.global.world + ')' + ' Trimps ' + document.getElementById('versionNumber').innerHTML;
    //for the dummies like me who always forget to turn automaps back on after portaling
    if(getPageSetting('RunUniqueMaps') && !game.upgrades.Battle.done && autoTrimpSettings.AutoMaps.enabled == false) {
        settingChanged("AutoMaps");
    }
}

function getEnemyMaxAttack(world, level, name, diff, corrupt) {
    var amt = 0;
    var adjWorld = ((world - 1) * 100) + level;
    amt += 50 * Math.sqrt(world) * Math.pow(3.27, world / 2);
    amt -= 10;
    if (world == 1){
        amt *= 0.35;
        amt = (amt * 0.20) + ((amt * 0.75) * (level / 100));
    }
    else if (world == 2){
        amt *= 0.5;
        amt = (amt * 0.32) + ((amt * 0.68) * (level / 100));
    }
    else if (world < 60)
        amt = (amt * 0.375) + ((amt * 0.7) * (level / 100));
    else{
        amt = (amt * 0.4) + ((amt * 0.9) * (level / 100));
        amt *= Math.pow(1.15, world - 59);
    }
    if (world < 60) amt *= 0.85;
    if (world > 6 && game.global.mapsActive) amt *= 1.1;
    if (diff) {
        amt *= diff;
    }
    if (!corrupt)
        amt *= game.badGuys[name].attack;
    else {
        amt *= getCorruptScale("attack");
    }
    return Math.floor(amt);
}

function getEnemyMaxHealth(world, level, corrupt) {
    if (!level)
        level = 30;
    var amt = 0;
    amt += 130 * Math.sqrt(world) * Math.pow(3.265, world / 2);
    amt -= 110;
    if (world == 1 || world == 2 && level < 10) {
        amt *= 0.6;
        amt = (amt * 0.25) + ((amt * 0.72) * (level / 100));
    }
    else if (world < 60)
        amt = (amt * 0.4) + ((amt * 0.4) * (level / 110));
    else {
        amt = (amt * 0.5) + ((amt * 0.8) * (level / 100));
        amt *= Math.pow(1.1, world - 59);
    }
    if (world < 60) amt *= 0.75;
    if (world > 5 && game.global.mapsActive) amt *= 1.1;
    if (!corrupt)
        amt *= game.badGuys["Grimp"].health;
    else
        amt *= getCorruptScale("health");
    return Math.floor(amt);
}

function getCurrentEnemy(current) {
    if (!current)
        current = 1;
    var enemy;
    if (!game.global.mapsActive && !game.global.preMapsActive) {
        if (typeof game.global.gridArray[game.global.lastClearedCell + current] === 'undefined') {
            enemy = game.global.gridArray[game.global.gridArray.length - 1];
        } else {
            enemy = game.global.gridArray[game.global.lastClearedCell + current];
        }
    } else if (game.global.mapsActive && !game.global.preMapsActive) {
        if (typeof game.global.mapGridArray[game.global.lastClearedMapCell + current] === 'undefined') {
            enemy = game.global.mapGridArray[game.global.gridArray.length - 1];
        } else {
            enemy = game.global.mapGridArray[game.global.lastClearedMapCell + current];
        }
    }
    return enemy;
}

function getCorruptedCellsNum() {
    var enemy;
    var corrupteds = 0;
    for (var i = 0; i < game.global.gridArray.length - 1; i++) {
        enemy = game.global.gridArray[i];
        if (enemy.corrupted)
            corrupteds++;
    }
    return corrupteds;
}
function getPotencyMod() {
    var potencyMod = game.resources.trimps.potency;
    //Add potency (book)
    if (game.upgrades.Potency.done > 0) potencyMod *= Math.pow(1.1, game.upgrades.Potency.done);
    //Add Nurseries
    if (game.buildings.Nursery.owned > 0) potencyMod *= Math.pow(1.01, game.buildings.Nursery.owned);
    //Add Venimp
    if (game.unlocks.impCount.Venimp > 0) potencyMod *= Math.pow(1.003, game.unlocks.impCount.Venimp);
    //Broken Planet
    if (game.global.brokenPlanet) potencyMod /= 10;
    //Pheromones
    potencyMod *= 1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
    //Geneticist
    if (game.jobs.Geneticist.owned > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned);
    //Quick Trimps
    if (game.unlocks.quickTrimps) potencyMod *= 2;
    //Daily mods
    if (game.global.challengeActive == "Daily"){
        if (typeof game.global.dailyChallenge.dysfunctional !== 'undefined'){
            potencyMod *= dailyModifiers.dysfunctional.getMult(game.global.dailyChallenge.dysfunctional.strength);
        }
        if (typeof game.global.dailyChallenge.toxic !== 'undefined'){
            potencyMod *= dailyModifiers.toxic.getMult(game.global.dailyChallenge.toxic.strength, game.global.dailyChallenge.toxic.stacks);
        }
    }
    if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0){
        potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
    }
    if (game.global.voidBuff == "slowBreed"){
        potencyMod *= 0.2;
    }
    potencyMod = calcHeirloomBonus("Shield", "breedSpeed", potencyMod);
    return potencyMod;
}    

function getBreedTime(remaining) {
    var trimps = game.resources.trimps;
    var trimpsMax = trimps.realMax();

    var potencyMod = getPotencyMod();
    // <breeding per second> would be calced here without the following line in potencymod
    potencyMod = (1 + (potencyMod / 10));
    var timeRemaining = log10((trimpsMax - trimps.employed) / (trimps.owned - trimps.employed)) / log10(potencyMod);
    timeRemaining /= 10;
    if (remaining)
        return parseFloat(timeRemaining.toFixed(1));

    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var totalTime = log10((trimpsMax - trimps.employed) / (trimpsMax - adjustedMax - trimps.employed)) / log10(potencyMod);
    totalTime /= 10;

    return parseFloat(totalTime.toFixed(1));
}

////////////////////////////////////////
//Heirloom Functions////////////////////
////////////////////////////////////////

//OLD:
//renamed from sortHeirlooms to worthOfHeirlooms
var worth = {'Shield': {}, 'Staff': {}};
function worthOfHeirlooms(){
    worth = {'Shield': {}, 'Staff': {}};
    for (var loom in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[loom];
        worth[theLoom.type][loom] = theLoom.rarity;
    }

    //sort high to low value, priority on rarity, followed by mod evaluation
    for (var x in worth){
        worth[x] = Object.keys(worth[x]).sort(function(a, b) {
            if(worth[x][b] == worth[x][a]) {
                return evaluateHeirloomMods(b, 'heirloomsExtra') - evaluateHeirloomMods(a, 'heirloomsExtra');
            }
            else
                return worth[x][b] - worth[x][a];
        });
    }
}


//NEW:
//makes an array of heirlooms sitting in the temporary extra area to indicate to the autoHeirlooms2() function which to Carry/Drop
var worth2 = {'Shield': [], 'Staff': []};
function worthOfHeirlooms2(){
    worth2 = {'Shield': [], 'Staff': []};
    for (var index in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[index];
        var data = {'location': 'heirloomsExtra', 'index': index, 'rarity': theLoom.rarity, 'eff': evaluateHeirloomMods(index, 'heirloomsExtra')};
        worth2[theLoom.type].push(data);
    }
    //sort algorithm: high to low value, priority on rarity, followed by mod evaluation
    var valuesort = function(a, b) {
        if(b.rarity == a.rarity) {
            return b.eff - a.eff;
        }
        else
            return b.rarity - a.rarity;
    };
    // sort shield
    worth2['Shield'].sort(valuesort);
    // sort staff
    worth2['Staff'].sort(valuesort);

    //Output each carried Heirlooms worth to console (or say heirloomsExtra instead)
    /*
    for(var index in game.global.heirloomsCarried) {
        console.log(evaluateHeirloomMods(index, 'heirloomsCarried'));
    }
    */
}

//Automatically evaluate and carry the best heirlooms, and recommend upgrades for equipped items. AutoHeirlooms will only change carried items when the heirlooms window is not open. Carried items will be compared and swapped with the types that are already carried. If a carry spot is empty, it will be filled with the best shield (if available). Evaluation is based ONLY on the following mods (listed in order of priority, high to low): Void Map Drop Chance/Trimp Attack, Crit Chance/Crit Damage, Miner Efficiency/Metal Drop, Gem Drop/Dragimp Efficiency, Farmer/Lumberjack Efficiency. For the purposes of carrying, rarity trumps all of the stat evaluations. Empty mod slots are valued at the average value of the best missing mod.
//NEW:
function autoHeirlooms2() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        //PART 1: start by dropping ALL carried heirlooms
        var originalLength = game.global.heirloomsCarried.length;
        for(var index=0; index < originalLength; index++) {
            selectHeirloom(0, 'heirloomsCarried');
            stopCarryHeirloom();
        }
        //PART 2: immediately begin carrying any protected heirlooms.
        var originalLength = game.global.heirloomsExtra.length;
        for(var index=0; index < originalLength; index++) {
            var theLoom = game.global.heirloomsExtra[index];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms)){
                selectHeirloom(index, 'heirloomsExtra');
                carryHeirloom();
                index--; originalLength--;  //stop index-skipping/re-ordering (idk how else to do it).
            }
        }
        worthOfHeirlooms2();
        //now start by re-filling any empty carried slots with the most highly evaluated heirlooms
        //Alternates EQUALLY between Shield and Staff, putting the best ones of each.
        //PART 3:
        while ((game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms) && game.global.heirloomsExtra.length > 0){
            //re-evaluate their worth (needed to refresh the worth array since we for sure re-arranged everything.)
            worthOfHeirlooms2();
            if (worth2["Shield"].length > 0){
                var carryshield = worth2["Shield"].shift();
                selectHeirloom(carryshield.index, 'heirloomsExtra');
                carryHeirloom();
            }
            worthOfHeirlooms2();
            if (worth2["Staff"].length > 0){
                var carrystaff = worth2["Staff"].shift();
                selectHeirloom(carrystaff.index, 'heirloomsExtra');
                carryHeirloom();
            }
        }
        worthOfHeirlooms();
        // Doing the Alternating Shield/Staff method above can cause good heirlooms to remain un-carried, just because the above was trying to hard to balance.
        // example: It picks up 4 ethereal shields and 2 ethereal staffs and 2 bad rare staffs, but there was actually a 5th good ethereal shield that it skipped.
        //          this will replace the lesser rarity or stat with the higher rarity or stat, either shield or staff.
        //PART 4:
        //Check each carried heirloom....
        for(var carried in game.global.heirloomsCarried) {
            var theLoom = game.global.heirloomsCarried[carried];
            //... against the Opposite type
            var opposite = {"Shield":"Staff", "Staff":"Shield"};
            if(worth[opposite[theLoom.type]].length == 0) continue; //end loop quick if absolutely nothin to swap in
            var index = worth[opposite[theLoom.type]][0];
            //... and compare the carried against the best worth opposite type in the extra pile. (since part 3 above took care of the bests of each same type)
            if(theLoom.rarity < game.global.heirloomsExtra[index].rarity) {
                if (!theLoom.protected){
                    selectHeirloom(carried, 'heirloomsCarried');
                    stopCarryHeirloom();
                    selectHeirloom(index, 'heirloomsExtra');
                    carryHeirloom();
                    worthOfHeirlooms();
                }
                //do nothing if the carried thing was protected.
            }
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        heirloomUpgradeHighlighting();
    }
}

//OLD:
function autoHeirlooms() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        //start by immediately carrying any protected heirlooms.
        for(var extra in game.global.heirloomsExtra) {
            var theLoom = game.global.heirloomsExtra[extra];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms)){
                selectHeirloom(extra, 'heirloomsExtra');
                carryHeirloom();
            }
        }
        //re-evaluate their worth (needed to refresh the worth array since we possibly moved the extras)
        worthOfHeirlooms();
        for(var carried in game.global.heirloomsCarried) {
            var theLoom = game.global.heirloomsCarried[carried];
            if(worth[theLoom.type].length == 0) continue;
            var index = worth[theLoom.type][0];
            if(theLoom.rarity < game.global.heirloomsExtra[index].rarity || (theLoom.rarity == game.global.heirloomsExtra[index].rarity && evaluateHeirloomMods(carried, 'heirloomsCarried') < evaluateHeirloomMods(index, 'heirloomsExtra'))) {
                if (!theLoom.protected){
                    selectHeirloom(carried, 'heirloomsCarried');
                    stopCarryHeirloom();
                    selectHeirloom(index, 'heirloomsExtra');
                    carryHeirloom();
                    worthOfHeirlooms();
                }
            }
        }
        if (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms){
            if(worth.Shield.length > 0)
                selectHeirloom(worth.Shield[0], 'heirloomsExtra');
            else if(worth.Staff.length > 0)
                selectHeirloom(worth.Staff[0], 'heirloomsExtra');
            carryHeirloom();
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        heirloomUpgradeHighlighting();
    }
}

//common to both autoheirloom1 and 2
//Shows you which Mod you would be best off upgrading in the heirloom window by highlighting it in blueish gray and a tooltip.
function heirloomUpgradeHighlighting() {
    var bestUpgrade;
    if(game.global.selectedHeirloom[1].includes('Equipped')) {
        var loom = game.global[game.global.selectedHeirloom[1]];
        bestUpgrade = evaluateHeirloomMods(0, game.global.selectedHeirloom[1], true);
        if(bestUpgrade.index) {
            bestUpgrade.effect *= getModUpgradeCost(loom, bestUpgrade.index);
            bestUpgrade.effect = bestUpgrade.effect.toFixed(6);
            var styleIndex = 4 + (bestUpgrade.index * 3);
            //enclose in backtic ` for template string $ stuff
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].style.backgroundColor = "lightblue";
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseover", `tooltip(\'Heirloom\', \"customText\", event, \'<div class=\"selectedHeirloomItem heirloomRare${loom.rarity}\"> AutoTrimps recommended upgrade for this item. </div>\'         )`);
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseout", 'tooltip(\'hide\')');
            //lightblue = greyish
            //swapClass("tooltipExtra", "tooltipExtraHeirloom", document.getElementById("tooltipDiv"));
            //document.getElementById("tooltipDiv");
        }
    }
}

//Automatically upgrades the best mod on the equipped shield and equipped staff. Runs until you run out of nullifium.
//Do not tamper with this.
function autoNull(){try {
    for(var e,d=[game.global.ShieldEquipped,game.global.StaffEquipped],o=0;2>o;o++){var l=d[o];if(e=evaluateHeirloomMods(0,l.type+"Equipped",!0),e.index){selectedMod=e.index;var a=getModUpgradeCost(l,selectedMod);if(game.global.nullifium<a)continue;game.global.nullifium-=a;var i=getModUpgradeValue(l,selectedMod),t=l.mods[selectedMod];t[1]=i,"undefined"!=typeof t[3]?t[3]++:(t[2]=0,t[3]=1),game.heirlooms[l.type][l.mods[selectedMod][0]].currentBonus=i}}
    } catch (err) {
        debug("AutoSpendNull Error encountered, no Heirloom detected?: " + err.message,"general");
    }
}

//commented out because it was never finished.
/*
function autoSwapHeirlooms(loomtype="Shield" || "Staff", loomlocation="heirloomsCarried" || "heirloomsExtra"){
    var bestfooddroploom = [];
    var bestwooddroploom = [];
    var bestmetaldroploom = [];
    var bestgemdroploom = [];

    //search in loomlocation="heirloomsCarried" or "heirloomsExtra"
    for(var eachloom in game.global[loomlocation]) {
        var theLoom = game.global[loomlocation][eachloom];
        if (theLoom.type != loomtype)
            continue;
        var effRating = evaluateHeirloomMods(eachloom, loomlocation);
    }
    if(loomlocation.includes('Equipped'))
        loom = game.global[loomlocation];
    else
        loom = game.global[loomlocation][loom];

    //---------- SHIELD SWAP FUNCTION (search on critdamage and swap)---
    var count = 0;
    for (var carried in game.global.heirloomsCarried){
        var heirloom = game.global.heirloomsCarried[carried];
        for (var item in heirloom.mods){
            if (item[0] == "critDamage" && item[1] > 300){
                unequipHeirloom(game.global.ShieldEquipped, "heirloomsCarried");
                game.global.ShieldEquipped = heirloom;
                game.global.heirloomsCarried.splice(count, 1);
            }
        }
        count++;
    }
    for (var item in heirloom.mods){
        game.heirlooms[heirloom.type][heirloom.mods[item][0]].currentBonus += heirloom.mods[item][1];
    }
    populateHeirloomWindow();
    //-------OK------
}
*/

//Heirloom helper function
function checkForMod(what, loom, location){
    var heirloom = game.global[location][loom];
    for (var mod in heirloom.mods){
        if (heirloom.mods[mod][0] == what) return true;
    }
    return false;
}

//Determines the best heirloom mods
function evaluateHeirloomMods(loom, location, upgrade) {
    var index = loom;
    var bestUpgrade = {
        'index': null,
        'name': '',
        'effect': 0
    };
    var tempEff;
    var steps;
    if(location.includes('Equipped'))
        loom = game.global[location];
    else
        loom = game.global[location][loom];
    //  return loom.rarity;
    var eff = 0;
    for(var m in loom.mods) {
        var critmult = getPlayerCritDamageMult();
        var critchance = getPlayerCritChance();
        var cmb = (critmult - game.heirlooms.Shield.critDamage.currentBonus/100);
        var ccb = (critchance - game.heirlooms.Shield.critChance.currentBonus/100);
        switch(loom.mods[m][0]) {
            case 'critChance':
                tempEff = ((loom.mods[m][1]/100) * cmb)/(ccb * cmb + 1 - ccb);
                eff += tempEff;
                if(upgrade){
                    if(loom.mods[m][1] >= 30) break;
                    steps = game.heirlooms.Shield.critChance.steps[loom.rarity];
                    tempEff = ((steps[2]/100) * critmult)/((critchance * critmult) + 1 - critchance);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critChance';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'critDamage':
                tempEff = ((loom.mods[m][1]/100) * ccb)/(cmb * ccb + 1 - ccb);
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.critDamage.steps[loom.rarity];
                    tempEff = ((steps[2]/100)* critchance)/((critchance * critmult) + 1 - critchance);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critDamage';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'trimpAttack':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.trimpAttack.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.trimpAttack.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'trimpAttack';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'voidMaps':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.voidMaps.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.voidMaps.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'voidMaps';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'MinerSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.MinerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'MinerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'metalDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.metalDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'metalDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'DragimpSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.DragimpSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'DragimpSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'gemsDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.gemsDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'gemsDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'FarmerSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.FarmerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'FarmerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'LumberjackSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.LumberjackSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'LumberjackSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'empty':
                var av;
                if(upgrade) break;
                //value empty mod as the average of the best mod it doesn't have. If it has all good mods, empty slot has no value
                if(loom.type == 'Shield') {
                    if(!checkForMod('trimpAttack', index, location)){
                        steps = game.heirlooms[loom.type].trimpAttack.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = av/100;
                        eff += tempEff;
                    }
                    else if(!checkForMod('voidMaps', index, location)){
                        steps = game.heirlooms[loom.type].voidMaps.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (steps[2]/100);
                        eff += tempEff;
                    }
                    else if(!checkForMod('critChance', index, location)){
                        steps = game.heirlooms[loom.type].critChance.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * cmb)/(ccb * cmb + 1 - ccb);
                        eff += tempEff;
                    }
                    else if(!checkForMod('critDamage', index, location)){
                        steps = game.heirlooms[loom.type].critDamage.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * ccb)/(cmb * ccb + 1 - ccb);
                        eff += tempEff;
                    }
                }
                if(loom.type == 'Staff') {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    av = steps[0] + ((steps[1] - steps[0])/2);
                    if(!checkForMod('MinerSpeed', index, location) || !checkForMod('metalDrop', index, location) || !checkForMod('DragimpSpeed', index, location) || !checkForMod('gemsDrop', index, location)){
                        eff += 0.75*av/100;
                    }
                    else if(!checkForMod('FarmerSpeed', index, location) || !checkForMod('LumberjackSpeed', index, location)) {
                        eff += 0.5*av/100;
                    }
                }
                break;
                //trimpHealth?
        }
    }
    if(upgrade) return bestUpgrade;
    return eff;
}


////////////////////////////////////////
//Main Functions////////////////////////
////////////////////////////////////////

function workerRatios() {
    if (game.buildings.Tribute.owned > 3000 && mutations.Magma.active()) {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '12';
        autoTrimpSettings.MinerRatio.value = '12';
    } else if (game.buildings.Tribute.owned > 1500) {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '2';
        autoTrimpSettings.MinerRatio.value = '22';
    } else if (game.buildings.Tribute.owned > 1000) {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '10';
    } else if (game.resources.trimps.realMax() > 3000000) {
        autoTrimpSettings.FarmerRatio.value = '3';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '4';
    } else if (game.resources.trimps.realMax() > 300000) {
        autoTrimpSettings.FarmerRatio.value = '3';
        autoTrimpSettings.LumberjackRatio.value = '3';
        autoTrimpSettings.MinerRatio.value = '5';
    } else {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '1';
    }
    if (game.global.challengeActive == 'Watch'){
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '1';
    }
}

function isBuildingInQueue(building) {
    //limit to 1 building per queue
    for (var b in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[b].includes(building)) return true;
    }
}    
//An error-resilient function that will actually purchase buildings and return a success status
function safeBuyBuilding(building) {
    if (isBuildingInQueue(building)) return false;
    //check if building is locked, or else it can buy 'phantom' buildings and is not exactly safe.
    if (game.buildings[building].locked)
        return false;
    preBuy();
    //build 2 at a time if we have the mastery for it.
    //Note: Bypasses any "Max" caps by 1 if they are odd numbers and we can afford the 2nd one.
    if (game.talents.doubleBuild.purchased) {
        game.global.buyAmt = 2;
        if (!canAffordBuilding(building)) {
            game.global.buyAmt = 1;
            if (!canAffordBuilding(building)) {            
                postBuy();
                return false;
            }
        }
    }
    else {
        game.global.buyAmt = 1;
        if (!canAffordBuilding(building)) {
            postBuy();
            return false;
        }
    }
    game.global.firing = false;
    //buy max warpstations when we own <2 (ie: after a new giga)
    //thereafter, buy only 1 warpstation
    if(building == 'Warpstation'){
        if (game.buildings.Warpstation.owned < 2) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
        } else {
            game.global.buyAmt = 1;
        }
        buyBuilding(building, true, true);
        debug('Building ' + game.global.buyAmt + ' ' + building + 's', "buildings", '*rocket');
        postBuy();
        return;
    }
    debug('Building ' + building, "buildings", '*hammer2');
    buyBuilding(building, true, true);
    postBuy();
    return true;
}

//Outlines the most efficient housing based on gems (credits to Belaith)
function highlightHousing() {
    var allHousing = ["Mansion", "Hotel", "Resort", "Gateway", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (var house in allHousing) {
        if (game.buildings[allHousing[house]].locked === 0) {
            unlockedHousing.push(allHousing[house]);
        }
    }
    if (unlockedHousing.length) {
        var obj = {};
        for (var house in unlockedHousing) {
            var building = game.buildings[unlockedHousing[house]];
            var cost = 0;
            cost += getBuildingItemPrice(building, "gems", false, 1);
            var ratio = cost / building.increase.by;
            //don't consider Gateway if we can't afford it right now - hopefully to prevent game waiting for fragments to buy gateway when collector could be bought right now
            if(unlockedHousing[house] == "Gateway" && !canAffordBuilding('Gateway')) continue;
            obj[unlockedHousing[house]] = ratio;
            if (document.getElementById(unlockedHousing[house]).style.border = "1px solid #00CC00") {
                document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
                // document.getElementById(unlockedHousing[house]).removeEventListener("click", update);
            }
        }
        var keysSorted = Object.keys(obj).sort(function(a, b) {
            return obj[a] - obj[b];
        });
        bestBuilding = null;
        //loop through the array and find the first one that isn't limited by max settings
        for (var best in keysSorted) {
            var max = getPageSetting('Max' + keysSorted[best]);
            if (max === false) max = -1;
            if (game.buildings[keysSorted[best]].owned < max || max == -1) {
                bestBuilding = keysSorted[best];

                if (getPageSetting('WarpstationCap') && bestBuilding == "Warpstation") {
                    //Warpstation Cap - if we are past the basewarp+deltagiga level, "cap" and just wait for next giga.
                    if (game.buildings.Warpstation.owned >= (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')))
                        bestBuilding = null;
                }
                var wallpct = getPageSetting('WarpstationWall3');
                if (wallpct > 1 && bestBuilding == "Warpstation") {
                    //Warpstation Wall - allow only warps that cost 1/n'th less then current metal (try to save metal for next prestige)
                    if (getBuildingItemPrice(game.buildings.Warpstation, "metal", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.metal.owned / wallpct))
                        bestBuilding = null;
                }
                break;
            }
        }
        if (bestBuilding) {
            document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
        }
        // document.getElementById(bestBuilding).addEventListener('click', update, false);
    } else {
        bestBuilding = null;
    }
}

//Helper function to buy best "Food" Buildings
function buyFoodEfficientHousing() {
    var houseWorth = game.buildings.House.locked ? 0 : game.buildings.House.increase.by / getBuildingItemPrice(game.buildings.House, "food", false, 1);
    var hutWorth = game.buildings.Hut.increase.by / getBuildingItemPrice(game.buildings.Hut, "food", false, 1);
    var hutAtMax = (game.buildings.Hut.owned >= autoTrimpSettings.MaxHut.value && autoTrimpSettings.MaxHut.value != -1);
    //if hutworth is more, but huts are maxed , still buy up to house max
    if ((houseWorth > hutWorth || hutAtMax) && canAffordBuilding('House') && (game.buildings.House.owned < autoTrimpSettings.MaxHouse.value || autoTrimpSettings.MaxHouse.value == -1)) {
        safeBuyBuilding('House');
    } else {
        if (!hutAtMax) {
            safeBuyBuilding('Hut');
        }
    }
}

//Main Decision Function that determines cost efficiency and Buys all housing (gems), or calls buyFoodEfficientHousing, and also non-storage buildings (Gym, Tribute, Nursery)s
function buyBuildings() {
    if(game.global.world!=1 && ((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist")))
        return;
    highlightHousing();

    //if housing is highlighted
    if (bestBuilding !== null) {
        if (!safeBuyBuilding(bestBuilding)) {
            buyFoodEfficientHousing();
        }
    } else {
        buyFoodEfficientHousing();
    }

    if(getPageSetting('MaxWormhole') > 0 && game.buildings.Wormhole.owned < getPageSetting('MaxWormhole') && !game.buildings.Wormhole.locked) safeBuyBuilding('Wormhole');

    //Buy non-housing buildings
    if (!game.buildings.Gym.locked && (getPageSetting('MaxGym') > game.buildings.Gym.owned || getPageSetting('MaxGym') == -1)) {
        safeBuyBuilding('Gym');
    }
    if (!game.buildings.Tribute.locked && (getPageSetting('MaxTribute') > game.buildings.Tribute.owned || getPageSetting('MaxTribute') == -1)) {
        safeBuyBuilding('Tribute');
    }
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    //NoNurseriesUntil', 'No Nurseries Until z', 'For Magma z230+ purposes. Nurseries get shut down, and wasting nurseries early on is probably a bad idea. Might want to set this to 230+ as well.'
    var nursminlvl = getPageSetting('NoNurseriesUntil');
    if (game.global.world < nursminlvl)
        return;    
    //only buy nurseries if enabled,   and we need to lower our breed time, or our target breed time is 0, or we aren't trying to manage our breed time before geneticists, and they aren't locked
    //even if we are trying to manage breed timer pre-geneticists, start buying nurseries once geneticists are unlocked AS LONG AS we can afford a geneticist (to prevent nurseries from outpacing geneticists soon after they are unlocked)
    if ((targetBreed < getBreedTime() || targetBreed <= 0 ||
        (targetBreed < getBreedTime(true) && game.global.challengeActive == 'Watch') ||
        (!game.jobs.Geneticist.locked && canAffordJob('Geneticist', false, 1))) && !game.buildings.Nursery.locked)
    {
        var nwr = 0.05; //nursery to warpstation cost ratio (unrelated to the 20 below), has been this way since forever.
        var gemCostratio = 20;  //(1/20th)
        var nursCost = getBuildingItemPrice(game.buildings.Nursery, "gems", false, 1);
        var warpCost = getBuildingItemPrice(game.buildings.Warpstation, "gems", false, 1);
        var collCost = getBuildingItemPrice(game.buildings.Collector, "gems", false, 1);
        var resomod = Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level);    //need to apply the resourceful mod when comparing anything other than building vs building.
        //buy nurseries irrelevant of warpstations (after we unlock them) - if we have enough extra gems that its not going to impact anything. note:(we will be limited by wood anyway - might use a lot of extra wood)
        var buyWithExtraGems = (!game.buildings.Warpstation.locked && nursCost * resomod < game.resources.gems.owned/gemCostratio);
        //refactored the old calc, and added new buyWithExtraGems tacked on the front
        if ((getPageSetting('MaxNursery') > game.buildings.Nursery.owned || getPageSetting('MaxNursery') == -1) &&
            ( buyWithExtraGems ||
            ((nursCost < nwr * warpCost || game.buildings.Warpstation.locked) &&
             (nursCost < nwr * collCost || game.buildings.Collector.locked || !game.buildings.Warpstation.locked))
            )
           )
        {
            safeBuyBuilding('Nursery');
        }
    }
}

//Buys all available non-equip upgrades listed in var upgradeList
function buyUpgrades() {
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        var gameUpgrade = game.upgrades[upgrade];
        var available = (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(gameUpgrade));
        if (upgrade == 'Coordination' && !canAffordCoordinationTrimps()) continue;
        if (upgrade == 'Shieldblock' && !getPageSetting('BuyShieldblock')) continue;
        if (upgrade == 'Gigastation' && (game.global.lastWarp ? game.buildings.Warpstation.owned < (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')) : game.buildings.Warpstation.owned < getPageSetting('FirstGigastation'))) continue;
        //skip bloodlust during scientist challenges and while we have autofight enabled.
        if (upgrade == 'Bloodlust' && game.global.challengeActive == 'Scientist' && getPageSetting('AutoFight')) continue;
        //skip potency when autoBreedTimer is disabled
        if (upgrade == 'Potency' && getPageSetting('GeneticistTimer') >= 0) continue;

        //Main logics:
        if (!available) continue;
        if (game.upgrades.Scientists.done < game.upgrades.Scientists.allowed && upgrade != 'Scientists') continue;
        buyUpgrade(upgrade, true, true);
        debug('Upgraded ' + upgrade, "upgrades", "*upload2");
    //loop again.
    }
}

//Buys more storage if resource is over 85% full (or 50% if Zone 2-10) (or 70% if zone==1)
function buyStorage() {
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
        if(game.global.mapsActive && game.unlocks.imps.Jestimp) {
            jest = simpleSeconds(Bs[B], 45);
            jest = scaleToCurrentMap(jest);
        }
        if ((game.global.world==1 && owned > max * 0.7) || (game.global.world >= 2 && game.global.world < 10 && owned > max * 0.5) || (owned + jest > max * 0.85)) {
            // debug('Buying ' + B + '(' + Bs[B] + ') at ' + Math.floor(game.resources[Bs[B]].owned / (game.resources[Bs[B]].max * packMod * 0.99) * 100) + '%');
            if (canAffordBuilding(B) && game.triggers[B].done) {
                safeBuyBuilding(B);
                if (getPageSetting('ManualGather2')) setGather('buildings');
            }
        }
    }
}

function safeFireJob(job,amount) {
    //do some jiggerypokery in case jobs overflow and firing -1 worker does 0 (java integer overflow)
    var oldjob = game.jobs[job].owned;
    if (oldjob == 0)
        return 0;
    var test = oldjob;
    var x = 1;
    if (!Number.isSafeInteger(oldjob)){
        while (oldjob == test) {
            test-=x;
            x*=2;
        }
    }
    preBuy();
    game.global.firing = true;
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    while (freeWorkers == Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed) {
        game.global.buyAmt = x;    
        buyJob(job, true, true);
        x*=2;
    }
    postBuy();
    return x;
}


//Hires and Fires all workers (farmers/lumberjacks/miners/scientists/trainers/explorers)
function buyJobs() {
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    var farmerRatio = parseInt(getPageSetting('FarmerRatio'));
    var lumberjackRatio = parseInt(getPageSetting('LumberjackRatio'));
    var minerRatio = parseInt(getPageSetting('MinerRatio'));
    var totalRatio = farmerRatio + lumberjackRatio + minerRatio;
    var scientistRatio = totalRatio / 25;
    if (game.jobs.Farmer.owned < 100) {
        scientistRatio = totalRatio / 10;
    }

    //FRESH GAME LOWLEVEL NOHELIUM CODE.
    if (game.global.world == 1 && game.global.totalHeliumEarned<=1000){
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9){
            if (game.resources.food.owned > 5 && freeWorkers > 0){
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned)
                    safeBuyJob('Farmer', 1);
                else if (game.jobs.Farmer.owned > game.jobs.Lumberjack.owned && !game.jobs.Lumberjack.locked)
                    safeBuyJob('Lumberjack', 1);
            }
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (game.resources.food.owned > 20 && freeWorkers > 0){
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned && !game.jobs.Miner.locked)
                    safeBuyJob('Miner', 1);
            }
        }
        return;
    //make sure the game always buys at least 1 farmer, so we can unlock lumberjacks.
    } else if (game.jobs.Farmer.owned == 0 && game.jobs.Lumberjack.locked && freeWorkers > 0) {
        safeBuyJob('Farmer', 1);
    //make sure the game always buys 10 scientists.
    } else if (game.jobs.Scientist.owned < 10 && scienceNeeded > 100)
        safeBuyJob('Scientist', 10);
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    if (game.global.challengeActive == 'Watch'){
        scientistRatio = totalRatio / 10;
        stopScientistsatFarmers = 1e8;
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire){
            //so the game buys scientists first while we sit around waiting for breed timer.
            var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
            if (game.jobs.Scientist.owned < buyScientists && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.1){
                var toBuy = buyScientists-game.jobs.Scientist.owned;
                var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
                if((buyScientists > 0 && freeWorkers > 0) && (getPageSetting('MaxScientists') > game.jobs.Scientist.owned || getPageSetting('MaxScientists') == -1))
                    safeBuyJob('Scientist', toBuy <= canBuy ? toBuy : canBuy);
            }
            else
                return;
        }
    }
    else
    {   //exit if we are havent bred to at least 90% breedtimer yet...
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire) 
            return;
    }
    var subtract = 0;
    //used multiple times below: (good job javascript for allowing functions in functions)
    function checkFireandHire(job,amount) {
        freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
        if (amount === null)
            amount = 1;
        if (freeWorkers < amount) 
            subtract = safeFireJob('Farmer');
        if (canAffordJob(job, false, amount) && !game.jobs[job].locked)
            safeBuyJob(job, amount);
    }
    //Scientists:
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    if (getPageSetting('HireScientists') && !game.jobs.Scientist.locked) {
        //if earlier in the game, buy a small amount of scientists
        if (game.jobs.Farmer.owned < stopScientistsatFarmers && !breedFire) {
            var buyScientists = Math.floor((scientistRatio / totalRatio) * totalDistributableWorkers) - game.jobs.Scientist.owned - subtract;
            if((buyScientists > 0 && freeWorkers > 0) && (getPageSetting('MaxScientists') > game.jobs.Scientist.owned || getPageSetting('MaxScientists') == -1))
                safeBuyJob('Scientist', buyScientists);
        }
    }    
    //Trainers: capped to tributes percentage.
    var trainerpercent = getPageSetting('TrainerCaptoTributes');
    if (trainerpercent > 0){
        var curtrainercost = game.jobs.Trainer.cost.food[0]*Math.pow(game.jobs.Trainer.cost.food[1], game.jobs.Trainer.owned);
        var curtributecost = getBuildingItemPrice(game.buildings.Tribute, "food", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level);
        if (curtrainercost < curtributecost * (trainerpercent / 100) && (getPageSetting('MaxTrainers') > game.jobs.Trainer.owned || getPageSetting('MaxTrainers') == -1)) {
            checkFireandHire('Trainer');
        }
    }
    //Trainers: regular old way of hard capping trainers to a certain number. (sorry about lazy duplicate coding)
    else if (getPageSetting('MaxTrainers') > game.jobs.Trainer.owned || getPageSetting('MaxTrainers') == -1) {
        checkFireandHire('Trainer');
    }
    //Explorers:
    if (getPageSetting('MaxExplorers') > game.jobs.Explorer.owned || getPageSetting('MaxExplorers') == -1) {
        checkFireandHire('Explorer');
    }

    //Buy Farmers:
    //Buy/Fire Miners:
    //Buy/Fire Lumberjacks:
    function ratiobuy(job, jobratio) {
        if(!game.jobs[job].locked && !breedFire) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
            var toBuy = Math.floor((jobratio / totalRatio) * totalDistributableWorkers) - game.jobs[job].owned - subtract;
            var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
            var amount = toBuy <= canBuy ? toBuy : canBuy;
            safeBuyJob(job, amount);
/*             if (amount > 0)
                debug("Jobbing: " + job + " " + amount); */
            return true;
        }
        else
            return false;
    }
    ratiobuy('Farmer', farmerRatio);    
    if (!ratiobuy('Miner', minerRatio) && breedFire && game.global.turkimpTimer === 0)
        safeBuyJob('Miner', game.jobs.Miner.owned * -1);
    if (!ratiobuy('Lumberjack', lumberjackRatio) && breedFire)
        safeBuyJob('Lumberjack', game.jobs.Lumberjack.owned * -1);
}


//evaluateEquipmentEfficiency: Back end function for autoLevelEquipment to determine most cost efficient items, and what color they should be.
function evaluateEquipmentEfficiency(equipName) {
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
        if (equip.Equip) price = Math.ceil(price * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
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
    //wall (don't buy any more equipment, buy prestige first) is true if the limit equipment option is on and we are past our limit
    //Factor = 0 sets the efficiency to 0 so that it will be disregarded. if not, efficiency will still be somenumber that is cheaper,
    //      and the algorithm will get stuck on whatever equipment we have capped, and not buy other equipment.
    if (game.jobs[mapresourcetojob[equip.Resource]].locked){
        //cap any equips that we haven't unlocked metal for (new/fresh game/level1/no helium code)
        Factor = 0;
        Wall = true;
    }
    if (gameResource.level > 10 - gameResource.prestige && getPageSetting('LimitEquipment')) {
        Factor = 0;
        Wall = true;
    }
    if (gameResource.level >= 10 && getPageSetting('CapEquip')) {
        Factor = 0;
        Wall = true;
    }
    if (game.global.world >= 58 && game.global.world < 60 && getPageSetting('WaitTill60')){
        Wall = true;
    }
    if (gameResource.level < 2 && equip.Stat == 'health' && getPageSetting('AlwaysArmorLvl2')){
        Factor = 9999 - gameResource.prestige;
    }

    return {
        Stat: equip.Stat,
        Factor: Factor,
        StatusBorder: StatusBorder,
        Wall: Wall
    };
}

//autoLevelEquipment = "Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"
function autoLevelEquipment() {
    //if((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist"))
        //return;
    var Best = {};
    var keys = ['healthwood', 'healthmetal', 'attackmetal', 'blockwood'];
    for (var i = 0; i < keys.length; i++) {
        Best[keys[i]] = {
            Factor: 0,
            Name: '',
            Wall: false,
            StatusBorder: 'white'
        };
    }
    var enemyDamage = getEnemyMaxAttack(game.global.world + 1, 30, 'Snimp', .85);
    var enemyHealth = getEnemyMaxHealth(game.global.world + 1);
    //Take Spire as a special case.
    var spirecheck = (game.global.world == 200 && game.global.spireActive);
    if (spirecheck) {
        var cell = (!game.global.mapsActive && !game.global.preMapsActive) ? game.global.lastClearedCell : 40;
        enemyDamage = getSpireStats(cell, "Snimp", "attack");
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
    var pierceMod = getPierceAmt();
    //change name to make sure these are local to the function
    var enoughHealthE = !(doVoids && voidCheckPercent > 0) && 
        (baseHealth * 4 > 30 * (enemyDamage - baseBlock / 2 > 0 ? enemyDamage - baseBlock / 2 : enemyDamage * pierceMod)  || 
            baseHealth > 30 * (enemyDamage - baseBlock > 0 ? enemyDamage - baseBlock : enemyDamage * pierceMod));
    var enoughDamageE = (baseDamage * 4 > enemyHealth);

    for (var equipName in equipmentList) {
        var equip = equipmentList[equipName];
        // debug('Equip: ' + equip + ' EquipIndex ' + equipName);
        var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
        // debug('Game Resource: ' + gameResource);
        if (!gameResource.locked) {
            document.getElementById(equipName).style.color = 'white';   //reset
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
            //Apply colors from before:        
            //white - Upgrade is not available
            //yellow - Upgrade is not affordable
            //orange - Upgrade is affordable, but will lower stats
            //red - Yes, do it now!

            document.getElementById(equipName).style.borderColor = evaluation.StatusBorder;
            if (evaluation.StatusBorder != 'white' && evaluation.StatusBorder != 'yellow') {
                document.getElementById(equip.Upgrade).style.color = evaluation.StatusBorder;
            }
            if (evaluation.StatusBorder == 'yellow') {
                document.getElementById(equip.Upgrade).style.color = 'white';
            }
            if (evaluation.Wall) {
                document.getElementById(equipName).style.color = 'yellow';
            }

            //Code is Spaced This Way So You Can Read It:
            if (evaluation.StatusBorder == 'red' &&
                (
                    ( getPageSetting('BuyWeaponUpgrades') && equipmentList[equipName].Stat == 'attack' )
                    ||
                    ( getPageSetting('BuyWeaponUpgrades') && equipmentList[equipName].Stat == 'block' )
                    ||
                    ( getPageSetting('BuyArmorUpgrades') && (equipmentList[equipName].Stat == 'health' )
                        &&
                //Only buy Armor prestiges when 'DelayArmorWhenNeeded' is on, IF:
                        (
                            (getPageSetting('DelayArmorWhenNeeded') && !shouldFarm)  // not during "Farming" mode
                            ||                                                       //     or
                            (getPageSetting('DelayArmorWhenNeeded') && enoughDamage) //  has enough damage (not in "Wants more Damage" mode)
                            ||                                                       //     or
                            (getPageSetting('DelayArmorWhenNeeded') && !enoughDamage && !enoughHealth) // if neither enough dmg or health, then tis ok to buy.
                            ||
                            (getPageSetting('DelayArmorWhenNeeded') && equipmentList[equipName].Resource == 'wood')
                            ||
                            !getPageSetting('DelayArmorWhenNeeded')  //or when its off.
                        )
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
        }
    }
    preBuy();
    game.global.buyAmt = 1; //needed for buyEquipment()
    for (var stat in Best) {
        if (Best[stat].Name !== '') {
            var eqName = Best[stat].Name;
            var DaThing = equipmentList[eqName];
            document.getElementById(Best[stat].Name).style.color = Best[stat].Wall ? 'orange' : 'red';
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
            var aalvl2 = getPageSetting('AlwaysArmorLvl2') || (game.global.world == 200 && game.global.spireActive);
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

//OLD: "Auto Gather/Build"
function manualLabor() {
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;

    //FRESH GAME NO HELIUM CODE.
    if (game.global.world <=3 && game.global.totalHeliumEarned<=500) {
        if (game.global.buildingsQueue.length == 0 && (game.global.playerGathering != 'trimps' || game.buildings.Trap.owned == 0)){
            if (!game.triggers.wood.done || game.resources.food.owned < 10 || Math.floor(game.resources.food.owned) < Math.floor(game.resources.wood.owned))
                setGather('food');
            else
                setGather('wood');
        }
    }

    if(getPageSetting('TrapTrimps') && breedingTrimps < 5 && game.buildings.Trap.owned == 0 && canAffordBuilding('Trap')) {
        //safeBuyBuilding returns false if item is already in queue
        if(!safeBuyBuilding('Trap'))
            setGather('buildings');
    }
    else if (getPageSetting('TrapTrimps') && breedingTrimps < 5 && game.buildings.Trap.owned > 0) {
        setGather('trimps');
    }
    else if (getPageSetting('ManualGather2') != 2 && game.resources.science.owned < 100 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden')
        setGather('science');
    //if we have more than 2 buildings in queue, or (our modifier is real fast and trapstorm is off), build
    else if (!game.talents.foreman.purchased && (game.global.buildingsQueue.length ? (game.global.buildingsQueue.length > 1 || game.global.autoCraftModifier == 0 || (getPlayerModifier() > 1000 && game.global.buildingsQueue[0] != 'Trap.1')) : false)) {
        setGather('buildings');
    }
    //if trapstorm is off (likely we havent gotten it yet, the game is still early, buildings take a while to build ), then Prioritize Storage buildings when they hit the front of the queue (should really be happening anyway since the queue should be >2(fits the clause above this), but in case they are the only object in the queue.)
    else if (!game.global.trapBuildToggled && (game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Forge.1')){
        setGather('buildings');
    }
    //if we have some upgrades sitting around which we don't have enough science for, gather science
    else if (game.resources.science.owned < scienceNeeded && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        // debug('Science needed ' + scienceNeeded);
        if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && game.global.turkimpTimer > 0)||getPageSetting('ManualGather2') == 2){
            //if manual is less than science production, switch on turkimp
            setGather('metal');
        }
        else if (getPageSetting('ManualGather2') != 2){
            setGather('science');
        }
    }
    else if (getPageSetting('TrapTrimps') && parseInt(getPageSetting('GeneticistTimer')) < getBreedTime(true)){
        //combined to optimize code.
        if (game.buildings.Trap.owned < 1 && canAffordBuilding('Trap')) {
            safeBuyBuilding('Trap');
            setGather('buildings');
        }
        else if (game.buildings.Trap.owned > 0)
            setGather('trimps');
    }
    else {
        var manualResourceList = {
            'food': 'Farmer',
            'wood': 'Lumberjack',
            'metal': 'Miner',
        };
        var lowestResource = 'food';
        var lowestResourceRate = -1;
        var haveWorkers = true;
        for (var resource in manualResourceList) {
            var job = manualResourceList[resource];
            var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
            // debug('Current rate for ' + resource + ' is ' + currentRate + ' is hidden? ' + (document.getElementById(resource).style.visibility == 'hidden'));
            if (document.getElementById(resource).style.visibility != 'hidden') {
                //find the lowest resource rate
                if (currentRate === 0) {
                    currentRate = game.resources[resource].owned;
                    // debug('Current rate for ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                        // debug('New Lowest1 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
                        haveWorkers = false;
                        lowestResource = resource;
                        lowestResourceRate = currentRate;
                    }
                }
                if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                    // debug('New Lowest2 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
            // debug('Current Stats ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
        }

        if (game.global.playerGathering != lowestResource && !haveWorkers && !breedFire) {
            if (game.global.turkimpTimer > 0)
                setGather('metal');
            else
                setGather(lowestResource);//gather the lowest resource
        //This stuff seems to be repeated from above. Should be refactored and fixed so this is not confusing.
        } else if (getPageSetting('ManualGather2') != 2 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
            if (game.resources.science.owned < getPsString('science', true) * 60 && game.global.turkimpTimer < 1 && haveWorkers)
                setGather('science');
            else if (game.global.turkimpTimer > 0)
                setGather('metal');
            else
                setGather(lowestResource);
        }
        //refactored into the if else block above:
        //else if (getPageSetting('ManualGather2') != 2 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden')
        //    setGather('science');
        //Build more traps if we have TrapTrimps on, and we own less than 1000 traps.
        else if(getPageSetting('TrapTrimps') && game.global.trapBuildToggled == true && game.buildings.Trap.owned < 1000)
            setGather('buildings'); //confusing (was always like this, see commits @ 2/23/16). 
        else
            setGather(lowestResource); 
    }
}

//NEW: #2 "Auto Gather/Build"
function manualLabor2() {
    //vars
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
    var trapTrimpsOK = getPageSetting('TrapTrimps');
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    
    //FRESH GAME LOWLEVEL NOHELIUM CODE.
    if (game.global.world <=3 && game.global.totalHeliumEarned<=1000) {
        if (game.global.buildingsQueue.length == 0 && (game.global.playerGathering != 'trimps' || game.buildings.Trap.owned == 0)){
            if (!game.triggers.wood.done || game.resources.food.owned < 10 || Math.floor(game.resources.food.owned) < Math.floor(game.resources.wood.owned)) {
                setGather('food');
                return;
            }
            else {
                setGather('wood');
                return;
            }
        }
    }
    //Traps and Trimps
    if (trapTrimpsOK && (breedingTrimps < 5 || targetBreed < getBreedTime(true))) {
        if (game.buildings.Trap.owned > 0) { 
            setGather('trimps');//gatherTrimps = true;
            return;
        }
        if (game.buildings.Trap.owned == 0 && canAffordBuilding('Trap'))
            safeBuyBuilding('Trap');//buyTraps = true;
    }
    //Buildings:
    //if we have more than 2 buildings in queue, or (our modifier is real fast and trapstorm is off), build
    if ((!game.talents.foreman.purchased && (game.global.buildingsQueue.length ? (game.global.buildingsQueue.length > 1 || game.global.autoCraftModifier == 0 || (getPlayerModifier() > 1000 && game.global.buildingsQueue[0] != 'Trap.1')) : false)) || 
    //if trapstorm is off (likely we havent gotten it yet, the game is still early, buildings take a while to build ), then Prioritize Storage buildings when they hit the front of the queue (should really be happening anyway since the queue should be >2(fits the clause above this), but in case they are the only object in the queue.)
    (!game.global.trapBuildToggled && (game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Forge.1')) || 
    //Build more traps if we have TrapTrimps on, and we own less than 1000 traps.
    (trapTrimpsOK && game.global.trapBuildToggled && game.buildings.Trap.owned < 1000)) {
        setGather('buildings');//buildBuildings = true;
        return;
    }
    //Sciencey:    
    //if we have some upgrades sitting around which we don't have enough science for, gather science
    if (document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        //if we have less than a minute of science
        if (game.resources.science.owned < 100 || (game.resources.science.owned < getPsString('science', true) * 60 && game.global.turkimpTimer < 1))
            if (getPageSetting('ManualGather2') != 2) {
                setGather('science');
                return;
            }
        if (game.resources.science.owned < scienceNeeded) {
            //if manual is less than science production and turkimp, metal. (or science is set as disallowed)
            if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && game.global.turkimpTimer > 0) || getPageSetting('ManualGather2') == 2)
                setGather('metal');
            else if (getPageSetting('ManualGather2') != 2) {
                setGather('science');
                return;
            }
        }
    }
    //If we got here, without exiting, gather Normal Resources:
    var manualResourceList = {
        'food': 'Farmer',
        'wood': 'Lumberjack',
        'metal': 'Miner',
    };
    var lowestResource = 'food';
    var lowestResourceRate = -1;
    var haveWorkers = true;
    for (var resource in manualResourceList) {
        var job = manualResourceList[resource];
        var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
        // debug('Current rate for ' + resource + ' is ' + currentRate + ' is hidden? ' + (document.getElementById(resource).style.visibility == 'hidden'));
        if (document.getElementById(resource).style.visibility != 'hidden') {
            //find the lowest resource rate
            if (currentRate === 0) {
                currentRate = game.resources[resource].owned;
                // debug('Current rate for ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                    // debug('New Lowest1 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
                    haveWorkers = false;
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
            if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                // debug('New Lowest2 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                lowestResource = resource;
                lowestResourceRate = currentRate;
            }
        }
        // debug('Current Stats ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
    }

    if (game.global.playerGathering != lowestResource && !haveWorkers && !breedFire) {
        if (game.global.turkimpTimer > 0)
            setGather('metal');
        else
            setGather(lowestResource);//gather the lowest resource
    } else if (game.global.turkimpTimer > 0)
        setGather('metal');
    else
        setGather(lowestResource);
    //ok
    return true;
}

function calcBaseDamageinX() {
    //baseDamage
    baseDamage = game.global.soldierCurrentAttack * (1 + (game.global.achievementBonus / 100)) * ((game.global.antiStacks * game.portal.Anticipation.level * game.portal.Anticipation.modifier) + 1) * (1 + (game.global.roboTrimpLevel * 0.2));
    //D stance
    if (game.global.formation == 2) 
        baseDamage /= 4;
    else if (game.global.formation != "0") 
        baseDamage *= 2;

    //baseBlock
    baseBlock = game.global.soldierCurrentBlock;
    //B stance
    if (game.global.formation == 3) 
        baseBlock /= 4;
    else if (game.global.formation != "0") 
        baseBlock *= 2;

    //baseHealth
    baseHealth = game.global.soldierHealthMax;
    //H stance
    if (game.global.formation == 1) 
        baseHealth /= 4;
    else if (game.global.formation != "0") 
        baseHealth *= 2;
    
    //S stance is accounted for (combination of all the above's else clauses)
}

//Autostance - function originally created by Belaith (in 1971)
//Automatically swap formations (stances) to avoid dying
function autoStance() {
    //get back to a baseline of no stance (X)
    calcBaseDamageinX();
    //no need to continue
    if (game.global.gridArray.length === 0) return;
    if (!getPageSetting('AutoStance')) return;

    //start analyzing autostance
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var dHealth = baseHealth/2;
    var xHealth = baseHealth;
    var bHealth = baseHealth/2;
    var enemy;
    var corrupt = game.global.world >= mutations.Corruption.start(true);
    if (!game.global.mapsActive && !game.global.preMapsActive) {
        enemy = getCurrentEnemy();
        var enemyFast = game.global.challengeActive == "Slow" || ((((game.badGuys[enemy.name].fast || enemy.corrupted) && game.global.challengeActive != "Nom") && game.global.challengeActive != "Coordinate"));
        var enemyHealth = enemy.health;
        var enemyDamage = enemy.attack * 1.2;
        //check for world Corruption
        if (enemy && enemy.corrupted){
            enemyHealth *= getCorruptScale("health");
            enemyDamage *= getCorruptScale("attack");
        }
        if (enemy && enemy.corrupted == 'corruptStrong') {
            enemyDamage *= 2;
        }
        if (enemy && enemy.corrupted == 'corruptTough') {
            enemyHealth *= 5;
        }
        if (game.global.challengeActive == 'Lead') {
            enemyDamage *= (1 + (game.challenges.Lead.stacks * 0.04));
        }
        if (game.global.challengeActive == 'Watch') {
            enemyDamage *= 1.25;
        }
        var pierceMod = getPierceAmt();
        var dDamage = enemyDamage - baseBlock / 2 > enemyDamage * pierceMod ? enemyDamage - baseBlock / 2 : enemyDamage * pierceMod;
        var xDamage = enemyDamage - baseBlock > enemyDamage * pierceMod ? enemyDamage - baseBlock : enemyDamage * pierceMod;
        var bDamage = enemyDamage - baseBlock * 4 > enemyDamage * pierceMod ? enemyDamage - baseBlock * 4 : enemyDamage * pierceMod;

    } else if (game.global.mapsActive && !game.global.preMapsActive) {
        enemy = getCurrentEnemy();
        var enemyFast = game.global.challengeActive == "Slow" || ((((game.badGuys[enemy.name].fast || enemy.corrupted) && game.global.challengeActive != "Nom") || game.global.voidBuff == "doubleAttack") && game.global.challengeActive != "Coordinate");
        var enemyHealth = enemy.health;
        var enemyDamage = enemy.attack * 1.2;
        //check for voidmap Corruption        
        if (getCurrentMapObject().location == "Void" && corrupt) {
            enemyDamage *= getCorruptScale("attack");
            enemyHealth *= getCorruptScale("health");
            //halve if magma is not active (like it was before)
            if (!mutations.Magma.active()) {
                enemyDamage /= 2;
                enemyHealth /= 2;
            }
        }
        //check for z230 magma map corruption
        else if (getCurrentMapObject().location != "Void" && mutations.Magma.active()) {
            enemyHealth *= (getCorruptScale("health") / 2);
            enemyDamage *= (getCorruptScale("attack") / 2);
        }
        if (enemy && enemy.corrupted == 'corruptStrong') {
            enemyDamage *= 2;
        }
        if (enemy && enemy.corrupted == 'corruptTough') {
            enemyHealth *= 5;
        }
        if (game.global.challengeActive == 'Lead') {
            enemyDamage *= (1 + (game.challenges.Lead.stacks * 0.04));
        }
        if (game.global.challengeActive == 'Watch') {
            enemyDamage *= 1.25;
        }
        var dDamage = enemyDamage - baseBlock / 2 > 0 ? enemyDamage - baseBlock / 2 : 0;
        var dVoidCritDamage = enemyDamage*5 - baseBlock / 2 > 0 ? enemyDamage*5 - baseBlock / 2 : 0;
        var xDamage = enemyDamage - baseBlock > 0 ? enemyDamage - baseBlock : 0;
        var xVoidCritDamage = enemyDamage*5 - baseBlock > 0 ? enemyDamage*5 - baseBlock : 0;
        var bDamage = enemyDamage - baseBlock * 4 > 0 ? enemyDamage - baseBlock * 4 : 0;
    }

    var drainChallenge = game.global.challengeActive == 'Nom' || game.global.challengeActive == "Toxicity";

    if (game.global.challengeActive == "Electricity" || game.global.challengeActive == "Mapocalypse") {
        dDamage+= dHealth * game.global.radioStacks * 0.1;
        xDamage+= xHealth * game.global.radioStacks * 0.1;
        bDamage+= bHealth * game.global.radioStacks * 0.1;
    } else if (drainChallenge) {
        dDamage += dHealth/20;
        xDamage += xHealth/20;
        bDamage += bHealth/20;
    } else if (game.global.challengeActive == "Crushed") {
        if(dHealth > baseBlock /2)
            dDamage = enemyDamage*5 - baseBlock / 2 > 0 ? enemyDamage*5 - baseBlock / 2 : 0;
        if(xHealth > baseBlock)
            xDamage = enemyDamage*5 - baseBlock > 0 ? enemyDamage*5 - baseBlock : 0;
    }
    if (game.global.voidBuff == "bleed" || (enemy && enemy.corrupted == 'corruptBleed')) {
        dDamage += game.global.soldierHealth * 0.2;
        xDamage += game.global.soldierHealth * 0.2;
        bDamage += game.global.soldierHealth * 0.2;
    }
    baseDamage *= (game.global.titimpLeft > 0 ? 2 : 1); //consider titimp
    //double attack is OK if the buff isn't double attack, or we will survive a double attack, or we are going to one-shot them (so they won't be able to double attack)
    var doubleAttackOK = (game.global.voidBuff != 'doubleAttack' || (enemy && enemy.corrupted != 'corruptDbl')) || ((newSquadRdy && dHealth > dDamage * 2) || dHealth - missingHealth > dDamage * 2) || ((dHealth - missingHealth > dDamage) && enemyHealth < baseDamage);
    //lead attack ok if challenge isn't lead, or we are going to one shot them, or we can survive the lead damage
    var leadDamage = game.challenges.Lead.stacks * 0.0005;
    var leadAttackOK = game.global.challengeActive != 'Lead' || enemyHealth < baseDamage || ((newSquadRdy && dHealth > dDamage + (dHealth * leadDamage)) || (dHealth - missingHealth > dDamage + (dHealth * leadDamage)));
    //added voidcrit.
    //voidcrit is OK if the buff isn't crit-buff, or we will survive a crit, or we are going to one-shot them (so they won't be able to crit)
    var isCritVoidMap = game.global.voidBuff == 'getCrit' || (enemy && enemy.corrupted == 'corruptCrit');
    var voidCritinDok = !isCritVoidMap || (!enemyFast ? enemyHealth < baseDamage : false) || (newSquadRdy && dHealth > dVoidCritDamage) || (dHealth - missingHealth > dVoidCritDamage);
    var voidCritinXok = !isCritVoidMap || (!enemyFast ? enemyHealth < baseDamage : false) || (newSquadRdy && xHealth > xVoidCritDamage) || (xHealth - missingHealth > xVoidCritDamage);

    if (!game.global.preMapsActive && game.global.soldierHealth > 0) {
        if (!enemyFast && game.upgrades.Dominance.done && enemyHealth < baseDamage && (newSquadRdy || (dHealth - missingHealth > 0 && !drainChallenge) || (drainChallenge && dHealth - missingHealth > dHealth/20))) {
            setFormation(2);
            //use D stance if: new army is ready&waiting / can survive void-double-attack or we can one-shot / can survive lead damage / can survive void-crit-dmg
        } else if (game.upgrades.Dominance.done && ((newSquadRdy && dHealth > dDamage) || dHealth - missingHealth > dDamage) && doubleAttackOK && leadAttackOK && voidCritinDok ) {
            setFormation(2);
            //if CritVoidMap, switch out of D stance if we cant survive. Do various things.
        } else if (isCritVoidMap && !voidCritinDok) {
            //if we are already in X and the NEXT potential crit would take us past the point of being able to return to D/B, switch to B.
            if (game.global.formation == "0" && game.global.soldierHealth - xVoidCritDamage < game.global.soldierHealthMax/2){
                if (game.upgrades.Barrier.done && (newSquadRdy || (missingHealth < game.global.soldierHealthMax/2)) )
                    setFormation(3);
            }
                //else if we can totally block all crit damage in X mode, OR we can't survive-crit in D, but we can in X, switch to X.
                // NOTE: during next loop, the If-block above may immediately decide it wants to switch to B.
            else if (xVoidCritDamage == 0 || (game.global.formation == 2 && voidCritinXok)){
                setFormation("0");
            }
                //otherwise, stuff:
            else {
                if (game.global.formation == "0"){
                    if (game.upgrades.Barrier.done && (newSquadRdy || (missingHealth < game.global.soldierHealthMax/2)) )
                        setFormation(3);
                    else
                        setFormation(1);
                }
                else if (game.upgrades.Barrier.done && game.global.formation == 2)
                    setFormation(3);
            }
        } else if (game.upgrades.Formations.done && ((newSquadRdy && xHealth > xDamage) || xHealth - missingHealth > xDamage)) {
            //in lead challenge, switch to H if about to die, so doesn't just die in X mode without trying
            if ((game.global.challengeActive == 'Lead') && (xHealth - missingHealth < xDamage + (xHealth * leadDamage)))
                setFormation(1);
            else
                setFormation("0");
        } else if (game.upgrades.Barrier.done && ((newSquadRdy && bHealth > bDamage) || bHealth - missingHealth > bDamage)) {
            setFormation(3);    //does this ever run?
        } else if (game.upgrades.Formations.done) {
            setFormation(1);
        } else
            setFormation("0");
    }
    baseDamage /= (game.global.titimpLeft > 0 ? 2 : 1); //unconsider titimp :P
}


var stackingTox = false;
var doVoids = false;
var needToVoid = false;
var needPrestige = false;
var voidCheckPercent = 0;
var HDratio = 0;

//AutoMap - function originally created by Belaith (in 1971)
//anything/everything to do with maps.
function autoMap() {
    //allow script to handle abandoning
    if(game.options.menu.alwaysAbandon.enabled == 1) toggleSetting('alwaysAbandon');
    //if we are prestige mapping, force equip first mode
    var prestige = autoTrimpSettings.Prestige.selected;
    if(prestige != "Off" && game.options.menu.mapLoot.enabled != 1) toggleSetting('mapLoot');
    //if player has selected arbalest or gambeson but doesn't have them unlocked, just unselect it for them! It's magic!
    if(document.getElementById('Prestige').selectedIndex > 11 && game.global.slowDone == false) {
        document.getElementById('Prestige').selectedIndex = 11;
        autoTrimpSettings.Prestige.selected = "Bestplate";
    }
    //Control in-map right-side-buttons for people who can't control themselves. If you wish to use these buttons manually, turn off autoMaps temporarily.
    if(game.options.menu.repeatUntil.enabled == 2) toggleSetting('repeatUntil');
    if(game.options.menu.exitTo.enabled != 0) toggleSetting('exitTo');
    if(game.options.menu.repeatVoids.enabled != 0) toggleSetting('repeatVoids');
    //exit and do nothing if we are prior to zone 6 (maps haven't been unlocked):
    if (!game.global.mapsUnlocked) {
        enoughDamage = true; enoughHealth = true; shouldFarm = false;
        return;
    }
    //if we are in mapology and we have no credits, exit
    if (game.global.challengeActive == "Mapology" && game.challenges.Mapology.credits < 1) return;
    //FIND VOID MAPS LEVEL:
    var voidMapLevelSetting = getPageSetting('VoidMaps');
    //decimal void maps are possible, using string function to avoid false float precision (0.29999999992). javascript can compare ints to strings anyway.
    var voidMapLevelSettingZone = (voidMapLevelSetting+"").split(".")[0];
    var voidMapLevelSettingMap = (voidMapLevelSetting+"").split(".")[1];
    if (voidMapLevelSettingMap === undefined || game.global.challengeActive == 'Lead')
        voidMapLevelSettingMap = 93;
    if (voidMapLevelSettingMap.length == 1) voidMapLevelSettingMap += "0";  //entering 187.70 becomes 187.7, this will bring it back to 187.70
    var voidsuntil = getPageSetting('RunNewVoidsUntil');
    needToVoid = voidMapLevelSetting > 0 && game.global.totalVoidMaps > 0 && game.global.lastClearedCell + 1 >= voidMapLevelSettingMap &&
                                    (game.global.world == voidMapLevelSettingZone ||
                                 (game.global.world >= voidMapLevelSettingZone && getPageSetting('RunNewVoids') && (voidsuntil == -1 || game.global.world <= voidsuntil)));
    if(game.global.totalVoidMaps == 0 || !needToVoid)
        doVoids = false;
    //calculate if we are behind on prestiges
    needPrestige = prestige != "Off" && game.mapUnlocks[prestige].last <= game.global.world - 5 && game.global.challengeActive != "Frugal";
   //dont need prestige if we are caught up, and have unbought prestiges:
     /*if (needPrestige && game.upgrades[prestige].allowed == Math.floor(game.mapUnlocks[prestige].last) && game.upgrades[prestige].done < game.upgrades[prestige].allowed)
        needPrestige = false;
    */

//START CALCULATING DAMAGES
    //PREPARE SOME VARIABLES
    //calculate crits (baseDamage was calced in function autoStance)    divide by two is because we are adding two hits here (non-crit + crit)
    baseDamage = (baseDamage * (1-getPlayerCritChance()) + (baseDamage * getPlayerCritChance() * getPlayerCritDamageMult()));
    //calculate with map bonus
    var mapbonusmulti = 1 + (0.20*game.global.mapBonus);
    baseDamage *= mapbonusmulti;
    //get average enemyhealth and damage for the next zone, cell 30, snimp type and multiply it by a factor of .85 (don't ask why)
    var enemyDamage = getEnemyMaxAttack(game.global.world + 1, 30, 'Snimp', .85);
    var enemyHealth = getEnemyMaxHealth(game.global.world + 1);
    //Corruption Zone Proportionality Farming Calculator:
    var corrupt = game.global.world >= mutations.Corruption.start(true);
    if (getPageSetting('CorruptionCalc') && corrupt) {
        var cptnum = getCorruptedCellsNum();     //count corrupted cells
        var cpthlth = getCorruptScale("health"); //get corrupted health mod
        var cptpct = cptnum / 100;               //percentage of zone which is corrupted.
        var hlthprop = cptpct * cpthlth;         //Proportion of cells corrupted * health of a corrupted cell
        if (hlthprop >= 1)                       //dont allow sub-1 numbers to make the number less
            enemyHealth *= hlthprop;
        var cptatk = getCorruptScale("attack");  //get corrupted attack mod
        var atkprop = cptpct * cptatk;           //Proportion of cells corrupted * attack of a corrupted cell
        if (atkprop >= 1)
            enemyDamage *= atkprop;
        //console.log("enemy dmg:" + enemyDamage + " enemy hp:" + enemyHealth + " base dmg: " + baseDamage);
    }
    //farm if basedamage is between 10 and 16)
    if(!getPageSetting('DisableFarm')) {
        shouldFarm = shouldFarm ? getEnemyMaxHealth(game.global.world) / baseDamage > 10 : getEnemyMaxHealth(game.global.world) / baseDamage > 16;
    }
    if(game.global.challengeActive == "Toxicity") {
        //enemyDamage *= 2; //ignore damage changes (which would effect how much health we try to buy) entirely since we die in 20 attacks anyway?
        enemyHealth *= 2;
    }
    var pierceMod = getPierceAmt();
    //Lead specific farming calcuation section:
    if(game.global.challengeActive == 'Lead') {
        baseDamage /= mapbonusmulti;
        enemyDamage *= (1 + (game.challenges.Lead.stacks * 0.04));
        enemyHealth *= (1 + (game.challenges.Lead.stacks * 0.04));
        //if the zone is odd:   (skip the +2 calc for the last level.
        if (game.global.world % 2 == 1 && game.global.world != 179){
            enemyDamage = getEnemyMaxAttack(game.global.world + 2, 30, 'Chimp', 1); //calculate for the next level in advance (since we only farm on odd, and evens are very tough)
            enemyHealth = getEnemyMaxHealth(game.global.world + 2);
            baseDamage /= 1.5; //subtract the odd-zone bonus.
        }
        //let people disable this if they want.
        if(!getPageSetting('DisableFarm')) {
            shouldFarm = enemyHealth / baseDamage > 5;
        }
    }
    enoughHealth = (baseHealth * 4 > 30 * (enemyDamage - baseBlock / 2 > 0 ? enemyDamage - baseBlock / 2 : enemyDamage * pierceMod)
                    ||
                    baseHealth > 30 * (enemyDamage - baseBlock > 0 ? enemyDamage - baseBlock : enemyDamage * pierceMod));
    enoughDamage = baseDamage * 4 > enemyHealth;
    HDratio = getEnemyMaxHealth(game.global.world) / baseDamage;
    //prevents map-screen from flickering on and off during startup when base damage is 0.
    var shouldDoMaps;
    if (baseDamage > 0){
        shouldDoMaps = !enoughHealth || !enoughDamage || shouldFarm;
    }
    var selectedMap = "world";

//BEGIN AUTOMAPS DECISIONS:
    //if we are at max map bonus, and we don't need to farm, don't do maps
    if(game.global.mapBonus == 10 && !shouldFarm) shouldDoMaps = false;

    //FarmWhenNomStacks7
    if(game.global.challengeActive == 'Nom' && getPageSetting('FarmWhenNomStacks7')) {
        if (game.global.gridArray[99].nomStacks > 7){
            if (game.global.mapBonus != 10)
                shouldDoMaps = true;
        }
        //Go into maps on 30 stacks, and I assume our enemy health to damage ratio is worse than 10 (so that shouldfarm would be true),
        // and exit farming once we get enough damage to drop under 10.
        if (game.global.gridArray[99].nomStacks == 30){
            shouldFarm = (HDratio > 20);
            shouldDoMaps = true;
        }
    }

    //stack tox stacks if we are doing max tox, or if we need to clear our void maps
    if(game.global.challengeActive == 'Toxicity' && game.global.lastClearedCell > 93 && game.challenges.Toxicity.stacks < 1500 && ((getPageSetting('MaxTox') && game.global.world > 59) || needToVoid)) {
        shouldDoMaps = true;
        //we willl get at least 85 toxstacks from the 1st voidmap (unless we have overkill)
//            if (!game.portal.Overkill.locked && game.stats.cellsOverkilled.value)

        stackingTox = !(needToVoid && game.challenges.Toxicity.stacks > 1415);
        //force abandon army
        if(!game.global.mapsActive && !game.global.preMapsActive) {
            mapsClicked();
            mapsClicked();
        }
    }
    else stackingTox = false;

    //during 'watch' challenge, run maps on these levels:
    var watchmaps = [15, 25, 35, 50];
    var shouldDoWatchMaps = false;
    if (game.global.challengeActive == 'Watch' && watchmaps.indexOf(game.global.world) > -1 && game.global.mapBonus < 1){
        shouldDoMaps = true;
        shouldDoWatchMaps = true;
    }
    //Farm X Minutes Before Spire:
    var shouldDoSpireMaps = false;    
    var needFarmSpire = game.global.world == 200 && game.global.spireActive && (((new Date().getTime() - game.global.zoneStarted) / 1000 / 60) < getPageSetting('MinutestoFarmBeforeSpire'));
    if (needFarmSpire) {
        shouldDoMaps = true;
        shouldDoSpireMaps = true;
    }
    //Run a single map to get nurseries when blacksmithery is purchased
    if (game.talents.blacksmith.purchased && game.buildings.Nursery.locked && game.global.world >= 60) {
        shouldDoMaps = true;
        shouldDoWatchMaps = true;
    }


    //Dynamic Siphonology section (when necessary)
    var siphlvl = game.global.world - game.portal.Siphonology.level;
    var maxlvl = game.talents.mapLoot.purchased ? game.global.world - 1 : game.global.world;
    if (getPageSetting('DynamicSiphonology')){
        for (siphlvl; siphlvl < maxlvl; siphlvl++) {
            //check HP vs damage and find how many siphonology levels we need.
            var maphp = getEnemyMaxHealth(siphlvl);
            var cpthlth = getCorruptScale("health")/2; //get corrupted health mod
            if (mutations.Magma.active())
                maphp *= cpthlth;
            if (baseDamage * 2 < maphp){
                break;
            }
        }
    }
    var obj = {};
    var siphonMap = -1;
    for (var map in game.global.mapsOwnedArray) {
        if (!game.global.mapsOwnedArray[map].noRecycle) {
            obj[map] = game.global.mapsOwnedArray[map].level;
            if(game.global.mapsOwnedArray[map].level == siphlvl)
                siphonMap = map;
        }
    }
    var keysSorted = Object.keys(obj).sort(function(a, b) {
        return obj[b] - obj[a];
    });
    //if there are no non-unique maps, there will be nothing in keysSorted, so set to create a map
    var highestMap;
    if (keysSorted[0])
        highestMap = keysSorted[0];
    else
        selectedMap = "create";

    //Look through all the maps we have - find Uniques and figure out if we need to run them.
    for (var map in game.global.mapsOwnedArray) {
        var theMap = game.global.mapsOwnedArray[map];
        if (theMap.noRecycle && getPageSetting('RunUniqueMaps')) {
            if (theMap.name == 'The Wall' && game.upgrades.Bounty.allowed == 0 && !game.talents.bounty.purchased) {
                selectedMap = theMap.id;
                break;
            }
            if (theMap.name == 'Dimension of Anger' && document.getElementById("portalBtn").style.display == "none" && !game.talents.portal.purchased) {
                var doaDifficulty = Math.ceil(theMap.difficulty / 2);
                if(game.global.world < 20 + doaDifficulty) continue;
                selectedMap = theMap.id;
                break;
            }
            //run the prison only if we are 'cleared' to run level 80 + 1 level per 200% difficulty. Could do more accurate calc if needed
            if(theMap.name == 'The Prison' && (game.global.challengeActive == "Electricity" || game.global.challengeActive == "Mapocalypse")) {
                var prisonDifficulty = Math.ceil(theMap.difficulty / 2);
                if(game.global.world >= 80 + prisonDifficulty) {
                    selectedMap = theMap.id;
                    break;
                }
            }
            if(theMap.name == 'The Block' && !game.upgrades.Shieldblock.allowed && (game.global.challengeActive == "Scientist" || game.global.challengeActive == "Trimp" || getPageSetting('BuyShieldblock'))) {
                selectedMap = theMap.id;
                break;
            }
            if(theMap.name == 'Trimple Of Doom' && game.global.challengeActive == "Meditate") {
                selectedMap = theMap.id;
                break;
            }
            if(theMap.name == 'Bionic Wonderland' && game.global.challengeActive == "Crushed" ) {
                var wonderlandDifficulty = Math.ceil(theMap.difficulty / 2);
                if(game.global.world >= 125 + wonderlandDifficulty) {
                    selectedMap = theMap.id;
                    break;
                }
            }
            //run Bionics before spire to farm.
            if (getPageSetting('RunBionicBeforeSpire') && (game.global.world == 200) && theMap.name.includes('Bionic Wonderland')){
                //this is how to check if a bionic is green or not.
                var bionicnumber = 1 + ((theMap.level - 125) / 15);
                //if numbers match, map is green, so run it. (do the pre-requisite bionics one at a time in order)
                if (bionicnumber == game.global.bionicOwned && bionicnumber < 6){
                    selectedMap = theMap.id;
                    break;
                }
                if (shouldDoSpireMaps && theMap.name == 'Bionic Wonderland VI'){
                    selectedMap = theMap.id;
                    break;
                }
            }
            //other unique maps here
        }
    }

    //voidArray: make an array with all our voidmaps, so we can sort them by real-world difficulty level
    var voidArray = [];
    //values are easiest to hardest. (hardest has the highest value)
    var prefixlist = {'Deadly':10, 'Heinous':11, 'Poisonous':20, 'Destructive':30};
    var prefixkeys = Object.keys(prefixlist);
    var suffixlist = {'Descent':7.077, 'Void':8.822, 'Nightmare':9.436, 'Pit':10.6};
    var suffixkeys = Object.keys(suffixlist);
    for (var map in game.global.mapsOwnedArray) {
        var theMap = game.global.mapsOwnedArray[map];
        if(theMap.location == 'Void') {
            for (var pre in prefixkeys) {
                if (theMap.name.includes(prefixkeys[pre]))
                    theMap.sortByDiff = 1 * prefixlist[prefixkeys[pre]];
            }
            for (var suf in suffixkeys) {
                if (theMap.name.includes(suffixkeys[suf]))
                    theMap.sortByDiff += 1 * suffixlist[suffixkeys[suf]];
            }
            voidArray.push(theMap);
        }
    }
    //sort the array (harder/highvalue last):
    var voidArraySorted = voidArray.sort(function(a, b) {
        return a.sortByDiff - b.sortByDiff;
    });
    for (var map in voidArraySorted) {
        var theMap = voidArraySorted[map];
        //Only proceed if we needToVoid right now.
        if(needToVoid) {
            //if we are on toxicity, don't clear until we will have max stacks at the last cell.
            if(game.global.challengeActive == 'Toxicity' && game.challenges.Toxicity.stacks < (1500 - theMap.size)) break;
            doVoids = true;
            //check to make sure we won't get 1-shot in nostance by boss
            var eAttack = getEnemyMaxAttack(game.global.world, theMap.size, 'Voidsnimp', theMap.difficulty);
            if (game.global.world >= 181 || (game.global.challengeActive == "Corrupted" && game.global.world >= 60))
                eAttack *= (getCorruptScale("attack") / 2).toFixed(1);
            var ourHealth = baseHealth;
            if(game.global.challengeActive == 'Balance') {
                var stacks = game.challenges.Balance.balanceStacks ? (game.challenges.Balance.balanceStacks > theMap.size) ? theMap.size : game.challenges.Balance.balanceStacks : false;
                eAttack *= 2;
                if(stacks) {
                    for (i = 0; i < stacks; i++ ) {
                        ourHealth *= 1.01;
                    }
                }
            }
            if(game.global.challengeActive == 'Toxicity') eAttack *= 5;
            //break to prevent finishing map to finish a challenge?
            //continue to check for doable map?
            var diff = parseInt(getPageSetting('VoidCheck')) > 0 ? parseInt(getPageSetting('VoidCheck')) : 2;
            if(ourHealth/diff < eAttack - baseBlock) {
                shouldFarm = true;
                voidCheckPercent = Math.round((ourHealth/diff)/(eAttack-baseBlock)*100);
                break;
            }
            else {
                voidCheckPercent = 0;
                if(getPageSetting('DisableFarm'))
                    shouldFarm = false;
            }
            selectedMap = theMap.id;
            //Restart the voidmap if we hit 30 nomstacks on the final boss
            if(game.global.mapsActive && game.global.challengeActive == "Nom" && getPageSetting('FarmWhenNomStacks7')) {
                if(game.global.mapGridArray[theMap.size-1].nomStacks >= 100) {
                    mapsClicked(true);
                }
            }
            break;
        }
    }

    //map if we don't have health/dmg or we need to clear void maps or if we are prestige mapping, and our set item has a new prestige available
    if (shouldDoMaps || doVoids || needPrestige) {
        //selectedMap = world here if we haven't set it to create yet, meaning we found appropriate high level map, or siphon map
        if (selectedMap == "world") {
            //if needPrestige, TRY to find current level map as the highest level map we own.
            if (needPrestige) {
                if (game.global.world == game.global.mapsOwnedArray[highestMap].level)
                    selectedMap = game.global.mapsOwnedArray[highestMap].id;
                else
                    selectedMap = "create";
            //if needFarmSpire x minutes is true, switch over from wood maps to metal maps.
            } else if (needFarmSpire) {
                var spiremaplvl = game.talents.mapLoot.purchased ? 199 : 200;
                if (game.global.mapsOwnedArray[highestMap].level >= spiremaplvl && game.global.mapsOwnedArray[highestMap].location == (game.global.decayDone ? 'Plentiful' : 'Mountain'))
                    selectedMap = game.global.mapsOwnedArray[highestMap].id;
                else
                    selectedMap = "create";
            //if shouldFarm is true, use a siphonology adjusted map, as long as we aren't trying to prestige
            } else if (siphonMap != -1)
                selectedMap = game.global.mapsOwnedArray[siphonMap].id;
            //if we dont' have an appropriate max level map, or a siphon map, we need to make one
            else
                selectedMap = "create";
        }
        //if selectedMap != world, it already has a map ID and will be run below
    }

    //don't map on even worlds if on Lead, except if person is dumb and wants to void on even
    if(game.global.challengeActive == 'Lead' && !doVoids && (game.global.world % 2 == 0 || game.global.lastClearedCell < 59)) {
        if(game.global.preMapsActive)
            mapsClicked();
        return; //exit
    }

    //Repeat Button Management (inside a map):
    if (!game.global.preMapsActive && game.global.mapsActive) {
        //Set the repeatBionics flag (farm bionics before spire), for the repeat button management code.
        var repeatBionics = getPageSetting('RunBionicBeforeSpire') && game.global.bionicOwned >= 6;
        //if we are doing the right map, and it's not a norecycle (unique) map, and we aren't going to hit max map bonus
        //or repeatbionics is true and there are still prestige items available to get
        if (selectedMap == game.global.currentMapId && (!getCurrentMapObject().noRecycle && (game.global.mapBonus < 9 || shouldFarm || stackingTox || needPrestige || shouldDoSpireMaps) || repeatBionics)) {
            var targetPrestige = autoTrimpSettings.Prestige.selected;
            //make sure repeat map is on
            if (!game.global.repeatMap) {
                repeatClicked();
            }
            //if we aren't here for dmg/hp, and we see the prestige we are after on the last cell of this map, and it's the last one available, turn off repeat to avoid an extra map cycle
            if (!shouldDoMaps && (game.global.mapGridArray[game.global.mapGridArray.length - 1].special == targetPrestige && game.mapUnlocks[targetPrestige].last >= game.global.world - 9 )) {
                repeatClicked();
            }
            //avoid another map cycle due to having the amount of tox stacks we need.
            if (stackingTox && (game.challenges.Toxicity.stacks + game.global.mapGridArray.length - (game.global.lastClearedMapCell + 1) >= 1500)){
                repeatClicked();
            }
            //turn off repeat maps if we doing Watch maps.
            if (shouldDoWatchMaps)
                repeatClicked();
        } else {
            //otherwise, make sure repeat map is off
            if (game.global.repeatMap) {
                repeatClicked();
            }
        }
    //clicks the maps button, once or twice (inside the world):
    } else if (!game.global.preMapsActive && !game.global.mapsActive) {
        if (selectedMap != "world") {
            //if we should not be in the world, and the button is not already clicked, click map button once (and wait patiently until death)
            if (!game.global.switchToMaps){
                mapsClicked();
            }
            //Get Impatient/Abandon if: (need prestige / _NEED_ to do void maps / on lead in odd world.) AND (a new army is ready, OR _need_ to void map OR lead farming and we're almost done with the zone)
            if (game.global.switchToMaps &&
                (needPrestige || doVoids ||
                (game.global.challengeActive == 'Lead' && game.global.world % 2 == 1) ||
                (!enoughDamage && game.global.lastClearedCell < 5) ||
                (shouldFarm && game.global.lastClearedCell >= 59))
                &&
                    (
                    (game.resources.trimps.realMax() <= game.resources.trimps.owned + 1)
                    || (game.global.challengeActive == 'Lead' && game.global.lastClearedCell > 93)
                    || (doVoids && game.global.lastClearedCell > 93)
                    )
                ){
                mapsClicked();
            }
        }
        //forcibly run watch maps
        if (shouldDoWatchMaps) {
            mapsClicked();
        }
    } else if (game.global.preMapsActive) {
        if (selectedMap == "world") {
            mapsClicked();  //go back
        }
        else if (selectedMap == "create") {
            if (needPrestige)
                document.getElementById("mapLevelInput").value = game.global.world;
            else
                document.getElementById("mapLevelInput").value = siphlvl;

            //instead of normal map locations, use Plentiful (Gardens) if the Decay challenge has been completed. (for +25% better loot)

            if (game.global.world >= 70) {
                //Zone 70+ (9/9/9 Metal):
                sizeAdvMapsRange.value = 9;
                adjustMap('size', 9);
                difficultyAdvMapsRange.value = 9;
                adjustMap('difficulty', 9);
                lootAdvMapsRange.value = 9;
                adjustMap('loot', 9);
                biomeAdvMapsSelect.value = game.global.decayDone ? "Plentiful" : "Mountain";  //metal is the current meta
            } else if (game.global.world >= 47) {
                //Zone 47-70 (9/9/4 Metal):
                sizeAdvMapsRange.value = 9;
                adjustMap('size', 9);
                difficultyAdvMapsRange.value = 9;
                adjustMap('difficulty', 9);
                lootAdvMapsRange.value = 4;
                adjustMap('loot', 4);
                biomeAdvMapsSelect.value = game.global.decayDone ? "Plentiful" : "Mountain";  //metal is the current meta
            } else {
                //Zone 6-16 (9/0/0 Random):
                //Zone 16-47 (9/9/0 Random):
                sizeAdvMapsRange.value = 9;
                adjustMap('size', 9);
                if (game.global.world >= 16) {
                    difficultyAdvMapsRange.value = 9;
                    adjustMap('difficulty', 9);
                } else {
                    difficultyAdvMapsRange.value = 0;
                    adjustMap('difficulty', 0);
                }
                lootAdvMapsRange.value = 0;
                adjustMap('loot', 0);
                biomeAdvMapsSelect.value = game.global.decayDone ? "Plentiful" : "Random";
            }
            if (needFarmSpire)
                document.getElementById("mapLevelInput").value = game.talents.mapLoot.purchased ? 199 : 200;            
            //recalculate cost.
            updateMapCost();
            //if we are "Farming" for resources, make sure it's Plentiful OR metal (and always aim for lowest difficulty)
            if(shouldFarm || !enoughDamage || !enoughHealth || game.global.challengeActive == 'Metal') {
                biomeAdvMapsSelect.value = game.global.decayDone ? "Plentiful" : "Mountain";
                updateMapCost();
            } else {
                //if we can't afford the map:
                //Put a priority on small size, and increase the difficulty? for high Helium that just wants prestige = yes.
                //Really just trying to prevent prestige mapping from getting stuck
                while (difficultyAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
                    difficultyAdvMapsRange.value -= 1;
                }
            }
            //Common:
            //if we still cant afford the map, lower the size slider (make it larger) (doesn't matter much for farming.)
            while (sizeAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
                sizeAdvMapsRange.value -= 1;
            }
            //if we STILL cant afford the map, lower the loot slider (less loot)
            while (lootAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
                lootAdvMapsRange.value -= 1;
            }
            //if we can't afford the map we designed, pick our highest existing map
            if (updateMapCost(true) > game.resources.fragments.owned) {
                selectMap(game.global.mapsOwnedArray[highestMap].id);
                debug("Can't afford the map we designed, #" + document.getElementById("mapLevelInput").value, "maps", '*crying2');
                debug("..picking our highest map:# " + game.global.mapsOwnedArray[highestMap].id + " Level: " + game.global.mapsOwnedArray[highestMap].level, "maps", '*happy2');
                runMap();
            } else {
                debug("BUYING a Map, level: #" + document.getElementById("mapLevelInput").value, "maps", 'th-large');
                var result = buyMap();
                if(result == -2){
                    debug("Too many maps, recycling now: ", "maps", 'th-large');
                    recycleBelow(true);
                    debug("Retrying BUYING a Map, level: #" + document.getElementById("mapLevelInput").value, "maps", 'th-large');
                    buyMap();
                }
            }
            //if we already have a map picked, run it
        } else {
            selectMap(selectedMap);
            debug("Already have a map picked: Running map: " + selectedMap +
                " Level: " + game.global.mapsOwnedArray[getMapIndex(selectedMap)].level +
                " Name: " + game.global.mapsOwnedArray[getMapIndex(selectedMap)].name, "maps", 'th-large');
            runMap();
        }
    }
}

//Controls "Manage Breed Timer" and "Geneticist Timer" - adjust geneticists to reach desired breed timer
function autoBreedTimer() {
    var fWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    if(getPageSetting('ManageBreedtimer')) {
        if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");

        if(game.portal.Anticipation.level == 0) autoTrimpSettings.GeneticistTimer.value = '0';
        else if(game.global.challengeActive == 'Electricity' || game.global.challengeActive == 'Mapocalypse') autoTrimpSettings.GeneticistTimer.value = '3.5';
        else if(game.global.challengeActive == 'Nom' || game.global.challengeActive == 'Toxicity') {

            if(getPageSetting('FarmWhenNomStacks7') && game.global.gridArray[99].nomStacks >= 5 && !game.global.mapsActive) {
                //if Improbability already has 5 nomstacks, do 30 antistacks.
                autoTrimpSettings.GeneticistTimer.value = '30';
                //actually buy them here because we can't wait.
                safeBuyJob('Geneticist', 1+(autoTrimpSettings.GeneticistTimer.value - getBreedTime())*2);
            }
            else
                autoTrimpSettings.GeneticistTimer.value = '10';
        }
        else autoTrimpSettings.GeneticistTimer.value = '30';
    }
    var inDamageStance = game.upgrades.Dominance.done ? game.global.formation == 2 : game.global.formation == 0;
    var inScryerStance = (game.global.world >= 60 && game.global.highestLevelCleared >= 180) && game.global.formation == 4;
    //(inDamageStance||inScryerStance);
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    //if we need to hire geneticists
    //Don't hire geneticists if total breed time remaining is greater than our target breed time
    //Don't hire geneticists if we have already reached 30 anti stacks (put off further delay to next trimp group)
    if (targetBreed > getBreedTime() && !game.jobs.Geneticist.locked && targetBreed > getBreedTime(true) && (game.global.lastBreedTime/1000 + getBreedTime(true) < autoTrimpSettings.GeneticistTimer.value) && game.resources.trimps.soldiers > 0 && !breedFire) {
        //insert 10% of total food limit here? or cost vs tribute?
        //if there's no free worker spots, fire a farmer
        if (fWorkers < 1)
            //do some jiggerypokery in case jobs overflow and firing -1 worker does 0 (java integer overflow)
            safeFireJob('Farmer');
        if (canAffordJob('Geneticist', false, 1)) {
            //hire a geneticist
            safeBuyJob('Geneticist', 1);
        }
    }
    //if we need to speed up our breeding
    //if we have potency upgrades available, buy them. If geneticists are unlocked, or we aren't managing the breed timer, just buy them
    if ((targetBreed < getBreedTime() || !game.jobs.Geneticist.locked || !getPageSetting('ManageBreedtimer') || game.global.challengeActive == 'Watch') && game.upgrades.Potency.allowed > game.upgrades.Potency.done && canAffordTwoLevel('Potency') && getPageSetting('BuyUpgrades')) {
        buyUpgrade('Potency');
    }
    //otherwise, if we have some geneticists, start firing them
    else if ((targetBreed*1.02 < getBreedTime() || targetBreed*1.02 < getBreedTime(true)) && !game.jobs.Geneticist.locked && game.jobs.Geneticist.owned > 10) {
        safeBuyJob('Geneticist', -10);
        //debug('fired 10 geneticist');
    }
    //if our time remaining to full trimps is still too high, fire some jobs to get-er-done
    //needs option to toggle? advanced options?
    else if ((targetBreed < getBreedTime(true) || (game.resources.trimps.soldiers == 0 && getBreedTime(true) > 6)) && breedFire == false && getPageSetting('BreedFire') && game.global.world > 10) {
        breedFire = true;
    }

    //reset breedFire once we have less than 2 seconds remaining
    if(getBreedTime(true) < 2) breedFire = false;

    //if a new fight group is available and anticipation stacks aren't maxed, force abandon and grab a new group
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    if (getPageSetting('ForceAbandon') && game.portal.Anticipation.level && game.global.antiStacks < targetBreed && getBreedTime(true) == 0 && (game.global.lastBreedTime/1000) >= targetBreed && newSquadRdy && game.resources.trimps.soldiers > 0) {
        forceAbandonTrimps();
    }
}

//Abandon trimps function that should handle all special cases.
function forceAbandonTrimps() {
    //dont if <z6 (no button)
    if (!game.global.mapsUnlocked) return;
    //dont if were in a voidmap
    if (game.global.mapsActive && getCurrentMapObject().location == "Void") return;
    //dont if were on map-selection screen.
    if (game.global.preMapsActive) return;
    if (getPageSetting('AutoMaps')) {
        mapsClicked();
        //force abandon army
        if (game.global.switchToMaps || game.global.switchToWorld)
            mapsClicked();
    }
    //in map without automaps
    else if (game.global.mapsActive) {
        mapsClicked();
        if (game.global.switchToMaps)
            mapsClicked();        
        runMap();
    }
    //in world without automaps
    else  {
        mapsClicked();
        if (game.global.switchToMaps)
            mapsClicked();        
        mapsClicked();
    }
    debug("Killed your army! (to get " + parseInt(getPageSetting('GeneticistTimer')) + " Anti-stacks). Trimpicide successful.","other");    
}

//Change prestiges as we go (original idea thanks to Hider)
//The idea is like this. We will stick to Dagger until the end of the run, then we will slowly start grabbing prestiges, so we can hit the Prestige we want by the last zone.
//The keywords below "Dagadder" and "GambesOP" are merely representative of the minimum and maximum values. Toggling these on and off, the script will take care of itself, when set to min (Dagger) or max (Gambeson).
//In this way, we will achieve the desired "maxPrestige" setting (which would be somewhere in the middle, like Polearm) by the end of the run. (instead of like in the past where it was gotten from the beginning and wasting time in early maps.)
//Function originally written by Hyppy (in July 2016)
function prestigeChanging2(){
     //find out the equipment index of the prestige we want to hit at the end.
     var maxPrestigeIndex = document.getElementById('Prestige').selectedIndex;
    // Cancel dynamic prestige logic if maxPrestigeIndex is less than or equal to 2 (dagger)
    if (maxPrestigeIndex <= 2)
        return;

     //find out the last zone (checks custom autoportal and challenge's portal zone)
    var lastzone = checkSettings() - 1; //subtract 1 because the function adds 1 for its own purposes.

     //if we can't figure out lastzone (likely Helium per Hour AutoPortal setting), then use the last run's Portal zone.
    if (lastzone < 0)
        lastzone = game.global.lastPortal;

    // Find total prestiges needed by determining current prestiges versus the desired prestiges by the end of the run
    var neededPrestige = 0;
    for (i = 1; i <= maxPrestigeIndex ; i++){
        var lastp = game.mapUnlocks[autoTrimpSettings.Prestige.list[i]].last;
        if (lastp <= lastzone - 5){
            var rem = lastzone - lastp;
            var addto = Math.floor(rem/5);
            // For Scientist IV bonus, halve the required prestiges to farm
            if (game.global.sLevel > 3)
                addto = Math.ceil(addto/2);
            neededPrestige += addto;
        }
    }
    // For Lead runs, we hack this by doubling the neededPrestige to acommodate odd zone-only farming. This might overshoot a bit
    if (game.global.challengeActive == 'Lead')
        neededPrestige *= 2;

    // Determine the number of zones we want to farm.  We will farm 4 maps per zone, then ramp up to 9 maps by the final zone
    var zonesToFarm = 0;
    if (neededPrestige == 0){
        autoTrimpSettings.Prestige.selected = "Dagadder";
        return;
    }

    zonesToFarm = Math.ceil(neededPrestige/maxPrestigeIndex);

    //If we are in the zonesToFarm threshold, kick off the additional prestige maps
    if(game.global.world > (lastzone-zonesToFarm)){
        if (game.global.mapBonus < maxPrestigeIndex) {
            //if player has selected arbalest or gambeson but doesn't have them unlocked, just unselect it for them! It's magic!
            if(game.global.slowDone == true)
                autoTrimpSettings.Prestige.selected = "GambesOP";
            else
                autoTrimpSettings.Prestige.selected = "Bestplate";
        }
        else if (game.global.mapBonus > maxPrestigeIndex)
             autoTrimpSettings.Prestige.selected = "Dagadder";
    }

    //If we are not in the prestige farming zone (the beginning of the run), use dagger:
    if (game.global.world <= lastzone-zonesToFarm || game.global.mapBonus == 10)
        autoTrimpSettings.Prestige.selected = "Dagadder";
}

//Activate Robo Trimp
function autoRoboTrimp() {
    //exit if the cooldown is active, or we havent unlocked robotrimp.
    if (game.global.roboTrimpCooldown > 0 || !game.global.roboTrimpLevel) return;
    var robotrimpzone = parseInt(getPageSetting('AutoRoboTrimp'));
    //exit if we have the setting set to 0
    if (robotrimpzone == 0) return;
    //activate the button when we are above the cutoff zone, and we are out of cooldown (and the button is inactive)
    if (game.global.world >= robotrimpzone && !game.global.useShriek){
        magnetoShriek();
        debug("Activated Robotrimp MagnetoShriek Ability", "other", '*podcast');
    }
}

//Version 3.6 Golden Upgrades
function autoGoldenUpgrades() {
    //get the numerical value of the selected index of the dropdown box
    var setting = document.getElementById('AutoGoldenUpgrades').value;
    if (setting == "Off") return;   //if disabled, exit.
    var num = getAvailableGoldenUpgrades();
    if (num == 0) return;       //if we have nothing to buy, exit.
    //buy one upgrade per loop.
    buyGoldenUpgrade(setting);
}

//old: Handles manual fighting automatically, in a different way.
function betterAutoFight() {
    if (game.global.autoBattle && !game.global.pauseFight)
        pauseFight(); //Disable built-in autofight
    if (game.global.gridArray.length === 0) return;  //sanity check. stops error message on z1 right after portal
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var lowLevelFight = game.resources.trimps.maxSoldiers < breeding * 0.5 && breeding > game.resources.trimps.realMax() * 0.1 && game.global.world < 5 && game.global.sLevel > 0;
    //Manually fight instead of using builtin auto-fight
    if (!game.global.fighting) {
        if (game.upgrades.Battle.done && game.global.gridArray.length !== 0 && !game.global.preMapsActive && (newSquadRdy || game.global.soldierHealth > 0 || lowLevelFight || game.global.challengeActive == 'Watch')) {
            fightManual();
        }
        //Click Fight if we are dead and already have enough for our breed timer, and fighting would not add a significant amount of time
        else if (getBreedTime() < 2 && (game.global.lastBreedTime/1000) > autoTrimpSettings.GeneticistTimer.value && game.global.soldierHealth == 0)
            fightManual();
        //AutoFight will now send Trimps to fight if it takes less than 0.5 seconds to create a new group of soldiers, if we havent bred fully yet
        else if (game.resources.trimps.owned >= game.resources.trimps.realMax() || getBreedTime() <= 0.5)
            fightManual();
    }
}

//NEW:: 2nd algorithm for Better Auto Fight
function betterAutoFight2() {
    if (game.global.autoBattle && !game.global.pauseFight)
        pauseFight(); //Disable built-in autofight
    if (game.global.gridArray.length === 0 || game.global.preMapsActive || !game.upgrades.Battle.done || game.global.fighting)
        return;
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var potencyMod = getPotencyMod();
    var tps = breeding * potencyMod;
    var addTime = adjustedMax / tps;
    var lowLevelFight = game.resources.trimps.maxSoldiers < breeding * 0.5 && breeding > game.resources.trimps.realMax() * 0.1 && game.global.world < 5 && game.global.sLevel > 0;
    //Manually fight if:
    if (!game.global.fighting) {
        if (newSquadRdy || game.global.soldierHealth > 0 || lowLevelFight || game.global.challengeActive == 'Watch') {
            battle(true);
            debug("AutoFight: Default, because NewSquad was ready, etc", "other");
        }
        //Click Fight if we are dead and already have enough for our breed timer, and fighting would not add a significant amount of time
        else if (getBreedTime() < 2 && (game.global.lastBreedTime/1000) > autoTrimpSettings.GeneticistTimer.value) {
            battle(true);
            debug("AutoFight: BAF1 #1, breed &lt; 2 &amp;&amp; HiddenNextGroup &gt; GeneTimer", "other");
        }
        //AutoFight will now send Trimps to fight if it takes less than 0.5 seconds to create a new group of soldiers, if we havent bred fully yet
        else if (getBreedTime() <= 0.5) {
            battle(true);
            debug("AutoFight: BAF1 #2, breed &lt;= 0.5s", "other");
        }
        //Click fight anyway if we are dead and stuck in a loop due to Dimensional Generator and we can get away with adding time to it.
        else if (game.global.soldierHealth == 0 && (getBreedTime(true)+addTime <= autoTrimpSettings.GeneticistTimer.value) && (breeding>=adjustedMax)){
            battle(true);
            debug("AutoFight: NEW: BAF2 #3, RemainingTime + ArmyAdd.Time &lt; GeneTimer", "other");
        }
    }
}

function getArmyTime() {
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var potencyMod = getPotencyMod();
    var tps = breeding * potencyMod;
    var addTime = adjustedMax / tps;
    return addTime;
}

//Exits the Spire after completing the specified cell.
function exitSpireCell() {
    if(game.global.world == 200 && game.global.spireActive && game.global.lastClearedCell >= getPageSetting('ExitSpireCell')-1)
        endSpire();
}

//use S stance
function useScryerStance() {
    //check preconditions   (exit quick, if impossible to use)
    var use_auto = game.global.preMapsActive || game.global.gridArray.length === 0 || game.global.highestLevelCleared < 180;
    use_auto = use_auto || game.global.world <= 60;
    if (use_auto) {
        autoStance();
        return;
    }

    calcBaseDamageinX(); //calculate internal script variables normally processed by autostance.
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var form = game.global.formation;
    var oktoswitch = true;
    if (form == 0 || form == 1)
        oktoswitch = newSquadRdy || (missingHealth < (baseHealth / 2));

    var useoverkill = getPageSetting('ScryerUseWhenOverkill');
    if (useoverkill && game.portal.Overkill.level == 0)
        setPageSetting('ScryerUseWhenOverkill', false);
    if (useoverkill && game.global.world == 200 && game.global.spireActive && getPageSetting('ScryerUseinSpire2')==2)
        useoverkill = false;
    //Overkill button being on and being able to overkill in S will override any other setting, regardless.
    if (useoverkill && game.portal.Overkill.level > 0) {
        var avgDamage = (baseDamage * (1-getPlayerCritChance()) + (baseDamage * getPlayerCritChance() * getPlayerCritDamageMult()))/2;
        var Sstance = 0.5;
        var ovkldmg = avgDamage * Sstance * (game.portal.Overkill.level*0.005);
        //are we going to overkill in S?
        var ovklHDratio = getCurrentEnemy(1).maxHealth / ovkldmg;
        if (ovklHDratio < 8) {
            if (oktoswitch)
                setFormation(4);
            return;
        }
    }

//Any of these being true will indicate scryer should not be used, and cause the function to dump back to regular autoStance():
    //check for spire
    use_auto = use_auto || game.global.world == 200 && game.global.spireActive && getPageSetting('ScryerUseinSpire2')!=1;
    //check for voids
    use_auto = use_auto || game.global.mapsActive && getCurrentMapObject().location == "Void" && !getPageSetting('ScryerUseinVoidMaps2');
    //check for maps
    use_auto = use_auto || game.global.mapsActive && !getPageSetting('ScryerUseinMaps2');
    //check for bosses above voidlevel
    use_auto = use_auto || getPageSetting('ScryerSkipBoss2') == 1 && game.global.world > getPageSetting('VoidMaps') && game.global.lastClearedCell == 98;
    //check for bosses (all levels)
    use_auto = use_auto || getPageSetting('ScryerSkipBoss2') == 2 && game.global.lastClearedCell == 98;
    if (use_auto) {
        autoStance();    //falls back to autostance when not using S.
        return;
    }

    //check for corrupted cells (and exit)
    var iscorrupt = getCurrentEnemy(1).corrupted;
    if (iscorrupt && getPageSetting('ScryerSkipCorrupteds2')) {
        autoStance();
        return;
    }

    //Default.
    var min_zone = getPageSetting('ScryerMinZone');
    var max_zone = getPageSetting('ScryerMaxZone');
    var valid_min = game.global.world >= min_zone;
    var valid_max = max_zone <= 0 || game.global.world < max_zone;
    if (valid_min && valid_max) {
        if (oktoswitch)
            setFormation(4);
    } else {
        autoStance();
        return;
    }
}

//Auto Magmite spender before portal
function autoMagmiteSpender() {
    var didSpend = false;
    //Part #1:
    //list of available permanent one-and-done upgrades
    var permanames = ["Slowburn","Shielding","Storage","Hybridization"];
    //cycle through:
    for (var i=0; i < permanames.length; i++) {
        var item = permanames[i];
        var upgrade = game.permanentGeneratorUpgrades[item];
        if (typeof upgrade === 'undefined')
            return; //error-resistant
        //skip owned perma-upgrades
        if (upgrade.owned)
            continue;
        var cost = upgrade.cost;
        //if we can afford anything, buy it:
        if (game.global.magmite >= cost) {
            buyPermanentGeneratorUpgrade(item);
            debug("Auto Spending " + cost + " Magmite on: " + item, "general");
            didSpend = true;
        }
    }
    //Part #2
    var repeat = true;
    while (repeat) {
        try {
            //list of available multi upgrades
            var names = ["Efficiency","Capacity","Supply"];
            var lowest = [null,null];   //keep track of cheapest one
            //cycle through:
            for (var i=0; i < names.length; i++) {
                var item = names[i];
                var upgrade = game.generatorUpgrades[item];
                if (typeof upgrade === 'undefined')
                    return; //error-resistant
                var cost = upgrade.cost();
                //store the first upgrade once
                if (lowest[1] == null)
                    lowest = [item,cost];
                //always load cheapest one in.
                else if (cost < lowest[1])
                    lowest = [item,cost];
            }
            //if we can afford anything, buy it:
            if (game.global.magmite >= lowest[1]) {
                buyGeneratorUpgrade(lowest[0]);
                debug("Auto Spending " + lowest[1] + " Magmite on: " + lowest[0] + " #" + game.generatorUpgrades[lowest[0]].upgrades, "general");
                didSpend = true;
            }
            //if we can't, exit the loop
            else
                repeat = false;
        }
        //dont get trapped in a while loop cause something stupid happened.
        catch (err) {
            debug("AutoSpendMagmite Error encountered: " + err.message,"general");
            repeat = false;
        }
    }
    //print the result
    if (didSpend)
        debug("Leftover magmite: " + game.global.magmite,"general");
    return;
}

/////////////////////////////////////////////////////
//Portal Related Code)///////////////////////////////
/////////////////////////////////////////////////////
var lastHeliumZone = 0;
var zonePostpone = 0;
//Decide When to Portal
function autoPortal() {
    switch (autoTrimpSettings.AutoPortal.selected) {
        //portal if we have lower He/hr than the previous zone (or buffer)
        case "Helium Per Hour":
            game.stats.bestHeliumHourThisRun.evaluate();    //normally, evaluate() is only called once per second, but the script runs at 10x a second.
            if(game.global.world > lastHeliumZone) {
                lastHeliumZone = game.global.world;
                if(game.global.world > (game.stats.bestHeliumHourThisRun.atZone + zonePostpone) && game.global.world >= getPageSetting('HeHrDontPortalBefore')) {
                    zonePostpone = 0;
                    var bestHeHr = game.stats.bestHeliumHourThisRun.storedValue;
                    var myHeliumHr = game.stats.heliumHour.value();
                    var heliumHrBuffer = Math.abs(getPageSetting('HeliumHrBuffer'));
                    if(myHeliumHr < bestHeHr * (1-(heliumHrBuffer/100)) && !game.global.challengeActive) {
                        debug("My HeliumHr was: " + myHeliumHr + " & the Best HeliumHr was: " + bestHeHr + " at zone: " +  game.stats.bestHeliumHourThisRun.atZone, "general");
                        pushData();
                        tooltip('confirm', null, 'update', '<b>Auto Portaling NOW!</b><p>Hit Confirm to WAIT 1 more zone.', 'zonePostpone+=1', '<b>NOTICE: Auto-Portaling in 10 seconds....</b>');
                        setTimeout(cancelTooltip,10000);
                        setTimeout(function(){ 
                            if (zonePostpone > 0)
                                 return; 
                            if(autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                                doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                            else
                                doPortal();
                            zonePostpone = 0;
                        },10100);
                    }
                }
            }
            break;
        case "Custom":
            if(game.global.world > getPageSetting('CustomAutoPortal') && !game.global.challengeActive) {
                pushData();
                if(autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                    doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                else
                    doPortal();
            }
            break;
        case "Balance":
        case "Decay":
        case "Electricity":
        case "Crushed":
        case "Nom":
        case "Toxicity":
        case "Watch":
        case "Lead":
        case "Corrupted":
            if(!game.global.challengeActive) {
                pushData();
                doPortal(autoTrimpSettings.AutoPortal.selected);
            }
            break;
        default:
            break;
    }
}

//Checks portal related UI settings (TODO: split into two, and move the validation check to NewUI)
function checkSettings() {
    var portalLevel = -1;
    var leadCheck = false;
    switch(autoTrimpSettings.AutoPortal.selected) {
        case "Off":
            break;
        case "Custom":
            portalLevel = autoTrimpSettings.CustomAutoPortal.value + 1;
            leadCheck = autoTrimpSettings.HeliumHourChallenge.selected == "Lead" ? true:false;
            break;
        case "Balance":
            portalLevel = 41;
            break;
        case "Decay":
            portalLevel = 56;
            break;
        case "Electricity":
            portalLevel = 82;
            break;
        case "Crushed":
            portalLevel = 126;
            break;
        case "Nom":
            portalLevel = 146;
            break;
        case "Toxicity":
            portalLevel = 166;
            break;
        case "Lead":
            portalLevel = 181;
            break;
        case "Watch":
            portalLevel = 181;
            break;
        case "Corrupted":
            portalLevel = 191;
            break;
    }
    if(portalLevel == -1)
        return portalLevel;
    if(autoTrimpSettings.VoidMaps.value >= portalLevel)
        tooltip('confirm', null, 'update', 'WARNING: Your void maps are set to complete after your autoPortal, and therefore will not be done at all! Please Change Your Settings Now. This Box Will Not Go away Until You do. Remember you can choose \'Custom\' autoPortal along with challenges for complete control over when you portal. <br><br> Estimated autoPortal level: ' + portalLevel , 'cancelTooltip()', 'Void Maps Conflict');
    if((leadCheck || game.global.challengeActive == 'Lead') && (autoTrimpSettings.VoidMaps.value % 2 == 0 && portalLevel < 182))
        tooltip('confirm', null, 'update', 'WARNING: Voidmaps run during Lead on an Even zone do not receive the 2x Helium Bonus for Odd zones, and are also tougher. You should probably fix this.', 'cancelTooltip()', 'Lead Challenge Void Maps');
    return portalLevel;
}

//Actually Portal.
function doPortal(challenge) {
    if(!game.global.portalActive) return;
    try {
        if (getPageSetting('AutoMagmiteSpender2')==1)
            autoMagmiteSpender();
    } catch (err) {
        debug("Error encountered in AutoMagmiteSpender: " + err.message,"general");
    }
    portalClicked();
    if(challenge) selectChallenge(challenge);
    activateClicked();
    activatePortal();
    lastHeliumZone = 0; zonePostpone = 0;
}

////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first)/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function initializeAutoTrimps() {
    debug('AutoTrimps v' + ATversion + ' Loaded!', '*spinner3');
    loadPageVariables();

    var atscript = document.getElementById('AutoTrimps-script')
      , base = 'https://genbtc.github.io/AutoTrimps'
      ;
    if (atscript !== null) {
        base = atscript.getAttribute('src').replace(/\/AutoTrimps2\.js$/, '');
    }
    //document.head.appendChild(document.createElement('script')).src = base + '/NewUI.js';
    document.head.appendChild(document.createElement('script')).src = base + '/NewUI2.js';
    document.head.appendChild(document.createElement('script')).src = base + '/Graphs.js';
    if (typeof(AutoPerks) === 'undefined')
        document.head.appendChild(document.createElement('script')).src = base + '/AutoPerks.js';
    else
        debug('AutoPerks is now included in Autotrimps, please disable the tampermonkey script for AutoPerks to remove this message!', '*spinner3');
    toggleSettingsMenu();
    toggleSettingsMenu();
}

////////////////////////////////////////
//Main DELAY Loop///////////////////////
////////////////////////////////////////

setTimeout(delayStart, startupDelay);
function delayStart() {
    initializeAutoTrimps();
    setTimeout(delayStartAgain, startupDelay);
}
function delayStartAgain(){
    setInterval(mainLoop, runInterval);
    updateCustomButtons();
    tooltip('confirm', null, 'update', '<b>ChangeLog: -Please Read- </b><br><b>11/23 Patch 4.0 fixes are still happening!<br>Auto Magmite Spender can now be toggled to Always Run<br>AutoTrimpicide/Force-Abandon is now toggleable<br>Fix Bugs I created<br>NEW: Better AutoFight 2</b><br><a href="https://puu.sh/srfQq/38a0be6656.png" target="#">Screenshot of new hover tooltips beta0.1</a>, more to come.<br>Auto Spend Magmite before portaling - setting in genBTC page (read tooltip)<br>Buy 2 buildings instead of 1 if we have the mastery.<br>Entirely remove high lumberjack ratio during Spire.<br>During Magma with 3000+ Tributes, switch to 1/12/12 auto-worker-ratios instead of 1/2/22.<br>Add a 10 second timeout Popup window that can postpone Autoportal when clicked.<br>Added a No Nurseries Until setting in genBTC page', 'cancelTooltip()', 'Script Update Notice ' + ATversion);    
    document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
}

////////////////////////////////////////
//Main LOGIC Loop///////////////////////
////////////////////////////////////////

var OVKcellsWorld = 0;
//reset stuff that may not have gotten cleaned up on portal
function mainCleanup() {
    //runs at zone 1 only.
    if (game.global.world == 1) {
        stopScientistsatFarmers = 250000;   //put this here so it reverts every cycle (in case we portal out of watch challenge)
        lastHeliumZone = 0;
        zonePostpone = 0;
        OVKcellsWorld = 0;
    }
}    
function mainLoop() {
    if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");    //just better.
    addbreedTimerInsideText.innerHTML = parseFloat(game.global.lastBreedTime/1000).toFixed(1) + 's'; //add hidden next group breed timer;
    mainCleanup();
    game.global.addonUser = true;
    game.global.autotrimps = {
        firstgiga: getPageSetting('FirstGigastation'),
        deltagiga: getPageSetting('DeltaGigastation')
    }
    if(getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled) return;
    if(game.global.viewingUpgrades) return;
    //auto-close breaking the world textbox
    if(document.getElementById('tipTitle').innerHTML == 'The Improbability') cancelTooltip();
    //auto-close the corruption at zone 181 textbox
    if(document.getElementById('tipTitle').innerHTML == 'Corruption') cancelTooltip();
    //auto-close the Spire notification checkbox
    if(document.getElementById('tipTitle').innerHTML == 'Spire') cancelTooltip();
    setTitle();          //set the browser title
    setScienceNeeded();  //determine how much science is needed
    updateValueFields(); //refresh the UI

    if (getPageSetting('ExitSpireCell') >= 1) exitSpireCell(); //"Exit Spire After Cell" (genBTC settings area)
    if (getPageSetting('WorkerRatios')) workerRatios(); //"Auto Worker Ratios"
    if (getPageSetting('BuyUpgrades')) buyUpgrades();   //"Buy Upgrades"
    autoGoldenUpgrades();                               //"AutoGoldenUpgrades" (genBTC settings area)
    if (getPageSetting('BuyStorage')) buyStorage();     //"Buy Storage"
    if (getPageSetting('BuyBuildings')) buyBuildings(); //"Buy Buildings"
    if (getPageSetting('BuyJobs')) buyJobs();           //"Buy Jobs"
    if (getPageSetting('ManualGather2')) manualLabor();  //"Auto Gather/Build"
    if (getPageSetting('AutoMaps')) autoMap();          //"Auto Maps"
    if (getPageSetting('GeneticistTimer') >= 0) autoBreedTimer(); //"Geneticist Timer" / "Auto Breed Timer"
    if (autoTrimpSettings.AutoPortal.selected != "Off") autoPortal();   //"Auto Portal" (hidden until level 40)
    if (getPageSetting('AutoHeirlooms2')) autoHeirlooms2(); //"Auto Heirlooms 2" (genBTC settings area)
    else if (getPageSetting('AutoHeirlooms')) autoHeirlooms();//"Auto Heirlooms"
    if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap(); //"Trap Trimps"
    if (getPageSetting('AutoRoboTrimp')) autoRoboTrimp();   //"AutoRoboTrimp" (genBTC settings area)
    if (getPageSetting('AutoUpgradeHeirlooms') && !heirloomsShown) autoNull();  //"Auto Upgrade Heirlooms" (genBTC settings area)
    autoLevelEquipment();                                   //"Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"

    if (getPageSetting('UseScryerStance'))
        useScryerStance();                                  //"Use Scryer Stance"
    else
        autoStance();                                           //"Auto Stance"
    if (getPageSetting('BetterAutoFight')==1) betterAutoFight();     //"Better Auto Fight"
    else if (getPageSetting('BetterAutoFight')==2) betterAutoFight2();     //"Better Auto Fight2"
    if (getPageSetting('DynamicPrestige')) prestigeChanging2(); //"Dynamic Prestige" (genBTC settings area)
    else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value; //if we dont want to, just make sure the UI setting and the internal setting are aligned.

    //track how many overkill world cells we have beaten in the current level. (game.stats.cellsOverkilled.value for the entire run)
    if (game.options.menu.overkillColor.enabled == 0) toggleSetting('overkillColor');   //make sure the setting is on.
    if (game.portal.Overkill.level) OVKcellsWorld = document.getElementById("grid").getElementsByClassName("cellColorOverkill").length

    //Runs any user provided scripts - by copying and pasting a function named userscripts() into the Chrome Dev console. (F12)
    userscripts();
    
    try {
        if (getPageSetting('AutoMagmiteSpender2')==2)
            autoMagmiteSpender();
    } catch (err) {
        debug("Error encountered in AutoMagmiteSpender(Always): " + err.message,"general");
    }    
}

//left blank intentionally. the user will provide this. blank global vars are included as an example
var globalvar0,globalvar1,globalvar2,globalvar3,globalvar4,globalvar5,globalvar6,globalvar7,globalvar8,globalvar9;
function userscripts()
{
    //insert code here:
}

////////////////////////////////////////
//HTML/CSS/DOM Overwrites //////////////
////////////////////////////////////////

//we copied message function because this was not able to be called from function debug() without getting a weird scope? related "cannot find function" error.
var lastmessagecount = 1;
function message2(messageString, type, lootIcon, extraClass) {
    var log = document.getElementById("log");
    var needsScroll = ((log.scrollTop + 10) > (log.scrollHeight - log.clientHeight));
    var displayType = (AutoTrimpsDebugTabVisible) ? "block" : "none";
    var prefix = "";
    if (lootIcon && lootIcon.charAt(0) == "*") {
        lootIcon = lootIcon.replace("*", "");
        prefix =  "icomoon icon-";
    }
    else prefix = "glyphicon glyphicon-";
    //add timestamp
    if (game.options.menu.timestamps.enabled){
        messageString = ((game.options.menu.timestamps.enabled == 1) ? getCurrentTime() : updatePortalTimer(true)) + " " + messageString;
    }
    //add a suitable icon for "AutoTrimps"
    if (lootIcon)
        messageString = "<span class=\"" + prefix + lootIcon + "\"></span> " + messageString;
    messageString = "<span class=\"glyphicon glyphicon-superscript\"></span> " + messageString;
    messageString = "<span class=\"icomoon icon-text-color\"></span>" + messageString;

    var add = "<span class='" + type + "Message message " + extraClass + "' style='display: " + displayType + "'>" + messageString + "</span>";
    var toChange = document.getElementsByClassName(type + "Message");
    if (toChange.length > 1 && toChange[toChange.length-1].innerHTML.indexOf(messageString) > -1){
        var msgToChange = toChange[toChange.length-1].innerHTML;
        lastmessagecount++;
        //search string backwards for the occurrence of " x" (meaning x21 etc)
        var foundXat = msgToChange.lastIndexOf(" x");
        if (foundXat != -1){
            toChange[toChange.length-1].innerHTML = msgToChange.slice(0, foundXat);  //and slice it out.
        }
        //so we can add a new number in.
        toChange[toChange.length-1].innerHTML += " x" + lastmessagecount;
    }
    else {
        lastmessagecount =1;
        log.innerHTML += add;
    }
    if (needsScroll) log.scrollTop = log.scrollHeight;
    trimMessages(type);
}

//HTML For adding a 5th tab to the message window
//
var ATbutton = document.createElement("button");
ATbutton.innerHTML = 'AutoTrimps';
ATbutton.setAttribute('id', 'AutoTrimpsFilter');
ATbutton.setAttribute('type', 'button');
ATbutton.setAttribute('onclick', "filterMessage2('AutoTrimps')");
ATbutton.setAttribute('class', "btn btn-success logFlt");
//
var tab = document.createElement("DIV");
tab.setAttribute('class', 'btn-group');
tab.setAttribute('role', 'group');
tab.appendChild(ATbutton);
document.getElementById('logBtnGroup').appendChild(tab);
//Toggle settings button & filter messages accordingly.
function filterMessage2(what){
    var log = document.getElementById("log");

    displayed = (AutoTrimpsDebugTabVisible) ? false : true;
    AutoTrimpsDebugTabVisible = displayed;

    var toChange = document.getElementsByClassName(what + "Message");
    var btnText = (displayed) ? what : what + " off";
    var btnElem = document.getElementById(what + "Filter");
    btnElem.innerHTML = btnText;
    btnElem.className = "";
    btnElem.className = getTabClass(displayed);
    displayed = (displayed) ? "block" : "none";
    for (var x = 0; x < toChange.length; x++){
        toChange[x].style.display = displayed;
    }
    log.scrollTop = log.scrollHeight;
}

var hrlmProtBtn1 = document.createElement("DIV");
hrlmProtBtn1.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn1.setAttribute('onclick', 'protectHeirloom(this, true)');
hrlmProtBtn1.innerHTML = 'Protect/Unprotect';  //since we cannot detect the selected heirloom on load, ambiguous name
hrlmProtBtn1.id='protectHeirloomBTN1';
var hrlmProtBtn2 = document.createElement("DIV");
hrlmProtBtn2.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn2.setAttribute('onclick', 'protectHeirloom(this, true)');
hrlmProtBtn2.innerHTML = 'Protect/Unprotect';
hrlmProtBtn2.id='protectHeirloomBTN2';
var hrlmProtBtn3 = document.createElement("DIV");
hrlmProtBtn3.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn3.setAttribute('onclick', 'protectHeirloom(this, true)');
hrlmProtBtn3.innerHTML = 'Protect/Unprotect';
hrlmProtBtn3.id='protectHeirloomBTN3';
document.getElementById('equippedHeirloomsBtnGroup').appendChild(hrlmProtBtn1);
document.getElementById('carriedHeirloomsBtnGroup').appendChild(hrlmProtBtn2);
document.getElementById('extraHeirloomsBtnGroup').appendChild(hrlmProtBtn3);


function protectHeirloom(element, modify){
    var selheirloom = game.global.selectedHeirloom;  //[number, location]
    var heirloomlocation = selheirloom[1];
    var heirloom = game.global[heirloomlocation];
    if (selheirloom[0] != -1)
        var heirloom = heirloom[selheirloom[0]];
    //hard way ^^, easy way>>
    //var heirloom = getSelectedHeirloom();
    if (modify)    //sent by onclick of protect button, to toggle the state.
        heirloom.protected = !heirloom.protected;

    if (!element) { //then we came from newSelectHeirloom
        if (heirloomlocation.includes("Equipped"))
            element = document.getElementById('protectHeirloomBTN1');
        else if (heirloomlocation == "heirloomsCarried")
            element = document.getElementById('protectHeirloomBTN2');
        else if (heirloomlocation == "heirloomsExtra")
            element = document.getElementById('protectHeirloomBTN3');
    }
    if (element)
        element.innerHTML = heirloom.protected ? 'UnProtect' : 'Protect';
}

//wrapper for selectHeirloom, to handle the protect button
function newSelectHeirloom(number, location, elem){
    selectHeirloom(number, location, elem);
    protectHeirloom();
}

//replacement function that inserts a new onclick action into the heirloom icons so it can populate the proper Protect icon. (yes this is the best way to do it.)
function generateHeirloomIcon(heirloom, location, number){
    if (typeof heirloom.name === 'undefined') return "<span class='icomoon icon-sad3'></span>";
    var icon = (heirloom.type == "Shield") ? 'icomoon icon-shield3' : 'glyphicon glyphicon-grain';
    var html = '<span class="heirloomThing heirloomRare' + heirloom.rarity;
    if (location == "Equipped") html += ' equipped';
    var locText = "";
    if (location == "Equipped") locText += '-1,\'' + heirloom.type + 'Equipped\'';
    else locText += number + ', \'heirlooms' + location + '\'';
    html += '" onmouseover="tooltip(\'Heirloom\', null, event, null, ' + locText + ')" onmouseout="tooltip(\'hide\')" onclick="newSelectHeirloom(';
    html += locText + ', this)"> <span class="' + icon + '"></span></span>';
    return html;
}

 //Replacement function for Zone tooltip to show current amount in seconds (Just adds the seconds)
function formatMinutesForDescriptions(number){
    var text;
    var seconds = Math.floor((number*60) % 60);
    var minutes = Math.floor(number % 60);
    var hours = Math.floor(number / 60);
    if (hours == 0) 
        text = minutes + " minutes " + seconds + " seconds";
    else if (minutes > 0) {
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        text = hours + ":" + minutes + ":" + seconds;
    }
    else {
        var hs = (hours > 1) ? "s" : "";
        var ms = (minutes > 1) ? "s" : "";
        var ss = (seconds > 1) ? "s" : "";
        text = hours + " hour" + hs + " " + minutes + " minute" + ms + " " + seconds + " second" + ss;
    }
    return text;
}

//Add breeding box:
var breedbarContainer = document.querySelector('#trimps > div.row');
var addbreedTimerContainer = document.createElement("DIV");
addbreedTimerContainer.setAttribute('class', "col-xs-3");
addbreedTimerContainer.setAttribute('style','padding-left: 0;');
addbreedTimerContainer.setAttribute("onmouseover", 'tooltip(\"Hidden Next Group Breed Timer\", \"customText\", event, \"How long your next army has been breeding for, or how many anticipation stacks you will have if you send a new army now (capped at 30 obv.)\")');
addbreedTimerContainer.setAttribute("onmouseout", 'tooltip("hide")');
var addbreedTimerInside = document.createElement("DIV");
addbreedTimerInside.id='turkimpBuff';
addbreedTimerInside.setAttribute('style','display: block;');
var addbreedTimerInsideIcon = document.createElement("SPAN");
addbreedTimerInsideIcon.setAttribute('class',"icomoon icon-clock");
var addbreedTimerInsideText = document.createElement("SPAN");
addbreedTimerInsideText.id='hiddenBreedTimer';
addbreedTimerInside.appendChild(addbreedTimerInsideIcon);
addbreedTimerInside.appendChild(addbreedTimerInsideText);
addbreedTimerContainer.appendChild(addbreedTimerInside);
breedbarContainer.appendChild(addbreedTimerContainer);
//Add tooltip to current army count
var armycount = document.getElementById('trimpsFighting');
armycount.setAttribute("onmouseover", 'tooltip(\"Army Count\", \"customText\", event, \"To Fight now would add: \" + prettify(getArmyTime()) + \" seconds to the breed timer.\")');
armycount.setAttribute("onmouseout", 'tooltip("hide")');
