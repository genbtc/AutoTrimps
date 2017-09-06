MODULES["magmite"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["magmite"].algorithm = 2;   //2 is advanced cost/benefit calculation between capacity/efficiency. 1 is buy-cheapest-upgrade.

// Finish Challenge2
function finishChallengeSquared() {
    // some checks done before reaching this:
    // getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared
    var zone = getPageSetting('FinishC2');
    if (game.global.world >= zone) {
        abandonChallenge();
        debug("Finished challenge2 because we are on zone " + game.global.world, "other", 'oil');
    }
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
function autoGoldenUpgradesAT() {
    //get the numerical value of the selected index of the dropdown box
    try {
        var setting = document.getElementById('AutoGoldenUpgrades').value;
        var speedVoid = document.getElementById('speedVoid').value;
        if (setting == "Off") return;   //if disabled, exit.
        var num = getAvailableGoldenUpgrades();
        if (num == 0) return;       //if we have nothing to buy, exit.
        //buy one upgrade per loop.
        buyGoldenUpgrade(setting);
        
            //createSetting('goldStrat', 'goldStrat', 'This setting will after max void golden upgrades alternate between buying helium and battle upgrades', 'dropdown', 'Off', ["Off", "Alternating", "Zone"], 'Golden');
            //createSetting('goldAlternating', 'goldAlternating', 'Buy a helium upgrade after X-1 battle upgrades have been purchased', 'value', '2', '2', 'Golden'); 
            //createSetting('goldZone', 'goldZone', 'Buy a helium upgrade until zone, then buy battle upgrades', 'value', '200', '200', 'Golden'); 
    
        
        // DZUGAVILI MOD - SMART VOID GUs
        // Assumption: buyGoldenUpgrades is not an asynchronous operation and resolves completely in function execution.
        if (setting == "Void") { // we can only buy a few void GUs. We should check if we actually made the buy.
            num = getAvailableGoldenUpgrades();
            if (num == 0) return; // we actually bought the upgrade.
            // DerSkagg Mod - For every Helium upgrade buy X-1 battle upgrades to maintain speed runs
            if (goldStrat == "Alternating") {
                var goldAlternating = getPageSetting('goldAlternating')
                if (game.global.goldenUpgrades%goldAlternating == 0){
                    buyGoldenUpgrade("Helium");
                }else{
                    buyGoldenUpgrade("Battle");
                }
            }else if(goldStrat == "goldZone")
                var zone = game.global.world
                var goldZone = getPageSetting('goldZone')
                if (zone <= goldZone){
                    buyGoldenUpgrade("Helium");
                }else{
                    buyGoldenUpgrade("Battle");
                }
            }else{
                buyGoldenUpgrade("Helium");
            }
        }
        // END OF DZUGAVILI MOD

    } catch(err) { debug("Error in autoGoldenUpgrades: " + err.message); }
}

//Exits the Spire after completing the specified cell.
function exitSpireCell() {
    if(game.global.world == 200 && game.global.spireActive && game.global.lastClearedCell >= getPageSetting('ExitSpireCell')-1)
        endSpire();
}
