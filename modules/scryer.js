
var wantToScry = false;
//use S stance
function useScryerStance() {
    var AutoStance = getPageSetting('AutoStance');
    function autostancefunction() {
        if (AutoStance<=1) autoStance();    //"Auto Stance"
        else if (AutoStance==2) autoStance2();   //"Auto Stance #2"
    };
    //check preconditions   (exit quick, if impossible to use)
    var use_auto = game.global.preMapsActive || game.global.gridArray.length === 0 || game.global.highestLevelCleared < 180;
    use_auto = use_auto || game.global.world <= 60;
    use_auto = use_auto || game.global.mapsActive && getCurrentMapObject().location == "Void" && getPageSetting('ScryerUseinVoidMaps2') == 2;
    if (use_auto) {
        autostancefunction();
        wantToScry = false;
        return;
    }

    if (AutoStance<=1)
        calcBaseDamageinX(); //calculate internal script variables normally processed by autostance.
    else if (AutoStance==2)
        calcBaseDamageinX2(); //calculate method #2
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var form = game.global.formation;
    var oktoswitch = true;
    var die = getPageSetting('ScryerDieToUseS');
    const willSuicide = getPageSetting('ScryerDieZ');
    if (die && willSuicide >= 0) {
        var [dieZ, dieC] = willSuicide.toString().split(".");
        if (dieC && dieC.length == 1) dieC = dieC + "0";
        die = game.global.world >= dieZ && (!dieC || (game.global.lastClearedCell + 1 >= dieC));
    }
    if (form == 0 || form == 1)
        oktoswitch = die || newSquadRdy || (missingHealth < (baseHealth / 2));

    var useoverkill = getPageSetting('ScryerUseWhenOverkill');
    if (useoverkill && game.portal.Overkill.level == 0)
        setPageSetting('ScryerUseWhenOverkill', false);
    if (useoverkill && !game.global.mapsActive && isActiveSpireAT() && getPageSetting('ScryerUseinSpire2')==2)
        useoverkill = false;
    //Overkill button being on and being able to overkill in S will override any other setting, regardless.
    if (useoverkill && game.portal.Overkill.level > 0) {
        var avgDamage = (baseDamage * (1-getPlayerCritChance()) + (baseDamage * getPlayerCritChance() * getPlayerCritDamageMult()));
        var Sstance = 0.5;
        var ovkldmg = avgDamage * Sstance * (game.portal.Overkill.level*0.005);
        //are we going to overkill in S?
        var ovklHDratio = getCurrentEnemy(1).maxHealth / ovkldmg;
        if (ovklHDratio < 8) {
            if (oktoswitch)
                setFormation(4);
            return;
        }
    }

//Any of these being true will indicate scryer should not be used, and cause the function to dump back to regular autoStance():
    //check for spire
    use_auto = use_auto || !game.global.mapsActive && isActiveSpireAT() && getPageSetting('ScryerUseinSpire2')!=1;
    //check for voids
    use_auto = use_auto || game.global.mapsActive && getCurrentMapObject().location == "Void" && !getPageSetting('ScryerUseinVoidMaps2');
    //check for maps
    use_auto = use_auto || game.global.mapsActive && !getPageSetting('ScryerUseinMaps2');
    //check for bosses above voidlevel
    use_auto = use_auto || getPageSetting('ScryerSkipBoss2') == 1 && game.global.world > getPageSetting('VoidMaps') && game.global.lastClearedCell == 98;
    //check for bosses (all levels)
    use_auto = use_auto || getPageSetting('ScryerSkipBoss2') == 2 && game.global.lastClearedCell == 98;
    if (use_auto) {
        autostancefunction();    //falls back to autostance when not using S.
        wantToScry = false;
        return;
    }

    //check for corrupted cells (and exit)
    var iscorrupt = getCurrentEnemy(1).mutation == "Corruption";
    iscorrupt = iscorrupt || (mutations.Magma.active() && game.global.mapsActive);
    iscorrupt = iscorrupt || (game.global.mapsActive && getCurrentMapObject().location == "Void" && game.global.world >= mutations.Corruption.start());
    if (iscorrupt && getPageSetting('ScryerSkipCorrupteds2')) {
        autostancefunction();
        wantToScry = false;
        return;
    }

    //Default.
    var min_zone = getPageSetting('ScryerMinZone');
    var max_zone = getPageSetting('ScryerMaxZone');
    var valid_min = game.global.world >= min_zone;
    var valid_max = max_zone <= 0 || game.global.world < max_zone;
    if (valid_min && valid_max) {
        if (oktoswitch)
            setFormation(4);
        wantToScry = true;
    } else {
        autostancefunction();
        wantToScry = false;
        return;
    }
}
