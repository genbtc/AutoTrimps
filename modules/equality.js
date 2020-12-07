//automatic equality management

//a holder object to avoid polluting namespace
equality = {};
MODULES["equality"] = equality;

//this is the threshold for angelic to heal us indefinitely
equality.gammaHits = 5;
equality.dropEverything = -1;

//returns true if we should try to keep trimps alive for 5 attacks
//setting is argument for it
//reflect is an argument against it
//we don't care about plague/poison/electricity for now because Angelic is good enough
equality.aimAtGamma = function() {
    var settingOn = getPageSetting('WaitForGamma');
    //reflect is going to kill us, so what's the point
    settingOn = settingOn && !mainWrapper.reflect();

    return settingOn;
}

equality.hitsToSurvive = function() {
    return getPageSetting('IWannaLiveForHowLong');
}

equality.iWannaLive = function() {
    var settingOn = getPageSetting('IWannaLive')
    //reflect is going to kill us, so what's the point
    settingOn = settingOn && !mainWrapper.reflect();

    return settingOn;
}

equality.howLongDoILive = function(cell) {
    var hitsToSurvive = this.dropEverything;
    //fast => just enough equality to survive
    //  waitForGamma => survive 5 turns
    //  iWannaLive => survive however many turns there is, at least 5
    //slow => zero equality
    //  iWannaLive => survive however many turns there is
    //      waitForGamma => at least 5
    if (mainWrapper.isEnemyFast(cell)) {
        hitsToSurvive = 1;
        if (this.aimAtGamma()) {
            hitsToSurvive = this.gammaHits;
        }
        if (this.iWannaLive() && (hitsToSurvive < this.hitsToSurvive())) {
            hitsToSurvive = this.hitsToSurvive();
        }
    } else {
        if (this.iWannaLive()) {
            hitsToSurvive = this.hitsToSurvive();
            if (this.aimAtGamma() && (hitsToSurvive < this.gammaHits)) {
                hitsToSurvive = this.gammaHits;
            }
        }
    }
    return hitsToSurvive;
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
        //happens near portal
        if (typeof cell === 'undefined') return false;

        var hitsToSurvive = this.howLongDoILive(cell);

        //this will drop equality stacks to zero
        var equalityNeeded = -getPerkLevel("Equality");

        if (0 < hitsToSurvive) {
            var minEnemyDamage = calculateDamage(cell.attack, false, false, false, cell, true);
            var maxEnemyDamage = mainWrapper.min2max(minEnemyDamage);

            var enemyDamage = maxEnemyDamage;

            var ourEffectiveHealth = game.global.soldierHealthMax + game.global.soldierEnergyShieldMax;
            var ourEffectiveHealthWait = ourEffectiveHealth / hitsToSurvive;

            equalityNeeded = this.additionalStacksNeeded(ourEffectiveHealthWait, enemyDamage);

            if (equalityNeeded > this.equalityStackBudget()) {
                equalityNeeded = this.additionalStacksNeeded(ourEffectiveHealth, enemyDamage);
            }
        }

        equality.setStacks(equalityNeeded);
    }
}

equality.additionalStacksNeeded = function(ourHealth, enemyDamage) {
    var equalityNeeded = 0;
    if (enemyDamage > ourHealth) {
        equalityNeeded = Math.ceil(Math.log10(enemyDamage / ourHealth)/Math.log10(1.1));
    //cut down on equality if we can
    } else {
        //the corner case is when the truth lies between the two equality stacks
        //this might cause fluctuation
        equalityNeeded = -Math.floor(Math.log10(ourHealth / enemyDamage)/Math.log10(1.1));
    }
    return equalityNeeded;
}

equality.equalityStackBudget = function() {
    return getPerkLevel("Equality") - Number(game.portal.Equality.disabledStackCount);
}

equality.setStacks = function(equalityNeeded) {
    //there might be some stacks already
    //this can also be NaN sometimes
    if (isNaN(game.portal.Equality.disabledStackCount)) {
        game.portal.Equality.disabledStackCount = 0;
    }
    //also this happens to be string if set via slider, hence Number() call
    game.portal.Equality.disabledStackCount = Number(game.portal.Equality.disabledStackCount) + equalityNeeded;

    //gotta stay in the interval, game doesn't have validation
    var maxEquality = getPerkLevel("Equality");
    if (game.portal.Equality.disabledStackCount > maxEquality) { // gotta ignore
        game.portal.Equality.disabledStackCount = maxEquality;
    } else if (game.portal.Equality.disabledStackCount < 0) {
        game.portal.Equality.disabledStackCount = 0;
    }

    manageEqualityStacks();
}