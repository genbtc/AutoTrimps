// MODULES["dynprestige"] = {};
//These can be changed (in the console) if you know what you're doing:
// MODULES["dynprestige"]

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

     //find out the last zone
    var lastzone = getPageSetting("DynamicPrestige2");

    var extra = maxPrestigeIndex > 10 ? maxPrestigeIndex - 10 : 0;

    // Find total prestiges needed by determining current prestiges versus the desired prestiges by the end of the run
    var neededPrestige = 0;
    for (i = 1; i <= maxPrestigeIndex ; i++){
        var lastp = game.mapUnlocks[autoTrimpSettings.Prestige.list[i]].last;
        if (lastp <= lastzone - 5){
            var rem = lastzone - lastp;
            var addto = Math.floor(rem/5);
            // For Scientist IV bonus, halve the required prestiges to farm
            if (game.global.sLevel >= 4)
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
        autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value;    //revert to selection after final zone reached
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