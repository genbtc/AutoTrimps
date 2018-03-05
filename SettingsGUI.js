//AutoTrimps Settings GUI - Current Version 2.1.6.4
//maintained by genBTC, current as of 3/4/2018

(function () {
    //create the Automation icon in the game bar (self-executing)
    automationMenuInit();
}());

//prepare CSS for new Tab interface
var link1 = document.createElement('link');
link1.rel = "stylesheet";
link1.type = "text/css";
link1.href = basepath + 'tabs.css';
document.head.appendChild(link1);

//Tab make helperfunctions
function createTabs(name, description) {
    var li_0 = document.createElement('li');

    var a_0 = document.createElement('a');
    a_0.className = "tablinks";
    a_0.setAttribute('onclick', 'toggleTab(event, \'' + name + '\')');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode(name));
    li_0.id = 'tab' + name;
    li_0.appendChild(a_0);

    addtabsUL.appendChild(li_0);
    createTabContents(name, description);
}

function createTabContents(name, description) {
    var div_0 = document.createElement('div');
    div_0.className = "tabcontent";
    div_0.id = name;

    var div_1 = document.createElement('div');
    div_1.setAttribute("style", "margin-left: 1vw; margin-right: 1vw;");
    var h4_0 = document.createElement('h4');
    h4_0.setAttribute('style', 'font-size: 1.2vw;');
    h4_0.appendChild(document.createTextNode(description));
    div_1.appendChild(h4_0);

    div_0.appendChild(div_1);

    addTabsDiv.appendChild(div_0);
}

function toggleTab(evt, tabName) {
    //Toggle.
    if (evt.currentTarget.className.indexOf(" active") > -1) {
        document.getElementById(tabName).style.display = "none";
        evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
    } else {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
}

function minimizeAllTabs() {
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0,len = tabcontent.length; i < len ; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0,len = tablinks.length; i < len ; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}
var addTabsDiv;
var addtabsUL;
//Actually Make the Tabs
function initializeAllTabs() {
    //CREATE TABS + CONTENT
    addTabsDiv = document.createElement('div');
    addtabsUL = document.createElement('ul');
    addtabsUL.className = "tab";
    addTabsDiv.appendChild(addtabsUL);
    //Make Tabs.
    createTabs("Core", "Main Controls for the script");
    createTabs("Gear", "Gear = Prestiges / Equipment settings");
    createTabs("Maps", "AutoMaps + VoidMaps related Settings");
    createTabs("Settings", "Sub Controls for the script");
    createTabs("genBTC", "GenBTC Advanced");
    createTabs("Uni", "Uni's mods");
    createTabs("Scryer", "Scryer Stance");
    createTabs("Magma", "Dimensional Generator");
    createTabs("Golden", "Golden Upgrade Strategies");
    createTabs("Nature", "Nature");
    createTabs("Spam", "Controls AutoTrimps message Spam");
    createTabs("Import Export", "Import Export Settings");
    //add a minimize button:
    var li_0 = document.createElement('li');
    var a_0 = document.createElement('a');
    a_0.className = "tablinks minimize";
    a_0.setAttribute('onclick', 'minimizeAllTabs()');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode("Minimize All"));
    li_0.appendChild(a_0);
    li_0.setAttribute("style", "float:right!important;");
    addtabsUL.appendChild(li_0);
    //Insert tabs into the game area
    document.getElementById("autoSettings").appendChild(addTabsDiv);
    //pretend click to make first tab active.
    document.getElementById("Core").style.display = "block";
    document.getElementsByClassName("tablinks")[0].className += " active";
}
initializeAllTabs();

