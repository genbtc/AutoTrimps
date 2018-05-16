// ==UserScript==
// @name         AutoTrimpsV2
// @version      2.2-Sliverz
// @updateURL    https://github.com/slivermasterz/AutoTrimps/AutoTrimps2.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC, Unihedron, coderPatsy, Sliverz
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
var ATversion = '2.2-Sliverz';


////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first, load everything else)///////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
var atscript = document.getElementById('AutoTrimps-script')
    , basepath = 'https://github.com/slivermasterz/AutoTrimps'
    , modulepath = 'modules/'
;
//This should redirect the script to wherever its being mirrored from.
if (atscript !== null) {
    basepath = atscript.src.replace(/AutoTrimps2\.js$/, '');
}
//This could potentially do something one day. like: read localhost url from tampermonkey.
// AKA do certain things when matched on a certain url.
//if (atscript.src.includes('localhost')) {;};

//Script can be loaded like this: ATscriptLoad(modulepath, 'utils.js');
function ATscriptLoad(pathname, modulename) {
    if (modulename == null) debug("Wrong Syntax. Script could not be loaded. Try ATscriptLoad(modulepath, 'example.js'); ");
    var script = document.createElement('script');
    if (pathname == null) pathname = '';
    script.src = basepath + pathname + modulename + '.js';
    script.id = modulename + '_MODULE';
    //script.setAttribute('crossorigin',"use-credentials");
    //script.setAttribute('crossorigin',"anonymous");
    document.head.appendChild(script);
}
//Scripts can be unloaded like this: ATscriptUnload('scryer');
function ATscriptUnload(id) {
    var $link = document.getElementById(id + '_MODULE');
    if (!$link) return;
    document.head.removeChild($link);
    debug("Removing " + id + "_MODULE","other");
}
ATscriptLoad(modulepath, 'utils');    //Load stuff needed to load other stuff:

//This starts up after 2.5 seconds.
function initializeAutoTrimps() {
    loadPageVariables();            //get autoTrimpSettings
    ATscriptLoad('','SettingsGUI');   //populate Settings GUI
    ATscriptLoad('','Graphs');        //populate Graphs
    //Load modules:
    ATmoduleList = ['query', 'portal', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'stance', 'battlecalc', 'maps', 'breedtimer', 'dynprestige', 'fight', 'scryer', 'magmite', 'other', 'import-export', 'client-server', 'perks', /* 'perky', */ 'fight-info', 'performance', 'raiding'];
    for (var m in ATmoduleList) {
        ATscriptLoad(modulepath, ATmoduleList[m]);
    }
    //
    debug('AutoTrimps v' + ATversion + ' Loaded!', '*spinner3');
}

var changelogList = [];

//changelogList.push({date: " ", version: " ", description: "", isNew: true});  //TEMPLATE
changelogList.push({date: "4/15", version: "v2.2.0.1", description: "Raiding with menu added. Filler/Dailies options also added. Now can change between most gear and fastest", isNew: true});
changelogList.push({date: "4/14", version: "v2.2.0", description: "AutoStance and Autofight 3 were added. TrimpScripts code were added to userscript",isNew: false});
changelogList.push({date: "4/2", version: "v2.1.6.9b", description: "Import Export, Modules Load code Improvements. Multiple Buttons/Settings Were Combined. AutoPerks code was changed but still functions the same, except for a new Fast-Allocate algorithm (now with a checkbox) that reduces the time to allocate for high helium players to near-instantaneous. Please test new algo; it might overshoot. You can also clear all perks then allocate and have it work now.  AutoMaps no longer considered as being in Lead challenge during Chall^2.",isNew: false});
changelogList.push({date: "3/23", version: "v2.1.6.9", description: "Game's <u>Map at Zone</u> can be used with AT now, to run maps forever. AutoMaps setting was combined with RunUniqueMaps (variable has changed from boolean false,true to a value 0,1,2). Settings file has been migrated as such. New: Map SpecialMod is sort of working, at least. Geneticist Infinity bugfix. New AGU Settings for 60% Void (fixed). Many Graphs fixes. AutoMaps changes. Equipment Cap, see README at <a target='#' href='https://github.com/genbtc/AutoTrimps/blob/gh-pages/README.md'>GitHub</a> DarkTheme fix. Scientists Fix. Zek450 Perks Preset Changed. Ongoing Development...", isNew: false});
//changelogList.push({date: "3/22", version: "v2.1.6.8", description: "Settings GUI, make better. Import/export improved. Graph buttons: Cycle Up/Down. Internal code fixes. New Graph: Nurseries", isNew: false});
//changelogList.push({date: "3/24", version: "v2.1.6.5-stable", description: "Set up <a target='#' href='https://genbtc.github.io/AutoTrimps-stable'>Stable Repository</a> for the faint of heart.", isNew: true});

