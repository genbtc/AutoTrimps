// ==UserScript==
// @name         AutoTrimpsV2
// @version      2.1.6.6-genbtc-3-13-2018+Mod+Uni+coderpatsy
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC, Unihedron, coderPatsy
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
var ATversion = '2.1.6.6-genbtc-3-13-2018+Mod+Uni+coderpatsy';

////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first, load everything else)///////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
var atscript = document.getElementById('AutoTrimps-script')
  , basepath = 'https://genbtc.github.io/AutoTrimps/'
  , modulepath = 'modules/'
  ;
//This should redirect the script to wherever its being mirrored from.
if (atscript !== null) {
    basepath = atscript.getAttribute('src').replace(/AutoTrimps2\.js$/, '');
}

function scriptLoad(pathname) {
    var script = document.createElement('script');
    script.src = basepath + pathname;
    //script.setAttribute('crossorigin',"use-credentials");
    //script.setAttribute('crossorigin',"anonymous");
    document.head.appendChild(script);
}
scriptLoad(modulepath + 'utils.js');    //Load stuff needed to load other stuff:

//This starts up after 2.5 seconds.
function initializeAutoTrimps() {
    loadPageVariables();            //get autoTrimpSettings
    scriptLoad(modulepath + 'performance.js');    //Load stuff needed to load other stuff:
    scriptLoad('SettingsGUI.js');   //populate Settings GUI
    scriptLoad('Graphs.js');        //populate Graphs
    //Load modules:
    var ATmodules = ['query', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'stance', 'battlecalc', 'maps', 'breedtimer', 'dynprestige', 'fight', 'scryer', 'magmite', 'portal', 'other', 'import-export', 'client-server', 'perks', 'fight-info'];
    for (var m in ATmodules) {
        scriptLoad(modulepath + ATmodules[m] + '.js');
    }
    //
    debug('AutoTrimps v' + ATversion + ' Loaded!', '*spinner3');
}

//print changelog function should be refactored:
// arguments: Line #/
//          : Date
//          : Version #
//          : New?
//          : Description
//Other function should be made to create a DOM element for this, scrape the API data into it, and then print tooltip with header/footer.
function printChangelog() {
    tooltip('confirm', null, 'update', '\
<br><b class="AutoEggs">3/13 v2.1.6.6 </b><b style="background-color:#32CD32"> New:</B> Geneticist management changes. Equipment code improvements. scriptLoad improvements. attempt to track errors. Continue Development on long TODO list... \
<br>3/7 v2.1.6.5 </b><b style="background-color:#32CD32"> New:</B> Save/Reload Profiles in Import/Export. Magmamancer graph. Magmite/Magma Spam disableable. \
<br><b>3/4 v2.1.6.4 </b> Basic Analytics are now being collected. Read about it in the tooltip of the new button on the Import/Export tab . Overkill Graph fixed for Liquification.  Setting Max Explorers to infinity as they are not that useless anymore. Update battlecalc for Fluffy & Ice on Autostance2.\
<br><b>3/1 v2.1.6.3 </b> AutoPerks: Capable/Curious/Cunning, BaseDamageCalc: C2,StillRowing,Strength in Health,Ice,Fluffy,Magmamancer - Fix bugs in autoperks around capable/fluffy allocating looting + more bugs\
<br><u>Report any bugs/problems please!<br You can find me on Discord: <span style="background-color:#ddd;color:#222">genr8_#8163 </span>\
<a href="https://discord.gg/0VbWe0dxB9kIfV2C"> @ AT Discord Channel</a></u>\
<br><a href="https://github.com/genBTC/AutoTrimps/commits/gh-pages" target="#">Check the commit history</a> (if you want)\
', 'cancelTooltip()', 'Script Update Notice<br>' + ATversion);
}
////////////////////////////////////////
//Main DELAY Loop///////////////////////
////////////////////////////////////////

//Magic Numbers
var runInterval = 100;      //How often to loop through logic
var startupDelay = 2500;    //How long to wait for everything to load

//Start Loops
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
    if (autoTrimpSettings.PrestigeBackup !== undefined && autoTrimpSettings.PrestigeBackup.selected != "")
        document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
    if (document.getElementById('Prestige').value === "")
        document.getElementById('Prestige').value = "Off";
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    //Set some game ars after we load.
    game.global.addonUser = true;
    game.global.autotrimps = true;    
}

////////////////////////////////////////
//Global Main vars /////////////////////
////////////////////////////////////////
////////////////////////////////////////
var ATrunning = true;   //status var
var ATmessageLogTabVisible = true;    //show an AutoTrimps tab after Story/Loot/Unlocks/Combat message Log Container
var enableDebug = true; //Spam console.log with debug info