//Actually Make the Settings Buttons
function initializeAllSettings() {
    //START MAKING BUTTONS IN THE TABS:
//CORE:
    createSetting('ManualGather2', ['Gather/Build OFF', 'Auto Gather/Build', 'Science Research OFF', 'Auto Gather/Build #2'], '3-Way Button. Auto Gathering of Food,Wood,Metal(w/turkimp) & Science. Auto speed-Builds your build queue. Now able to turn science researching off for the achievement Reach Z120 without using manual research. Please test the Auto Gather/Build #2, its experimental but should work.', 'multitoggle', 1, null, "Core");
    createSetting('BetterAutoFight', ['Better AutoFight OFF', 'Better Auto Fight 1', 'Better Auto Fight 2'], '3-Way Button, Recommended. Will automatically handle fighting. #2 is the new one, #1 is the old algorithm (if you have any issues). The new BAF#2 does: 3)Click fight anyway if we are dead and stuck in a loop due to Dimensional Generator and we can get away with adding time to it.(RemainingTime + ArmyAdd.Time &lt; GeneTimer) and 4) Clicks fight anyway if we are dead and have &gt;=31 NextGroupTimer and deal with the consequences by firing genetecists afterwards. WARNING: If you autoportal with BetterAutoFight disabled, the game sits there doing nothing until you click FIGHT. (not good for afk) ', 'multitoggle', 1, null, "Core");
    createSetting('AutoStance', ['Auto Stance OFF', 'Auto Stance 1', 'Auto Stance 2'], 'Automatically swap stances to avoid death. Please test the Autostance #2, its very experimental, and in beta.', 'multitoggle', 1, null, "Core");
    createSetting('BuyStorage', 'Buy Storage', 'Will buy storage when resource is almost full. (like AutoStorage, even anticipates Jestimp)', 'boolean', true, null, "Core");
    createSetting('BuyBuildings', 'Buy Buildings', 'Will buy non storage buildings as soon as they are available', 'boolean', true, null, "Core");
    createSetting('BuyUpgrades', 'Buy Upgrades', 'Autobuy non equipment Upgrades', 'boolean', true, null, "Core");
    createSetting('BuyJobs', 'Buy Jobs', 'Buys jobs based on ratios configured below. CAUTION: you cannot manually assign jobs with this. Toggle if you need to.', 'boolean', true, null, "Core");

    createSetting('TrapTrimps', 'Trap Trimps', 'Automatically trap trimps when needed, including building traps. (when you turn off, make sure you also turn off the ingame AutoTraps button)', 'boolean', true, null, "Core");

    createSetting('AutoHeirlooms', 'Auto Heirlooms', 'Automatically evaluate and carry the best heirlooms, and recommend upgrades for equipped items. AutoHeirlooms will only change carried items when the heirlooms window is not open. Carried items will be compared and swapped with the types that are already carried. If a carry spot is empty, it will be filled with the best shield (if available). Evaluation is based ONLY on the following mods (listed in order of priority, high to low): Void Map Drop Chance/Trimp Attack, Crit Chance/Crit Damage, Miner Efficiency/Metal Drop, Gem Drop/Dragimp Efficiency, Farmer/Lumberjack Efficiency. For the purposes of carrying, rarity trumps all of the stat evaluations. Empty mod slots are valued at the average value of the best missing mod.', 'boolean', true, null, "Core");
    createSetting('HireScientists', 'Hire Scientists', 'Enable or disable hiring of scientists. Math: ScientistRatio=(FarmerRatio+LumberjackRatio+MinerRatio)/25 and stops hiring scientists after 250k Farmers.', 'boolean', true, null, "Core");
    createSetting('WorkerRatios', 'Auto Worker Ratios', 'Automatically changes worker ratios based on current progress. WARNING: overrides worker ratio settings. Settings: 1/1/1 up to 300k trimps, 3/3/5 up to 3mil trimps, then 3/1/4 above 3 mil trimps, then 1/1/10 above 1000 tributes, then 1/2/22 above 1500 tributes, then 1/12/12 above 3000 tributes.', 'boolean', true, null, "Core");
    createSetting('ManageBreedtimer', 'Auto Breed Timer', '<u>Genetecist management is controlled by the Timer setting box to the right, not this.</u><br><b>Explanation: </b><br><U>[ON](Green): </U>All this does is auto-choose the appropriate timer for various challenges (0, 3.5s, 10s, 30s).<br><U>[OFF](Red): </U>You set the Timer yourself! Even if this is red, it still tampers with genetecists if the timer is >= 0.<br><b>Note: </b>Using AutoStance is recommended to survive the full 30 seconds or else Auto will probably be undesirable.', 'boolean', true, null, "Core");
    createSetting('GeneticistTimer', 'Geneticist Timer', 'Manages the breed timer by hiring/firing Geneticists for the purpose of setting the ideal anticpation stacks. Disable with -1 to disable the Hiring/Firing of geneticists. <br><b>Info:</b> Potency and Nursery buying behavior is adjusted dynamically (and disabling no longer disables potency). The Automatic Genetecist Hiring Process can best be summarized by: Buy/Wait/Die,Repeat. (if you do not die, no action is taken). Also self-kills (trimpicide) aka force abandon when your anti-stacks arent maxed out (conservatively).<p><B>Controlled automatically (locked) when Auto Breed Timer is on</B>.', 'value', '30', null, "Core");
    createSetting('AutoPortal', 'Auto Portal', 'Automatically portal. Will NOT auto-portal if you have a challenge active, the challenge setting dictates which challenge it will select for the next run. All challenge settings will portal right after the challenge ends, regardless. Helium Per Hour only <b>portals at cell 1</b> of the first level where your He/Hr went down even slightly compared to the current runs Best He/Hr. Take note, there is a Buffer option, which is like a grace percentage of how low it can dip without triggering. Setting a buffer will portal mid-zone if you exceed 5x of the buffer.  CAUTION: Selecting He/hr may immediately portal you if its lower-(use Pause AutoTrimps button to pause the script first to avoid this)', 'dropdown', 'Off', ['Off', 'Helium Per Hour', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Custom'], "Core");
    createSetting('HeliumHourChallenge', 'Challenge for Helium per Hour and Custom', 'Automatically portal into this challenge when using helium per hour or custom autoportal. Custom portals after cell 100 of the zone specified. ', 'dropdown', 'None', ['None', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted'], "Core");
    document.getElementById("HeliumHourChallengeLabel").innerHTML = "Challenge:";
    createSetting('CustomAutoPortal', 'Custom Portal', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '200', null, "Core");
    createSetting('HeHrDontPortalBefore', 'He/Hr Dont Portal Before', 'Do NOT allow Helium per Hour AutoPortal setting to portal BEFORE this level is reached. It is an additional check that prevents drops in helium/hr from triggering autoportal. Set to 0 or -1 to completely disable this check.', 'value', '200', null, "Core");
    createSetting('HeliumHrBuffer', 'He/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the He/Hr Autoportal, it will portal if your He/Hr drops by this amount of % lower than your best for current run, default is 0% (ie: set to 5 to portal at 95% of your best). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Core');
    createSetting('AutoFinishDaily', 'Auto Finish Daily', 'With this on, the He/Hr Portal and Custom Auto Portal options will auto-finish the daily <b>whenever they trigger</b> and THEN portal you.', 'boolean', false, null, 'Core');
    createSetting('AutoFinishDailyZone', 'Finish Daily Zone Mod', 'Finish Daily by this # of zones earlier/later than your regular Custom AutoPortal zone or your Helium Dont Portal Before zone. When Auto Finish Daily is on. Tip: Tune your value of He/HrDontPortalBefore to suit the daily, and then tune this. Can accept negative numbers for earlier, ie: -7 means portal 7 zones earlier than normal. Can also use positive numbers to DELAY portaling for later. When used with He/Hr AutoPortal, the number of zones early does not FORCE end the daily at that zone, only ALLOW it to end that early: it will Always end when your HE/hr drops enough to trigger the portal. <b>Use 0 to disable.</b>', 'valueNegative', -2, null, 'Core');
    createSetting('AutoStartDaily', 'Auto Start Daily', 'With this on, the Auto Portal options will portal you into and auto-start the daily <b>whenever available</b>. Does Yesterday first, followed by Today. Falls back to selected challenge when both are complete.', 'boolean', false, null, 'Core');
    createSetting('PauseScript', 'Pause AutoTrimps', 'Pause AutoTrimps Script (not including the graphs module)', 'boolean', null, null, 'Core');
    document.getElementById('PauseScript').parentNode.style.setProperty('float','right');
    document.getElementById('PauseScript').parentNode.style.setProperty('margin-right','1vw');
    document.getElementById('PauseScript').parentNode.style.setProperty('margin-left','0');

//GEAR:
    createSetting('BuyArmor', 'Buy Armor', 'Auto-Buy/Level-Up the most cost efficient armor available. ', 'boolean', true, null, "Gear");
    createSetting('BuyArmorUpgrades', 'Buy Armor Upgrades', '(Prestiges) & Gymystic. Will buy the most efficient armor upgrade available. ', 'boolean', true, null, "Gear");
    createSetting('BuyWeapons', 'Buy Weapons', 'Auto-Buy/Level-Up the most cost efficient weapon available. ', 'boolean', true, null, "Gear");
    createSetting('BuyWeaponUpgrades', 'Buy Weapon Upgrades', '(Prestiges) Will buy the most efficient weapon upgrade available. ', 'boolean', true, null, "Gear");
    createSetting('BuyShieldblock', 'Buy Shield Block', 'Will buy the shield block upgrade. CAUTION: If you are progressing past zone 60, you probably don\'t want this :)', 'boolean', false, null, "Gear");
    createSetting('Prestige', 'Prestige', 'Acquire prestiges through the selected item (inclusive) as soon as they are available in maps. Forces equip first mode. Automap must be enabled. THIS IS AN IMPORTANT SETTING related to speed climbing and should probably always be on something. If you find the script getting stuck somewhere, particularly where you should easily be able to kill stuff, setting this to an option lower down in the list will help ensure you are more powerful at all times, but will spend more time acquiring the prestiges in maps.', 'dropdown', 'Polierarm', ['Off', 'Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'], "Gear");
    //Make a backup of the prestige setting: backup setting grabs the actual value of the primary setting any time it is changed, (line 784 of the function settingChanged())
    var lastSetting = autoTrimpSettings["PrestigeBackup"];
    autoTrimpSettings["PrestigeBackup"] = {
        selected: (lastSetting != undefined ? lastSetting.selected : autoTrimpSettings["Prestige"].selected ) || "Off",
        id: "PrestigeBackup",
        name: "PrestigeBackup"
    };
    createSetting('DynamicPrestige2', 'Dynamic Prestige z', 'Dynamic Prestige: <b>Set Target Zone number: Z #. (disable with 0 or -1)</b><br> Skip getting prestiges at first, and Gradually work up to the desired Prestige setting you have set (set the Prestige dropdown to the highest weapon you want to end up on at the target zone you set here). Runs with Dagger to save a significant amount of time until we need better gear, then starts increasing the prestige setting near the end of the run.  Examines which prestiges you have, how many missing ones youd need to achieve the desired target and starts running maps every zone (more maps for higher settings), Until the target prestige is reached. ', 'value', -1, null, 'Gear');
    createSetting('PrestigeSkipMode', 'Prestige Skip Mode', 'If there are more than 2 Unbought Prestiges (besides Shield), ie: sitting in your upgrades window but you cant afford them, AutoMaps will not enter Prestige Mode, and/or will exit from it. The amount of unboughts can be configured with this variable MODULES[\\"automaps\\"].SkipNumUnboughtPrestiges = 2;', 'boolean', false, null, "Gear");
    createSetting('AlwaysArmorLvl2', 'Always Buy Lvl 2 Armor', 'Always Buy the 2nd point of Armor even if we dont need the HP. Its the most cost effective level, and the need HP decision script isnt always adequate. Forced on during Spire. Recommended On.', 'boolean', true, null, 'Gear');
    createSetting('WaitTill60', 'Skip Gear Level 58&59', 'Dont Buy Gear during level 58 and 59, wait till level 60, when cost drops down to 10%.', 'boolean', true, null, 'Gear');
    createSetting('DelayArmorWhenNeeded', 'Delay Armor', 'Delays buying armor prestige-upgrades during Want More Damage or Farming automap-modes, Although if you need health AND damage, it WILL buy armor prestiges tho.', 'boolean', null, null, 'Gear');
    //migrate old CapEquip to new CapEquip2
    if (autoTrimpSettings["CapEquip2"] === undefined && autoTrimpSettings["CapEquip"]) {
        createSetting('CapEquip2', 'Cap Equip to', 'Do not level equipment past this number. Helps for early game when the script wants to level your tier2s to level 40+, or to stop wasting metal. Recommended value: 10, Disable with -1 or 0.', 'value', -1, null, 'Gear');
        setPageSetting("CapEquip2",10 * autoTrimpSettings["CapEquip"].enabled);
    } else {
        createSetting('CapEquip2', 'Cap Equip to', 'Do not level equipment past this number. Helps for early game when the script wants to level your tier2s to level 40+, or to stop wasting metal. Recommended value: 10, Disable with -1 or 0.', 'value', -1, null, 'Gear');
    }

//AutoMaps + VoidMaps settings:
    createSetting('AutoMaps', 'Auto Maps', 'Recommended. Automatically run maps to progress. Very Important. Has multiple modes: <b>Prestige, Voids, Want more Damage, Want more Health, Want Health & Damage, and Farming.</b>Prestige takes precedence and does equal level maps until it gets what is needed as per Autotrimps Prestige dropdown setting. Voids is self explanatory: use the Void Difficulty Check setting to control the amount of farming. If \'want more damage\', it will only do 10 maps for 200% mapbonus damage bonus. If \'Farming\', it does maps beyond 10 if the displayed number is over >16x. \'Want more health[or and damage]\' is basically just a status message telling you need more health, theres not much that can be done besides tell AutoLevelEquipment to keep buying stuff. If you \'want health\' but your damage is OK to continue, invest in more HP perks.', 'boolean', true, null, "Maps");
    createSetting('RunUniqueMaps', 'Run Unique Maps', 'Relies on AutoMaps. Decides when to run Unique maps. <b>Required to auto-run The Wall and Dimension of Anger.</b> Also Required for challenges: Electricity, Mapocalypse, Meditate, and Crushed (etc) to complete their AutoPortal. <p> Maps/Levels: <br>The Block - 12<br>The Wall - 16<br>Dimension of Anger - 21<br>Trimple Of Doom - 34<br>The Prison - 82<br>Bionic Wonderland (only during Crushed) @ 127<br><b>NOTE:</b> This should generally be on.<br><B>NOTE:</B> Disable Run Bionic Before Spire to be able to disable this. <br><b>NOTICE:</b> This does <b>NOT</b> auto-run all your Bionics according to your lack of Robotrimp status or whether you pass a certain level (yet).', 'boolean', true, null, "Maps");
    createSetting('DynamicSiphonology', 'Dynamic Siphonology', 'Recommended Always ON. Use the right level of siphonology based on your damage output. IE: Only uses  siphonology if you are weak. With this OFF it means it ALWAYS uses the lowest siphonology map you can create. Siphonology is a perk you get at level 115-125ish, and means you receive map bonus stacks for running maps below your current zone - Up to 3 zones below (1 per perk level).', 'boolean', true, null, 'Maps');
    createSetting('LowerFarmingZone', 'Lower Farming Zone', 'Lowers the zone used during Farming mode. Uses the dynamic siphonology code, to Find the minimum map level you can successfully one-shot, and uses this level for any maps done after the first 10 map stacks. The difference being it goes LOWER than what Siphonology gives you map-bonus for, but after 10 stacks you dont need bonus, you just want to do maps that you can one-shot. Goes as low as 10 below current zone if your damage is that bad, but this is extreme and indicates you should probably portal.', 'boolean', true, null, 'Maps');
    createSetting('MaxMapBonusAfterZone', 'Max MapBonus After', 'Always gets Max Map Bonus from this zone on. (inclusive and after).<br><b>NOTE:</b> Set -1 to disable entirely (default). Set 0 to use it always.<br><b>Advanced:</b>User can set a lower number than the default 10 maps with the AT hidden console command: MODULES[\\"automaps\\"].maxMapBonusAfterZ = 9;', 'value', '-1', null, 'Maps');    
    createSetting('MaxStacksForSpire', 'Max Map Bonus for Spire', 'Get max map bonus before running the Spire.', 'boolean', false, null, 'Maps');
    createSetting('MinutestoFarmBeforeSpire', 'Minutes to Farm Before Spire', 'Farm level 200/199(or BW) maps for X minutes before continuing onto attempting Spire.<br><b>NOTE:</b> Set 0 to disable entirely (default). <br>Setting to -1/Infinite does not work here, set a very high number instead.', 'value', '0', null, 'Maps');
    createSetting('IgnoreSpiresUntil', 'Ignore Spires Until', 'Spire specific settings like end-at-cell are ignored until at least this zone is reached (0 to disable).<br>Does not work with Run Bionic Before Spire.', 'value', '200', null, 'Maps');
    createSetting('RunBionicBeforeSpire', 'Run Bionic Before Spire', 'CAUTION:  Runs Bionic Wonderlands and repeatedly farms Bionic VI @ level 200 before attempting Spire, for the purpose of resource farming. Then it attempts the spire. The Minutes-Before-Spire timer runs concurrently to this, and <b>needs</b> to be set. If not set, it will exit without doing any Bionics... You can un-toggle it on the fly. <br><b>NOTE:</b> Turning this on also mandates that Run Unique Maps be on. <br><b>WARNING:</b> These 100 square maps take ~3x longer than normal maps. <br><b>WARNING:</b> If you dont have Bionic Magnet mastery, this will run the 5 pre-requisites and take longer.<br><b>NOTE:</b> In fact, it may not be what you want at all.', 'boolean', null, null, 'Maps');
    createSetting('ExitSpireCell', 'Exit Spire After Cell', 'Optional/Rare. Exits the Spire early, after completing cell X. example: 40 for Row 4. (use 0 or -1 to disable)', 'value', '-1', null, 'Maps');
    createSetting('CorruptionCalc', 'Corruption Farm Mode', 'Recommended. Enabling this will cause the Automaps routine to take amount of corruption in a zone into account, to decide whether it should do maps first for map bonus. ONLY in Zone 181+ (or Headstart 1,2,3 zone: 176,166,151) ', 'boolean', true, null, 'Maps');
    createSetting('FarmWhenNomStacks7', 'Farm on >7 NOMstacks', 'Optional. If Improbability already has 5 NOMstacks, stack 30 Anticipation. If the Improbability has >7 NOMstacks on it, get +200% dmg from MapBonus. If we still cant kill it, enter Farming mode at 30 stacks, Even with DisableFarming On! (exits when we get under 10x). Farms if we hit 100 stacks in the world. If we ever hit (100) nomstacks in a map (likely a voidmap), farm, (exit the voidmap) and (prevent void from running, until situation is clear). Restarts any voidmaps if we hit 100 stacks. ', 'boolean', null, null, 'Maps');
    createSetting('VoidMaps', 'Void Maps', 'The zone at which you want all your void maps to be cleared (Cell 96).  0 is off', 'value', '0', null, "Maps");
    createSetting('RunNewVoids', 'Run New Voids', 'Run new void maps acquired after the set void map zone. Runs them at Cell 95 by default, unless you set a decimal value indicating the cell, like: 187.75  CAUTION: May severely slow you down by trying to do too-high level voidmaps. Use the adjacent RunNewVoidsUntil setting to limit this.', 'boolean', null, null, 'Maps');
    createSetting('RunNewVoidsUntil', 'New Voids Until', 'Run New Voids Until: Put a cap on what zone new voids will run at, until this zone, inclusive. ', 'value', '-1', null, 'Maps');
    //createSetting('VoidsPerZone', 'Voids per Zone', 'Run a max of this many Voids per zone, if you have a lot of Voids saved up. Then moves onto the next zone and does more voids.', 'value', '-1', null, 'Maps');
    createSetting('VoidCheck', 'Void Difficulty Check', 'How many hits to be able to take from a void map boss in X stance before we attempt the map. Higher values will get you stronger (by farming maps for health) before attempting. Disabling this with 0 or -1 translates into a default of surviving 2 hits. I recommend somewhere between 2 and 12 (default is now 6).', 'value', '6', null, 'Maps');
    createSetting('MaxTox', 'Max Toxicity Stacks', 'Get maximum toxicity stacks before killing the improbability in each zone 60 and above. Generally only recommended for 1 run to maximize bone portal value. This setting will revert to disabled after a successful Max-Tox run + Toxicity Autoportal.', 'boolean', null, null, 'Maps');
    createSetting('DisableFarm', 'Disable Farming', 'Disables the extended farming algorithm of the AutoMaps part of the script. Always returns to the world after reaching 10 map stacks. Use at your own risk. (No need to refresh anymore)', 'boolean', null, null, 'Maps');

//Settings:
    createSetting('FarmerRatio', 'Farmer Ratio', '', 'value', '1', null, "Settings");
    createSetting('LumberjackRatio', 'Lumberjack Ratio', '', 'value', '1', null, "Settings");
    createSetting('MinerRatio', 'Miner Ratio', '', 'value', '1', null, "Settings");
    createSetting('MaxScientists', 'Max Scientists', 'Advanced. Cap your scientists. recommend: -1 (infinite still controls itself)', 'value', '-1', null, "Settings");
    createSetting('MaxExplorers', 'Max Explorers', 'Advanced. Cap your explorers. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('MaxTrainers', 'Max Trainers', 'Advanced. Cap your trainers. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('MaxHut', 'Max Huts', 'Huts', 'value', '100', null, "Settings");
    createSetting('MaxHouse', 'Max Houses', 'Houses', 'value', '100', null, "Settings");
    createSetting('MaxMansion', 'Max Mansions', 'Mansions', 'value', '100', null, "Settings");
    createSetting('MaxHotel', 'Max Hotels', 'Hotels', 'value', '100', null, "Settings");
    createSetting('MaxResort', 'Max Resorts', 'Resorts', 'value', '100', null, "Settings");
    createSetting('MaxGateway', 'Max Gateways', 'WARNING: Not recommended to raise above 25', 'value', '25', null, "Settings");
    createSetting('MaxWormhole', 'Max Wormholes', 'WARNING: Wormholes cost helium! Values below 0 do nothing.', 'value', '0', null, "Settings");
    createSetting('MaxCollector', 'Max Collectors', 'recommend: -1', 'value', '-1', null, "Settings");
    createSetting('FirstGigastation', 'First Gigastation', 'How many warpstations to buy before your first gigastation', 'value', '20', null, "Settings");
    createSetting('DeltaGigastation', 'Delta Gigastation', 'How many extra warpstations to buy for each gigastation. Supports decimal values. For example 2.5 will buy +2/+3/+2/+3...', 'value', '2', null, "Settings");
    createSetting('MaxGym', 'Max Gyms', 'Advanced. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('MaxTribute', 'Max Tributes', 'Advanced. recommend: -1 ', 'value', '-1', null, "Settings");
    createSetting('MaxNursery', 'Max Nurseries', 'Advanced. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('BreedFire', 'Breed Fire', 'OPTIONAL. Fire Lumberjacks and Miners to speed up breeding when needed. Basically trades wood/metal to cut the wait between deaths down. Disclaimer: May heavily negatively impact wood-gathering. ', 'boolean', null, null, 'Settings');
    createSetting('AutoMagmamancers', ['Magmamancers Off', 'Magmamancers After 10', 'Magmamancers Always'], 'OPTIONAL. Auto Magmamancer Management. Hires Magmamancers when the Current Zone time goes over 10 minutes. Does a one-time spend of at most 10% of your resources. Every increment of 10 minutes after that repeats the 10% hiring process. Disclaimer: May negatively impact Gem count.', 'multitoggle', 0, null, 'Settings');
    createSetting('AutoMagmamancersZone', 'Magmamancer after Zone', 'Only buys Magmamancers if you are on this Zone or higer', 'value', '0', null, "Settings");

//genBTC advanced settings - option buttons.
    createSetting('WarpstationCap', 'Warpstation Cap', 'Do not level Warpstations past Basewarp+DeltaGiga **. Without this, if a Giga wasnt available, it would level infinitely (wastes metal better spent on prestiges instead.) **The script bypasses this cap each time a new giga is bought, when it insta-buys as many as it can afford (since AT keeps available metal/gems to a low, overbuying beyond the cap to what is affordable at that first moment is not a bad thing). ', 'boolean', true, null, 'genBTC');
    createSetting('WarpstationWall3', 'Warpstation Wall', 'Conserves Metal. Only buys 1 Warpstation when you can afford <b>X</b> warpstations metal cost (at the first one\'s price, simple math). -1, 0, 1 = disable. In other words, only allows warps that cost less than 1/nth your currently owned metal. (to save metal for prestiges)', 'value', -1, null, 'genBTC');
    createSetting('WarpstationCoordBuy', 'Buy Warp to Hit Coord', 'If we are very close to hitting the next coordination, and we can afford the warpstations it takes to do it, Do it! (even if we are over the Cap/Wall). Recommended with WarpCap/WarpWall. (has no point otherwise) ', 'boolean', true, null, 'genBTC');
    createSetting('AutoRoboTrimp', 'AutoRoboTrimp', 'Use RoboTrimps ability starting at this level, and every 5 levels thereafter. (set to 0 to disable. default 60.) 60 is a good choice for mostly everybody.', 'value', '60', null, 'genBTC');
    createSetting('AutoHeirlooms2', 'Auto Heirlooms2', 'IMPORTANT SETTING. New algorithm for Heirlooms. While enabled, the old AutoHeirlooms algorithm will be disabled (the button will stay lit or you can turn that one off). CAUTION: Turning this on will immediately re-sort your heirlooms according to the new algorithm, and turning it off again DOES revert to the original algorithm even though it may NOT have a visible result on your heirlooms. (fyi: This lack of action highlights one of the problems with the old one.) ', 'boolean', null, null, 'genBTC');
    createSetting('AutoUpgradeHeirlooms', 'Auto Upgrade Heirlooms', 'Automatically buys the upgrades the script advises for the Equipped shield and staff, until we are out of nullifium.', 'boolean', null, null, 'genBTC');
    createSetting('TrainerCaptoTributes', 'Cap Trainers to a % of Tributes', 'Only Buy a Trainer when its cost is LESS than X% of cost of a tribute. This setting can work in combination with the other one, or set the other one to -1 and this will take full control. Default: -1 (Disabled). 50% is close to the point where the cap does nothing. You can go as low as you want but recommended is 10% to 1%. (example: Trainer cost of 5001, Tribute cost of 100000, @ 5%, it would NOT buy the trainer.)', 'value', '-1', null, 'genBTC');
    createSetting('NoNurseriesUntil', 'No Nurseries Until z', 'For Magma z230+ purposes. Nurseries get shut down, and wasting nurseries early on is probably a bad idea. Might want to set this to 230+ for now. Can use combined with the old Max Nurseries cap setting.', 'value', -1, null, 'genBTC');
    createSetting('ForceAbandon', 'Auto Force-Abandon', '(Trimpicide). If a new fight group is available and anticipation stacks arent maxed, force abandon and grab a new group. Located in the geneticist management script.', 'boolean', true, null, 'genBTC');
    createSetting('GymWall', 'Gym Wall', 'Conserves Wood. Only buys 1 Gym when you can afford <b>X</b> gyms wood cost (at the first one\'s price, simple math). -1 or 0 to disable. In other words, only allows gyms that cost less than 1/nth your currently owned wood. (to save wood for nurseries for new z230+ Magma nursery strategy). Takes decimal numbers. (Identical to the Warpstation wall setting which is why its called that). Setting to 1 does nothing besides stopping gyms from being bought 2 at a time due to the mastery.', 'value', -1, null, 'genBTC');
    createSetting('DynamicGyms', 'Dynamic Gyms', 'Designed to limit your block to slightly more than however much the enemy attack is. If MaxGyms is capped or GymWall is set, those will still work, and this will NOT override those (works concurrently), but it will further limit them. In the future it may override, but the calculation is not easy to get right so I dont want it undo-ing other things yet. EXPERIMENTAL.', 'boolean', false, null, 'genBTC');
    createSetting('AutoAllocatePerks', 'Auto Allocate Perks', 'EXPERIMENTAL. Uses the AutoPerks ratio based preset system to automatically allocate your perks to spend whatever helium you have when you AutoPortal. ', 'boolean', false, null, 'genBTC');
    createSetting('SpireBreedTimer', 'Spire Breed Timer', 'Set a different breed timer target for the Spire. Use -1 to disable this special setting.', 'value', -1, null, 'genBTC');
    createSetting('UsePatience', 'Enable Patience', 'Sets the default breed timer to 45 seconds if you have the Patience mastery.', 'boolean', true, null, 'genBTC');

// Uni's mods
    createSetting('ManualCoords', 'Don\'t buy Coords', 'Enable it if you know what you\'re doing, disable it if you don\'t know what you\'re doing. For when manually handling coords means a lot on challenges like Trapper.', 'boolean', false, null, 'Uni');
    createSetting('TrimpleZ', 'Trimple Z', 'I don\'t really think doing this automatically is a good idea. You might want to farm for a bit before this, but I\'m not sure if it\'s meaningful at all to make a \'farm X minutes before trimple\' parameter to go along with it. Set it to the zone you want and it will run Trimple of Doom for Ancient Treasure AFTER farming and getting map stacks. If it is a negative number, this will be disabled after a successful run so you can set it differently next time.', 'valueNegative', 0, null, 'Uni');
    createSetting('ScryerDieZ', 'Scryer Suicide Z', 'You know, Die To Use S is helpful and all, but sometimes it doesn\'t matter in early zones. Don\'t you think so? That was a rhetorical question, don\'t answer it. Like Void Maps config, you can put a decimal value for cell, like 230.60 for after zone 230 for >= 60th cell.', 'value', 230.60, null, 'Uni');
    createSetting('IgnoreCrits', ['Safety First', 'Ignore Void Strength', 'Ignore All Crits'], 'No longer switches to B against corrupted precision and/or void strength. <b>Basically we now treat \'crit things\' as regular in both autoStance and autoStance2</b>. In fact it no longer takes precision / strength into account and will manage like a normal enemy, thus retaining X / D depending on your needs. If you\'re certain your block is high enough regardless if you\'re fighting a crit guy in a crit daily, use this! Alternatively, manage the stances yourself.', 'multitoggle', 0, null, 'Uni');
    createSetting('ForcePresZ', 'Force Prestige Z', 'On and after this zone is reached, always try to prestige for everything immediately, ignoring Dynamic Prestige settings and overriding that of Linear Prestige. Prestige Skip mode will exit this. Disable with -1.', 'value', -1, null, 'Uni');
    createSetting('PreferMetal', 'Prefer Metal Maps', 'Always prefer metal maps, intended for manual use, such as pre-spire farming. Remember to turn it back off after you\'re done farming!', 'boolean', false, null, 'Uni');
    createSetting('PreSpireNurseries', 'Nurseries pre-Spire', 'Set the maximum number of Nurseries to build for Spires. Overrides No Nurseries Until z and Max Nurseries so you can keep them seperate! Will build nurseries before z200 for Spire 1, but only on the zone of Spires 2+ to avoid unnecessary burning. Disable with -1.', 'value', -1, null, 'Uni');
    createSetting('FinishC2', 'Finish Challenge2', 'Finish / Abandon Challenge2 (any) when this zone is reached, if you are running one. For manual use. Recommended: Zones ending with 0 for most challenges. Disable with -1.', 'value', -1, null, 'Uni');
    createSetting('PowerSaving', ['Don\'t care', 'Power Saving', 'Only Rush Voids'], 'Avoid killing your army impatiently. Don\'t force abandon trimps when prestiging. Will still Die To Use Z and aggressively autostance to aid progression and anything else. Made for Empower daily, you might find it helpful if you\'re doing Workplace Safety feat. Then again with that I strongly recommend doing it fully manually. Anyway, don\'t blame me whatever happens. Only Rush Voids will allow considering abandoning, not force one. <b>Note:</b> AT will no longer be able to fix when your scryer gets stuck!', 'multitoggle', 0, null, 'Uni');
    createSetting('PrestigeSkip2', 'Prestige Skip 2', 'If there are 2 or fewer <b>Unobtained Weapon Prestiges in maps</b>, ie: there are less than 2 types to run for, AutoMaps will not enter Prestige Mode, and/or will exit from it. For users who tends to not need the last few prestiges due to resource gain not keeping up. The amount of unboughts can be configured with MODULES.automaps.UnearnedPrestigesRequired. If PrestigeSkipMode is enabled, both conditions need to be reached before exiting.', 'boolean', false, null, 'Uni');
    if (game.worldUnlocks.easterEgg)
        createSetting('AutoEggs', 'AutoEggs', 'Click easter egg if it exists, upon entering a new zone. Warning: Quite overpowered. Please solemnly swear that you are up to no good.', 'boolean', false, null, 'Uni');

// Scryer settings
    createSetting('UseScryerStance', 'Use Scryer Stance', '<b>MASTER BUTTON</b> Stay in Scryer stance in z181 and above (Overrides Autostance). Falls back to regular Autostance when not in use (so leave that on). Get 2x resources or Dark Essence. <u>All other buttons have no effect if this one is off.</u>', 'boolean', true, null, 'Scryer');
    createSetting('ScryerUseWhenOverkill', 'Use When Overkill', 'Use when we can Overkill in S stance, for double loot with no speed penalty. Recommend this be on. <b>NOTE:</b> This being on, and being able to overkill in S will override ALL other settings <u>(Except never use in spire)</u>. This is a boolean logic shortcut that disregards all the other settings including Min and Max Zone. If you ONLY want to use S during Overkill, as a workaround: turn this on and Min zone: to 9999 and everything else off(red). ', 'boolean', true, null, 'Scryer');
    createSetting('ScryerMinZone', 'Min Zone', 'Minimum zone to start using scryer in.(inclusive) Recommend:(60 or 181). This needs to be On & Valid for options other than Overkill to work. Tip: Use 9999 to disable all other Non-Overkill scryer usage.', 'value', '181', null, 'Scryer');
    createSetting('ScryerMaxZone', 'Max Zone', 'Zone to STOP using scryer at.(not inclusive) Recommend: Leave off (0 or -1 to disable: doesnt prevent options other than Overkill from working.) Positive numbers DO disable it past that zone. ', 'value', '230', null, 'Scryer');
    createSetting('ScryerUseinMaps2', ['Maybe Use in Maps', 'Force Use in Maps'], 'Maybe/Force Use in Maps. Overkill overrides this setting. Does not have to be on for Overkill Button to use S in maps. (Obeys zone settings)', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerUseinVoidMaps2', ['Maybe Use in VoidMaps', 'Force Use in VoidMaps', 'Never Use in VoidMaps'], 'Maybe/Force/Never Use in Void Maps. <b>Never WILL override the Overkill setting, and never use S in Void Maps.</b> Maybe means default - treat Void Maps like any other cell (something else has to be ON to trigger Scryer). Force = Always use S.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerUseinSpire2', ['Maybe Use in Spire', 'Force Use in Spire', 'Never Use in Spire'], 'Maybe/Force/Never Use in Spire. <b>Never WILL override the Overkill setting, and never use S in Spire.</b> Maybe means default - treat Spire like any other cell (something else has to be ON to trigger Scryer). Force = Always use S.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerSkipBoss2', ['Default on Cell 100', 'Never Use on Cell 100 above VoidLevel', 'Never Use on Cell 100 (ALL Levels)'], 'On cell 100: Default/Never Use(above VoidLevel)/Never Use(ALL Levels). Overkill overrides this setting. Doesnt use Scrying stance for world Improbabilities/Bosses (cell 100) if you are past the level you have your VoidMaps set to run at. (or all levels, if set.) Default treats cell 100 like any other cell.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerSkipCorrupteds2', ['Maybe Use S on Corrupteds', 'Dont Use S on Corrupteds'], 'Overkill overrides this setting, even on Dont Use. Turning this Green doesnt use S stance for corrupted cells UNLESS you can overkill them. Red/Maybe just means default (corrupteds are treated like normal cells), so something else has to be ON to trigger Scryer to be used. <b>Magma maps and Corrupted Voidmaps are classified under this box as corrupted</b> and Green-DontUse here will override the ForceMaps/ForceVoidmaps (for now)', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerDieToUseS', 'Die To Use S', 'Turning this on will switch you back to S even when doing so would kill you. Happens in scenarios where you used Skip Corrupteds that took you into regular Autostance X/H stance, killed the corrupted and reached a non-corrupted enemy that you wish to use S on, but you havent bred yet and you are too low on health to just switch back to S. So youd rather die, wait to breed, then use S for the full non-corrupted enemy, to maximize DE. This feature was added for 1 person, use at your own risk.', 'boolean', false, null, 'Scryer');

// Dimensional Generator settings:
    createSetting('UseAutoGen', ['Auto Generator OFF', 'Auto Generator ON'], '<b>MASTER BUTTON</b> Dynamically switch generator modes. Required for the following mode management configurations to work. The Dimensional Generator is a building unlocked in The Magma, from z230.', 'multitoggle', 0, null, 'Magma');
    createSetting('AutoGen2', ['Default', 'Microtick', 'Max Cap', 'Overclock'], 'Before Z is reached, Microtick and Max Cap will switch between [Hybrid / Gain Fuel] to get EXACTLY one / FULL stacks of Capacity (not Storage) before using [Gain Mi]. Default will respect whatever you set it to and won\'t fiddle with it unless challenge overriding is on. Overclock will Gain Fuel until Z.', 'multitoggle', 2, null, 'Magma');
    createSetting('AutoGen2End', 'End Early Mode Z', 'On and after Z, be done with the mode we start with and switch to the final mode. -1 to disable.', 'value', 300, null, 'Magma');
    createSetting('AutoGen2SupplyEnd', 'End at Supply', 'On and after the zone for gathering the most magma by Supply, end Early Mode. Works alongside AutoGen2End and will end when either condition is met.', 'boolean', false, null, 'Magma');
    createSetting('AutoGen3', ['Gain Mi', 'Gain Fuel', 'Hybrid'], 'Mode to use after Z / SupplyEnd.', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGenDC', ['Daily: Normal', 'Daily: Fuel', 'Daily: Hybrid'], 'Use a special mode in dailies to make the most out of it. Overrides AutoGen3 unless Strong Override is on.', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGenC2', ['c2: Normal', 'c2: Fuel', 'c2: Hybrid'], 'Use a special mode when running challenge2s to make the most out of it. Overrides AutoGen3 unless Strong Override is on.', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGen2Override', ['Override Final Only', 'Strong Override'], 'Overrides apply to the final mode (always use early mode), or also to early mode (will stop microtick etc). Normal will not change anything.', 'multitoggle', 1, null, 'Magma');

    document.getElementById('AutoGen2Override').parentNode.insertAdjacentHTML('afterend','<hr>');
    createSetting('MagmiteExplain', 'Magmite spending behaviour', '1. Buy one-and-done upgrades, expensive first, then consider 1st level of Overclocker;<br>2. Buy Overclocker IF AND ONLY IF we can afford it;<br>2.5. Exit if OneTimeOnly<br>3. Buy Efficiency if it is better than capacity;<br>4. Buy Capacity or Supply depending on which is cheaper, or based on SupplyWall', 'infoclick', 'MagmiteExplain', null, 'Magma');
    createSetting('AutoMagmiteSpender2', ['Spend Magmite OFF', 'Spend Magmite (Portal)', 'Spend Magmite Always'], 'Auto Spends any unspent Magmite immediately before portaling. (Or Always, if toggled). Part 1 buys any permanent one-and-done upgrades in order from most expensive to least. Part 2 then analyzes Efficiency vs Capacity for cost/benefit, and buys Efficiency if its BETTER than Capacity. If not, if the PRICE of Capacity is less than the price of Supply, it buys Capacity. If not, it buys Supply. And then it repeats itself until you run out of Magmite and cant buy anymore. For Magma z230+ purposes.', 'multitoggle', 1, null, 'Magma');
    createSetting('SupplyWall', 'Throttle Supply (or Capacity)', 'Positive number NOT 1 e.g. 2.5: Consider Supply when its cost * 2.5 is < Capacity, instead of immediately when < Cap. Effectively throttles supply for when you don\'t need too many.<br><br>Negative number (-1 is ok) e.g. -2.5: Consider Supply if it costs < Capacity * 2.5, buy more supplys! Effectively throttling capacity instead.<br><br><b>Set to 1: DISABLE SUPPLY only spend magmite on Efficiency, Capacity and Overclocker. (For some end game players, supply is worth probably figuratively nothing.)<br>Set to 0: IGNORE SETTING and use old behaviour (will still try to buy overclocker)</b>', 'valueNegative', 2, null, 'Magma');
    createSetting('OneTimeOnly', 'One Time / Overclock Only', 'Makes the magmite spending sequence only buy one time upgrades and overclock, ignoring Efficiency, Capacity and Supply. Intended for manual use. Does not disable itself.', 'boolean', false, null, 'Magma');
    createSetting('BuyOvclock', 'Buy Overclock', 'Turn this off to not buy anymore overclocks. Will still buy the first level if you don\'t already own it.', 'boolean', true, null, 'Magma');

//Golden Upgrade Strategies:
    createSetting('AutoGoldenUpgrades', 'AutoGoldenUpgrades', 'IMPORTANT SETTING. Automatically Buy the specified Golden Upgrades as they become available. <b>Void</b> unlocks some intelligent settings from Dzugavili Mod and Derskagg Mod.', 'dropdown', 'Off', ["Off", "Helium", "Battle", "Void"], 'Golden');
    createSetting('goldStrat', 'goldStrat', 'VOID ONLY: After max void golden upgrades, alternate between buying helium and battle upgrades. Or Choose a Zone to switch over completely at.', 'dropdown', 'Off', ["Off", "Alternating", "Zone"], 'Golden');
    createSetting('goldAlternating', 'goldAlternating', 'Buy a helium upgrade after X-1 battle upgrades have been purchased', 'value', '2', null, 'Golden');
    createSetting('goldZone', 'goldZone', 'Buy a helium upgrade until zone X, then buy battle upgrades.', 'value', '200', null, 'Golden');

// Nature settings:
    createSetting('AutoNatureTokens', 'Spend Nature Tokens', '<b>MASTER BUTTON</b> Automatically spend or convert nature tokens.', 'boolean', false, null, 'Nature');
    createSetting('AutoPoison', 'Poison', 'Spend/convert Poison tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Wind', 'Convert to Ice', 'Convert to Both'], 'Nature');
    createSetting('AutoWind', 'Wind', 'Spend/convert Wind tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Ice', 'Convert to Both'], 'Nature');
    createSetting('AutoIce', 'Ice', 'Spend/convert Ice tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Wind', 'Convert to Both'], 'Nature');

//Spam settings:
    createSetting('SpamGeneral', 'General Spam', 'General Spam = Starting Zone, Auto He/Hr, AutoMagmiteSpender ', 'boolean', true, null, 'Spam');
    createSetting('SpamUpgrades', 'Upgrades Spam', 'Upgrades Spam', 'boolean', true, null, 'Spam');
    createSetting('SpamEquipment', 'Equipment Spam', 'Equipment Spam', 'boolean', true, null, 'Spam');
    createSetting('SpamMaps', 'Maps Spam', 'Maps Spam = Buy,Pick,Run Maps,Recycle,CantAfford', 'boolean', true, null, 'Spam');
    createSetting('SpamOther', 'Other Spam', 'Other Spam = Better Auto Fight, Trimpicide, Robotrimp, AutoMagmamancers', 'boolean', true, null, 'Spam');
    createSetting('SpamBuilding', 'Building Spam', 'Building Spam = all buildings, even storage', 'boolean', false, null, 'Spam');
    createSetting('SpamJobs', 'Job Spam', 'Job Spam = All jobs, in scientific notation', 'boolean', false, null, 'Spam');
    createSetting('SpamGraphs', 'Starting Zone Spam', 'Disables \'Starting new Zone ###\' and any future Graph Spam that comes from graph logs.', 'boolean', true, null, 'Spam');
    

// Export/Import/Default settings
    createSetting('ExportAutoTrimps', 'Export AutoTrimps', 'Export your Settings.', 'infoclick', 'ExportAutoTrimps', null, 'Import Export');
    createSetting('ImportAutoTrimps', 'Import AutoTrimps', 'Import your Settings.', 'infoclick', 'ImportAutoTrimps', null, 'Import Export');
    createSetting('DefaultAutoTrimps', 'Reset to Default', 'Reset everything to the way it was when you first installed the script.', 'infoclick', 'DefaultAutoTrimps', null, 'Import Export');
    createSetting('CleanupAutoTrimps', 'Cleanup Saved Settings ', 'Deletes old values from previous versions of the script from your AutoTrimps Settings file.', 'infoclick', 'CleanupAutoTrimps', null, 'Import Export');
    createSetting('allowSettingsUpload', 'Allow Settings Upload for Analytics', 'Uploads your current AUTOTRIMPS settings file (the same as Export AutoTrimps on this tab) <b>anonymously</b> - to https://autotrimps.site = the official Autotrimps development server. It will remain private for now, and aggregated for analytics to improve the script in the future and see which features are being used. Please Opt in. The upload will be approximately a small 3KB uncompressed text file every time the script is LOADED (for the time being until it is refined), and there is no concern for any personal data leak or privacy concern. This is all in good faith, and you are welcome to check the open source file modules/client-server.js. In the future, I will have to make a more fine-grained data-usage privacy-policy. Possible other data collected in the near-future may include certain game stats such as your highest zone, your helium amount, resource/magma/DE amounts, perk ratio selections. ', 'boolean', true, null, 'Import Export');
    //createSetting('ExportModuleVars', 'Export Custom Variables', 'Export your custom MODULES variables.', 'infoclick', 'ExportModuleVars', null, 'Import Export');
    //createSetting('ImportModuleVars', 'Import Custom Variables', 'Import your custom MODULES variables (and save).', 'infoclick', 'ImportModuleVars', null, 'Import Export');
    //createSetting('ResetModuleVars', 'Reset Custom Variables', 'Reset(Delete) your custom MODULES variables, and return the script to normal. ', 'infoclick', 'ResetModuleVars', null, 'Import Export');
}
initializeAllSettings(); //EXECUTE

//Handler for the popup/tooltip window for Import/Export/Default
function AutoTrimpsTooltip(what, isItIn, event) {
    if (game.global.lockTooltip)
        return;
    var elem = document.getElementById("tooltipDiv");
    swapClass("tooltipExtra", "tooltipExtraNone", elem);
    var ondisplay = null; // if non-null, called after the tooltip is displayed
    var tooltipText;
    var costText = "";
    if (what == "ExportAutoTrimps") {
        tooltipText = "This is your AUTOTRIMPS save string. There are many like it but this one is yours. Save this save somewhere safe so you can save time next time. <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + serializeSettings() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportAutoTrimps") {
        //runs the loadAutoTrimps() function.
        tooltipText = "Import your AUTOTRIMPS save string! It'll be fine, I promise.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); loadAutoTrimps();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "DefaultAutoTrimps") {
        resetAutoTrimps();
        tooltipText = "Autotrimps has been successfully reset to its defaults! ";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
        debug(tooltipText, "other");
    } else if (what == "CleanupAutoTrimps") {
        cleanupAutoTrimps();
        tooltipText = "Autotrimps saved-settings have been attempted to be cleaned up. If anything broke, refreshing will fix it, but check that your settings are correct! (prestige in particular)";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == "ExportModuleVars") {
        tooltipText = "These are your custom Variables. The defaults have not been included, only what you have set... <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + exportModuleVars() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportModuleVars") {
        tooltipText = "Enter your Autotrimps MODULE variable settings to load, and save locally for future use between refreshes:<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); importModuleVars();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "ResetModuleVars") {
        resetModuleVars();
        tooltipText = "Autotrimps MODULE variable settings have been successfully reset to its defaults!";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == 'MagmiteExplain') {
        tooltipText = "<img src='" + base + "mi.png'>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>I don't get it at all</div></div>";
    }
    game.global.lockTooltip = true;
    elem.style.left = "33.75%";
    elem.style.top = "25%";
    document.getElementById("tipTitle").innerHTML = what;
    document.getElementById("tipText").innerHTML = tooltipText;
    document.getElementById("tipCost").innerHTML = costText;
    elem.style.display = "block";
    if (ondisplay !== null)
        ondisplay();
}

//reset autotrimps to defaults (also handles imports)
function resetAutoTrimps(imported) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpSettings');
        //delete,remake,init defaults, recreate everything:
        autoTrimpSettings = imported ? imported : new Object(); //load the import.
        var settingsrow = document.getElementById("settingsRow");
        settingsrow.removeChild(document.getElementById("autoSettings"));
        automationMenuSettingsInit();
        initializeAllTabs();
        initializeAllSettings();
        updateCustomButtons();
        saveSettings();
        checkPortalSettings();
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}

//import autotrimps settings from a textbox
//For importing a new AT Config on the fly and reloading/applying all the settings.
function loadAutoTrimps() {
    //try the import
    try {
        var thestring = document.getElementById("importBox").value.replace(/[\n\r]/gm, "");
        var tmpset = JSON.parse(thestring);
        if (tmpset == null)
            return;
    } catch (err) {
        debug("Error importing, the string is bad." + err.message);
        return;
    }
    resetAutoTrimps(tmpset);
}

//remove stale values from past autotrimps versions
function cleanupAutoTrimps() {
    for (var setting in autoTrimpSettings) {
        var elem = document.getElementById(autoTrimpSettings[setting].id);
        if (elem == null)
            delete autoTrimpSettings[setting];
    }
}

//export MODULE variables to a textbox
function exportModuleVars() {
    return JSON.stringify(compareModuleVars());
}

function compareModuleVars() {
    var diffs = {};
    var mods = Object.keys(MODULES);
    for (var i=0,leni=mods.length;i<leni;i++) {
        var vars = Object.keys(MODULES[mods[i]]);
        for (var j=0,lenj=vars.length;j<lenj;j++) {
            var a = MODULES[mods[i]][vars[j]];
            var b = MODULESdefault[mods[i]][vars[j]];
            //var isArray = !!a && Array === a.constructor;
            if (JSON.stringify(a)!=JSON.stringify(b)) {
            //if ((a != b) || (isArray && JSON.stringify(a)!=JSON.stringify(b))) {
                if (diffs[mods[i]] === undefined)
                    diffs[mods[i]] = {};
                //console.log(vars[j]);
                diffs[mods[i]][vars[j]] = a;
            }
        }
    }
    //console.log(diffs);
    return diffs;
}

//import MODULE variables from a textbox
function importModuleVars() {
    //try the import
    try {
        //var thestring = document.getElementById("importBox").value.replace(/(\r\n|\n|\r)/gm, "");
        var thestring = document.getElementById("importBox").value;
        var strarr = thestring.split(/\n/);
        for (var line in strarr) {
            var s = strarr[line];
            s = s.substring(0, s.indexOf(';')+1); //cut after the ;
            s = s.replace(/\s/g,'');    //regexp remove ALL(/g) whitespaces(\s)
            //s = s.split('=');           //split into left / right on the =
            eval(s);
            strarr[line] = s;
        }

        //var tmpset = JSON.parse(thestring);
        var tmpset = compareModuleVars();
        // if (tmpset == null)
            // return;
    } catch (err) {
        debug("Error importing, the string is bad." + err.message);
        return;
    }
//    resetModuleVars(tmpset);
    localStorage.removeItem('autoTrimpVariables');
    localStorage.setItem('autoTrimpVariables', JSON.stringify(tmpset));
}

//reset MODULE variables to default, (and/or then import)
function resetModuleVars(imported) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpVariables');
        MODULES = JSON.parse(JSON.stringify(MODULESdefault));
        //load everything again, anew
        // debug('Saved');
        try {
            localStorage.setItem('autoTrimpVariables', JSON.stringify(autoTrimpVariables));
        } catch(e) {
          if (e.code == 22) {
            // Storage full, maybe notify user or do some clean-up
            debug("Error: LocalStorage is full, or some other error. Try to restart your browser.");
          }
        }
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}

//This creates the entire DOM-structure for this page.
function automationMenuInit() {
    //create container for settings buttons (bottom toolbar)
    var settingsrow = document.getElementById("settingsRow");
    var autoSettings = document.createElement("DIV");
    autoSettings.id = "autoSettings";
    autoSettings.setAttribute("style", "display: none; max-height: 96vh;overflow: auto;");
    settingsrow.appendChild(autoSettings);
    var settingBtnSrch = document.getElementsByClassName("btn btn-default");
    //Change Settings button handler to go through AutoTrimps Settings
    for (var i = 0; i < settingBtnSrch.length; i++) {
        if (settingBtnSrch[i].getAttribute("onclick") === "toggleSettingsMenu()")
            settingBtnSrch[i].setAttribute("onclick", "autoPlusSettingsMenu()");
    }
    //create the AutoTrimps Script button (bottom toolbar)
    var newItem = document.createElement("TD");
    newItem.appendChild(document.createTextNode("AutoTrimps"));
    newItem.setAttribute("class", "btn btn-default");
    newItem.setAttribute("onclick", "autoToggle()");
    var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
    settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);

    //create automaps button (in the world sidebar) 
    var newContainer = document.createElement("DIV");
    newContainer.setAttribute("class", "battleSideBtnContainer");
    newContainer.setAttribute("style", "display: block;");
    newContainer.setAttribute("id", "autoMapBtnContainer");
    var abutton = document.createElement("SPAN");
    abutton.appendChild(document.createTextNode("Auto Maps"));
    abutton.setAttribute("class", "btn fightBtn btn-success");
    abutton.setAttribute("id", "autoMapBtn");
    abutton.setAttribute("onClick", "settingChanged('AutoMaps')");
    abutton.setAttribute("onmouseover", 'tooltip(\"Toggle Automapping\", \"customText\", event, \"Toggle automapping on and off.\")');
    abutton.setAttribute("onmouseout", 'tooltip("hide")');
    var fightButtonCol = document.getElementById("battleBtnsColumn");
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //create automaps status (in the world sidebar)
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1.1vw; text-align: center; background-color: rgba(0,0,0,0.3);");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Health to Damage ratio\", \"customText\", event, \"This status box displays the current mode Automaps is in. The number usually shown here during Farming or Want more Damage modes is the \'HDratio\' meaning EnemyHealth to YourDamage Ratio (in X stance). Above 16 will trigger farming, above 4 will trigger going for Map bonus up to 10 stacks. If the number is not shown, hovering will display it below.<p><b>enoughHealth: </b>\" + enoughHealth + \"<br><b>enoughDamage: </b>\" + enoughDamage +\"<br><b>shouldFarm: </b>\" + shouldFarm +\"<br><b>H:D ratio = </b>\" + HDratio + \"<br>\")');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'autoMapStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //create hiderStatus - He/hr percent (in world sidebar)
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1vw; text-align: center; margin-top: 2px; background-color: rgba(0,0,0,0.3);");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Helium/Hr Info\", \"customText\", event, \"1st is Current He/hr % out of Lifetime He(not including current+unspent).<br> 0.5% is an ideal peak target. This can tell you when to portal... <br>2nd is Current run Total He earned / Lifetime He(not including current)<br>\" + getDailyHeHrStats())');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'hiderStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //make timer clock toggle paused mode when clicked (bottom right)
    document.getElementById('portalTimer').setAttribute('onclick', 'toggleSetting(\'pauseGame\')');
    document.getElementById('portalTimer').setAttribute('style', 'cursor: default');

    //shrink padding for fight buttons to help fit automaps button/status
    var btns = document.getElementsByClassName("fightBtn");
    for (var x = 0; x < btns.length; x++) {
        btns[x].style.padding = "0.01vw 0.01vw";
    }
}

//Hider's He/Hr Info stats (in world sidebar)
function getDailyHeHrStats() {
    var words = "";
    if (game.global.challengeActive == "Daily") {
        var getPercent = (game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned)));
        getPercent *= 100 + getDailyHeliumValue(countDailyWeight());
        words = "<b>After Daily He/Hr: " + getPercent.toFixed(3) +'%';
    }
    return words;
}

