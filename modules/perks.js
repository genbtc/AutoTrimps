// ==UserScript==
// @name         AutoPerks
// @namespace    http://tampermonkey.net/
// @version      1.1.3-4-7-2018+genBTC
// @description  Trimps Automatic Perk Calculator
// @author       zxv, genBTC
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

//Create blank AutoPerks object
var AutoPerks = {};
MODULES["perks"] = {};
MODULES["perks"].showDetails = true;   //show which individual perks are spent;
MODULES["perks"].useAlgo2 = false;   //use algorithm 2 instead.

//Import the FastPriorityQueue.js general Library (not AT specific, but needed for perk queue)
var head = document.getElementsByTagName('head')[0];
var queuescript = document.createElement('script');
queuescript.type = 'text/javascript';
//This does not need to be changed to your own repo. Its a 3rd party file.
queuescript.src = 'https://genbtc.github.io/AutoTrimps/FastPriorityQueue.js';
head.appendChild(queuescript);

//--------------------------------------
//Ratio Presets - Perk proportions:
// (in perk order): [looting,toughness,power,motivation,pheromones,artisanistry,carpentry,resilience,coordinated,resourceful,overkill,cunning,curious];
var preset_ZXV = [20, 0.5, 1, 1.5, 0.5, 1.5, 8, 1, 25, 2, 3, 1, 1];
var preset_ZXVnew = [50, 0.75, 1, 3, 0.75, 3, 10, 1.5, 60, 2, 5, 1, 1];
var preset_ZXV3 = [100, 1, 3, 3, 1, 3, 40, 2, 100, 1, 3, 1, 1];
var preset_TruthEarly = [30, 4, 4, 4, 4, 2, 24, 8, 60, 2, 3, 1, 1];
var preset_TruthLate = [120, 4, 4, 4, 4, 2, 24, 8, 60, 2, 3, 1, 1];
var preset_nsheetz = [42, 1.75, 5, 4, 1.5, 5, 29, 3.5, 100, 1, 5, 1, 1];
var preset_nsheetzNew= [160, 1.5, 5, 2.5, 1.5, 3.5, 18, 3, 100, 1, 10, 1, 1];
var preset_HiderHehr = [90, 4, 12, 10, 1, 8, 8, 1, 20, 0.1, 3, 1, 1];
var preset_HiderBalance = [75, 4, 8, 4, 1, 4, 24, 1, 75, 0.5, 3, 1, 1];
var preset_HiderMore = [20, 4, 10, 12, 1, 8, 8, 1, 40, 0.1, 0.5, 1, 1];
var preset_genBTC = [100, 8, 8, 4, 4, 5, 18, 8, 14, 1, 1, 1, 1];
var preset_genBTC2 = [96, 19, 15.4, 8, 8, 7, 14, 19, 11, 1, 1, 1, 1];
var preset_Zek4501 = [300, 1, 30, 2, 4, 2, 9, 8, 17, 0.1, 1, 320, 1];
var preset_Zek4502 = [350, 1, 40, 2, 3, 2, 5, 8, 2, 0.1, 1, 300, 20];
var preset_Zek450 = [450, 0.9, 48, 3.35, 1, 2.8, 7.8, 1.95, 4, 0.04, 1, 120, 175];
//
var preset_space = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//
var preset_Zek059 = [7, 0.6, 3, 0.8, 0.3, 3, 25, 0.6, 0, 0, 0, 0, 0];
var preset_Zek100 = [9.8, 1.8, 3.2, 2.6, 0.7, 2.9, 25, 1.8, 0, 0, 0, 0, 0];
var preset_Zek180 = [13, 1.3, 4, 2.6, 0.7, 2.9, 25, 1.3, 35, 0.05, 1, 0, 0];
var preset_Zek229 = [11.2, 0.58, 2.37, 1.464, 0.3, 2.02, 12.2, 0.58, 37, 0.22, 2.2, 0, 0];
var preset_Zek299 = [16.8, 3, 1.9, 1.1, 1.2, 1, 17.1, 3, 100, 0.06, 0.8, 0, 0];
var preset_Zek399 = [135, 6.1, 18.5, 6.5, 2.5, 6, 17, 6.1, 25, 0.08, 1, 0, 0];
var preset_Zek449 = [245, 5.85, 29, 1.95, 2.8, 6, 6.1, 5.85, 15, 0.05, 1, 57, 0];
//gather these into an array of objects. this is one important object.
var presetList = [preset_ZXV,preset_ZXVnew,preset_ZXV3,preset_TruthEarly,preset_TruthLate,preset_nsheetz,preset_nsheetzNew,preset_HiderHehr,preset_HiderBalance,preset_HiderMore,preset_genBTC,preset_genBTC2,preset_Zek4501,preset_Zek4502,preset_Zek450,preset_space,preset_Zek059,preset_Zek100,preset_Zek180,preset_Zek229,preset_Zek299,preset_Zek399,preset_Zek449,preset_Zek450,preset_space];
//Specific ratios labeled above must be given the matching ID below.
//Ratio preset dropdown list
var presetListHtml = "\
<option id='preset_ZXV'>ZXV</option>\
<option id='preset_ZXVnew'>ZXV (new)</option>\
<option id='preset_ZXV3'>ZXV 3</option>\
<option id='preset_TruthEarly'>Truth (early)</option>\
<option id='preset_TruthLate'>Truth (late)</option>\
<option id='preset_nsheetz'>nSheetz</option>\
<option id='preset_nsheetzNew'>nSheetz(new)</option>\
<option id='preset_HiderHehr'>Hider* (He/hr)</option>\
<option id='preset_HiderBalance'>Hider (Balance)</option>\
<option id='preset_HiderMore'>Hider* (More Zones)</option>\
<option id='preset_genBTC'>genBTC</option>\
<option id='preset_genBTC2'>genBTC2</option>\
<option id='preset_Zek4501'>Zeker0-#1 old</option>\
<option id='preset_Zek4502'>Zeker0-#2 old</option>\
<option id='preset_Zek450'>Zeker0-#3 old</option>\
<option id='preset_space'>--------------</option>\
<option id='preset_Zek059'>Zeker0 (z1-59)</option>\
<option id='preset_Zek100'>Zeker0 (z60-100)</option>\
<option id='preset_Zek180'>Zeker0 (z101-180)</option>\
<option id='preset_Zek229'>Zeker0 (z181-229)</option>\
<option id='preset_Zek299'>Zeker0 (z230-299)</option>\
<option id='preset_Zek399'>Zeker0 (z300-399)</option>\
<option id='preset_Zek449'>Zeker0 (z400-449)</option>\
<option id='preset_Zek450'>Zeker0 (z450+) (new)</option>\
<option id='preset_space'>--------------</option>\
<option id='customPreset'>CUSTOM ratio</option></select>";
//Custom Creation for all perk customRatio boxes in Trimps Perk Window
AutoPerks.createInput = function(perkname,div) {
    var perk1input = document.createElement("Input");
    perk1input.id = perkname + 'Ratio';
    var oldstyle = 'text-align: center; width: calc(100vw/36); font-size: 1.0vw; ';
    if(game.options.menu.darkTheme.enabled != 2) perk1input.setAttribute("style", oldstyle + " color: black;");
    else perk1input.setAttribute('style', oldstyle);
    perk1input.setAttribute('class', 'perkRatios');
    perk1input.setAttribute('onchange', 'AutoPerks.switchToCustomRatios()');
    var perk1label = document.createElement("Label");
    perk1label.id = perkname + 'Label';
    perk1label.innerHTML = perkname;
    perk1label.setAttribute('style', 'margin-right: 0.7vw; width: calc(100vw/18); color: white; font-size: 0.9vw; font-weight: lighter; margin-left: 0.3vw; ');
    //add to the div.
    div.appendChild(perk1input);
    div.appendChild(perk1label);
}
//--------------------------------------
//BEGIN AUTOPERKS GUI CODE:>>>>>>>>>>>>>>
//--------------------------------------
AutoPerks.GUI = {};
AutoPerks.removeGUI = function() {
    Object.keys(AutoPerks.GUI).forEach(function(key) {
      var $elem = AutoPerks.GUI[key];
      if (!$elem) {
          console.log("error in: "+key);
          return;
      }
      if ($elem.parentNode) {
        $elem.parentNode.removeChild($elem);
        delete $elem;
      }
    });
}
AutoPerks.displayGUI = function() {
    let apGUI = AutoPerks.GUI;
    //Create Allocator button and add it to Trimps Perk Window
    var $buttonbar = document.getElementById("portalBtnContainer");
    apGUI.$allocatorBtn1 = document.createElement("DIV");
    apGUI.$allocatorBtn1.id = 'allocatorBtn1';
    apGUI.$allocatorBtn1.setAttribute('class', 'btn inPortalBtn settingsBtn settingBtntrue');
    apGUI.$allocatorBtn1.setAttribute('onclick', 'AutoPerks.clickAllocate()');
    apGUI.$allocatorBtn1.textContent = 'Allocate Perks';
    $buttonbar.appendChild(apGUI.$allocatorBtn1);
    $buttonbar.setAttribute('style', 'margin-bottom: 0.8vw;');
    apGUI.$customRatios = document.createElement("DIV");
    apGUI.$customRatios.id = 'customRatios';
    //Line 1 of the UI
    apGUI.$ratiosLine1 = document.createElement("DIV");
    apGUI.$ratiosLine1.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
    var listratiosLine1 = ["Overkill","Resourceful","Coordinated","Resilience","Carpentry","Artisanistry"];
    for (var i in listratiosLine1)
        AutoPerks.createInput(listratiosLine1[i],apGUI.$ratiosLine1);
    apGUI.$customRatios.appendChild(apGUI.$ratiosLine1);
    //Line 2 of the UI
    apGUI.$ratiosLine2 = document.createElement("DIV");
    apGUI.$ratiosLine2.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
    var listratiosLine2 = ["Pheromones","Motivation","Power","Looting","Cunning","Curious"];
    for (var i in listratiosLine2)
        AutoPerks.createInput(listratiosLine2[i],apGUI.$ratiosLine2);
    //Create dump perk dropdown
    apGUI.$dumpperklabel = document.createElement("Label");
    apGUI.$dumpperklabel.id = 'DumpPerk Label';
    apGUI.$dumpperklabel.innerHTML = "Dump Perk:";
    apGUI.$dumpperklabel.setAttribute('style', 'margin-right: 1vw; color: white; font-size: 0.9vw;');
    apGUI.$dumpperk = document.createElement("select");
    apGUI.$dumpperk.id = 'dumpPerk';
    apGUI.$dumpperk.setAttribute('onchange', 'AutoPerks.saveDumpPerk()');
    var oldstyle = 'text-align: center; width: 8vw; font-size: 0.8vw; font-weight: lighter; ';
    if(game.options.menu.darkTheme.enabled != 2) apGUI.$dumpperk.setAttribute("style", oldstyle + " color: black;");
    else apGUI.$dumpperk.setAttribute('style', oldstyle);
    //Add the dump perk dropdown to UI Line 2
    apGUI.$ratiosLine2.appendChild(apGUI.$dumpperklabel);
    apGUI.$ratiosLine2.appendChild(apGUI.$dumpperk);
    //Toggle Algorithm 2 checkbox
    apGUI.$toggleAlgo2 = document.createElement("DIV");
    apGUI.$toggleAlgo2.setAttribute('style', 'display: inline; text-align: left; margin-left: 1vw;');
    apGUI.$toggleAlgo2.innerHTML = '\
    <input onclick="AutoPerks.toggleFastAllocate()" style="margin-left: 0.5vw;" type="checkbox" id="fastAllocate">\
    <span style="margin-left: 0.2vw; font-size: 1.1vw; "><b>Fast Allocate!</b></span>';
    $buttonbar.appendChild(apGUI.$toggleAlgo2);
    var $fastAllocate = document.getElementById("fastAllocate");
    $fastAllocate.setAttribute("onmouseover", 'tooltip(\"FastAllocate\", \"customText\", event, \"Bulk buys thousands of Tier2 Perks at once to save time. Caution - May overshoot. Recommended for High Helium amounts above 1 Qi only.\")');
    $fastAllocate.setAttribute("onmouseout", 'tooltip("hide")');
    //Create ratioPreset dropdown
    apGUI.$ratioPresetLabel = document.createElement("Label");
    apGUI.$ratioPresetLabel.id = 'Ratio Preset Label';
    apGUI.$ratioPresetLabel.innerHTML = "Ratio Preset:";
    apGUI.$ratioPresetLabel.setAttribute('style', 'margin-right: 0.5vw; color: white; font-size: 0.9vw;');
    apGUI.$ratioPreset = document.createElement("select");
    apGUI.$ratioPreset.id = 'ratioPreset';
    apGUI.$ratioPreset.setAttribute('onchange', 'AutoPerks.setDefaultRatios()');
    oldstyle = 'text-align: center; width: 8vw; font-size: 0.8vw; font-weight: lighter; ';
    if(game.options.menu.darkTheme.enabled != 2) apGUI.$ratioPreset.setAttribute("style", oldstyle + " color: black;");
    else apGUI.$ratioPreset.setAttribute('style', oldstyle);
    //Populate ratio preset dropdown list from HTML above:
    apGUI.$ratioPreset.innerHTML = presetListHtml;
    //Load the last ratio used
    var loadLastPreset = localStorage.getItem('AutoperkSelectedRatioPresetID');
    var setID;
    if (loadLastPreset != null) { 
        //these four lines are temporary to migrate Custom Ratios to the new dropdown. Once everyone has the name in localStorage we can remove this.
        if (loadLastPreset == 15 && !localStorage.getItem('AutoperkSelectedRatioPresetName'))
            loadLastPreset = 25;
        if (localStorage.getItem('AutoperkSelectedRatioPresetName')=="customPreset")
            loadLastPreset = 25;
        setID = loadLastPreset;
    }
    else 
        setID = 0; // First element is zxv (default) ratio.
    apGUI.$ratioPreset.selectedIndex = setID;
    //Add the presets dropdown to UI Line 1
    apGUI.$ratiosLine1.appendChild(apGUI.$ratioPresetLabel);
    apGUI.$ratiosLine1.appendChild(apGUI.$ratioPreset);
    apGUI.$customRatios.appendChild(apGUI.$ratiosLine2);
    //Add it all to the perk/portal screen
    var $portalWrapper = document.getElementById("portalWrapper")
    $portalWrapper.appendChild(apGUI.$customRatios);
    ////////////////////////////////////////
    //Main LOGIC Loop///////////////////////
    ////////////////////////////////////////
    AutoPerks.initializePerks();// Init all the new vars
    AutoPerks.populateDumpPerkList();
}