var autoTrimpSettings = {};
var MODULES = {};
var MODULESdefault = {};
var ATMODULES = {};

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

var currentworld = 0;
var lastrunworld = 0;
var aWholeNewWorld = false;
var needGymystic = true;    //used in setScienceNeeded, buildings.js, equipment.js
var heirloomFlag = false;
var heirloomCache = game.global.heirloomsExtra.length;
var magmiteSpenderChanged = false;

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
    if(getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled || game.global.viewingUpgrades) return;
    ATrunning = true;
    if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");    //more detail
    addbreedTimerInsideText.innerHTML = parseFloat(game.global.lastBreedTime/1000).toFixed(1) + 's';  //add hidden next group breed timer;
    addToolTipToArmyCount(); //Add hidden tooltip for army count (SettingsGUI.js @ end)
    //Heirloom:
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
    //Stuff to do  Every new Zone
    if (aWholeNewWorld) {
        // Auto-close dialogues.
        switch (document.getElementById('tipTitle').innerHTML) {
            case 'The Improbability':   // Breaking the Planet
            case 'Corruption':          // Corruption / True Corruption
            case 'Spire':               // Spire
            case 'The Magma':           // Magma
                cancelTooltip();
        }
        if (getPageSetting('AutoEggs'))
            easterEggClicked();
        setTitle(); // Set the browser title        
    }
    setScienceNeeded();  //determine how much science is needed

    //EXECUTE CORE LOGIC
    if (getPageSetting('ExitSpireCell') >0) exitSpireCell(); //"Exit Spire After Cell" (other.js)
    if (getPageSetting('WorkerRatios')) workerRatios(); //"Auto Worker Ratios"  (jobs.js)
    if (getPageSetting('BuyUpgrades')) buyUpgrades();   //"Buy Upgrades"       (upgrades.js)
    autoGoldenUpgradesAT();                             //"Golden Upgrades"     (other.js)
    if (getPageSetting('BuyStorage'))  buyStorage();     //"Buy Storage"     (buildings.js)
    if (getPageSetting('BuyBuildings')) buyBuildings(); //"Buy Buildings"    (buildings.js)
    if (getPageSetting('BuyJobs')) buyJobs();           //"Buy Jobs"            (jobs.js)
    if (getPageSetting('ManualGather2')<=2) manualLabor();  //"Auto Gather/Build"       (gather.js)
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
    if (getPageSetting('UseAutoGen')) autoGenerator(); // "Auto Generator ON" (magmite.js)
    ATselectAutoFight();  //  pick the right version of Fight/AutoFight/BetterAutoFight/BAF2 (fight.js)
    if (getPageSetting('DynamicPrestige2')>0&&((getPageSetting('ForcePresZ')<0)||(game.global.world<getPageSetting('ForcePresZ')))) prestigeChanging2(); //"Dynamic Prestige" (dynprestige.js)
    else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value; //just make sure the UI setting and the internal setting are aligned.
    try {
        if (getPageSetting('AutoMagmiteSpender2')==2 && !magmiteSpenderChanged)
            autoMagmiteSpender();   //Auto Magmite Spender (magmite.js)
    } catch (err) {
        debug("Error encountered in AutoMagmiteSpender(Always): " + err.message,"general");
    }
    if (getPageSetting('AutoNatureTokens')) autoNatureTokens();     //Nature - (other.js)
    //
    //Runs any user provided scripts - by copying and pasting a function named userscripts() into the Chrome Dev console. (F12)
    if (userscriptOn) userscripts();
    //rinse, repeat
    return;
}

//GUI Updates happen on this thread, every 1000ms, concurrently
function guiLoop() {
    updateCustomButtons();

    if(autoTrimpSettings['EnhanceGrids'].enabled)
        MODULES["fightinfo"].Update();

    if(typeof MODULES !== 'undefined' && typeof MODULES["performance"] !== 'undefined' && MODULES["performance"].isAFK)
    {
        MODULES["performance"].UpdateAFKOverlay();
    }
}

// Userscript loader. write your own!
var userscriptOn = true;    //controls the looping of userscripts and can be self-disabled
var globalvar0,globalvar1,globalvar2,globalvar3,globalvar4,globalvar5,globalvar6,globalvar7,globalvar8,globalvar9;
//left blank intentionally. the user will provide this. blank global vars are included as an example
function userscripts()
{
    //insert code here:
}