//toggles the display of the settings menu. 1
function autoToggle(what) {
    if (what) {
        whatobj = document.getElementById(what);
        if (whatobj.style.display === 'block') {
            whatobj.style.display = 'none';
            document.getElementById(what + 'BTN').style.border = '';
        } else {
            whatobj.style.display = 'block';
            document.getElementById(what + 'BTN').style.border = '4px solid green';
        }
    } else {
        if (game.options.displayed)
            toggleSettingsMenu();
        if (document.getElementById('graphParent').style.display === 'block')
            document.getElementById('graphParent').style.display = 'none';
        var item = document.getElementById('autoSettings');
        if (item.style.display === 'block')
            item.style.display = 'none';
        else item.style.display = 'block';
    }
}

//toggles the display of the original settings menu button,
// when clicked, hiding the AT settings and graph.
function autoPlusSettingsMenu() {
    var item = document.getElementById('autoSettings');
    if (item.style.display === 'block')
        item.style.display = 'none';
    item = document.getElementById('graphParent');
    if (item.style.display === 'block')
        item.style.display = 'none';
    toggleSettingsMenu();
}

//Universal function that creates sets up the Settings database, structures and associated graphic elements
function createSetting(id, name, description, type, defaultValue, list, container) {
    var btnParent = document.createElement("DIV");
    // btnParent.setAttribute('class', 'optionContainer');
    btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 1vw; margin-bottom: 1vw; width: 13.142vw;');
    var btn = document.createElement("DIV");
    btn.id = id;
    var loaded = autoTrimpSettings[id];
    if (type == 'boolean') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                enabled: loaded === undefined ? (defaultValue || false) : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].enabled);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'value' || type == 'valueNegative') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        if (type == 'valueNegative')
            btn.setAttribute("onclick", 'autoSetValueToolTip("' + id + '", "' + name + '",true)');
        else
            btn.setAttribute("onclick", 'autoSetValueToolTip("' + id + '", "' + name + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'dropdown') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                selected: loaded === undefined ? defaultValue : loaded,
                list: list
            };
        var btn = document.createElement("select");
        btn.id = id;
        if (game.options.menu.darkTheme.enabled == 2) btn.setAttribute("style", "color: #C8C8C8; font-size: 1.1vw;");
        else btn.setAttribute("style", "color:black; font-size: 1.1vw;");
        btn.setAttribute("class", "noselect");
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("onchange", 'settingChanged("' + id + '")');

        for (var item in list) {
            var option = document.createElement("option");
            option.value = list[item];
            option.text = list[item];
            btn.appendChild(option);
        }
        btn.value = autoTrimpSettings[id].selected;

        var dropdownLabel = document.createElement("Label");
        dropdownLabel.id = id + "Label";
        dropdownLabel.innerHTML = id + ":";
        dropdownLabel.setAttribute('style', 'margin-right: 0.3vw; font-size: 0.8vw;');
        btnParent.appendChild(dropdownLabel);
        btnParent.appendChild(btn);

        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);

    } else if (type == 'infoclick') {
        btn.setAttribute('class', 'btn btn-info');
        btn.setAttribute("onclick", 'AutoTrimpsTooltip(\'' + defaultValue + '\', null, \'update\')');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("style", "display: block; font-size: 0.8vw;");
        btn.textContent = name;
        btnParent.style.width = '';
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return;
    } else if (type == 'multitoggle') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue || 0 : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].value);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name.join(' / ') + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = autoTrimpSettings[id]["name"][autoTrimpSettings[id]["value"]];
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    }
    //make sure names/descriptions match what we have stored.
    if (autoTrimpSettings[id].name != name)
        autoTrimpSettings[id].name = name;
    if (autoTrimpSettings[id].description != description)
        autoTrimpSettings[id].description = description;
    autoTrimpSettings["ATversion"] = ATversion;
}

