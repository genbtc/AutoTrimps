//this is a wrapper for everything that needs a bit of code around main.js calls

//a holder object to avoid polluting namespace
mainWrapper = {};
MODULES["mainWrapper"] = mainWrapper;

//obtains current world or map cell
mainWrapper.getCurrentCell = function() {
    // copypaste from approx main.js#handleDominationDebuff:6945
    return (game.global.mapsActive) ? getCurrentMapCell() : getCurrentWorldCell();
}

//checks whether the current enemy is fast. A copypaste job from approx main.js#fight:13491
//cell is a current world or map cell object
mainWrapper.isEnemyFast = function(cell) {
    var checkFast =
        (game.global.challengeActive == "Slow" || ((((game.badGuys[cell.name].fast || cell.mutation == "Corruption") && game.global.challengeActive != "Nom") || game.global.voidBuff == "doubleAttack") && game.global.challengeActive != "Coordinate"));
    var forceSlow = false;
    if (game.global.challengeActive == "Duel"){
        if (game.challenges.Duel.enemyStacks < 10) {
            checkFast = true;
        } else if (game.challenges.Duel.trimpStacks < 10 && !game.global.runningChallengeSquared) {
            forceSlow = true;
        }
    }
    return checkFast && !forceSlow;
}

//copypaste as well; at least this is straightforward to do
mainWrapper.getFluctuation = function() {
    if (game.global.universe == 2) {
        return 0.5;
    } else {
        return 0.2;
    }
}