function assembleChangelog(date,version,description,isNew) {
    return (isNew)
        ? (`<b class="AutoEggs">${date} ${version} </b><b style="background-color:#32CD32"> New:</b> ${description}<br>`)
        : (`<b>${date} ${version} </b> ${description}<br>`);
}
function printChangelog() {
    var body="";
    for (var i in changelogList) {
        var $item = changelogList[i];
        var result = assembleChangelog($item.date,$item.version,$item.description,$item.isNew);
        body+=result;
    };
    var footer =
        '<b>Ongoing Development</b> - <u>Report any bugs/problems please</u>!\
        <br>Talk with this fork\'s dev: <b>Sliverz#7416</b> @ <a target="#" href="https://discord.gg/0VbWe0dxB9kIfV2C">AutoTrimps Discord Channel</a>\
        <br>See<a target="#" href="https://github.com/genbtc/AutoTrimps/blob/gh-pages/README.md">ReadMe</a> Or check <a target="#" href="https://github.com/slivermasterz/AutoTrimps/commits/gh-pages" target="#">the commit history</a> (if you want).'
        ,   action = 'cancelTooltip()'
        ,   title = 'Script Update Notice<br>' + ATversion
        ,   acceptBtnText = "Thank you for playing AutoTrimps. Accept and Continue."
        ,   hideCancel = true;
    tooltip('confirm', null, 'update', body+footer, action, title, acceptBtnText, null, hideCancel);
}
function printLowerLevelPlayerNotice() {
    tooltip('confirm', null, 'update', 'The fact that it works at all is misleading new players into thinking its perfect. Its not. If your highest zone is under z60, you have not unlocked the stats required, and have not experienced the full meta with its various paradigm shifts. If you are just starting, my advice is to play along naturally and use AutoTrimps as a tool, not a crutch. Play with the settings as if it was the game, Dont expect to go unattended, if AT chooses wrong, and make the RIGHT choice yourself. Additionally, its not coded to run one-time challenges for you, only repeatable ones for helium. During this part of the game, content is king - automating literally removes the fun of the game. If you find that many flaws in the automation exist for you, level up. Keep in mind the challenge of maintaining the code is that it has to work for everyone. AT cant see the future and doesnt run simulations, it exists only in the present moment. Post any suggestions on how it can be better, or volunteer to adapt the code, or produce some sort of low-level player guide with what youve learned.<br>Happy scripting! -genBTC','cancelTooltip()', '<b>LowLevelPlayer Notes:</b><br><b>PSA: </b><u>AutoTrimps was not designed for new/low-level players.</u>', "I understand I am on my own and I Accept and Continue.", null, true);
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
    if (game.achievements.zones.finished < 8)   //z60
        printLowerLevelPlayerNotice();
    //Set some game ars after we load.
    game.global.addonUser = true;
    game.global.autotrimps = true;
    //Actually Start mainLoop and guiLoop
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    setInterval(mainLoop, runInterval);
    setInterval(guiLoop, runInterval*10);
    if (autoTrimpSettings.PrestigeBackup !== undefined && autoTrimpSettings.PrestigeBackup.selected != "")
        document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
    if (document.getElementById('Prestige').value === "")
        document.getElementById('Prestige').value = "Off";

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
var ATmoduleList = [];

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
    if (getPageSetting('WorkerRatios')) workerRatios();  //"Auto Worker Ratios"  (jobs.js)
    if (getPageSetting('BuyUpgrades')) buyUpgrades();    //"Buy Upgrades"       (upgrades.js)
    var agu = getPageSetting('AutoGoldenUpgrades');
    if (agu && agu!='Off') autoGoldenUpgradesAT(agu);    //"Golden Upgrades"     (other.js)
    if (getPageSetting('BuyStorage'))  buyStorage();     //"Buy Storage"     (buildings.js)
    if (getPageSetting('BuyBuildings')) buyBuildings();  //"Buy Buildings"    (buildings.js)
    if (getPageSetting('BuyJobs')) buyJobs();            //"Buy Jobs"            (jobs.js)
    if (getPageSetting('ManualGather2')<=2) manualLabor();  //"Auto Gather/Build"       (gather.js)
    else if (getPageSetting('ManualGather2')==3) manualLabor2();  //"Auto Gather/Build #2"  (")
    getPageSetting('AutoMaps') > 0 ? autoMap() : updateAutoMapsStatus(); //"Auto Maps"      (automaps.js)
    if (getPageSetting('Raiding') > 0) raiding();
    if (getPageSetting('GeneticistTimer') >= 0) autoBreedTimer(); //"Geneticist Timer" / "Auto Breed Timer"     (autobreedtimer.js)
    if (autoTrimpSettings.AutoPortal.selected != "Off") autoPortal();   //"Auto Portal" (hidden until level 40) (portal.js)
    if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap(); //"Trap Trimps"
    if (aWholeNewWorld && getPageSetting('AutoRoboTrimp')) autoRoboTrimp();   //"AutoRoboTrimp" (other.js)
    if (aWholeNewWorld && getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared) finishChallengeSquared(); // "Finish Challenge2" (other.js)
    autoLevelEquipment();           //"Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"  (equipment.js)
    if (getPageSetting('UseScryerStance'))  useScryerStance();  //"Use Scryer Stance"   (scryer.js)
    else if (getPageSetting('AutoStance')<=1) autoStance();     //"Auto Stance"       (autostance.js)
    else if (getPageSetting('AutoStance')===2) autoStance2();    //"Auto Stance #2"         (")
    else if (getPageSetting('AutoStance')===3) autoStance3();   //"Auto Stance #3"         (")
    if (getPageSetting('UseAutoGen')) autoGenerator();          //"Auto Generator ON" (magmite.js)
    ATselectAutoFight();  //  pick the right version of Fight/AutoFight/BetterAutoFight/BAF2 (fight.js)
    var forcePrecZ = (getPageSetting('ForcePresZ')<0) || (game.global.world<getPageSetting('ForcePresZ'));
    if (getPageSetting('DynamicPrestige2')>0 && forcePrecZ) prestigeChanging2(); //"Dynamic Prestige" (dynprestige.js)
    else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value; //just make sure the UI setting and the internal setting are aligned.
    if (getPageSetting('AutoMagmiteSpender2')==2 && !magmiteSpenderChanged)  autoMagmiteSpender();   //Auto Magmite Spender (magmite.js)
    if (getPageSetting('AutoNatureTokens')) autoNatureTokens();     //Nature     (other.js)
    //
    //Runs any user provided scripts, see line 253 below
    if (userscriptOn) userscripts();
    //
    //rinse, repeat, done
    return;
}