//Default Toggler handler for any setting of the 3 special types (boolean, multitoggle, dropdown, and handle PrestigeBackup) - not value type.
function settingChanged(id) {
    var btn = autoTrimpSettings[id];
    if (btn.type == 'boolean') {
        btn.enabled = !btn.enabled;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
    }
    if (btn.type == 'multitoggle') {
        //puts a 5 second pause in between cycling through from "on portal" to "always" so you can switch it to "off".
        if (id == 'AutoMagmiteSpender2' && btn.value == 1) {
            magmiteSpenderChanged = true;
            setTimeout(function() {
                magmiteSpenderChanged = false;
            }, 5000);
        }
        btn.value++;
        if (btn.value > btn.name.length - 1)
            btn.value = 0;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        document.getElementById(id).textContent = btn.name[btn.value];
    }
    if (btn.type == 'dropdown') {
        btn.selected = document.getElementById(id).value;
        //part of the prestige dropdown's "backup" system to prevent internal tampering via the dynamic prestige algorithm. everytime we see a user initiated change, make a backup.
        if (id == "Prestige")
            autoTrimpSettings["PrestigeBackup"].selected = document.getElementById(id).value;
    }
    //console.log(id + " Setting Changed");
    updateCustomButtons();
    saveSettings();
    checkPortalSettings();
    if ((autoTrimpSettings.AutoGen2.value == 3) && game.generatorUpgrades["Overclocker"].upgrades <= 0)
        tooltip('confirm', null, 'update', 'WARNING: You are set to Overclock but do not have any Overclocker upgrades. AutoGen2 will default to \'Max Cap\' in this case. If this is not desired, please fix your AutoGen2 setting.', 'cancelTooltip()', 'Cannot Overclock');
}

