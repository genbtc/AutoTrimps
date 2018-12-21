MODULES["breedtimer"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["breedtimer"].buyGensIncrement = 1;    //Buy this many geneticists at a time
MODULES["breedtimer"].fireGensIncrement = 1;   //Fire this many geneticists at a time
MODULES["breedtimer"].fireGensFloor = 10;       //Dont FIRE below this number (nothing to do with hiring up to it)(maybe is disregarded?)
MODULES["breedtimer"].breedFireOn = 6;          //turn breedfire on at X seconds (if BreedFire)
MODULES["breedtimer"].breedFireOff = 2;         //turn breedfire off at X seconds(if BreedFire)
MODULES["breedtimer"].killTitimpStacks = 5;     //number of titimp stacks difference that must exist to Force Abandon
MODULES["breedtimer"].voidCheckPercent = 95;    //Void Check health %, for force-Abandon during voidmap, if it dips below this during the Void  (maybe this should be in automaps module)

//Add breeding box (to GUI on startup):
var addbreedTimerInsideText;
function addBreedingBoxTimers() {
    var breedbarContainer = document.querySelector('#trimps > div.row');
    var addbreedTimerContainer = document.createElement("DIV");
    addbreedTimerContainer.setAttribute('class', "col-xs-11");
    addbreedTimerContainer.setAttribute('style', 'padding-right: 0;');
    addbreedTimerContainer.setAttribute("onmouseover", 'tooltip(\"Hidden Next Group Breed Timer\", \"customText\", event, \"How long your next army has been breeding for, or how many anticipation stacks you will have if you send a new army now. This number is what BetterAutoFight #4 refers to when it says NextGroupBreedTimer.\")');
    addbreedTimerContainer.setAttribute("onmouseout", 'tooltip("hide")');
    var addbreedTimerInside = document.createElement("DIV");
    addbreedTimerInside.setAttribute('style', 'display: block;');
    var addbreedTimerInsideIcon = document.createElement("SPAN");
    addbreedTimerInsideIcon.setAttribute('class', "icomoon icon-clock");
    addbreedTimerInsideText = document.createElement("SPAN"); //updated in the top of mainLoop() each cycle
    addbreedTimerInsideText.id = 'hiddenBreedTimer';
    addbreedTimerInside.appendChild(addbreedTimerInsideIcon);
    addbreedTimerInside.appendChild(addbreedTimerInsideText);
    addbreedTimerContainer.appendChild(addbreedTimerInside);
    breedbarContainer.appendChild(addbreedTimerContainer);
}
addBreedingBoxTimers();

//Add GUI popup for hovering over the army group size and translate that to breeding time
function addToolTipToArmyCount() {
    var $armycount = document.getElementById('trimpsFighting');
    if ($armycount.className != "tooltipadded") {
        $armycount.setAttribute("onmouseover", 'tooltip(\"Army Count\", \"customText\", event, \"To Fight now would add: \" + prettify(getArmyTime()) + \" seconds to the breed timer.\")');
        $armycount.setAttribute("onmouseout", 'tooltip("hide")');
        $armycount.setAttribute("class", 'tooltipadded');
    }
}
/*
function testBreedManager() {
    var oldPotency = testPotencyMod();
    safeFireJob('Farmer', 1);
    canAffordJob('Geneticist', false, 1);
    safeBuyJob('Geneticist', 1);
    var newPotency = testPotencyMod();
    var potencyGap = newPotency - oldPotency;
    var targetBreed = getPageSetting('GeneticistTimer');
    var estimateBreedTime = getBreedTime(null,1);
    var genDif = Math.ceil(Math.log10(targetBreed / compareTime) / Math.log10(1.02));
    var realTime = game.global.realBreedTime;
}
*/
function controlGeneticistassist(targetTime) {
    var hasGA = game.global.Geneticistassist;
    if (hasGA) {
        //The targetTime GA setting has to match one in the list. [use the last slot]
        game.global.GeneticistassistSetting = targetTime;
        game.global.GeneticistassistSteps = [-1,10,30,targetTime];
        toggleGeneticistassist(true);   //true means updateOnly
    }
}
//controlGeneticistassist(45);

//Controls "Auto Breed Timer" and "Geneticist Timer" - adjust geneticists to reach desired breed timer
function autoBreedTimer() {
    var customVars = MODULES["breedtimer"];
    var fWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var defaultBreedTimer = game.talents.patience.purchased && getPageSetting('UsePatience') ? 45 : 30;
    var targetBreed = getPageSetting('GeneticistTimer');
    var newGeneTimerSetting=0;
//TIMER MANAGEMENT SECTION:
    var manageBreedTimer = getPageSetting('ManageBreedtimer');
    if (manageBreedTimer) {
        if(game.portal.Anticipation.level == 0) newGeneTimerSetting = 0;
        else if(game.global.challengeActive == 'Electricity' || game.global.challengeActive == 'Mapocalypse') newGeneTimerSetting = 3.5;
        else if(game.global.challengeActive == 'Nom' || game.global.challengeActive == 'Toxicity') {
            if(getPageSetting('FarmWhenNomStacks7') && game.global.gridArray[99].nomStacks >= 5 && !game.global.mapsActive)
                //if Improbability already has 5 nomstacks, do 30 antistacks.
                newGeneTimerSetting = defaultBreedTimer;
            else
                newGeneTimerSetting = 10;
        }
        else if (getPageSetting('SpireBreedTimer') > -1 && isActiveSpireAT())
            newGeneTimerSetting = getPageSetting('SpireBreedTimer');
        else
            newGeneTimerSetting = defaultBreedTimer;
        if (newGeneTimerSetting != targetBreed) {
            setPageSetting('GeneticistTimer',newGeneTimerSetting);
            //controlGeneticistassist(newGeneTimerSetting);
            debug("Changing the Geneticist Timer to a new value : " + newGeneTimerSetting, "other");
        }
    }
    var inDamageStance = game.upgrades.Dominance.done ? game.global.formation == 2 : game.global.formation == 0;
    var inScryerStance = (game.global.world >= 60 && game.global.highestLevelCleared >= 180) && game.global.formation == 4;
//HIRING SECTION:
    //Don't hire geneticists if total breed time remaining is greater than our target breed time
    //Don't hire geneticists if we have already reached 30 anti stacks (put off further delay to next trimp group) //&& (game.global.lastBreedTime/1000 + getBreedTime(true) < targetBreed)
    var time = getBreedTime();
    var timeLeft = getBreedTime(true);
    //TODO inline in getBreedTime?
    if (game.global.challengeActive == "Trapper") {
            timeLeft = 0;
    }
    var boughtGenRound1 = false;
    if ((newSquadRdy || (game.global.lastBreedTime/1000 + timeLeft < targetBreed)) && targetBreed > time && !game.jobs.Geneticist.locked && targetBreed > timeLeft && game.resources.trimps.soldiers > 0 && !breedFire) {
        //Buy geneticists in Increments of 1 for now:
        var hiredNumGens = customVars.buyGensIncrement;
        var doBuy = canAffordJob('Geneticist', false, hiredNumGens);
        //insert 10% of total food limit here? or cost vs tribute?
        if (doBuy) {
            var firingForJobs = (game.options.menu.fireForJobs.enabled && game.jobs['Geneticist'].allowAutoFire);
            //if there's no free worker spots, fire a farmer
            if (!firingForJobs && fWorkers < hiredNumGens)
                safeFireJob('Farmer', hiredNumGens);
            safeBuyJob('Geneticist', hiredNumGens);
            //debug("Bought this many Geneticists: " + hiredNumGens + ". Jobs Now: " + game.jobs.Geneticist.owned, "breed");
            boughtGenRound1 = true;
        }
    }
//FIRING SECTION:
    var time = getBreedTime();
    var timeLeft = getBreedTime(true);
    if (game.global.challengeActive == "Trapper") {
            timeLeft = 0;
    }
    var fire1 = targetBreed*1.02 < time;
    //#10 - can't really get rid of time left fire until we have simulacrum. what about getting a more reasonable threshold?
    var fire2 = targetBreed*2 < timeLeft;
    var fireobj = fire1 ? time : timeLeft;
    //if we need to speed up our breeding
    //if we have potency upgrades available, buy them. If geneticists are unlocked, or we aren't managing the breed timer, just buy them
    if ((targetBreed < time || !game.jobs.Geneticist.locked || !getPageSetting('ManageBreedtimer') || game.global.challengeActive == 'Watch') && game.upgrades.Potency.allowed > game.upgrades.Potency.done && canAffordTwoLevel('Potency') && getPageSetting('BuyUpgrades')) {
        buyUpgrade('Potency');
    }
    //otherwise, if we have too many geneticists, (total time) - start firing them #1
    //otherwise, if we have too many geneticists, (remaining time) - start firing them #2
    else if (!boughtGenRound1 && (fire1 || fire2) && !game.jobs.Geneticist.locked && game.jobs.Geneticist.owned > customVars.fireGensFloor) {
        //var timeGap = (time + timeLeft) > targetBreed ? targetBreed : targetBreed - (time + timeLeft);
        var timeOK = fireobj > 0 ? fireobj : 0.1;
        var numgens = Math.ceil(Math.log10(targetBreed / timeOK) / Math.log10(1.02));
        //debug("2a. Time: " + getBreedTime(true) + " / " + getBreedTime(),"breed");
        //debug("2b. " + numgens + " Genes.. / " + game.jobs.Geneticist.owned + " -> " + (game.jobs.Geneticist.owned+numgens),"breed");
        if (Number.isNaN(numgens)) numgens = 0;
        safeBuyJob('Geneticist', numgens);
        //debug("This many Geneticists were FIRED: " + numgens + ". Jobs Now: " + game.jobs.Geneticist.owned, "breed");
        //debug("2c. Time: " + getBreedTime(true) + " / " + getBreedTime(),"breed" );
    }
    //if our time remaining to full trimps is still too high, fire some jobs to get-er-done
    //needs option to toggle? advanced options?
    else if ((targetBreed < timeLeft || (game.resources.trimps.soldiers == 0 && timeLeft > customVars.breedFireOn)) && breedFire == false && getPageSetting('BreedFire') && game.global.world > 10) {
        breedFire = true;
    }

    //reset breedFire once we have less than 2 seconds remaining
    if(timeLeft < customVars.breedFireOff) breedFire = false;

    //Force Abandon Code (AutoTrimpicide):
    targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var nextgrouptime = (game.global.lastBreedTime/1000);
    if (targetBreed > defaultBreedTimer) targetBreed = defaultBreedTimer; //play nice with custom timers over default.
    var newstacks = nextgrouptime >= targetBreed ? targetBreed : nextgrouptime;
    //kill titimp if theres less than (5) seconds left on it or, we stand to gain more than (5) antistacks.
    var killTitimp = (game.global.titimpLeft < customVars.killTitimpStacks || (game.global.titimpLeft >= customVars.killTitimpStacks && newstacks - game.global.antiStacks >= customVars.killTitimpStacks))
    if (game.portal.Anticipation.level && game.global.antiStacks < targetBreed && game.resources.trimps.soldiers > 0 && killTitimp) {
        //if a new fight group is available and anticipation stacks aren't maxed, force abandon and grab a new group
        if (newSquadRdy && nextgrouptime >= targetBreed) {
            forceAbandonTrimps();
        }
        //if we're sitting around breeding forever and over (5) anti stacks away from target.
        else if (newSquadRdy && nextgrouptime >= 31 && newstacks - game.global.antiStacks >= customVars.killTitimpStacks) {
            forceAbandonTrimps();
        }
    }
}

//Abandon trimps function that should handle all special cases.
function abandonVoidMap() {
    var customVars = MODULES["breedtimer"];
    //do nothing if the button isnt set to on.
    if (!getPageSetting('ForceAbandon')) return;
    //exit out of the voidmap if we go back into void-farm-for-health mode (less than 95%, account for some leeway during equipment buying.)
    if (game.global.mapsActive && getCurrentMapObject().location == "Void") {
        var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
        if(voidCheckPercent < customVars.voidCheckPercent) {
            //only exit if it happened for reasons other than random losses of anti-stacks.
            if (game.portal.Anticipation.level) {
                if (targetBreed == 0 || targetBreed == -1)
                    mapsClicked(true);
                else if (game.global.antiStacks == targetBreed)
                    mapsClicked(true);
            }
            else
                mapsClicked(true);
        }
        return;
    }
}
//Abandon trimps function that should handle all special cases.
function forceAbandonTrimps() {
    //do nothing if the button isnt set to on.
    if (!getPageSetting('ForceAbandon')) return;
    //dont if <z6 (no button)
    if (!game.global.mapsUnlocked) return;
    //dont if were in a voidmap
    if (game.global.mapsActive && getCurrentMapObject().location == "Void") return;
    //dont if were on map-selection screen.
    if (game.global.preMapsActive) return;
    //dont if we are in spire:
    if (isActiveSpireAT() && !game.global.mapsActive) return;
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    if (getPageSetting('AutoMaps')) {
        mapsClicked();
        //force abandon army
        if (game.global.switchToMaps || game.global.switchToWorld)
            mapsClicked();
    } else if (game.global.mapsActive) {
    //in map without automaps
        mapsClicked();
        if (game.global.switchToMaps)
            mapsClicked();
        runMap();
    } else {
    //in world without automaps
        mapsClicked();
        if (game.global.switchToMaps)
            mapsClicked();
        mapsClicked();
    }
    debug("Killed your army! (to get " + targetBreed + " Anti-stacks). Trimpicide successful.","other");
}
