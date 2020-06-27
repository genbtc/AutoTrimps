//automatic equality management

//a holder object to avoid polluting namespace
equality = {};
MODULES["equality"] = equality;

//returns true if we should try to keep trimps alive for 5 attacks
//setting is argument for it
//reflect is an argument against it
//we don't care about plague/poison/electricity for now because Angelic is good enough
equality.aimAtGamma = function() {
    var settingOn = getPageSetting('WaitForGamma');
    //reflect is going to kill us, so what's the point
    settingOn &= !(game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.mirrored !== 'undefined');

    return settingOn;
}

//performs equality dance.
//no stacks if enemy is not fast
//otherwise, if not trying to hit gamma, barely enough stacks to survive a hit
//otherwise, barely enough stacks to survive 5 hits
//if we have too many equality stacks, dial those down a bit
equality.manageEquality = function() {
    if (game.global.universe == 2 && !game.portal.Equality.radLocked) {
        if (game.portal.Equality.scalingActive) {
            toggleEqualityScale();
        }

        var cell = mainWrapper.getCurrentCell();

        //run just enough stacks vs fast
        var aimAtGamma = this.aimAtGamma();
        if (mainWrapper.isEnemyFast(cell) || aimAtGamma) {
            var minEnemyDamage = calculateDamage(cell.attack, false, false, false, cell, true);
            var fluctuation = mainWrapper.getFluctuation();
            var maxEnemyDamage = (1 + fluctuation) * minEnemyDamage / (1 - fluctuation);

            var enemyDamage = (minEnemyDamage + maxEnemyDamage) / 2;
            var ourEffectiveHealth = game.global.soldierHealthMax + game.global.soldierEnergyShieldMax;
            if (aimAtGamma) {
                enemyDamage = maxEnemyDamage;
                ourEffectiveHealth = ourEffectiveHealth / 5;
            }

            var equalityNeeded = 0;
            if (enemyDamage > ourEffectiveHealth) {
                equalityNeeded = Math.ceil(Math.log10(enemyDamage / ourEffectiveHealth)/Math.log10(1.1));
            //cut down on equality if we can
            } else {
                //the corner case is when the truth lies between the two equality stacks
                //this will cause fluctuation
                //not very nice for your eyes, but better than adding 1 here and having an extra stack
                equalityNeeded = -Math.floor(Math.log10(ourEffectiveHealth / enemyDamage)/Math.log10(1.1));
            }

            //there might be some stacks already
            //this can also be NaN sometimes
            if (isNaN(game.portal.Equality.disabledStackCount)) {
                game.portal.Equality.disabledStackCount = 0;
            }
            //also this happens to be string if set via slider, hence Number() call
            game.portal.Equality.disabledStackCount = Number(game.portal.Equality.disabledStackCount) + equalityNeeded;

            //gotta stay in the interval, game doesn't have validation
            var maxEquality = getPerkLevel("Equality");
            if (game.portal.Equality.disabledStackCount > maxEquality) {
                game.portal.Equality.disabledStackCount = maxEquality;
            } else if (game.portal.Equality.disabledStackCount < 0) {
                game.portal.Equality.disabledStackCount = 0;
            }
        //if enemy is slow run 0 stacks
        } else {
            game.portal.Equality.disabledStackCount = 0;
        }

        manageEqualityStacks();
    }
}