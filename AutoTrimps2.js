// ==UserScript==
// @name         AutoTrimpsV2
// @version      2.1.5.9-genbtc-11-13-2017+Mod+Uni+coderpatsy
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC, Unihedron, coderPatsy
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
var ATversion = '2.1.5.9-genbtc-11-13-2017+Mod+Uni+coderpatsy';

////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first, load everything else)///////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
var atscript = document.getElementById('AutoTrimps-script')
  , base = 'https://genbtc.github.io/AutoTrimps/'
  , module = 'modules/'
  ;
if (atscript !== null) {
    base = atscript.getAttribute('src').replace(/AutoTrimps2\.js$/, '');
}
//Load stuff needed to load other stuff:
document.head.appendChild(document.createElement('script')).src = base + module + 'utils.js';

function initializeAutoTrimps() {
    loadPageVariables();
    document.head.appendChild(document.createElement('script')).src = base + 'NewUI2.js';
    document.head.appendChild(document.createElement('script')).src = base + 'Graphs.js';
    //Load modules:
    var modules = ['query', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'autostance', 'battlecalc', 'automaps', 'autobreedtimer', 'dynprestige', 'autofight', 'scryer', 'magma', 'portal', 'other'];
    for (var i=0,len=modules.length; i<len; i++) {
        document.head.appendChild(document.createElement('script')).src = base + module + modules[i] + '.js';
    }
    //Autoperks
    if (typeof(AutoPerks) === 'undefined')
        document.head.appendChild(document.createElement('script')).src = base + module + 'autoperks.js';
    else
        debug('AutoPerks is now included in Autotrimps, please disable the tampermonkey script for AutoPerks to remove this message!', '*spinner3');
    toggleSettingsMenu();
    toggleSettingsMenu();
    // dank dark graphs by Unihedron
    if (game.options.menu.darkTheme.enabled == 2) {
        const $link = document.createElement('link');
        $link.rel = "stylesheet";
        $link.type = "text/css";
        $link.href = base + 'dark-graph.css';
        document.head.appendChild($link);
    }
    //
    debug('AutoTrimps v' + ATversion + ' Loaded!', '*spinner3');
}

function printChangelog() {
    tooltip('confirm', null, 'update', '\
<br><b class="AutoEggs">11/13 v2.1.5.9 </b><b style="background-color:#32CD32"> New:</B> Max Map Bonus After Zone setting (in \"Maps\"), Reverse \"Farming for Spire\" timer so it counts down. Disable Max Tox after autoportal. \
<br><b class="AutoEggs">11/8 v2.1.5.8</b> Merge all coderPatsy\'s existing v2.1.5.6p7 changes:\
<br><b style="background-color:#32CD32">New Features:</b> Enable Patience, AutoNatureTokens, MaxMapBonusForSpire.\
<br><b style="background-color:#A3C00F">Fixes:</b> Turkimp Tamer IV, Optimize checking void maps, \
Add Challenge^2 and 4.5 mastery damage bonuses to AutoStance 2 damage calcs, \
Uni\'s PreSpireNurseries setting now works for higher spires 2+, \
AT now doesn\'t force Wait to Travel game setting, \
AutoMaps now displays Off when off, and still updates He/Hr %, \
Add Status display for out of Mapology map tokens \
<br><b class="AutoEggs">11/7 v2.1.5.7</b> Merge all of DerSkagg\'s changes, including: \
<br><b style="background-color:#32CD32">New AutoGoldenUpgrades</b> strats for <b>VOID</b>in "Golden" menu.  \
When Void costs too much: Choose Alternating Helium/Battle or Zone Cutoff for Helium(pre)/Battle(post) \
<br><b style="background-color:#83ddd6">8/26 v2.1.5.6</b> Merge UniHedro fork (settings in Uni Menu) \
<br><u>Report any bugs/problems please! You can find me on Discord: <span style="background-color:#ddd;color:#222">genr8_#8163</span></u>\
<br><a href="https://github.com/genBTC/AutoTrimps/commits/gh-pages" target="#">Check the commit history</a> (if you care)\
', 'cancelTooltip()', 'Script Update Notice<br>' + ATversion);
}
////////////////////////////////////////
//Main DELAY Loop///////////////////////
////////////////////////////////////////

//Magic Numbers/////////////////////////
var runInterval = 100;      //How often to loop through logic
var startupDelay = 2000;    //How long to wait for everything to load

