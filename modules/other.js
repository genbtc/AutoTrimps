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
    var setting = getPageSetting('AutoGoldenUpgrades');
    //get the numerical value of the selected index of the dropdown box
    try {
        if (setting == "Off") return;   //if disabled, exit.
        var num = getAvailableGoldenUpgrades();
        if (num == 0) return;       //if we have nothing to buy, exit.
        //buy one upgrade per loop.
        var success = buyGoldenUpgrade(setting);
        //Challenge^2 cant Get/Buy Helium, so adapt - do Derskagg mod.
        var challSQ = game.global.runningChallengeSquared;        
        var doDerskaggChallSQ = false;
        if (setting == "Helium" && challSQ && !success)
            doDerskaggChallSQ = true;
        // DZUGAVILI MOD - SMART VOID GUs
        // Assumption: buyGoldenUpgrades is not an asynchronous operation and resolves completely in function execution.
        // Assumption: "Locking" game option is not set or does not prevent buying Golden Void
        if (!success && setting == "Void" || doDerskaggChallSQ) {
            num = getAvailableGoldenUpgrades(); //recheck availables.
            if (num == 0) return;  //we already bought the upgrade...(unreachable)
            // DerSkagg Mod - Instead of Voids, For every Helium upgrade buy X-1 battle upgrades to maintain speed runs
            var goldStrat = getPageSetting('goldStrat');
            if (goldStrat == "Alternating") {
                var goldAlternating = getPageSetting('goldAlternating');
                setting = (game.global.goldenUpgrades%goldAlternating == 0) ? "Helium" : "Battle";
            } else if (goldStrat == "Zone") {
                var goldZone = getPageSetting('goldZone');
                setting = (game.global.world <= goldZone) ? "Helium" : "Battle";
            } else
                setting = (!challSQ) ? "Helium" : "Battle";
            buyGoldenUpgrade(setting);
        }
        // END OF DerSkagg & DZUGAVILI MOD
    } catch(err) { debug("Error in autoGoldenUpgrades: " + err.message); }
}

//auto spend nature tokens
function autoNatureTokens() {
    var changed = false;
    for (var nature in game.empowerments) {
        var empowerment = game.empowerments[nature];
        var setting = getPageSetting('Auto' + nature);
        if (!setting || setting == 'Off') continue;

        //buy/convert once per nature per loop
        if (setting == 'Empowerment') {
            var cost = getNextNatureCost(nature);
            if (empowerment.tokens < cost)
                continue;
            empowerment.tokens -= cost;
            empowerment.level++;
            changed = true;
            debug('Upgraded Empowerment of ' + nature, 'other');
        }
        else if (setting == 'Transfer') {
            if (empowerment.retainLevel >= 80)
                continue;
            var cost = getNextNatureCost(nature, true);
            if (empowerment.tokens < cost) continue;
            empowerment.tokens -= cost;
            empowerment.retainLevel++;
            changed = true;
            debug('Upgraded ' + nature + ' transfer rate', 'other');
        }
        else {
            if (empowerment.tokens < 10)
                continue;
            var match = setting.match(/Convert to (\w+)/);
            var targetNature = match ? match[1] : null;
            //sanity check
            if (!targetNature || targetNature === nature || !game.empowerments[targetNature]) continue;
            empowerment.tokens -= 10;
            var convertRate = (game.talents.nature.purchased) ? ((game.talents.nature2.purchased) ? 8 : 6) : 5;
            game.empowerments[targetNature].tokens += convertRate;
            changed = true;
            debug('Converted ' + nature + ' tokens to ' + targetNature, 'other');
        }
    }
    if (changed)
        updateNatureInfoSpans();
}

//Check if currently in a Spire past IgnoreSpiresUntil
function isActiveSpireAT() {
    return game.global.spireActive && game.global.world >= getPageSetting('IgnoreSpiresUntil');
}

//Exits the Spire after completing the specified cell.
function exitSpireCell() {
    if(isActiveSpireAT() && game.global.lastClearedCell >= getPageSetting('ExitSpireCell')-1)
        endSpire();
}
