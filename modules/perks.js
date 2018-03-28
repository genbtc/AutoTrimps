// ==UserScript==
// @name         AutoPerks
// @namespace    http://tampermonkey.net/
// @version      1.0.3-3-3-2018+hiders+zeker
// @description  Trimps Automatic Perk Calculator
// @author       zxv, genBTC
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

//Create blank AutoPerks object
MODULES["perks"] = {};
var AutoPerks = {};

//Import the FastPriorityQueue.js general Library (not AT specific, but needed for perk queue)
var head = document.getElementsByTagName('head')[0];
var queuescript = document.createElement('script');
queuescript.type = 'text/javascript';
//This does NOT need to be changed to your own repo. Its a 3rd party file.
queuescript.src = 'https://genbtc.github.io/AutoTrimps/FastPriorityQueue.js';
head.appendChild(queuescript);

//BEGIN AUTOPERKS GUI CODE:>>>>>>>>>>>>>>

//Create Allocator button and add it to Trimps Perk Window
var buttonbar = document.getElementById("portalBtnContainer");
var allocatorBtn1 = document.createElement("DIV");
allocatorBtn1.id = 'allocatorBTN1';
allocatorBtn1.setAttribute('class', 'btn inPortalBtn settingsBtn settingBtntrue');
allocatorBtn1.setAttribute('onclick', 'AutoPerks.clickAllocate()');
allocatorBtn1.textContent = 'Allocate Perks';
buttonbar.appendChild(allocatorBtn1);
buttonbar.setAttribute('style', 'margin-bottom: 0.8vw;');

//Custom Creation for all perk customRatio boxes in Trimps Perk Window
AutoPerks.createInput = function(perkname,div) {
    var perk1input = document.createElement("Input");
    perk1input.id = perkname + 'Ratio';
    var oldstyle = 'text-align: center; width: 60px;';
    if(game.options.menu.darkTheme.enabled != 2) perk1input.setAttribute("style", oldstyle + " color: black;");
    else perk1input.setAttribute('style', oldstyle);
    perk1input.setAttribute('class', 'perkRatios');

    var perk1label = document.createElement("Label");
    perk1label.id = perkname + 'Label';
    perk1label.innerHTML = perkname;
    perk1label.setAttribute('style', 'margin-right: 1vw; width: 120px; color: white;');
    //add to the div.
    div.appendChild(perk1input);
    div.appendChild(perk1label);
}
var customRatios = document.createElement("DIV");
customRatios.id = 'customRatios';
//Line 1 of the UI
var ratiosLine1 = document.createElement("DIV");
ratiosLine1.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
var listratiosLine1 = ["Overkill","Resourceful","Coordinated","Resilience","Carpentry"];
for (var i in listratiosLine1)
    AutoPerks.createInput(listratiosLine1[i],ratiosLine1);
customRatios.appendChild(ratiosLine1);
//Line 2 of the UI
var ratiosLine2 = document.createElement("DIV");
ratiosLine2.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
var listratiosLine2 = ["Artisanistry","Pheromones","Motivation","Power","Looting"];
for (var i in listratiosLine2)
    AutoPerks.createInput(listratiosLine2[i],ratiosLine2);
//Line 3 of the UI
var ratiosLine3 = document.createElement("DIV");
ratiosLine3.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
var listratiosLine3 = ["Cunning","Curious"];
for (var i in listratiosLine3)
    AutoPerks.createInput(listratiosLine3[i],ratiosLine3);