//Popup Tooltip - ask them to enter some numerical input. (STANDARDIZED)
function autoSetValueToolTip(id, text,negative) {
    ranstring = text;
    var elem = document.getElementById("tooltipDiv");
    var tooltipText = 'Type a number below. You can also use shorthand such as 2e5 or 200k.';
    if (negative)
        tooltipText += 'Accepts negative numbers as validated inputs.';
    else
        tooltipText += 'Put -1 for Infinite.';
    tooltipText += '<br/><br/><input id="customNumberBox" style="width: 50%" onkeypress="onKeyPressSetting(event, \'' + id + '\','+negative+')" value=' + autoTrimpSettings[id].value + '></input>';
    var costText = '<div class="maxCenter"><div class="btn btn-info" onclick="autoSetValue(\'' + id + '\','+negative+')">Apply</div><div class="btn btn-info" onclick="cancelTooltip()">Cancel</div></div>';
    game.global.lockTooltip = true;
    elem.style.left = '32.5%';
    elem.style.top = '25%';
    document.getElementById('tipTitle').textContent = ranstring + ':  Value Input';
    document.getElementById('tipText').innerHTML = tooltipText;
    document.getElementById('tipCost').innerHTML = costText;
    elem.style.display = 'block';
    var box = document.getElementById('customNumberBox');
    try {
        box.setSelectionRange(0, box.value.length);
    } catch (e) {
        box.select();
    }
    box.focus();
}
//enter handler for popup
function onKeyPressSetting(event, id,negative) {
    if (event.which == 13 || event.keyCode == 13) {
        autoSetValue(id,negative);
    }
}
//Custom Number Box - Suffix handler for numerical to string values in the prompted popup
function autoSetValue(id,negative) {
    var num = 0;
    unlockTooltip();
    tooltip('hide');
    var numBox = document.getElementById('customNumberBox');
    if (numBox) {
        num = numBox.value.toLowerCase();
        if (num.split('e')[1]) {
            num = num.split('e');
            num = Math.floor(parseFloat(num[0]) * (Math.pow(10, parseInt(num[1]))));
        } else {
            var letters = num.replace(/[^a-z]/gi, '');
            var base = 0;
            if (letters.length) {
                var suffices = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv', 'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'];
                for (var x = 0; x < suffices.length; x++) {
                    if (suffices[x].toLowerCase() == letters) {
                        base = x + 1;
                        break;
                    }
                }
                if (base) num = Math.round(parseFloat(num.split(letters)[0]) * Math.pow(1000, base));
            }
            if (!base) num = parseFloat(num);
        }
    } else return;
    autoTrimpSettings[id].value = num;
    if (num > -1 || negative)
        document.getElementById(id).textContent = ranstring + ': ' + prettify(num);
    else
    //document.getElementById(id).textContent = ranstring + ': ' + 'Infinite';
        document.getElementById(id).innerHTML = ranstring + ': ' + "<span class='icomoon icon-infinity'></span>";
    saveSettings();
    checkPortalSettings();
}

