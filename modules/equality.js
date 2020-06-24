//automatic equality management

function aimAtGamma() {
    var settingOn = getPageSetting('WaitForGamma');
    //reflect is going to kill us, so what's the point
    setting &= !(game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.mirrored !== 'undefined');

    return settingOn;
}

function manageEquality() {
    if (game.global.universe == 2 && !game.portal.Equality.radLocked) {
        if (game.portal.Equality.scalingActive) {
            toggleEqualityScale();
        }

        var cell = getCurrentCell();

        //run just enough stacks vs fast
        if (isEnemyFast(cell)) {
            var minEnemyDamage = calculateDamage(cell.attack, false, false, false, cell, true);
            var fluctuation = getFluctuation();
            var maxEnemyDamage = (1 + fluctuation) * minEnemyDamage / (1 - fluctuation);

            var enemyDamage = (minEnemyDamage + maxEnemyDamage) / 2;
            var ourEffectiveHealth = game.global.soldierHealthMax + game.global.soldierEnergyShieldMax;
            if (aimAtGamma()) {
                ourEffectiveHealth = ourEffectiveHealth / 5;
            }

            var equalityNeeded = 0;
            if (enemyDamage > ourEffectiveHealth) {
                equalityNeeded = Math.ceil(Math.log10(enemyDamage / ourEffectiveHealth)/Math.log10(1.1));
            //cut down on equality if we can
            } else {
                equalityNeeded = -Math.floor(Math.log10(ourEffectiveHealth / enemyDamage)/Math.log10(1.1));
            }

            //there might be some stacks already
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