//Create dump perk dropdown
var dumpperklabel = document.createElement("Label");
dumpperklabel.id = 'DumpPerk Label';
dumpperklabel.innerHTML = "Dump Perk:";
dumpperklabel.setAttribute('style', 'margin-right: 1vw; color: white;');
var dumpperk = document.createElement("select");
dumpperk.id = 'dumpPerk';
dumpperk.setAttribute('onchange', 'AutoPerks.saveDumpPerk()');
var oldstyle = 'text-align: center; width: 120px;';
if(game.options.menu.darkTheme.enabled != 2) dumpperk.setAttribute("style", oldstyle + " color: black;");
else dumpperk.setAttribute('style', oldstyle);
//Add the dump perk dropdown to UI Line 2
ratiosLine2.appendChild(dumpperklabel);
ratiosLine2.appendChild(dumpperk);
//Create ratioPreset dropdown
var ratioPresetLabel = document.createElement("Label");
ratioPresetLabel.id = 'Ratio Preset Label';
ratioPresetLabel.innerHTML = "Ratio Preset:";
ratioPresetLabel.setAttribute('style', 'margin-right: 1vw; color: white;');
var ratioPreset = document.createElement("select");
ratioPreset.id = 'ratioPreset';
var oldstyle = 'text-align: center; width: 110px;';
if(game.options.menu.darkTheme.enabled != 2) ratioPreset.setAttribute("style", oldstyle + " color: black;");
else ratioPreset.setAttribute('style', oldstyle);
//Populate dump perk dropdown list :
//var presetList = [preset_ZXV,preset_ZXVnew,preset_ZXV3,preset_TruthEarly,preset_TruthLate,preset_nsheetz,preset_nsheetzNew,preset_HiderHehr,preset_HiderBalance,preset_HiderMore,preset_genBTC,preset_genBTC2,preset_Zek450,preset_Zek4502,preset_Zek4503];
var html = "<option id='preset_ZXV'>ZXV</option>"
html += "<option id='preset_ZXVnew'>ZXV (new)</option>"
html += "<option id='preset_ZXV3'>ZXV 3</option>"
html += "<option id='preset_TruthEarly'>Truth (early)</option>"
html += "<option id='preset_TruthLate'>Truth (late)</option>"
html += "<option id='preset_nsheetz'>nSheetz</option>"
html += "<option id='preset_nsheetzNew'>nSheetz(new)</option>"
html += "<option id='preset_HiderHehr'>Hider* (He/hr)</option>"
html += "<option id='preset_HiderBalance'>Hider (Balance)</option>"
html += "<option id='preset_HiderMore'>Hider* (More Zones)</option>"
html += "<option id='preset_genBTC'>genBTC</option>"
html += "<option id='preset_genBTC2'>genBTC2</option>"
html += "<option id='preset_Zek450'>Zeker0#1 (z450+)</option>"
html += "<option id='preset_Zek4502'>Zeker0#2 (z450+)</option>"
html += "<option id='preset_Zek4503'>Zeker0#3 (z450+)</option>"
html += "<option id='customPreset'>Custom</option></select>"
//Specific ratios labeled above are configured down in the bottom of this file.Lines 543-556
ratioPreset.innerHTML = html;
//load the last ratio used
var loadLastPreset = localStorage.getItem('AutoperkSelectedRatioPresetID');
if (loadLastPreset != null)
    ratioPreset.selectedIndex = loadLastPreset; // First element is zxv (default) ratio.
else
    ratioPreset.selectedIndex = 0;
ratioPreset.setAttribute('onchange', 'AutoPerks.setDefaultRatios()');
//Add the presets dropdown to UI Line 1
ratiosLine1.appendChild(ratioPresetLabel);
ratiosLine1.appendChild(ratioPreset);
//
customRatios.appendChild(ratiosLine2);
customRatios.appendChild(ratiosLine3);
document.getElementById("portalWrapper").appendChild(customRatios);

//END AUTOPERKS GUI CODE:>>>>>>>>>>>>>>
//--------------------------------------
//Ratio Presets:
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
var preset_Zek450 = [300, 1, 30, 2, 4, 2, 9, 8, 17, 0.1, 1, 320, 1];
var preset_Zek4502 = [350, 1, 40, 2, 3, 2, 5, 8, 2, 0.1, 1, 300, 20];    //Will update again in few days, this seems to be more optimal for more helium for now
var preset_Zek4503 = [450, 0.9, 48, 3.35, 1, 2.8, 7.8, 1.95, 4, 0.04, 1, 120, 175];    //Final change till perky(?) integration
//gather these into an array of objects.
var presetList = [preset_ZXV,preset_ZXVnew,preset_ZXV3,preset_TruthEarly,preset_TruthLate,preset_nsheetz,preset_nsheetzNew,preset_HiderHehr,preset_HiderBalance,preset_HiderMore,preset_genBTC,preset_genBTC2,preset_Zek450,preset_Zek4502,preset_Zek4503];
//
//BEGIN AUTOPERKS SCRIPT CODE:>>>>>>>>>>>>>>

AutoPerks.saveDumpPerk = function() {
    var dumpIndex = document.getElementById("dumpPerk").selectedIndex;
    safeSetItems('AutoperkSelectedDumpPresetID', dumpIndex);
}