function updateCustomButtons() {
    //console.log("GUI: CustomButtons Updated");
    function toggleElem(elem, showHide) {
        var state = showHide ? '' : 'none';
        var stateParent = showHide ? 'inline-block' : 'none';
        var item = document.getElementById(elem);
        item.style.display = state;
        item.parentNode.style.display = stateParent;
    }

    function turnOff(elem) {
        toggleElem(elem, false);
    }

    function turnOn(elem) {
        toggleElem(elem, true);
    }
    //automaps button
    if (autoTrimpSettings.AutoMaps.enabled)
        document.getElementById("autoMapBtn").setAttribute("class", "btn fightBtn btn-success");
    else
        document.getElementById("autoMapBtn").setAttribute("class", "btn fightBtn btn-danger");
    //auto portal setting, hide until player has unlocked the balance challenge
    (game.challenges.Balance.filter()) ? turnOn("AutoPortal") : turnOff("AutoPortal");
    //auto Daily settings, hide until player has unlocked the Daily challenges
    (game.challenges.Daily.filter()) ? turnOn("AutoStartDaily") : turnOff("AutoStartDaily");
    (game.challenges.Daily.filter()) ? turnOn("AutoFinishDaily") : turnOff("AutoFinishDaily");
    (game.challenges.Daily.filter() && getPageSetting('AutoFinishDaily')) ? turnOn("AutoFinishDailyZone") : turnOff("AutoFinishDailyZone");
    //if custom auto portal is not selected, remove the custom value settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("CustomAutoPortal") : turnOff("CustomAutoPortal");
    //if HeHr is not selected, remove HeliumHourChallenge settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour" || autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("HeliumHourChallenge") : turnOff("HeliumHourChallenge");
    //if HeHr is not selected, remove HeHrDontPortalBefore settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour") ? turnOn("HeHrDontPortalBefore") : turnOff("HeHrDontPortalBefore");
    //if HeHr is not selected, remove HeHr buffer settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour") ? turnOn("HeliumHrBuffer") : turnOff("HeliumHrBuffer");

    //update dropdown selections: (ALL DROPDOWNS REQUIRE THIS BIT TO BE UPDATEY)
    document.getElementById('AutoPortal').value = autoTrimpSettings.AutoPortal.selected;
    document.getElementById('HeliumHourChallenge').value = autoTrimpSettings.HeliumHourChallenge.selected;
    document.getElementById('AutoGoldenUpgrades').value = autoTrimpSettings.AutoGoldenUpgrades.selected;
    document.getElementById('AutoPoison').value = autoTrimpSettings.AutoPoison.selected;
    document.getElementById('AutoWind').value = autoTrimpSettings.AutoWind.selected;
    document.getElementById('AutoIce').value = autoTrimpSettings.AutoIce.selected;
    //DerSkagg Mod: Golden Upgrade Settings. (Toggles relevant ones on/off)
    if (autoTrimpSettings.AutoGoldenUpgrades.selected == "Void") {
        turnOn("goldStrat");
        document.getElementById('goldStrat').value = autoTrimpSettings.goldStrat.selected;
        if (autoTrimpSettings.goldStrat.selected == "Alternating") {
            document.getElementById('goldAlternating').value = autoTrimpSettings.goldAlternating.selected;
            turnOn("goldAlternating")
        } else
            turnOff("goldAlternating");
        (autoTrimpSettings.goldStrat.selected == "Zone") ? turnOn("goldZone") : turnOff("goldZone");
    } else {
        turnOff("goldStrat");
        turnOff("goldAlternating");
        turnOff("goldZone");
    }
    //document.getElementById('Prestige').value = autoTrimpSettings.Prestige.selected; //dont update this, dynamic prestige takes it over and is handled elsewhere.

    //stop disable farming from needing a refresh
    if (getPageSetting('DisableFarm'))
        shouldFarm = false;
    // handle metal preference
    MODULES["automaps"] && (MODULES["automaps"].preferGardens = !getPageSetting('PreferMetal'));
    //if player has selected arbalest or gambeson but doesn't have them unlocked, just unselect it for them! It's magic!
    if (document.getElementById('Prestige').selectedIndex > 11 && game.global.slowDone == false) {
        document.getElementById('Prestige').selectedIndex = 11;
        autoTrimpSettings.Prestige.selected = "Bestplate";
    }
    //Bionic Before Spire - Auto turns on RunUniqueMaps
    if (autoTrimpSettings.RunBionicBeforeSpire.enabled && !autoTrimpSettings.RunUniqueMaps.enabled)
        setPageSetting("RunUniqueMaps",true);
    //make sure value buttons are set accurately.
    for (var setting in autoTrimpSettings) {
        if (autoTrimpSettings[setting].type == 'value' || autoTrimpSettings[setting].type == 'valueNegative') {
            var elem = document.getElementById(autoTrimpSettings[setting].id);
            if (elem != null) {
                if (autoTrimpSettings[setting].value > -1 || autoTrimpSettings[setting].type == 'valueNegative')
                    elem.textContent = autoTrimpSettings[setting].name + ': ' + prettify(autoTrimpSettings[setting].value);
                else
                //elem.textContent = ranstring + ': ' + 'Infinite';
                    elem.innerHTML = autoTrimpSettings[setting].name + ': ' + "<span class='icomoon icon-infinity'></span>";
            }
        }
    }
}

