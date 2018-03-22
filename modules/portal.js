MODULES["portal"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["portal"].timeout = 10000;  //time to delay before autoportaling in milliseconds
MODULES["portal"].bufferExceedFactor = 5;  //amount for: allows portaling midzone if we exceed (5x) the buffer

/////////////////////////////////////////////////////
//Portal Related Code)///////////////////////////////
/////////////////////////////////////////////////////
//var lastHeliumZone = 0; //zone where the He/hr portal conditions were first met
var zonePostpone = 0;   //additional postponement of the zone above.

//Decide When to Portal
function autoPortal() {
    if(!game.global.portalActive) return;
    var autoFinishDaily = (game.global.challengeActive == "Daily" && getPageSetting('AutoFinishDaily'));
    var autoFinishDailyZone = getPageSetting('AutoFinishDailyZone');
    if (!autoFinishDaily)
        autoFinishDailyZone = 0;    //dont use stale disabled values
    switch (autoTrimpSettings.AutoPortal.selected) {
        //portal if we have lower He/hr than the previous zone (or buffer)
        case "Helium Per Hour":
            var OKtoPortal = false;
            if (!game.global.challengeActive || autoFinishDaily) {
                var minZone = getPageSetting('HeHrDontPortalBefore');
                minZone += autoFinishDailyZone;
                game.stats.bestHeliumHourThisRun.evaluate();    //normally, evaluate() is only called once per second, but the script runs at 10x a second.
                var bestHeHr = game.stats.bestHeliumHourThisRun.storedValue;
                var bestHeHrZone = game.stats.bestHeliumHourThisRun.atZone;
                var myHeliumHr = game.stats.heliumHour.value();
                var heliumHrBuffer = Math.abs(getPageSetting('HeliumHrBuffer'));
                //Multiply the buffer by (5) if we are in the middle of a zone   (allows portaling midzone if we exceed (5x) the buffer)
                if (!aWholeNewWorld)
                    heliumHrBuffer *= MODULES["portal"].bufferExceedFactor;
                var bufferExceeded = myHeliumHr < bestHeHr * (1-(heliumHrBuffer/100));
                if (bufferExceeded && game.global.world >= minZone) {
                    OKtoPortal = true;
                    if (aWholeNewWorld)
                        zonePostpone = 0;   //reset the zonePostPone if we see a new zone
                }
                //make sure people with 0 buffer only portal on aWholeNewWorld (not midzone)
                if (heliumHrBuffer == 0 && !aWholeNewWorld)
                    OKtoPortal = false;
                //Postpone Portal (and Actually Portal) code:
                if (OKtoPortal && zonePostpone == 0) {
                    zonePostpone+=1;
                    //lastHeliumZone = game.global.world;
                    debug("My HeliumHr was: " + myHeliumHr + " & the Best HeliumHr was: " + bestHeHr + " at zone: " +  bestHeHrZone, "portal");
                    cancelTooltip();
                    tooltip('confirm', null, 'update', '<b>Auto Portaling NOW!</b><p>Hit Delay Portal to WAIT 1 more zone.', 'zonePostpone+=1', '<b>NOTICE: Auto-Portaling in 10 seconds....</b>','Delay Portal');
                    //set up 2 things to happen after the timeout. close the tooltip:
                    setTimeout(cancelTooltip,MODULES["portal"].timeout);
                    //and check if we hit the confirm to postpone, and if not, portal.
                    setTimeout(function(){
                        if (zonePostpone >= 2)
                            return; //do nothing if we postponed.
                        if (autoFinishDaily){
                            abandonDaily();
                            document.getElementById('finishDailyBtnContainer').style.display = 'none';
                        }
                        //
                        if (autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                            doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                        else
                            doPortal();
                    },MODULES["portal"].timeout+100);
                }
            }
            break;
        case "Custom":
            if ((game.global.world > getPageSetting('CustomAutoPortal')+autoFinishDailyZone) &&
                (!game.global.challengeActive || autoFinishDaily)) {
                if (autoFinishDaily) {
                    abandonDaily();
                    document.getElementById('finishDailyBtnContainer').style.display = 'none';
                }
                //
                if (autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                    doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                else
                    doPortal();
            }
            break;
        case "Balance":
        case "Decay":
        case "Electricity":
        case "Life":
        case "Crushed":
        case "Nom":
        case "Toxicity":
            if (getPageSetting('MaxTox'))
                settingChanged("MaxTox");
        case "Watch":
        case "Lead":
        case "Corrupted":
            if(!game.global.challengeActive) {
                doPortal(autoTrimpSettings.AutoPortal.selected);
            }
            break;
        default:
            break;
    }
}

//Actually Portal.
function doPortal(challenge) {
    if(!game.global.portalActive) return;
    if (getPageSetting('AutoMagmiteSpender2')==1) autoMagmiteSpender();
    // From mainLoop
    if (getPageSetting('AutoHeirlooms2')) autoHeirlooms2(); //"Auto Heirlooms 2" (heirlooms.js)
    else if (getPageSetting('AutoHeirlooms')) autoHeirlooms();//"Auto Heirlooms"      (")
    if (getPageSetting('AutoUpgradeHeirlooms') && !heirloomsShown) autoNull();  //"Auto Upgrade Heirlooms" (heirlooms.js)
    //Go into portal screen
    portalClicked();
    //AutoPerks: do this first, because it reflashes the screen.
    if (getPageSetting('AutoAllocatePerks'))
        AutoPerks.clickAllocate();
    //Auto Start Daily:
    if (getPageSetting('AutoStartDaily')) {
        selectChallenge('Daily');
        checkCompleteDailies();

        var lastUndone = -7; // Note: Most previous challenge == -6
        while (++lastUndone <= 0) {
            var done = (game.global.recentDailies.indexOf(getDailyTimeString(lastUndone)) != -1);
            if (!done)
                break;
        }

        if (lastUndone == 1) { // None
            debug("All available Dailies already completed.", "portal");
            //Fallback to w/e Regular challenge we picked. Or none (unselect)
            selectChallenge(challenge || 0);
        } else {
            getDailyChallenge(lastUndone);
            debug("Portaling into Daily for: " + getDailyTimeString(lastUndone, true) + " now!", "portal");
        }
    }
    //Regular Challenge:
    else if(challenge) {
        selectChallenge(challenge);
    }
    //Push He Data:
    pushData();
    //Actually Portal.
    activateClicked();
    activatePortal();
    lastHeliumZone = 0; zonePostpone = 0;
}

// Finish Challenge2 (UNI mod)
function finishChallengeSquared() {
    // some checks done before reaching this:
    // getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared
    var zone = getPageSetting('FinishC2');
    if (game.global.world >= zone) {
        abandonChallenge();
        debug("Finished challenge2 because we are on zone " + game.global.world, "other", 'oil');
    }
}

//helper for returning the proper level we should be auto-portaling at.
function findOutCurrentPortalLevel() {
    var portalLevel = -1;
    var leadCheck = false;
    var portalLevelName = 
    {
        "Balance" : 41,
        "Decay" : 56,
        "Electricity" : 82,
        "Crushed" : 126,
        "Nom" : 146,
        "Toxicity" : 166,
        "Lead" : 181,
        "Watch" : 181,
        "Corrupted" : 191
    };
    var AP = getPageSetting("AutoPortal");
    switch (AP) {
        case "Off":
            break;
        case "Custom":
            portalLevel = getPageSetting('CustomAutoPortal') + 1;
            leadCheck = getPageSetting('HeliumHourChallenge') == "Lead" ? true : false;
            break;
        default:
            var result = portalLevelName[AP];
            if (result)
                portalLevel = result;
            break;
    }
    return {level:portalLevel, lead:leadCheck};
}