AutoPerks.saveCustomRatios = function() {
    var perkRatioBoxes = document.getElementsByClassName('perkRatios');
    var customRatios = [];
    for(var i = 0; i < perkRatioBoxes.length; i++) {
        customRatios.push({'id':perkRatioBoxes[i].id,'value':parseFloat(perkRatioBoxes[i].value)});
    }
    safeSetItems('AutoPerksCustomRatios', JSON.stringify(customRatios) );
}

//sets the ratioboxes with the default ratios embedded in the script when perks are instanciated. hardcoded @ lines 461-488 (ish)
//executed manually at the very last line of this file. (and everytime the ratio-preset dropdown-selector is changed)
//loads custom ratio selections from localstorage if applicable
AutoPerks.setDefaultRatios = function() {
    var perkRatioBoxes = document.getElementsByClassName("perkRatios");
    var ratioSet = document.getElementById("ratioPreset").selectedIndex;
    var currentPerk;
    for(var i = 0; i < perkRatioBoxes.length; i++) {
        currentPerk = AutoPerks.getPerkByName(perkRatioBoxes[i].id.substring(0, perkRatioBoxes[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
        perkRatioBoxes[i].value = currentPerk.value[ratioSet];
    }
    //grab custom ratios if saved.
    if (ratioSet == document.getElementById("ratioPreset").length-1) {
        var tmp = JSON.parse(localStorage.getItem('AutoPerksCustomRatios'));
        if (tmp !== null)
            customRatios = tmp;
        else {
            // If "custom" is manually selected, and no file was found, start by setting all perkRatioBoxes to 0.
            for(var i = 0; i < perkRatioBoxes.length; i++) {
                perkRatioBoxes[i].value = 0;     //initialize to 0.
            }
            return; //then exit.
        }
        //if we have ratios in the storage file, load them
        for(var i = 0; i < perkRatioBoxes.length; i++) {
            //do a quick sanity check (order)
            if (customRatios[i].id != perkRatioBoxes[i].id) continue;
            currentPerk = AutoPerks.getPerkByName(perkRatioBoxes[i].id.substring(0, perkRatioBoxes[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
            perkRatioBoxes[i].value = customRatios[i].value;
        }
    }
    //save the last ratio used
    safeSetItems('AutoperkSelectedRatioPresetID', ratioSet);
}

//updates the internal perk variables with values grabbed from the custom ratio input boxes that the user may have changed.
AutoPerks.setNewRatios = function() {
    var perkRatioBoxes = document.getElementsByClassName('perkRatios');
    var currentPerk;
    for(var i = 0; i < perkRatioBoxes.length; i++) {
        currentPerk = AutoPerks.getPerkByName(perkRatioBoxes[i].id.substring(0, perkRatioBoxes[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
        currentPerk.updatedValue = parseFloat(perkRatioBoxes[i].value);
    }

    toughness.updatedValue = resilience.updatedValue / 2;
    // Manually update tier II perks
    var tierIIPerks = AutoPerks.getTierIIPerks();
    for(var i in tierIIPerks)
        tierIIPerks[i].updatedValue = tierIIPerks[i].parent.updatedValue / tierIIPerks[i].relativeIncrease;
}

//get ready / initialize
AutoPerks.initialise = function() {
    AutoPerks.setperksByName();
    //This does something important but oddly enough but i cant figure out how the local var carries over to mean something later.
    var perks = AutoPerks.getOwnedPerks();
    for(var i in perks) {
        perks[i].level = 0; //errors out here if a new perk is added.
        perks[i].spent = 0;
        perks[i].updatedValue = perks[i].value;
    }

    //grab new ratios if any
    AutoPerks.setNewRatios();
    //save custom ratios if "custom" is selected
    if (document.getElementById("ratioPreset").selectedIndex == document.getElementById("ratioPreset").length-1)
        AutoPerks.saveCustomRatios();
}

//Main function (green "Allocate Perks" button):
AutoPerks.clickAllocate = function() {
    AutoPerks.initialise(); // Reset all fixed perks to 0 and grab new ratios if any

    var preSpentHe = 0;

    var helium = AutoPerks.getHelium();

    // Get fixed perks
    var fixedPerks = AutoPerks.getFixedPerks();
    for (var i = 0; i < fixedPerks.length; i++) {
        fixedPerks[i].level = game.portal[AutoPerks.capitaliseFirstLetter(fixedPerks[i].name)].level;
        var price = AutoPerks.calculateTotalPrice(fixedPerks[i], fixedPerks[i].level);
        fixedPerks[i].spent += price;
        preSpentHe += price;
    }

    //if one of these is NaN, bugs.
    var remainingHelium = helium - preSpentHe;
    // Get owned perks
    var perks = AutoPerks.getOwnedPerks();

    // determine how to spend helium
    AutoPerks.spendHelium(remainingHelium, perks);

    //re-arrange perk points
    AutoPerks.applyCalculations(perks);
    debug("Finishing AutoPerks Auto-Allocate.","perks");
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

AutoPerks.calculatePrice = function(perk, level) { // Calculate price of buying *next* level
    if(perk.fluffy) return Math.ceil(perk.base * Math.pow(10,level));
    if(perk.type == 'exponential') return Math.ceil(level/2 + perk.base * Math.pow(1.3, level));
    else if(perk.type == 'linear') return Math.ceil(perk.base + perk.increase * level);
}

AutoPerks.calculateTotalPrice = function(perk, finalLevel) {
    var totalPrice = 0;
    for(var i = 0; i < finalLevel; i++) {
        totalPrice += AutoPerks.calculatePrice(perk, i);
    }
    return totalPrice;
}

AutoPerks.calculateIncrease = function(perk, level) {
    var increase = 0;
    var value; // Allows for custom perk ratios.

    if(perk.updatedValue != -1) value = perk.updatedValue;
    else value = perk.value;

    if(perk.compounding) increase = perk.baseIncrease;
    else increase = (1 + (level + 1) * perk.baseIncrease) / ( 1 + level * perk.baseIncrease) - 1;
    return increase / perk.baseIncrease * value;
}

AutoPerks.spendHelium = function(helium, perks) {
    debug("Beginning AutoPerks calculate how to spend " + helium + " Helium... This could take a while...","perks");
    if(helium < 0) {
        debug("AutoPerks: Not enough helium to buy fixed perks.","perks");
        //document.getElementById("nextCoordinated").innerHTML = "Not enough helium to buy fixed perks.";
        return;
    }
    if(helium == NaN) {
        debug("AutoPerks: Helium is Not a Number Error","perks");
        return;
     }

    var perks = AutoPerks.getVariablePerks();

    var effQueue = new FastPriorityQueue(function(a,b) { return a.efficiency > b.efficiency } ) // Queue that keeps most efficient purchase at the top
    // Calculate base efficiency of all perks
    for(var i in perks) {
        var price = AutoPerks.calculatePrice(perks[i], 0);
        var inc = AutoPerks.calculateIncrease(perks[i], 0);
        perks[i].efficiency = inc/price;
        if(perks[i].efficiency <= 0) {
            debug("Perk ratios must be positive values.","perks");
            return;
        }
        effQueue.add(perks[i]);
    }

    var mostEff = effQueue.poll();
    var price = AutoPerks.calculatePrice(mostEff, mostEff.level); // Price of *next* purchase.
    var inc;
    while(price <= helium) {
        // Purchase the most efficient perk
        helium -= price;
        mostEff.level++;
        mostEff.spent += price;
        // Reduce its efficiency
        inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
        mostEff.efficiency = inc/price;
        // Add back into queue run again until out of helium
        if(mostEff.level < mostEff.max) // but first, check if the perk has reached its maximum value
            effQueue.add(mostEff);
        mostEff = effQueue.poll();
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
    }
    debug("AutoPerks: Pass one complete.","perks");

    //Begin selectable dump perk code
    var selector = document.getElementById('dumpPerk');
    var index = selector.selectedIndex;
    if(selector.value != "None") {
        var dumpPerk = AutoPerks.getPerkByName(selector[index].innerHTML);
        debug(AutoPerks.capitaliseFirstLetter(dumpPerk.name) + " level pre-dump: " + dumpPerk.level,"perks");
        if(dumpPerk.level < dumpPerk.max) {
            for(price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level); price <= helium; price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level)) {
                helium -= price;
                dumpPerk.spent += price;
                dumpPerk.level++;
            }
        }
    } //end dump perk code.

    //Repeat the process for spending round 2. This spends any extra helium we have that is less than the cost of the last point of the dump-perk.
    while (effQueue.size > 1) {
        mostEff = effQueue.poll();
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
        if(mostEff.level < mostEff.max) // but first, check if the perk has reached its maximum value
            effQueue.add(mostEff);
    }
    debug("AutoPerks: Pass two complete.","perks");
}

//Pushes the respec button, then the Clear All button, then assigns perk points based on what was calculated.
AutoPerks.applyCalculationsRespec = function(perks){
    // *Apply calculations with respec
    if (game.global.canRespecPerks) {
        respecPerks();
    }
    if (game.global.respecActive) {
        clearPerks();
        var preBuyAmt = game.global.buyAmt;
        //var lastcustom = game.global.lastCustomAmt;
        for(var i in perks) {
            var capitalized = AutoPerks.capitaliseFirstLetter(perks[i].name);
            game.global.buyAmt = perks[i].level;
            //console.log(perks[i].name + " " + perks[i].level);
            buyPortalUpgrade(capitalized);
        }
        var FixedPerks = AutoPerks.getFixedPerks();
        for(var i in FixedPerks) {
            var capitalized = AutoPerks.capitaliseFirstLetter(FixedPerks[i].name);
            game.global.buyAmt = FixedPerks[i].level;
            //console.log(FixedPerks[i].name + " " + FixedPerks[i].level);
            buyPortalUpgrade(capitalized);
        }
        game.global.buyAmt = preBuyAmt;
        //game.global.lastCustomAmt = lastcustom;
        numTab(1,true);     //selects the 1st number of the buy-amount tab-bar (Always 1)
        cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
        //activateClicked();    //click OK for them (disappears the window).
    }
    else {
        debug("A Respec would be required and is not available. You used it already, try again next portal.","perks");
        allocatorBtn1.setAttribute('class', 'btn inPortalBtn settingsBtn settingBtnfalse');
        tooltip("Automatic Perk Allocation Error", "customText", event, "A Respec would be required and is NOT available. You used it already, try again next portal. Press <b>esc</b> to close this tooltip." );
    }
}

//Assigns perk points without respeccing if nothing is needed to be negative.
AutoPerks.applyCalculations = function(perks){
    // *Apply calculations WITHOUT respec

    var preBuyAmt = game.global.buyAmt;
    //var lastcustom = game.global.lastCustomAmt;
    var needsRespec = false;
    for(var i in perks) {
        var capitalized = AutoPerks.capitaliseFirstLetter(perks[i].name);
        game.global.buyAmt = perks[i].level - game.portal[capitalized].level;
        //console.log(perks[i].name + " " + perks[i].level);
        if (game.global.buyAmt < 0) {
            needsRespec = true;
            break;
        }
        else
            buyPortalUpgrade(capitalized);
    }
    var FixedPerks = AutoPerks.getFixedPerks();
    for(var i in FixedPerks) {
        var capitalized = AutoPerks.capitaliseFirstLetter(FixedPerks[i].name);
        game.global.buyAmt = FixedPerks[i].level - game.portal[capitalized].level;
        //console.log(FixedPerks[i].name + " " + FixedPerks[i].level);
        if (game.global.buyAmt < 0) {
            needsRespec = true;
            break;
        }
        else
            buyPortalUpgrade(capitalized);
    }
    game.global.buyAmt = preBuyAmt;
    //game.global.lastCustomAmt = lastcustom;
    numTab(1,true);     //selects the 1st number of the buy-amount tab-bar (Always 1)
    cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
    if (needsRespec == true){
        //get the variable, in this order, then switch screens (or else the sequence is messed up)
        var whichscreen = game.global.viewingUpgrades;
        cancelPortal();
        if (whichscreen)
            viewPortalUpgrades();
        else
            portalClicked();
        AutoPerks.applyCalculationsRespec(perks);
    }
}

AutoPerks.capitaliseFirstLetter = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

AutoPerks.getPercent = function(spentHelium, totalHelium) {
    var frac = spentHelium / totalHelium;
    frac = (frac* 100).toPrecision(2);
    return frac + "%";
}

AutoPerks.lowercaseFirst = function(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
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
        //var perkOrder = [looting,toughness,power,motivation,pheromones,artisanistry,carpentry,resilience,coordinated,resourceful,overkill,cunning,curious];
        var valueArray = [];
        for (var i=0; i<presetList.length; i++) {
            valueArray.push(presetList[i][value]);
        }
        return valueArray;
        //return [preset_ZXV[value],preset_ZXVnew[value],preset_ZXV3[value],preset_TruthEarly[value],preset_TruthLate[value],preset_nsheetz[value],preset_nsheetzNew[value],preset_HiderHehr[value],preset_HiderBalance[value],preset_HiderMore[value]];
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
//Tier2 perks
var toughness_II = new AutoPerks.ArithmeticPerk("toughness_II", 20000, 500, 0.01, toughness);
var power_II = new AutoPerks.ArithmeticPerk("power_II", 20000, 500, 0.01, power);
var motivation_II = new AutoPerks.ArithmeticPerk("motivation_II", 50000, 1000, 0.01, motivation);
var carpentry_II = new AutoPerks.ArithmeticPerk("carpentry_II", 100000, 10000, 0.0025, carpentry);
var looting_II = new AutoPerks.ArithmeticPerk("looting_II", 100000, 10000, 0.0025, looting);
//gather these into an array of objects
AutoPerks.perkHolder = [siphonology, anticipation, meditation, relentlessness, range, agility, bait, trumps, packrat, looting, toughness, power, motivation, pheromones, artisanistry, carpentry, resilience, coordinated, resourceful, overkill, capable, cunning, curious, toughness_II, power_II, motivation_II, carpentry_II, looting_II];

//Selector functions, essentially like queries but just another layer of abstraction.
//select where all valid and linear (therefore tier2) but not fluffy
AutoPerks.getTierIIPerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) {
        var name = AutoPerks.capitaliseFirstLetter(AutoPerks.perkHolder[i].name);
        var perk = game.portal[name];
        if(perk.locked || (typeof perk.level === 'undefined')) continue;
        if(AutoPerks.perkHolder[i].type == "linear" && !AutoPerks.perkHolder[i].fluffy) {
            perks.push(AutoPerks.perkHolder[i]);
        }
    }
    return perks;
}

//select where all valid.
AutoPerks.getAllPerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) {
        var name = AutoPerks.capitaliseFirstLetter(AutoPerks.perkHolder[i].name);
        var perk = game.portal[name];
        if(perk.locked || (typeof perk.level === 'undefined')) continue;
        perks.push(AutoPerks.perkHolder[i]);
    }
    return perks;
}

//select where all valid and fixed
AutoPerks.getFixedPerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) {
        var name = AutoPerks.capitaliseFirstLetter(AutoPerks.perkHolder[i].name);
        var perk = game.portal[name];
        if(perk.locked || (typeof perk.level === 'undefined')) continue;
        if(AutoPerks.perkHolder[i].fixed) {
            perks.push(AutoPerks.perkHolder[i]);
        }
    }
    return perks;
}

//select where all valid and not fixed(therefore variable)
AutoPerks.getVariablePerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) {
        var name = AutoPerks.capitaliseFirstLetter(AutoPerks.perkHolder[i].name);
        var perk = game.portal[name];
        if(perk.locked || (typeof perk.level === 'undefined')) continue;
        if(!AutoPerks.perkHolder[i].fixed) {
            perks.push(AutoPerks.perkHolder[i]);
        }
    }
    return perks;
}

//create a 2nd array (perksByName) of the contents of perkHolder, indexed by name (easy access w/ getPerkByName)
AutoPerks.perksByName = {};
AutoPerks.getPerkByName = function(name) {
    return AutoPerks.perksByName[AutoPerks.lowercaseFirst(name)];
}
AutoPerks.setperksByName = function() {
    for(var i in AutoPerks.perkHolder)
        AutoPerks.perksByName[AutoPerks.perkHolder[i].name] = AutoPerks.perkHolder[i];
}
AutoPerks.setperksByName();//fill it.

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

// Populate ratio textboxes
AutoPerks.setDefaultRatios();

//populate dump perk dropdown list
var dumpDropdown = document.getElementById('dumpPerk');
var html = "";
var dumpperks = AutoPerks.getVariablePerks();
for(var i = 0; i < dumpperks.length; i++)
    html += "<option id='"+dumpperks[i].name+"Dump'>"+AutoPerks.capitaliseFirstLetter(dumpperks[i].name)+"</option>"
html += "<option id='none'>None</option></select>";
dumpDropdown.innerHTML = html;
//load the last dump preset used
var loadLastDump = localStorage.getItem('AutoperkSelectedDumpPresetID');
if (loadLastDump != null)
    dumpDropdown.selectedIndex = loadLastDump;
else
    dumpDropdown.selectedIndex = dumpDropdown.length - 2; // Second to last element is looting_II (or other)
