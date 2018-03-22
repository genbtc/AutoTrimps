//MODULES["query"] = {};

function getPerSecBeforeManual(job) {
    var perSec = 0;
    var increase = game.jobs[job].increase;
    if (increase == "custom") return 0;
    if (game.jobs[job].owned > 0){
        perSec = (game.jobs[job].owned * game.jobs[job].modifier);
        if (game.portal.Motivation.level > 0) perSec += (perSec * game.portal.Motivation.level * game.portal.Motivation.modifier);
        if (game.portal.Motivation_II.level > 0) perSec *= (1 + (game.portal.Motivation_II.level * game.portal.Motivation_II.modifier));
        if (game.portal.Meditation.level > 0) perSec *= (1 + (game.portal.Meditation.getBonusPercent() * 0.01)).toFixed(2);
        if (game.jobs.Magmamancer.owned > 0 && increase == "metal") perSec *= game.jobs.Magmamancer.getBonusPercent();
        if (game.global.challengeActive == "Meditate") perSec *= 1.25;
        else if (game.global.challengeActive == "Size") perSec *= 1.5;
        if (game.global.challengeActive == "Toxicity"){
            var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
            perSec *= (1 + toxMult);
        }
        if (game.global.challengeActive == "Balance"){
            perSec *= game.challenges.Balance.getGatherMult();
        }
        if (game.global.challengeActive == "Decay"){
            perSec *= 10;
            perSec *= Math.pow(0.995, game.challenges.Decay.stacks);
        }
        if (game.global.challengeActive == "Daily"){
            if (typeof game.global.dailyChallenge.dedication !== 'undefined')
                perSec *= dailyModifiers.dedication.getMult(game.global.dailyChallenge.dedication.strength);
            if (typeof game.global.dailyChallenge.famine !== 'undefined' && increase != "fragments" && increase != "science")
                perSec *= dailyModifiers.famine.getMult(game.global.dailyChallenge.famine.strength);
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
    //if (world > 6 && game.global.mapsActive) amt *= 1.1;
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
    //if (world > 5 && game.global.mapsActive) amt *= 1.1;
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
        if (enemy.mutation == "Corruption")
            corrupteds++;
    }
    return corrupteds;
}
function getPotencyMod(howManyMoreGenes) {
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
    if (!howManyMoreGenes) howManyMoreGenes=0;
    if (game.jobs.Geneticist.owned > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned + howManyMoreGenes);
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

function getBreedTime(remaining,howManyMoreGenes) {
    var trimps = game.resources.trimps;
    var trimpsMax = trimps.realMax();

    var potencyMod = getPotencyMod(howManyMoreGenes);
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

function isBuildingInQueue(building) {
    //limit to 1 building per queue
    for (var b in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[b].includes(building)) return true;
    }
}

function getArmyTime() {
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : game.resources.trimps.maxSoldiers;
    var potencyMod = getPotencyMod();
    var tps = breeding * potencyMod;
    var addTime = adjustedMax / tps;
    return addTime;
}

function setScienceNeeded() {
    scienceNeeded = 0;
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        if (game.upgrades[upgrade].allowed > game.upgrades[upgrade].done) { //If the upgrade is available
            if (game.global.world == 1 && game.global.totalHeliumEarned<=1000 && upgrade.startsWith("Speed")) continue;  //skip speed upgrades on fresh game until level 2
            scienceNeeded += getScienceCostToUpgrade(upgrade);
        }
    }
    if (needGymystic)
        scienceNeeded += getScienceCostToUpgrade('Gymystic');
}