setTimeout(delayStart, startupDelay);
function delayStart() {
    initializeAutoTrimps();
    printChangelog();
    setTimeout(delayStartAgain, startupDelay);
}
function delayStartAgain(){
    setInterval(mainLoop, runInterval);
    setInterval(guiLoop, runInterval*10);
    updateCustomButtons();
    document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
    //MODULESdefault = MODULES;
    //MODULESdefault = Object.assign({}, MODULES);
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
}

////////////////////////////////////////
//Global Main vars /////////////////////
////////////////////////////////////////
////////////////////////////////////////

var AutoTrimpsDebugTabVisible = true;
var enableDebug = true; //Spam console
var autoTrimpSettings = {};

var MODULES = {};
var MODULESdefault = {};
var autoTrimpVariables = {};
var bestBuilding;
var scienceNeeded;
var breedFire = false;

var shouldFarm = false;
var enoughDamage = true;
var enoughHealth = true;

var baseDamage = 0;
var baseBlock = 0;
var baseHealth = 0;

var preBuyAmt;
var preBuyFiring;
var preBuyTooltip;
var preBuymaxSplit;

var ATrunning = true;
var magmiteSpenderChanged = false;
var BAFsetting, oldBAFsetting;

var currentworld = 0;
var lastrunworld = 0;
var aWholeNewWorld = false;
var needGymystic = true;
var heirloomFlag = false;
var heirloomCache = game.global.heirloomsExtra.length;

//reset stuff that may not have gotten cleaned up on portal
function mainCleanup() {
    lastrunworld = currentworld;
    currentworld = game.global.world;
    aWholeNewWorld = lastrunworld != currentworld;
    //run once per portal:
    if (currentworld == 1 && aWholeNewWorld) {
        lastHeliumZone = 0;
        zonePostpone = 0;
        //for the dummies like me who always forget to turn automaps back on after portaling
        if(getPageSetting('RunUniqueMaps') && !game.upgrades.Battle.done && autoTrimpSettings.AutoMaps.enabled == false)
            settingChanged("AutoMaps");
        return true; // Do other things
    }
}

