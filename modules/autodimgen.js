MODULES["autodimgen"] = {};
MODULES["autodimgen"].FuelOnlyZone = 250;
MODULES["autodimgen"].HybridZone = 250;
MODULES["autodimgen"].MagmiteZone = 400;
MODULES["autodimgen"].FuelOnlyOverclock = false;

//Initialize Global Vars (dont mess with these ones, nothing good can come from it).
var mapsForFuel = false;

function autodimgen() {
    mapsForFuel = false;
    if (game.global.word < 230) {
        return;
    }
    var customVars = MODULES["autodimgen"];
    var fuelCap = getGeneratorFuelCap();
    var autoCurrentFuel = game.global.magmaFuel;
    var fuelPerCurrentCell = Math.min(game.generatorUpgrades.Supply.modifier, 0.2 + ((game.global.world - 230) * 0.01))
    var wouldOverFuel = (game.permanentGeneratorUpgrades.Storage.owned) ? (autoCurrentFuel > fuelCap + 2) : (2 * fuelPerCurrentCell + autoCurrentFuel > fuelCap - 0.01);
    if (game.global.world < customVars.FuelOnlyZone) {
        if (game.global.generatorMode != 1) changeGeneratorState(1);
        mapsForFuel = wouldOverFuel && !customVars.FuelOnlyOverclock;
    } else if (game.global.world < customVars.HybridZone) {
        if (wouldOverFuel) {
            changeGeneratorState(0);
        } else {
            changeGeneratorState(1);
        }
    } else if (game.global.world < customVars.MagmiteZone) {
        if (game.global.generatorMode != 0) changeGeneratorState(0);
    }
}