//populate dump perk dropdown list
AutoPerks.populateDumpPerkList = function() {
    var $dumpDropdown = document.getElementById('dumpPerk');
    if ($dumpDropdown == null) return;
    var html = "";
    var dumpperks = AutoPerks.getVariablePerks();
    for(var i in dumpperks)
        html += "<option id='"+dumpperks[i].name+"Dump'>"+AutoPerks.capitaliseFirstLetter(dumpperks[i].name)+"</option>"
    html += "<option id='none'>None</option></select>";
    $dumpDropdown.innerHTML = html;
    //load the last dump preset used
    var loadLastDump = localStorage.getItem('AutoperkSelectedDumpPresetID');
    if (loadLastDump != null)
        $dumpDropdown.selectedIndex = loadLastDump;
    else
        $dumpDropdown.selectedIndex = $dumpDropdown.length - 2; // Second to last element is looting_II (or other)
}

AutoPerks.saveDumpPerk = function() {
    var $dump = document.getElementById("dumpPerk");
    safeSetItems('AutoperkSelectedDumpPresetID', $dump.selectedIndex);
    safeSetItems('AutoperkSelectedDumpPresetName', $dump.value);
}

AutoPerks.saveCustomRatios = function() {
    if (document.getElementById("ratioPreset").selectedIndex == document.getElementById("ratioPreset").length-1) {
        var $perkRatioBoxes = document.getElementsByClassName('perkRatios');
        var customRatios = [];
        for(var i = 0; i < $perkRatioBoxes.length; i++) {
            customRatios.push({'id':$perkRatioBoxes[i].id,'value':parseFloat($perkRatioBoxes[i].value)});
        }
        safeSetItems('AutoPerksCustomRatios', JSON.stringify(customRatios) );
    }
}

