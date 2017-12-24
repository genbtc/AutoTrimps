MODULES["autobreedtimer"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["autobreedtimer"].buyGensIncrement = 1;     //Buy this many geneticists at a time   (not needed much with new gen. code)
MODULES["autobreedtimer"].fireGensIncrement = 10;   //Fire this many geneticists at a time  (not needed much with new gen. code)
MODULES["autobreedtimer"].fireGensFloor = 10;       //Dont FIRE below this number (nothing to do with hiring up to it)(maybe is disregarded?)
MODULES["autobreedtimer"].breedFireOn = 6;          //turn breedfire on at X seconds (if BreedFire)
MODULES["autobreedtimer"].breedFireOff = 2;         //turn breedfire off at X seconds(if BreedFire)
MODULES["autobreedtimer"].killTitimpStacks = 5;     //number of titimp stacks difference that must exist to Force Abandon
MODULES["autobreedtimer"].voidCheckPercent = 95;    //Void Check health %, for force-Abandon during voidmap, if it dips below this during the Void  (maybe this should be in automaps module)

//Controls "Auto Breed Timer" and "Geneticist Timer" - adjust geneticists to reach desired breed timer
function autoBreedTimer() {
    var customVars = MODULES["autobreedtimer"];
    var fWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var defaultBreedTimer = game.talents.patience.purchased && getPageSetting('UsePatience') ? 45 : 30;
    if(getPageSetting('ManageBreedtimer')) {
        if(game.portal.Anticipation.level == 0) setPageSetting('GeneticistTimer',0);
        else if(game.global.challengeActive == 'Electricity' || game.global.challengeActive == 'Mapocalypse') setPageSetting('GeneticistTimer',3.5);
        else if(game.global.challengeActive == 'Nom' || game.global.challengeActive == 'Toxicity') {

            if(getPageSetting('FarmWhenNomStacks7') && game.global.gridArray[99].nomStacks >= 5 && !game.global.mapsActive) {
                //if Improbability already has 5 nomstacks, do 30 antistacks.
                setPageSetting('GeneticistTimer',defaultBreedTimer);
            }
            else
                setPageSetting('GeneticistTimer',10);
        }
        else if (getPageSetting('SpireBreedTimer') > -1 && isActiveSpireAT())
            setPageSetting('GeneticistTimer',getPageSetting('SpireBreedTimer'));
        else setPageSetting('GeneticistTimer',defaultBreedTimer);
    }
    var inDamageStance = game.upgrades.Dominance.done ? game.global.formation == 2 : game.global.formation == 0;
    var inScryerStance = (game.global.world >= 60 && game.global.highestLevelCleared >= 180) && game.global.formation == 4;
    //(inDamageStance||inScryerStance);
    var targetBreed = getPageSetting('GeneticistTimer');
    //if we need to hire geneticists
    //Don't hire geneticists if total breed time remaining is greater than our target breed time
    //Don't hire geneticists if we have already reached 30 anti stacks (put off further delay to next trimp group) //&& (game.global.lastBreedTime/1000 + getBreedTime(true) < targetBreed)
    if ((newSquadRdy || (game.global.lastBreedTime/1000 + getBreedTime(true) < targetBreed)) && targetBreed > getBreedTime() && !game.jobs.Geneticist.locked && targetBreed > getBreedTime(true) && game.resources.trimps.soldiers > 0 && !breedFire) {
        var time = getBreedTime();
        var timeOK = time > 0 ? time : 0.1;
        var numgens = Math.trunc(Math.log(targetBreed / timeOK ) / Math.log(1.02));
        //insert 10% of total food limit here? or cost vs tribute?
        //if there's no free worker spots, fire a farmer
        if (numgens > 0 && fWorkers < numgens)
            //do some jiggerypokery in case jobs overflow and firing -workers does 0 (java integer overflow)
            safeFireJob('Farmer', numgens);
        //hire geneticists in bulk
        if (numgens > 0 && canAffordJob('Geneticist', false, numgens)) {
            //debug("1a. Time: " + getBreedTime(true) + " / " + getBreedTime() );
            //debug("1b. " + numgens + " Genes.. / " + game.jobs.Geneticist.owned + " -> " + (game.jobs.Geneticist.owned+numgens));
            safeBuyJob('Geneticist', numgens);
            //debug("1c. Time: " + getBreedTime(true) + " / " + getBreedTime() );
        }
        //if all else fails, hire geneticists slowly (not likely)
        else
            safeBuyJob('Geneticist', customVars.buyGensIncrement);
    }
    var fire1 = targetBreed*1.02 < getBreedTime();
    var fire2 = targetBreed*1.02 < getBreedTime(true);
    var fireobj = fire1 ? getBreedTime() : getBreedTime(true);
    //if we need to speed up our breeding
    //if we have potency upgrades available, buy them. If geneticists are unlocked, or we aren't managing the breed timer, just buy them
    if ((targetBreed < getBreedTime() || !game.jobs.Geneticist.locked || !getPageSetting('ManageBreedtimer') || game.global.challengeActive == 'Watch') && game.upgrades.Potency.allowed > game.upgrades.Potency.done && canAffordTwoLevel('Potency') && getPageSetting('BuyUpgrades')) {
        buyUpgrade('Potency');
    }
    //otherwise, if we have too many geneticists, (total time) - start firing them #1
    //otherwise, if we have too many geneticists, (remaining time) - start firing them #2
    else if ((fire1 || fire2) && !game.jobs.Geneticist.locked && game.jobs.Geneticist.owned > customVars.fireGensFloor) {
        var timeOK = fireobj > 0 ? fireobj : 0.1;
        var numgens = Math.trunc(Math.log(targetBreed / timeOK ) / Math.log(1.02)) - 1;
        //debug("2a. Time: " + getBreedTime(true) + " / " + getBreedTime() );
        //debug("2b. " + numgens + " Genes.. / " + game.jobs.Geneticist.owned + " -> " + (game.jobs.Geneticist.owned+numgens));
        safeBuyJob('Geneticist', numgens);
        //debug("2c. Time: " + getBreedTime(true) + " / " + getBreedTime() );
    }
    //if our time remaining to full trimps is still too high, fire some jobs to get-er-done
    //needs option to toggle? advanced options?
    else if ((targetBreed < getBreedTime(true) || (game.resources.trimps.soldiers == 0 && getBreedTime(true) > customVars.breedFireOn)) && breedFire == false && getPageSetting('BreedFire') && game.global.world > 10) {
        breedFire = true;
    }

    //reset breedFire once we have less than 2 seconds remaining
    if(getBreedTime(true) < customVars.breedFireOff) breedFire = false;

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
    var customVars = MODULES["autobreedtimer"];
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
    debug("Killed your army! (to get " + targetBreed + " Anti-stacks). Trimpicide successful.","other");
}
