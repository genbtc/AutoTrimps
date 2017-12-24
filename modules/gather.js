MODULES["gather"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["gather"].minTraps = 100;
MODULES["gather"].minScienceAmount = 100;
MODULES["gather"].minScienceSeconds = 60;

//OLD: "Auto Gather/Build"
function manualLabor() {
    if (getPageSetting('ManualGather2')==0) return;
    //vars
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
    var lowOnTraps = game.buildings.Trap.owned < MODULES["gather"].minTraps;
    var notFullPop = game.resources.trimps.owned < game.resources.trimps.realMax();
    var trapTrimpsOK = getPageSetting('TrapTrimps');
    var targetBreed = getPageSetting('GeneticistTimer');
    var trapperTrapUntilFull = game.global.challengeActive == "Trapper" && notFullPop;
    var watchJumpstartTraps  = game.global.challengeActive == "Watch"  && notFullPop;    
    var hasTurkimp = game.talents.turkimp4.purchased || game.global.turkimpTimer > 0;

    //FRESH GAME NO HELIUM CODE.
    if (game.global.world <=3 && game.global.totalHeliumEarned<=5000) {
        if (game.global.buildingsQueue.length == 0 && (game.global.playerGathering != 'trimps' || game.buildings.Trap.owned == 0)){
            if (!game.triggers.wood.done || game.resources.food.owned < 10 || Math.floor(game.resources.food.owned) < Math.floor(game.resources.wood.owned))
                setGather('food');
            else
                setGather('wood');
        }
    }

    if(watchJumpstartTraps || trapTrimpsOK && (breedingTrimps < 5 || trapperTrapUntilFull) && game.buildings.Trap.owned == 0 && canAffordBuilding('Trap')) {
        //safeBuyBuilding returns false if item is already in queue
        if(!safeBuyBuilding('Trap'))
            setGather('buildings');
    }
    else if (watchJumpstartTraps || trapTrimpsOK && (breedingTrimps < 5 || trapperTrapUntilFull) && game.buildings.Trap.owned > 0) {
        setGather('trimps');
        if (trapperTrapUntilFull && (game.global.buildingsQueue.length == 0 || game.buildings.Trap.owned == 1) && !game.global.trapBuildAllowed  && canAffordBuilding('Trap'))
            safeBuyBuilding('Trap'); //get ahead on trap building since it is always needed for Trapper
    }
    else if (getPageSetting('ManualGather2') != 2 && game.resources.science.owned < MODULES["gather"].minScienceAmount && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden')
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
        if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && hasTurkimp)||getPageSetting('ManualGather2') == 2){
            //if manual is less than science production, switch on turkimp
            setGather('metal');
        }
        else if (getPageSetting('ManualGather2') != 2){
            setGather('science');
        }
    }
    else if (trapTrimpsOK && targetBreed < getBreedTime(true)){
        //combined to optimize code.
        if (game.buildings.Trap.owned < 100 && canAffordBuilding('Trap')) {
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
            if (hasTurkimp)
                setGather('metal');
            else
                setGather(lowestResource);//gather the lowest resource
        //This stuff seems to be repeated from above. Should be refactored and fixed so this is not confusing.
        } else if (getPageSetting('ManualGather2') != 2 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
            if (game.resources.science.owned < getPsString('science', true) * MODULES["gather"].minScienceSeconds && game.global.turkimpTimer < 1 && haveWorkers)
                setGather('science');
            else if (hasTurkimp)
                setGather('metal');
            else
                setGather(lowestResource);
        }
        //Build more traps if we have TrapTrimps on, and we own less than (100) traps.
        else if(trapTrimpsOK && game.global.trapBuildToggled == true && lowOnTraps)
            setGather('buildings');
        else
            setGather(lowestResource);
    }
}

//NEW: #2 "Auto Gather/Build"
function manualLabor2() {
    if (getPageSetting('ManualGather2')==0) return;
    //vars
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
    var lowOnTraps = game.buildings.Trap.owned < MODULES["gather"].minTraps;
    var notFullPop = game.resources.trimps.owned < game.resources.trimps.realMax();
    var trapTrimpsOK = getPageSetting('TrapTrimps');
    var targetBreed = getPageSetting('GeneticistTimer');
    var trapperTrapUntilFull = game.global.challengeActive == "Trapper" && notFullPop;
    var watchJumpstartTraps  = game.global.challengeActive == "Watch"  && notFullPop;
    var hasTurkimp = game.talents.turkimp4.purchased || game.global.turkimpTimer > 0;

    //FRESH GAME LOWLEVEL NOHELIUM CODE.
    if (game.global.world <=3 && game.global.totalHeliumEarned<=5000) {
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

    //Traps and Trimps:
    if(trapTrimpsOK && (breedingTrimps < 5 || trapperTrapUntilFull || watchJumpstartTraps) && game.buildings.Trap.owned == 0 && canAffordBuilding('Trap')) {
        //safeBuyBuilding returns false if item is already in queue
        if(!safeBuyBuilding('Trap'))
            setGather('buildings');
        return;
    }
    else if (trapTrimpsOK && (breedingTrimps < 5 || trapperTrapUntilFull || watchJumpstartTraps) && game.buildings.Trap.owned > 0) {
        setGather('trimps');
        if (trapperTrapUntilFull && (game.global.buildingsQueue.length == 0 || game.buildings.Trap.owned == 1) && !game.global.trapBuildAllowed  && canAffordBuilding('Trap'))
            safeBuyBuilding('Trap'); //get ahead on trap building since it is always needed for Trapper
        return;
    }

    //Buildings:
    var manualBuildSpeedAdvantage = getPlayerModifier() / game.global.autoCraftModifier;
        //pre-requisites for all: have something in the build queue, and playerCraftmod does actually speed it up.
    if ((game.global.buildingsQueue.length && manualBuildSpeedAdvantage > 1) && //AND:
    //if we have 2 or more buildings in queue, and playerCraftmod is high enough (>3x autoCraftmod) to speed it up.
    ((game.global.buildingsQueue.length >= 2 && manualBuildSpeedAdvantage > 3) ||
    //Prioritize Storage buildings when they hit the front of the queue (in case they are the only object in the queue).
    (game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Forge.1') ||
    //manualBuild traps if we have TrapTrimps on, AutoTraps on, and we own less than (100) traps.
    (trapTrimpsOK && game.global.trapBuildAllowed && game.global.trapBuildToggled && lowOnTraps))) {
        setGather('buildings');//buildBuildings = true;
        return;
    }

    //Sciencey:
    //if we have some upgrades sitting around which we don't have enough science for, gather science
    if (document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        //if we have less than (100) science or less than a minute of science
        if (game.resources.science.owned < MODULES["gather"].minScienceAmount ||
           (game.resources.science.owned < getPsString('science', true) * MODULES["gather"].minScienceSeconds && game.global.turkimpTimer < 1))
            if (getPageSetting('ManualGather2') != 2) {
                setGather('science');
                return;
            }
        if (game.resources.science.owned < scienceNeeded) {
            //if manual is less than science production and turkimp, metal. (or science is set as disallowed)
            if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && hasTurkimp) || getPageSetting('ManualGather2') == 2)
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
        if (hasTurkimp)
            setGather('metal');
        else
            setGather(lowestResource);//gather the lowest resource
    } else if (hasTurkimp)
        setGather('metal');
    else
        setGather(lowestResource);
    //ok
    return true;
}
