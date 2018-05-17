MODULES["fight"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["fight"].breedTimerCutoff1 = 2;
MODULES["fight"].breedTimerCutoff2 = 0.5;
MODULES["fight"].enableDebug = true;    //controls whether betterAutoFight2 is Spammy or not.

//selector function, called from main.
var BAFsetting, oldBAFsetting;
function ATselectAutoFight() {
    BAFsetting = getPageSetting('BetterAutoFight');
    if (BAFsetting==1) betterAutoFight();        //"Better Auto Fight"  (autofight.js)
    else if (BAFsetting==2) betterAutoFight2();     //"Better Auto Fight2"  (")
    else if (BAFsetting===3) betterAutoFight3();
    else if (BAFsetting==0 && BAFsetting!=oldBAFsetting && game.global.autoBattle && game.global.pauseFight)  pauseFight(); //turn on autofight on once when BAF is toggled off.
    else if (BAFsetting==0 && game.global.world == 1 && game.global.autoBattle && game.global.pauseFight) pauseFight();     //turn on autofight on lvl 1 if its off.
    else if (BAFsetting==0 && !game.global.autoBattle && game.global.soldierHealth == 0) betterAutoFight();   //use BAF as a backup for pre-Battle situations
    oldBAFsetting = BAFsetting;     //enables built-in autofight once when disabled
}

//old: Handles manual fighting automatically, in a different way.
function betterAutoFight() {
    var customVars = MODULES["fight"];
    if (game.global.autoBattle && !game.global.pauseFight)
        pauseFight(); //Disable built-in autofight
    if (game.global.gridArray.length === 0 || game.global.preMapsActive || !game.upgrades.Battle.done) return;  //sanity check. stops error message on z1 right after portal
    var targetBreed = getPageSetting('GeneticistTimer');
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var lowLevelFight = game.resources.trimps.maxSoldiers < breeding * 0.5 && breeding > game.resources.trimps.realMax() * 0.1 && game.global.world < 5;
    //Manually fight instead of using builtin auto-fight
    if (!game.global.fighting) {
        if (newSquadRdy || game.global.soldierHealth > 0 || lowLevelFight || game.global.challengeActive == 'Watch') {
            fightManual();
        }
        //Click Fight if we are dead and already have enough for our breed timer, and fighting would not add a significant amount of time
        else if (getBreedTime() < customVars.breedTimerCutoff1 && (game.global.lastBreedTime/1000) > targetBreed && game.global.soldierHealth == 0)
            fightManual();
        //AutoFight will now send Trimps to fight if it takes less than 0.5 seconds to create a new group of soldiers, if we havent bred fully yet
        else if (getBreedTime() <= customVars.breedTimerCutoff2)
            fightManual();
    }
}

//NEW:: 2nd algorithm for Better Auto Fight
function betterAutoFight2() {
    var customVars = MODULES["fight"];
    if (game.global.autoBattle && !game.global.pauseFight)
        pauseFight();   //Disable built-in autofight
    if (game.global.gridArray.length === 0 || game.global.preMapsActive || !game.upgrades.Battle.done || game.global.fighting)
        return;         //sanity check.
    var targetBreed = getPageSetting('GeneticistTimer');
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var potencyMod = getPotencyMod();
    var tps = breeding * potencyMod;
    var addTime = adjustedMax / tps;
    //if armySend is less than half of what you have breeding, and what you have breeding is more than 10% of your total trimps. (when scientist I is incompleted)
    var lowLevelFight = game.resources.trimps.maxSoldiers < 0.5*breeding && breeding > 0.1*game.resources.trimps.realMax() && game.global.world <= 6 && game.global.sLevel < 1;

    var breedTimerLimit = game.talents.patience.purchased && getPageSetting('UsePatience') ? 46 : 31;

    //Manually fight if:     //game.global.soldierHealth > 0 //just fight if we're alive,or if == 0; we're dead, and also fight :P
    if (!game.global.fighting) {
        if (game.global.soldierHealth > 0)
            battle(true); //just fight, dont speak.
        else if (newSquadRdy || lowLevelFight || game.global.challengeActive == 'Watch') {
            battle(true);
            if (MODULES["fight"].enableDebug)
            debug("AutoFight Default: New squad ready", "other");
        }
        //Click Fight if we are dead and already have enough for our breed timer, and fighting would not add a significant amount of time
        else if (getBreedTime() < customVars.breedTimerCutoff1 && (game.global.lastBreedTime/1000) > targetBreed) {
            battle(true);
            if (MODULES["fight"].enableDebug)
            debug("AutoFight: BAF2 #1, breed &lt; " + customVars.breedTimerCutoff1 + " &amp;&amp; HiddenNextGroup &gt; GeneTimer", "other");
        }
        //AutoFight will now send Trimps to fight if it takes less than 0.5 seconds to create a new group of soldiers, if we havent bred fully yet
        else if (getBreedTime() <= customVars.breedTimerCutoff2) {
            battle(true);
            if (MODULES["fight"].enableDebug)
            debug("AutoFight: BAF2 #2, breed &lt;= " + customVars.breedTimerCutoff2 + " s", "other");
        }
        //Click fight anyway if we are dead and stuck in a loop due to Dimensional Generator and we can get away with adding time to it.
        else if (getBreedTime(true)+addTime <= targetBreed && breeding>=adjustedMax && !(game.global.mapsActive && getCurrentMapObject().location == "Void")) {
            battle(true);
            if (MODULES["fight"].enableDebug)
            debug("AutoFight: BAF2 #3, RemainingTime + ArmyAdd.Time &lt; GeneTimer", "other");
        }
        //Clicks fight anyway if we are dead and have >=breedTimerLimit NextGroupTimer and deal with the consequences by firing geneticists afterwards.
        else if (game.global.soldierHealth == 0 && (game.global.lastBreedTime/1000)>=breedTimerLimit && targetBreed >= 0 && !game.jobs.Geneticist.locked && game.jobs.Geneticist.owned > 10 ) {
            battle(true);
            if (MODULES["fight"].enableDebug)
            debug("AutoFight: BAF2 #4, NextGroupBreedTimer went over " + breedTimerLimit + " and we arent fighting.", "other");
        }
    }
}

function betterAutoFight3()
{
    if (game.global.autoBattle && game.global.pauseFight)
        pauseFight();
    if (game.global.gridArray.length === 0 || game.global.preMapsActive || !game.upgrades.Battle.done) return; //sanity check. stops error message on z1 right after portal

    if (game.global.soldierHealth === 0 && !(game.global.spireActive || (game.global.mapsActive && getCurrentMapObject().location === "Void") || game.global.preMapsActive)) {
        if (game.global.antiStacks <= 1) {
            game.global.GeneticistassistSetting = 1;
            game.options.menu.gaFire.enabled = 1;
        }
        fightManual();
        buyArmors(); //temp fix for AT not buying armor
    }
    else {
        game.global.GeneticistassistSetting = 45;
    }
    if (game.global.antiStacks !== 45 && game.global.lastBreedTime >= 45000 && !game.global.spireActive) {
        forceAbandonTrimps();
    }
    if ((needPrestige || !enoughDamage) && game.global.world>=200 && (getEmpowerment() === "Ice" || (getEmpowerment() === "Wind" && game.global.lastBreedTime >= 45000)) && !game.global.mapsActive && game.global.mapBonus !== 10 && game.global.world!==game.options.menu.mapAtZone.setZone) {
        forceAbandonTrimps();
    }
}

function buyArmors(){
    numTab(3);
    buyEquipment('Boots');
    buyEquipment('Helmet');
    buyEquipment('Pants');
    buyEquipment('Shoulderguards');
    buyEquipment('Breastplate')
    buyEquipment('Gambeson')
}