AutoPerks.switchToCustomRatios = function() {
    var $rp = document.getElementById("ratioPreset");
    if ($rp.selectedIndex != $rp.length-1)
        ($rp.selectedIndex = $rp.length-1);
}

//sets the ratioboxes with the default ratios embedded in the script when perks are instanciated.
// (and everytime the ratio-preset dropdown-selector is changed)
//loads custom ratio selections from localstorage if applicable
AutoPerks.setDefaultRatios = function() {
    var $perkRatioBoxes = document.getElementsByClassName("perkRatios");
    var $rp = document.getElementById("ratioPreset");
    if (!$rp || !$perkRatioBoxes || !$rp.selectedOptions[0]) return;
    var ratioSet = $rp.selectedIndex;
    var currentPerk;
    //set ratio boxes using getPerksByName to get values from the perkHolder
    for(var i = 0; i < $perkRatioBoxes.length; i++) {
        currentPerk = AutoPerks.getPerkByName($perkRatioBoxes[i].id.substring(0, $perkRatioBoxes[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
        $perkRatioBoxes[i].value = currentPerk.value[ratioSet];
    }
    //If "Custom" dropdown is selected:
    if (ratioSet == $rp.length-1) {
        //Try to grab custom ratios from LocalStorage if they were saved.
        var tmp = JSON.parse(localStorage.getItem('AutoPerksCustomRatios'));
        if (tmp !== null)
            AutoPerks.GUI.$customRatios = tmp;
        else {
            // If no file was found, start by setting all $perkRatioBoxes to 1.
            for(var i = 0; i < $perkRatioBoxes.length; i++)
                $perkRatioBoxes[i].value = 1;     //initialize to 1.
            return; //then exit.
        }
        //if we have ratios in the storage file, load them
        for(var i = 0; i < $perkRatioBoxes.length; i++) {
            //do a quick sanity check (order)
            if (AutoPerks.GUI.$customRatios[i].id != $perkRatioBoxes[i].id) continue;
            currentPerk = AutoPerks.getPerkByName($perkRatioBoxes[i].id.substring(0, $perkRatioBoxes[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
            $perkRatioBoxes[i].value = AutoPerks.GUI.$customRatios[i].value;
        }
    }
    //save the last ratio used
    safeSetItems('AutoperkSelectedRatioPresetID', ratioSet);
    safeSetItems('AutoperkSelectedRatioPresetName', $rp.selectedOptions[0].id);
}

//updates the internal perk variables with values grabbed from the custom ratio input boxes that the user may have changed.
AutoPerks.updatePerkRatios = function() {
    var $perkRatioBoxes = document.getElementsByClassName('perkRatios');
    var currentPerk;
    for(var i = 0; i < $perkRatioBoxes.length; i++) {
        currentPerk = AutoPerks.getPerkByName($perkRatioBoxes[i].id.substring(0, $perkRatioBoxes[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
        currentPerk.updatedValue = parseFloat($perkRatioBoxes[i].value);
    }
    AutoPerks.getPerkByName("toughness").updatedValue = AutoPerks.getPerkByName("resilience").updatedValue / 2;
    // Manually update tier II perks
    var tierIIPerks = AutoPerks.getTierIIPerks();
    for(var i in tierIIPerks)
        tierIIPerks[i].updatedValue = tierIIPerks[i].parent.updatedValue / tierIIPerks[i].relativeIncrease;
}
//END AUTOPERKS GUI CODE:>>>>>>>>>>>>>>

//get ready / initialize
AutoPerks.initialise = function() {
    //save custom ratios if "custom" is selected
    AutoPerks.saveCustomRatios();
    AutoPerks.initializePerks(); // Init all the new vars
    AutoPerks.updatePerkRatios();   //grab new ratios if any
}

//Main function (green "Allocate Perks" button):
AutoPerks.clickAllocate = function() {
    AutoPerks.initialise(); // Reset all fixed perks to 0 and grab new ratios if any

    var helium = AutoPerks.getHelium();

    // Get fixed perks
    var preSpentHe = 0;
    var fixedPerks = AutoPerks.getFixedPerks();
    for (var i in fixedPerks) {
        //Maintain your existing fixed perks levels.
        fixedPerks[i].level = game.portal[AutoPerks.capitaliseFirstLetter(fixedPerks[i].name)].level;
        var price = AutoPerks.calculateTotalPrice(fixedPerks[i], fixedPerks[i].level);
        fixedPerks[i].spent += price;
        preSpentHe += price;
    }
    if (preSpentHe)
        debug("AutoPerks: Your existing fixed-perks reserve Helium: " + prettify(preSpentHe), "perks");

    //if one of these is NaN, bugs.
    var remainingHelium = helium - preSpentHe;
   //Check for NaN - if one of these is NaN, bugs.
    if (Number.isNaN(remainingHelium))
        debug("AutoPerks: Major Error: Reading your Helium amount. " + remainingHelium, "perks");    

    // determine how to spend helium
    var result;
    if (MODULES["perks"].useAlgo2)
        result = AutoPerks.spendHelium2(remainingHelium);
    else
        result = AutoPerks.spendHelium(remainingHelium);
    if (result == false) {
        debug("AutoPerks: Major Error: Make sure all ratios are set properly.","perks");
        return;
    }
    // Get owned perks
    var perks = AutoPerks.getOwnedPerks();
    //re-arrange perk points
    AutoPerks.applyCalculations(perks,remainingHelium);
    //Done
    debug("AutoPerks: Auto-Allocate Finished.","perks");
}

//NEW way: Get accurate count of helium (calcs it like the game does)
AutoPerks.getHelium = function() {
    //determines if we are in the portal screen or the perk screen.
    var respecMax = (game.global.viewingUpgrades) ? game.global.heliumLeftover : game.global.heliumLeftover + game.resources.helium.owned;
    //iterates all the perks and gathers up their heliumSpent counts.
    for (var item in game.portal){
        if (game.portal[item].locked) continue;
        var portUpgrade = game.portal[item];
        if (typeof portUpgrade.level === 'undefined') continue;
        respecMax += portUpgrade.heliumSpent;
    }
    return respecMax;
}

//Calculate Price
AutoPerks.calculatePrice = function(perk, level) { // Calculate price of buying *next* level
    if(perk.fluffy) return Math.ceil(perk.base * Math.pow(10,level));
    else if(perk.type == 'exponential') return Math.ceil(level/2 + perk.base * Math.pow(1.3, level));
    else if(perk.type == 'linear') return Math.ceil(perk.base + perk.increase * level);
}
//Calculate Total Price
AutoPerks.calculateTotalPrice = function(perk, finalLevel) {
    if(perk.type == 'linear' && !perk.fluffy)
        return AutoPerks.calculateTIIprice(perk, finalLevel);
    var totalPrice = 0;
    for(var i = 0; i < finalLevel; i++) {
        totalPrice += AutoPerks.calculatePrice(perk, i);
    }
    return totalPrice;
}
//Calculate Tier 2 Total Price (Shortcut)
AutoPerks.calculateTIIprice = function(perk, finalLevel) {
    //based on Trimps getAdditivePrice() @ main.js line 2056
    return Math.ceil((((finalLevel - 1) * finalLevel) / 2 * perk.increase) + (perk.base * finalLevel));
}
//Calculate the increase in stat.
AutoPerks.calculateIncrease = function(perk, level) {
    var increase = 0;
    var value; // Allows for custom perk ratios.

    if(perk.updatedValue != -1) value = perk.updatedValue;
    else value = perk.value;

    if(perk.compounding) increase = perk.baseIncrease;
    else increase = (1 + (level + 1) * perk.baseIncrease) / ( 1 + level * perk.baseIncrease) - 1;
    return increase / perk.baseIncrease * value;
}

AutoPerks.spendHelium = function(helium) {
    debug("Beginning AutoPerks1 calculate how to spend " + prettify(helium) + " Helium... This could take a while...","perks");
    if(helium < 0) {
        debug("AutoPerks: Major Error - Not enough helium to buy fixed perks.","perks");
        //document.getElementById("nextCoordinated").innerHTML = "Not enough helium to buy fixed perks.";
        return false;
    }
    if (Number.isNaN(helium)) {
        debug("AutoPerks: Major Error - Helium is Not a Number!","perks");
        return false;
    }
    
    var perks = AutoPerks.getVariablePerks();

    var effQueue = new FastPriorityQueue(function(a,b) { return a.efficiency > b.efficiency } ) // Queue that keeps most efficient purchase at the top
    // Calculate base efficiency of all perks

    var mostEff, price, inc;
    for(var i in perks) {
        price = AutoPerks.calculatePrice(perks[i], 0);
        inc = AutoPerks.calculateIncrease(perks[i], 0);
        perks[i].efficiency = inc/price;
        if(perks[i].efficiency < 0) {
            debug("Perk ratios must be positive values.","perks");
            return false;
        }
        //Unsaid: If eff == 0, just do nothing.
        if(perks[i].efficiency != 0)
            effQueue.add(perks[i]);        
    }
    if (effQueue.size < 1) {
        debug("All Perk Ratios were 0, or some other error.","perks");
        return false;
    }

    var i=0;
    //Change the way we iterate.
    function iterateQueue() {
        mostEff = effQueue.poll();
        price = AutoPerks.calculatePrice(mostEff, mostEff.level); // Price of *next* purchase.
        inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
        mostEff.efficiency = inc / price;
        i++;
    }
    for (iterateQueue() ; price <= helium ; iterateQueue() ) {
        if(mostEff.level < mostEff.max) { // but first, check if the perk has reached its maximum value
            // Purchase the most efficient perk
            helium -= price;
            mostEff.level++;
            mostEff.spent += price;
            price = AutoPerks.calculatePrice(mostEff, mostEff.level); // Price of *next* purchase.
            inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
            mostEff.efficiency = inc / price;
            effQueue.add(mostEff);  // Add back into queue run again until out of helium
        }
    }
    debug("AutoPerks1: Pass One Complete. Loops ran: " + i, "perks");

    //Begin selectable dump perk code
    var $selector = document.getElementById('dumpPerk');
    if ($selector != null && $selector.value != "None") {
        var heb4dump = helium;
        var index = $selector.selectedIndex;
        var dumpPerk = AutoPerks.getPerkByName($selector[index].innerHTML);
        //debug(AutoPerks.capitaliseFirstLetter(dumpPerk.name) + " level pre-dump: " + dumpPerk.level,"perks");
        if(dumpPerk.level < dumpPerk.max) {
            for(price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level); price < helium && dumpPerk.level < dumpPerk.max; price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level)) {
                helium -= price;
                dumpPerk.spent += price;
                dumpPerk.level++;
            }
        }
        var dumpresults = heb4dump - helium;
        debug("AutoPerks1: Dump Perk " + AutoPerks.capitaliseFirstLetter(dumpPerk.name) + " level post-dump: "+ dumpPerk.level + " Helium Dumped: " + prettify(dumpresults) + " He.", "perks");        
    } //end dump perk code.
    
    var heB4round2 = helium;
    //Repeat the process for spending round 2. This spends any extra helium we have that is less than the cost of the last point of the dump-perk.
    while (effQueue.size > 1) {
        mostEff = effQueue.poll();
        if (mostEff.level >= mostEff.max) continue;
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
        // Add back into queue run again until out of helium
        // but first, check if the perk has reached its maximum value
        if (price >= helium) continue;        
        // Purchase the most efficient perk
        helium -= price;
        mostEff.level++;
        mostEff.spent += price;
        // Reduce its efficiency
        inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
        mostEff.efficiency = inc/price;
        effQueue.add(mostEff);
    }
    var r2results = heB4round2 - helium;
    debug("AutoPerks1: Pass two complete. Round 2 cleanup spend of : " + prettify(r2results),"perks");
}

AutoPerks.spendHelium2 = function(helium) {
    debug("Beginning AutoPerks2 calculate how to spend " + prettify(helium) + " Helium... This could take a while...","perks");
    if(helium < 0) {
        debug("AutoPerks: Major Error - Not enough helium to buy fixed perks.","perks");
        //document.getElementById("nextCoordinated").innerHTML = "Not enough helium to buy fixed perks.";
        return false;
    }
    if (Number.isNaN(helium)) {
        debug("AutoPerks: Major Error - Helium is Not a Number!","perks");
        return false;
    }

    var perks = AutoPerks.getVariablePerks();

    var effQueue = new FastPriorityQueue(function(a,b) { return a.efficiency > b.efficiency } ) // Queue that keeps most efficient purchase at the top
    // Calculate base efficiency of all perks
    for(var i in perks) {
        var price = AutoPerks.calculatePrice(perks[i], 0);
        var inc = AutoPerks.calculateIncrease(perks[i], 0);
        perks[i].efficiency = inc/price;
        if(perks[i].efficiency < 0) {
            debug("Perk ratios must be positive values.","perks");
            return false;
        }
        //Unsaid: If eff == 0, just do nothing.
        if(perks[i].efficiency != 0)
            effQueue.add(perks[i]);
    }
    if (effQueue.size < 1) {
        debug("All Perk Ratios were 0, or some other error.","perks");
        return false;
    }

    var mostEff, price, inc;
    var packPrice,packLevel;
    var i=0;
    //Change the way we iterate.
    function iterateQueue() {
        mostEff = effQueue.poll();
        price = AutoPerks.calculatePrice(mostEff, mostEff.level); // Price of *next* purchase.
        inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
        mostEff.efficiency = inc / price;
        i++;
    }
    for (iterateQueue() ; price <= helium ; iterateQueue() ) {
        if(mostEff.level < mostEff.max) { // but first, check if the perk has reached its maximum value
            // Purchase the most efficient perk
            var t2 = mostEff.name.endsWith("_II");
            if (t2) {
                packLevel = mostEff.increase * 10;
                packPrice = AutoPerks.calculateTotalPrice(mostEff, mostEff.level + packLevel) - mostEff.spent;
            }
            if (t2 && packPrice <= helium) {
                helium -= packPrice;
                mostEff.level+= packLevel;
                mostEff.spent += packPrice;
            }  else  {
                helium -= price;
                mostEff.level++;
                mostEff.spent += price;            
            }
            price = AutoPerks.calculatePrice(mostEff, mostEff.level); // Price of *next* purchase.
            inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
            mostEff.efficiency = inc / price;
            effQueue.add(mostEff);  // Add back into queue run again until out of helium
        }
    }
    debug("AutoPerks2: Pass One Complete. Loops ran: " + i, "perks");

    //Begin selectable dump perk code
    var $selector = document.getElementById('dumpPerk');
    if ($selector != null && $selector.value != "None") {
        var heb4dump = helium;
        var index = $selector.selectedIndex;
        var dumpPerk = AutoPerks.getPerkByName($selector[index].innerHTML);
        //debug(AutoPerks.capitaliseFirstLetter(dumpPerk.name) + " level pre-dump: " + dumpPerk.level,"perks");
        if(dumpPerk.level < dumpPerk.max) {
            for(price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level); price < helium && dumpPerk.level < dumpPerk.max; price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level)) {
                helium -= price;
                dumpPerk.spent += price;
                dumpPerk.level++;
            }
        }
        var dumpresults = heb4dump - helium;
        debug("AutoPerks2: Dump Perk " + AutoPerks.capitaliseFirstLetter(dumpPerk.name) + " level post-dump: "+ dumpPerk.level + " Helium Dumped: " + prettify(dumpresults) + " He.", "perks");        
    } //end dump perk code.
    
    var heB4round2 = helium;
    //Repeat the process for spending round 2. This spends any extra helium we have that is less than the cost of the last point of the dump-perk.
    while (effQueue.size > 1) {
        mostEff = effQueue.poll();
        if (mostEff.level >= mostEff.max) continue; // but first, check if the perk has reached its maximum value
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
        if (price >= helium) continue;
        // Purchase the most efficient perk
        helium -= price;
        mostEff.level++;
        mostEff.spent += price;
        // Reduce its efficiency
        inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
        mostEff.efficiency = inc/price;
        // Add back into queue run again until out of helium
        effQueue.add(mostEff);
    }
    var r2results = heB4round2 - helium;
    debug("AutoPerks2: Pass Two Complete. Cleanup Spent Any Leftover Helium: " + prettify(r2results) + " He.","perks");
}



//Pushes the respec button, then the Clear All button, then assigns perk points based on what was calculated.
AutoPerks.applyCalculationsRespec = function(perks,remainingHelium){
    // *Apply calculations with respec
    if (game.global.canRespecPerks) {
        respecPerks();
    }
    if (game.global.respecActive) {
        clearPerks();
        var preBuyAmt = game.global.buyAmt;

        for(var i in perks) {
            if (perks[i]) {//defense against future unknown perks
                var capitalized = AutoPerks.capitaliseFirstLetter(perks[i].name);
                game.global.buyAmt = perks[i].level;
                if (getPortalUpgradePrice(capitalized) <= remainingHelium) {
                    if (MODULES["perks"].showDetails)
                        debug("AutoPerks-Respec Buying: " + capitalized + " " + perks[i].level, "perks");
                    buyPortalUpgrade(capitalized);
                } else
                    if (MODULES["perks"].showDetails)
                        debug("AutoPerks-Respec Error Couldn't Afford Asked Perk: " + capitalized + " " + perks[i].level, "perks");
            }
        }
        game.global.buyAmt = preBuyAmt;
        numTab(1,true);     //selects the 1st number of the buy-amount tab-bar (Always 1)
        cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
        //activateClicked();    //click OK for them (disappears the window).
    }
    else {
        debug("A Respec would be required and is not available. You used it already, try again next portal.","perks");
        AutoPerks.GUI.$allocatorBtn1.setAttribute('class', 'btn inPortalBtn settingsBtn settingBtnfalse');
        tooltip("Automatic Perk Allocation Error", "customText", event, "A Respec would be required and is NOT available. You used it already, try again next portal. Press <b>esc</b> to close this tooltip." );
    }
}

//Assigns perk points without respeccing if nothing is needed to be negative.
AutoPerks.applyCalculations = function(perks,remainingHelium){
    // // *Apply calculations WITHOUT respec

    var preBuyAmt = game.global.buyAmt;
    var needsRespec = false;
    for(var i in perks) {
        if (perks[i]) {//defense against future unknown perks
            var capitalized = AutoPerks.capitaliseFirstLetter(perks[i].name);
            game.global.buyAmt = perks[i].level - game.portal[capitalized].level - game.portal[capitalized].levelTemp;
            if (game.global.buyAmt < 0) {
                needsRespec = true;
                if (MODULES["perks"].showDetails)
                    debug("AutoPerks RESPEC Required for: " + capitalized + " " + game.global.buyAmt, "perks");
                //break;
            }
            else if (game.global.buyAmt > 0) {
                if (MODULES["perks"].showDetails)
                    debug("AutoPerks-NoRespec Adding: " + capitalized + " " + game.global.buyAmt, "perks");
                buyPortalUpgrade(capitalized);
            }
        }
    }

    game.global.buyAmt = preBuyAmt;
    numTab(1,true);     //selects the 1st number of the buy-amount tab-bar (Always 1)
    cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
    if (needsRespec){
        debug("AutoPerks - A Respec is required. Trying respec...", "perks");
        //get the variable, in this order, then switch screens (or else the sequence is messed up)
        var whichscreen = game.global.viewingUpgrades;
        cancelPortal();
        if (whichscreen)
            viewPortalUpgrades();
        else
            portalClicked();
        AutoPerks.applyCalculationsRespec(perks,remainingHelium);
        //
        if (MODULES["perks"].showDetails) {
            var exportPerks = {};
            for (var item in game.portal){
                el = game.portal[item];
                //For smaller strings and backwards compatibility, perks not added to the object will be treated as if the perk is supposed to be level 0.
                if (el.locked || el.level <= 0) continue;
                //Add the perk to the object with the desired level
                exportPerks[item] = el.level + el.levelTemp;
            }
            console.log(exportPerks);
        }
    }
}

AutoPerks.lowercaseFirst = function(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
AutoPerks.capitaliseFirstLetter = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
AutoPerks.getPercent = function(spentHelium, totalHelium) {
    var frac = spentHelium / totalHelium;
    frac = (frac* 100).toPrecision(2);
    return frac + "%";
}
AutoPerks.toggleFastAllocate = function() {
    MODULES["perks"].useAlgo2 = !MODULES["perks"].useAlgo2;
}

AutoPerks.FixedPerk = function(name, base, level, max, fluffy) {
    this.id = -1;
    this.name = name;
    this.base = base;
    this.type = "exponential";
    this.fixed = true;
    this.level = level || 0;
    this.spent = 0;
    this.max = max || Number.MAX_VALUE;
    if (fluffy == "fluffy") {
    //This affects cost calculation on "Capable" fixed perk (during line 273)
       this.fluffy = true; 
       this.type = "linear";
       this.increase = 10;
   }
}

AutoPerks.VariablePerk = function(name, base, compounding, value, baseIncrease, max, level) {
    this.id = -1;
    this.name = name;
    this.base = base;
    this.type  = "exponential";
    this.exprate = 1.3; //cost is almost always the default 1.3x
    this.fixed = false;
    this.compounding = compounding;
    this.updatedValue = -1; // If a custom ratio is supplied, this will be modified to hold the new value.
    this.baseIncrease = baseIncrease; // The raw stat increase that the perk gives.
    this.efficiency = -1; // Efficiency is defined as % increase * value / He cost
    this.max = max || Number.MAX_VALUE;
    this.level = level || 0; // How many levels have been invested into a perk
    this.spent = 0; // Total helium spent on each perk.
    function getRatiosFromPresets() {
        var valueArray = [];
        for (var i=0; i<presetList.length; i++) {
            valueArray.push(presetList[i][value]);
        }
        return valueArray;
    }
    this.value = getRatiosFromPresets();
}

AutoPerks.ArithmeticPerk = function(name, base, increase, baseIncrease, parent, max, level) { // Calculate a way to obtain parent automatically.
    this.id = -1;
    this.name = name;
    this.base = base;
    this.increase = increase;
    this.type = "linear";
    this.fixed = false;
    this.compounding = false;
    this.baseIncrease = baseIncrease;
    this.parent = parent;
    this.relativeIncrease = parent.baseIncrease / baseIncrease; // The ratio of base increase of tier II to tier I, e.g. for Toughness (5%) vs Toughness II (1%), this will be 5.
    this.value = parent.value.map(function(me) { return me * this.relativeIncrease; });
    this.updatedValue = -1;
    this.efficiency = -1;
    this.max = max || Number.MAX_VALUE;
    this.level = level || 0;
    this.spent = 0;
}

AutoPerks.initializePerks = function () {
    //From here on these magic numbers are not configurable. They represent internal trimps game initial values.
    //DO NOT EDIT UNTIL NEW PERKS GET INVENTED.
    //Fixed perks:
    //AutoPerks.FixedPerk = function(name, base, level, max, fluffy) {
    var siphonology = new AutoPerks.FixedPerk("siphonology", 100000, 3, 3);
    var anticipation = new AutoPerks.FixedPerk("anticipation", 1000, 10, 10);
    var meditation = new AutoPerks.FixedPerk("meditation", 75, 7, 7);
    var relentlessness = new AutoPerks.FixedPerk("relentlessness", 75, 10, 10);
    var range = new AutoPerks.FixedPerk("range", 1, 10, 10);
    var agility = new AutoPerks.FixedPerk("agility", 4, 20, 20);
    var bait = new AutoPerks.FixedPerk("bait", 4, 30);
    var trumps = new AutoPerks.FixedPerk("trumps", 3, 30);
    var packrat = new AutoPerks.FixedPerk("packrat", 3, 30);
    //Variable perks:
    //AutoPerks.VariablePerk = function(name, base, compounding, value, baseIncrease, max, level) {
    var looting = new AutoPerks.VariablePerk("looting", 1, false,             0, 0.05);
    var toughness = new AutoPerks.VariablePerk("toughness", 1, false,         1, 0.05);
    var power = new AutoPerks.VariablePerk("power", 1, false,                 2, 0.05);
    var motivation = new AutoPerks.VariablePerk("motivation", 2, false,       3, 0.05);
    var pheromones = new AutoPerks.VariablePerk("pheromones", 3, false,       4, 0.1);
    var artisanistry = new AutoPerks.VariablePerk("artisanistry", 15, true,   5, 0.1);
    var carpentry = new AutoPerks.VariablePerk("carpentry", 25, true,         6, 0.1);
    var resilience = new AutoPerks.VariablePerk("resilience", 100, true,      7, 0.1);
    var coordinated = new AutoPerks.VariablePerk("coordinated", 150000, true, 8, 0.1);
    var resourceful = new AutoPerks.VariablePerk("resourceful", 50000, true,  9, 0.05);
    var overkill = new AutoPerks.VariablePerk("overkill", 1000000, true,      10, 0.005, 30);
    //Fluffy perks: a new pseudo-category had to be created for "capable" - its a fixed,Linear, (not exponential) perk.
    //TODO: Cost benefit analysis the inter-relationship of buying these.
    var capable = new AutoPerks.FixedPerk("capable", 100000000, 0, 10, "fluffy");
    var cunning = new AutoPerks.VariablePerk("cunning", 100000000000, false,      11, 0.05);
    var curious = new AutoPerks.VariablePerk("curious", 100000000000000, false,   12, 0.05);
    var classy = new AutoPerks.FixedPerk("classy", 100000000000000000, 0, 100, "fluffy");
    //Tier2 perks
    var toughness_II = new AutoPerks.ArithmeticPerk("toughness_II", 20000, 500, 0.01, toughness);
    var power_II = new AutoPerks.ArithmeticPerk("power_II", 20000, 500, 0.01, power);
    var motivation_II = new AutoPerks.ArithmeticPerk("motivation_II", 50000, 1000, 0.01, motivation);
    var carpentry_II = new AutoPerks.ArithmeticPerk("carpentry_II", 100000, 10000, 0.0025, carpentry);
    var looting_II = new AutoPerks.ArithmeticPerk("looting_II", 100000, 10000, 0.0025, looting);

    //gather these into an array of objects
    AutoPerks.perkHolder = [siphonology, anticipation, meditation, relentlessness, range, agility, bait, trumps, packrat, looting, toughness, power, motivation, pheromones, artisanistry, carpentry, resilience, coordinated, resourceful, overkill, capable, cunning, curious, classy, toughness_II, power_II, motivation_II, carpentry_II, looting_II];
    //initialize basics on all.
    for(var i in AutoPerks.perkHolder) {
        AutoPerks.perkHolder[i].level = 0; //errors out here if a new perk is added to the game.
        AutoPerks.perkHolder[i].spent = 0;
        AutoPerks.perkHolder[i].updatedValue = AutoPerks.perkHolder[i].value;
    }
    //more startup stuff.
    AutoPerks.setPerksByName(); //fill it.
    AutoPerks.setDefaultRatios();// Populate ratio textboxes       
}

//Selector functions, essentially like queries but just another layer of abstraction.
//select where all valid and fixed
AutoPerks.getFixedPerks = function() {
    return AutoPerks.getSomePerks(true);
}
//select where all valid and not fixed(therefore variable)
AutoPerks.getVariablePerks = function() {
    return AutoPerks.getSomePerks(null,true);
}
//select where all valid and linear (therefore tier2) but not fluffy
AutoPerks.getTierIIPerks = function() {
    return AutoPerks.getSomePerks(null,null,true);
}
//select where all valid.
AutoPerks.getAllPerks = function() {
    return AutoPerks.getSomePerks(null,null,null,true);
}
//Universal function for accessing a perk object. Returns a bunch of perk types.
AutoPerks.getSomePerks = function(fixed,variable,tier2,allperks) {
    var perks = [];
    for(var i in AutoPerks.perkHolder) {
        var name = AutoPerks.capitaliseFirstLetter(AutoPerks.perkHolder[i].name);
        var perk = game.portal[name];
        if(perk.locked || (typeof perk.level === 'undefined')) continue;
        if ((fixed && AutoPerks.perkHolder[i].fixed) ||
           (variable && !AutoPerks.perkHolder[i].fixed) ||
           (tier2 && AutoPerks.perkHolder[i].type == "linear" && !AutoPerks.perkHolder[i].fluffy) ||
           (allperks))
        {   perks.push(AutoPerks.perkHolder[i]);    }
    }
    return perks;
}

//create a 2nd array (perksByName) of the contents of perkHolder, indexed by name (easy access w/ getPerkByName)
AutoPerks.perksByName = {};
AutoPerks.getPerkByName = function(name) {
    return AutoPerks.perksByName[AutoPerks.lowercaseFirst(name)];
}
AutoPerks.setPerksByName = function() {
    for(var i in AutoPerks.perkHolder)
        AutoPerks.perksByName[AutoPerks.perkHolder[i].name] = AutoPerks.perkHolder[i];
}

// Get owned perks (from save-game)
AutoPerks.getOwnedPerks = function() {
    var perks = [];
    for (var name in game.portal){
        perk = game.portal[name];
        if(perk.locked || (typeof perk.level === 'undefined')) continue;
        perks.push(AutoPerks.getPerkByName(name));
    }
    return perks;
}

//Run the GUI:
AutoPerks.displayGUI();