////////////////////////////////////////
//Main LOGIC Loop///////////////////////
////////////////////////////////////////
////////////////////////////////////////
function mainLoop() {
    if (ATrunning == false) return;
    ATrunning = true;
    if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");    //more detail
    addbreedTimerInsideText.innerHTML = parseFloat(game.global.lastBreedTime/1000).toFixed(1) + 's'; //add hidden next group breed timer;
    if (armycount.className != "tooltipadded") addToolTipToArmyCount();
    if (mainCleanup() // Z1 new world
            || portalWindowOpen // in the portal screen (for manual portallers)
            || (!heirloomsShown && heirloomFlag) // closed heirlooms screen
            || (heirloomCache != game.global.heirloomsExtra.length)) { // inventory size changed (a drop appeared)
            // also pre-portal: portal.js:111
        if (getPageSetting('AutoHeirlooms2')) autoHeirlooms2(); //"Auto Heirlooms 2" (heirlooms.js)
        else if (getPageSetting('AutoHeirlooms')) autoHeirlooms();//"Auto Heirlooms"      (")
        if (getPageSetting('AutoUpgradeHeirlooms') && !heirloomsShown) autoNull();  //"Auto Upgrade Heirlooms" (heirlooms.js)

        heirloomCache = game.global.heirloomsExtra.length;
    }
    heirloomFlag = heirloomsShown;

    if(getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled || game.global.viewingUpgrades) return;
    game.global.addonUser = true;
    game.global.autotrimps = {
        firstgiga: getPageSetting('FirstGigastation'),
        deltagiga: getPageSetting('DeltaGigastation')
    }
    if (aWholeNewWorld) {
        // Auto-close dialogues.
        switch (document.getElementById('tipTitle').innerHTML) {
            case 'The Improbability':   // Breaking the Planet
            case 'Corruption':          // Corruption / True Corruption
            case 'Spire':               // Spire
            case 'The Magma':           // Magma
                cancelTooltip();
        }
        setTitle(); // Set the browser title

        if (getPageSetting('AutoEggs'))
            easterEggClicked();
    }
    setScienceNeeded();  //determine how much science is needed

    //EXECUTE CORE LOGIC
    if (getPageSetting('ExitSpireCell') >0) exitSpireCell(); //"Exit Spire After Cell" (other.js)
    if (getPageSetting('WorkerRatios')) workerRatios(); //"Auto Worker Ratios"  (jobs.js)
    if (getPageSetting('BuyUpgrades')) buyUpgrades();   //"Buy Upgrades"       (upgrades.js)
    autoGoldenUpgradesAT();
    if (getPageSetting('BuyStorage'))
        buyStorage();     //"Buy Storage"     (buildings.js)
    if (getPageSetting('BuyBuildings')) buyBuildings(); //"Buy Buildings"   (buildings.js)
    needGymystic = false;   //reset this after buyBuildings
    if (getPageSetting('BuyJobs')) buyJobs();           //"Buy Jobs"    (jobs.js)
    if (getPageSetting('ManualGather2')<=2) manualLabor();  //"Auto Gather/Build"           (gather.js)
    else if (getPageSetting('ManualGather2')==3) manualLabor2();  //"Auto Gather/Build #2"     (")
    if (getPageSetting('AutoMaps')) autoMap();          //"Auto Maps"   (automaps.js)
    else updateAutoMapsStatus();
    if (getPageSetting('GeneticistTimer') >= 0) autoBreedTimer(); //"Geneticist Timer" / "Auto Breed Timer"     (autobreedtimer.js)
    if (autoTrimpSettings.AutoPortal.selected != "Off") autoPortal();   //"Auto Portal" (hidden until level 40) (portal.js)

    if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap(); //"Trap Trimps"
    if (aWholeNewWorld && getPageSetting('AutoRoboTrimp')) autoRoboTrimp();   //"AutoRoboTrimp" (other.js)
    if (aWholeNewWorld && getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared) finishChallengeSquared(); // "Finish Challenge2" (other.js)
    autoLevelEquipment();           //"Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"  (equipment.js)

    if (getPageSetting('UseScryerStance'))  useScryerStance();  //"Use Scryer Stance"   (scryer.js)
    else if (getPageSetting('AutoStance')<=1) autoStance();    //"Auto Stance"      (autostance.js)
    else if (getPageSetting('AutoStance')==2) autoStance2();   //"Auto Stance #2"       (")
    if (getPageSetting('UseAutoGen')) autoGenerator(); // "Auto Generator ON" (magma.js)

    BAFsetting = getPageSetting('BetterAutoFight');
    if (BAFsetting==1) betterAutoFight();        //"Better Auto Fight"  (autofight.js)
    else if (BAFsetting==2) betterAutoFight2();     //"Better Auto Fight2"  (")
    else if (BAFsetting==0 && BAFsetting!=oldBAFsetting && game.global.autoBattle && game.global.pauseFight)  pauseFight(); //turn on autofight on once when BAF is toggled off.
    else if (BAFsetting==0 && game.global.world == 1 && game.global.autoBattle && game.global.pauseFight) pauseFight();     //turn on autofight on lvl 1 if its off.
    else if (BAFsetting==0 && !game.global.autoBattle && game.global.soldierHealth == 0) betterAutoFight();   //use BAF as a backup for pre-Battle situations
    oldBAFsetting = BAFsetting;                                            //enables built-in autofight once when disabled

    if (getPageSetting('DynamicPrestige2')>0&&((getPageSetting('ForcePresZ')<0)||(game.global.world<getPageSetting('ForcePresZ')))) prestigeChanging2(); //"Dynamic Prestige" (dynprestige.js)
    else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value; //if we dont want to, just make sure the UI setting and the internal setting are aligned.

    //Auto Magmite Spender
    try {
        if (getPageSetting('AutoMagmiteSpender2')==2 && !magmiteSpenderChanged)
            autoMagmiteSpender(); // magma.js
    } catch (err) {
        debug("Error encountered in AutoMagmiteSpender(Always): " + err.message,"general");
    }

    if (getPageSetting('AutoNatureTokens')) autoNatureTokens();

    //Runs any user provided scripts - by copying and pasting a function named userscripts() into the Chrome Dev console. (F12)
    if (userscriptOn) userscripts();
    //rinse, repeat
    return;
}

//GUI Updates happen on this thread, every 1000ms, concurrently
function guiLoop() {
    updateCustomButtons();
}

// Userscript loader. write your own!
var userscriptOn = true;    //controls the looping of userscripts and can be self-disabled
var globalvar0,globalvar1,globalvar2,globalvar3,globalvar4,globalvar5,globalvar6,globalvar7,globalvar8,globalvar9;
//left blank intentionally. the user will provide this. blank global vars are included as an example
function userscripts()
{
    //insert code here:
}