//GUI Updates happen on this thread, every 1000ms
function guiLoop() {
    updateCustomButtons();
    //MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    //Store the diff of our custom MODULES vars in the localStorage bin.
    safeSetItems('storedMODULES', JSON.stringify(compareModuleVars()));
    //Swiffy UI/Display tab
    if(getPageSetting('EnhanceGrids'))
        MODULES["fightinfo"].Update();
    if(typeof MODULES !== 'undefined' && typeof MODULES["performance"] !== 'undefined' && MODULES["performance"].isAFK)
        MODULES["performance"].UpdateAFKOverlay();
}

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
        if(getPageSetting('AutoMaps')==1 && !game.upgrades.Battle.done && getPageSetting('AutoMaps') == 0)
            settingChanged("AutoMaps");
        return true; // Do other things
    }
}

// Userscript loader. write your own!
//Copy and paste this function named userscripts() into the JS Dev console. (F12)
var userscriptOn = true;    //controls the looping of userscripts and can be self-disabled
var perked = true;
var resetGenes = false;
//left blank intentionally. the user will provide this. blank global vars are included as an example
function userscripts()
{
    //Misc Features
    if (game.global.world === autoTrimpSettings["VoidMaps"].value && game.global.lastClearedCell >= 80 && getPageSetting('AutoMaps') === 0){
        toggleAutoMaps();
    }
    if (game.global.world === 495 && !resetGenes)
    {
        game.global.genPaused = true;
        numTab('6');
        game.global.firing = true;
        buyJob('Geneticist');
        game.global.firing = false;
        resetGenes = true;
    }

    //Resetting values
    if (game.global.world <= 10 && game.global.dailyChallenge.hasOwnProperty("mirrored")){
        autoTrimpSettings["BuyWeapons"].enabled = false;
    }
    else if (game.global.world===230){
        perked = false;
        resetGenes = false;
        autoTrimpSettings["BuyWeapons"].enabled = true;
        autoTrimpSettings["AutoMaps"].value = 1;
    }
    //AutoAllocate Looting II
    if (!perked && game.global.world !== 230){
        viewPortalUpgrades();
        game.global.lastCustomAmt = 100000;
        numTab(5, true);
        if (getPortalUpgradePrice("Looting_II")+game.resources.helium.totalSpentTemp <= game.resources.helium.respecMax){
            buyPortalUpgrade('Looting_II');
            activateClicked();
            message("Bought 100k Looting II","Notices");
        }
        else{
            perked = true;
            cancelPortal();
            message("Done buying Looting II","Notices");
        }
    }
}


//test.
function throwErrorfromMain() {
    throw new Error("We have successfully read the thrown error message out of the main file");
}