//buncha update stuff i wrote but ended up not needing:
/*
for (var setting in autoTrimpSettings) {
    var btn = autoTrimpSettings[setting];
    var elem = document.getElementById(setting);
    if (elem == null) continue;
    if (btn.type == 'boolean')
        elem.setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
    if (btn.type == 'multitoggle') {
        elem.setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        elem.textContent = btn.name[btn.value];
    }
}
*/

//Checks portal related UI settings (TODO: split into two, and move the validation check to SettingsGUI)
function checkPortalSettings() {
    var portalLevel = -1;
    var leadCheck = false;
    switch (autoTrimpSettings.AutoPortal.selected) {
        case "Off":
            break;
        case "Custom":
            portalLevel = autoTrimpSettings.CustomAutoPortal.value + 1;
            leadCheck = autoTrimpSettings.HeliumHourChallenge.selected == "Lead" ? true : false;
            break;
        case "Balance":
            portalLevel = 41;
            break;
        case "Decay":
            portalLevel = 56;
            break;
        case "Electricity":
            portalLevel = 82;
            break;
        case "Crushed":
            portalLevel = 126;
            break;
        case "Nom":
            portalLevel = 146;
            break;
        case "Toxicity":
            portalLevel = 166;
            break;
        case "Lead":
            portalLevel = 181;
            break;
        case "Watch":
            portalLevel = 181;
            break;
        case "Corrupted":
            portalLevel = 191;
            break;
    }
    if (portalLevel == -1)
        return portalLevel;
    if (autoTrimpSettings.VoidMaps.value >= portalLevel)
        tooltip('confirm', null, 'update', 'WARNING: Your void maps are set to complete after your autoPortal, and therefore will not be done at all! Please Change Your Settings Now. This Box Will Not Go away Until You do. Remember you can choose \'Custom\' autoPortal along with challenges for complete control over when you portal. <br><br> Estimated autoPortal level: ' + portalLevel, 'cancelTooltip()', 'Void Maps Conflict');
    if ((leadCheck || game.global.challengeActive == 'Lead') && (autoTrimpSettings.VoidMaps.value % 2 == 0 && portalLevel <= 181))
        tooltip('confirm', null, 'update', 'WARNING: Voidmaps run during Lead on an Even zone do not receive the 2x Helium Bonus for Odd zones, and are also tougher. You should probably fix this.', 'cancelTooltip()', 'Lead Challenge Void Maps');
    return portalLevel;
}

//on UI startup:
//Add breeding box:
var breedbarContainer = document.querySelector('#trimps > div.row');
var addbreedTimerContainer = document.createElement("DIV");
addbreedTimerContainer.setAttribute('class', "col-xs-11");
addbreedTimerContainer.setAttribute('style', 'padding-right: 0;');
addbreedTimerContainer.setAttribute("onmouseover", 'tooltip(\"Hidden Next Group Breed Timer\", \"customText\", event, \"How long your next army has been breeding for, or how many anticipation stacks you will have if you send a new army now. This number is what BetterAutoFight #4 refers to when it says NextGroupBreedTimer.\")');
addbreedTimerContainer.setAttribute("onmouseout", 'tooltip("hide")');
var addbreedTimerInside = document.createElement("DIV");
addbreedTimerInside.setAttribute('style', 'display: block;');
var addbreedTimerInsideIcon = document.createElement("SPAN");
addbreedTimerInsideIcon.setAttribute('class', "icomoon icon-clock");
var addbreedTimerInsideText = document.createElement("SPAN"); //updated in the top of mainLoop() each cycle
addbreedTimerInsideText.id = 'hiddenBreedTimer';
addbreedTimerInside.appendChild(addbreedTimerInsideIcon);
addbreedTimerInside.appendChild(addbreedTimerInsideText);
addbreedTimerContainer.appendChild(addbreedTimerInside);
breedbarContainer.appendChild(addbreedTimerContainer);
var armycount = document.getElementById('trimpsFighting');

//hover over the army group size to get a popup that translates to breeding time
function addToolTipToArmyCount() {
    armycount.setAttribute("onmouseover", 'tooltip(\"Army Count\", \"customText\", event, \"To Fight now would add: \" + prettify(getArmyTime()) + \" seconds to the breed timer.\")');
    armycount.setAttribute("onmouseout", 'tooltip("hide")');
    armycount.setAttribute("class", 'tooltipadded');
}
