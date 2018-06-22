//MODULES["heirlooms"] = {};
////////////////////////////////////////
//Heirloom Functions////////////////////
////////////////////////////////////////

//OLD:
//renamed from sortHeirlooms to worthOfHeirlooms
var worth = {'Shield': {}, 'Staff': {}};
function worthOfHeirlooms(){
    worth = {'Shield': {}, 'Staff': {}};
    for (var loom in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[loom];
        worth[theLoom.type][loom] = theLoom.rarity;
    }

    //sort high to low value, priority on rarity, followed by mod evaluation
    for (var x in worth){
        worth[x] = Object.keys(worth[x]).sort(function(a, b) {
            if(worth[x][b] == worth[x][a]) {
                return evaluateHeirloomMods(b, 'heirloomsExtra') - evaluateHeirloomMods(a, 'heirloomsExtra');
            }
            else
                return worth[x][b] - worth[x][a];
        });
    }
}


//NEW:
//makes an array of heirlooms sitting in the temporary extra area to indicate to the autoHeirlooms2() function which to Carry/Drop
var worth2 = {'Shield': [], 'Staff': []};
function worthOfHeirlooms2(){
    worth2 = {'Shield': [], 'Staff': []};
    for (var index in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[index];
        var data = {'location': 'heirloomsExtra', 'index': index, 'rarity': theLoom.rarity, 'eff': evaluateHeirloomMods(index, 'heirloomsExtra')};
        worth2[theLoom.type].push(data);
    }
    //sort algorithm: high to low value, priority on rarity, followed by mod evaluation
    var valuesort = function(a, b) {
        if(b.rarity == a.rarity) {
            return b.eff - a.eff;
        }
        else
            return b.rarity - a.rarity;
    };
    // sort shield
    worth2['Shield'].sort(valuesort);
    // sort staff
    worth2['Staff'].sort(valuesort);

    //Output each carried Heirlooms worth to console (or say heirloomsExtra instead)
    /*
    for(var index in game.global.heirloomsCarried) {
        console.log(evaluateHeirloomMods(index, 'heirloomsCarried'));
    }
    */
}

//Automatically evaluate and carry the best heirlooms, and recommend upgrades for equipped items. AutoHeirlooms will only change carried items when the heirlooms window is not open. Carried items will be compared and swapped with the types that are already carried. If a carry spot is empty, it will be filled with the best shield (if available). Evaluation is based ONLY on the following mods (listed in order of priority, high to low): Void Map Drop Chance/Trimp Attack, Crit Chance/Crit Damage, Miner Efficiency/Metal Drop, Gem Drop/Dragimp Efficiency, Farmer/Lumberjack Efficiency. For the purposes of carrying, rarity trumps all of the stat evaluations. Empty mod slots are valued at the average value of the best missing mod.
//NEW:
function autoHeirlooms2() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        //PART 1: start by dropping ALL carried heirlooms
        var originalLength = game.global.heirloomsCarried.length;
        for(var index=0; index < originalLength; index++) {
            selectHeirloom(0, 'heirloomsCarried');
            stopCarryHeirloom();
        }
        //PART 2: immediately begin carrying any protected heirlooms.
        var originalLength = game.global.heirloomsExtra.length;
        for(var index=0; index < originalLength; index++) {
            var theLoom = game.global.heirloomsExtra[index];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms)){
                selectHeirloom(index, 'heirloomsExtra');
                carryHeirloom();
                index--; originalLength--;  //stop index-skipping/re-ordering (idk how else to do it).
            }
        }
        worthOfHeirlooms2();
        //now start by re-filling any empty carried slots with the most highly evaluated heirlooms
        //Alternates EQUALLY between Shield and Staff, putting the best ones of each.
        //PART 3:
        while ((game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms) && game.global.heirloomsExtra.length > 0){
            //re-evaluate their worth (needed to refresh the worth array since we for sure re-arranged everything.)
            worthOfHeirlooms2();
            if (worth2["Shield"].length > 0){
                var carryshield = worth2["Shield"].shift();
                selectHeirloom(carryshield.index, 'heirloomsExtra');
                carryHeirloom();
            }
            worthOfHeirlooms2();
            if (worth2["Staff"].length > 0){
                var carrystaff = worth2["Staff"].shift();
                selectHeirloom(carrystaff.index, 'heirloomsExtra');
                carryHeirloom();
            }
        }
        worthOfHeirlooms();
        // Doing the Alternating Shield/Staff method above can cause good heirlooms to remain un-carried, just because the above was trying to hard to balance.
        // example: It picks up 4 ethereal shields and 2 ethereal staffs and 2 bad rare staffs, but there was actually a 5th good ethereal shield that it skipped.
        //          this will replace the lesser rarity or stat with the higher rarity or stat, either shield or staff.
        //PART 4:
        //Check each carried heirloom....
        for(var carried in game.global.heirloomsCarried) {
            var theLoom = game.global.heirloomsCarried[carried];
            //... against the Opposite type
            var opposite = {"Shield":"Staff", "Staff":"Shield"};
            if(worth[opposite[theLoom.type]].length == 0) continue; //end loop quick if absolutely nothin to swap in
            var index = worth[opposite[theLoom.type]][0];
            //... and compare the carried against the best worth opposite type in the extra pile. (since part 3 above took care of the bests of each same type)
            if(theLoom.rarity < game.global.heirloomsExtra[index].rarity) {
                if (!theLoom.protected){
                    selectHeirloom(carried, 'heirloomsCarried');
                    stopCarryHeirloom();
                    selectHeirloom(index, 'heirloomsExtra');
                    carryHeirloom();
                    worthOfHeirlooms();
                }
                //do nothing if the carried thing was protected.
            }
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        heirloomUpgradeHighlighting();
    }
}

//OLD:
function autoHeirlooms() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        //start by immediately carrying any protected heirlooms.
        for(var extra in game.global.heirloomsExtra) {
            var theLoom = game.global.heirloomsExtra[extra];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms)){
                selectHeirloom(extra, 'heirloomsExtra');
                carryHeirloom();
            }
        }
        //re-evaluate their worth (needed to refresh the worth array since we possibly moved the extras)
        worthOfHeirlooms();
        for(var carried in game.global.heirloomsCarried) {
            var theLoom = game.global.heirloomsCarried[carried];
            if(worth[theLoom.type].length == 0) continue;
            var index = worth[theLoom.type][0];
            if(theLoom.rarity < game.global.heirloomsExtra[index].rarity || (theLoom.rarity == game.global.heirloomsExtra[index].rarity && evaluateHeirloomMods(carried, 'heirloomsCarried') < evaluateHeirloomMods(index, 'heirloomsExtra'))) {
                if (!theLoom.protected){
                    selectHeirloom(carried, 'heirloomsCarried');
                    stopCarryHeirloom();
                    selectHeirloom(index, 'heirloomsExtra');
                    carryHeirloom();
                    worthOfHeirlooms();
                }
            }
        }
        if (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms){
            if(worth.Shield.length > 0)
                selectHeirloom(worth.Shield[0], 'heirloomsExtra');
            else if(worth.Staff.length > 0)
                selectHeirloom(worth.Staff[0], 'heirloomsExtra');
            carryHeirloom();
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        heirloomUpgradeHighlighting();
    }
}

//common to both autoheirloom1 and 2
//Shows you which Mod you would be best off upgrading in the heirloom window by highlighting it in blueish gray and a tooltip.
function heirloomUpgradeHighlighting() {
    var bestUpgrade;
    if(game.global.selectedHeirloom[1].includes('Equipped')) {
        var loom = game.global[game.global.selectedHeirloom[1]];
        bestUpgrade = evaluateHeirloomMods(0, game.global.selectedHeirloom[1], true);
        if(bestUpgrade.index) {
            bestUpgrade.effect *= getModUpgradeCost(loom, bestUpgrade.index);
            bestUpgrade.effect = bestUpgrade.effect.toFixed(6);
            var styleIndex = 4 + (bestUpgrade.index * 3);
            //enclose in backtic ` for template string $ stuff
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].style.backgroundColor = "lightblue";
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseover", `tooltip(\'Heirloom\', \"customText\", event, \'<div class=\"selectedHeirloomItem heirloomRare${loom.rarity}\"> AutoTrimps recommended upgrade for this item. </div>\'         )`);
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseout", 'tooltip(\'hide\')');
            //lightblue = greyish
            //swapClass("tooltipExtra", "tooltipExtraHeirloom", document.getElementById("tooltipDiv"));
            //document.getElementById("tooltipDiv");
        }
    }
}

//Automatically upgrades the best mod on the equipped shield and equipped staff. Runs until you run out of nullifium.
//Do not tamper with this.
function autoNull(){try {
    for(var e,d=[game.global.ShieldEquipped,game.global.StaffEquipped],o=0;2>o;o++){var l=d[o];if(e=evaluateHeirloomMods(0,l.type+"Equipped",!0),e.index){selectedMod=e.index;var a=getModUpgradeCost(l,selectedMod);if(game.global.nullifium<a)continue;game.global.nullifium-=a;var i=getModUpgradeValue(l,selectedMod),t=l.mods[selectedMod];t[1]=i,"undefined"!=typeof t[3]?t[3]++:(t[2]=0,t[3]=1),game.heirlooms[l.type][l.mods[selectedMod][0]].currentBonus=i}}
    } catch (err) {
        debug("AutoSpendNull Error encountered, no Heirloom detected?: " + err.message,"general");
    }
}

//commented out because it was never finished.
/*
function autoSwapHeirlooms(loomtype="Shield" || "Staff", loomlocation="heirloomsCarried" || "heirloomsExtra"){
    var bestfooddroploom = [];
    var bestwooddroploom = [];
    var bestmetaldroploom = [];
    var bestgemdroploom = [];

    //search in loomlocation="heirloomsCarried" or "heirloomsExtra"
    for(var eachloom in game.global[loomlocation]) {
        var theLoom = game.global[loomlocation][eachloom];
        if (theLoom.type != loomtype)
            continue;
        var effRating = evaluateHeirloomMods(eachloom, loomlocation);
    }
    if(loomlocation.includes('Equipped'))
        loom = game.global[loomlocation];
    else
        loom = game.global[loomlocation][loom];

    //---------- SHIELD SWAP FUNCTION (search on critdamage and swap)---
    var count = 0;
    for (var carried in game.global.heirloomsCarried){
        var heirloom = game.global.heirloomsCarried[carried];
        for (var item in heirloom.mods){
            if (item[0] == "critDamage" && item[1] > 300){
                unequipHeirloom(game.global.ShieldEquipped, "heirloomsCarried");
                game.global.ShieldEquipped = heirloom;
                game.global.heirloomsCarried.splice(count, 1);
            }
        }
        count++;
    }
    for (var item in heirloom.mods){
        game.heirlooms[heirloom.type][heirloom.mods[item][0]].currentBonus += heirloom.mods[item][1];
    }
    populateHeirloomWindow();
    //-------OK------
}
*/

//Heirloom helper function
function checkForMod(what, loom, location){
    var heirloom = game.global[location][loom];
    for (var mod in heirloom.mods){
        if (heirloom.mods[mod][0] == what) return true;
    }
    return false;
}

//Determines the best heirloom mods
function evaluateHeirloomMods(loom, location, upgrade) {
    var index = loom;
    var bestUpgrade = {
        'index': null,
        'name': '',
        'effect': 0
    };
    var tempEff;
    var steps;
    if(location.includes('Equipped'))
        loom = game.global[location];
    else
        loom = game.global[location][loom];
    //  return loom.rarity;
    var eff = 0;
    for(var m in loom.mods) {
        var critmult = getPlayerCritDamageMult();
        var critchance = getPlayerCritChance();
        var cmb = (critmult - game.heirlooms.Shield.critDamage.currentBonus/100);
        var ccb = (critchance - game.heirlooms.Shield.critChance.currentBonus/100);
        switch(loom.mods[m][0]) {
            case 'critChance':
                tempEff = ((loom.mods[m][1]/100) * cmb)/(ccb * cmb + 1 - ccb);
                eff += tempEff;
                if(upgrade){
                    if(loom.mods[m][1] >= 30) break;
                    steps = game.heirlooms.Shield.critChance.steps[loom.rarity];
                    tempEff = ((steps[2]/100) * critmult)/((critchance * critmult) + 1 - critchance);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critChance';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'critDamage':
                tempEff = ((loom.mods[m][1]/100) * ccb)/(cmb * ccb + 1 - ccb);
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.critDamage.steps[loom.rarity];
                    tempEff = ((steps[2]/100)* critchance)/((critchance * critmult) + 1 - critchance);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critDamage';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'trimpAttack':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.trimpAttack.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.trimpAttack.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'trimpAttack';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'voidMaps':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.voidMaps.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.voidMaps.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'voidMaps';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'MinerSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.MinerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'MinerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'metalDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.metalDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'metalDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'DragimpSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.DragimpSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'DragimpSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'gemsDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.gemsDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'gemsDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'FarmerSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.FarmerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'FarmerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'LumberjackSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.LumberjackSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'LumberjackSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'empty':
                var av;
                if(upgrade) break;
                //value empty mod as the average of the best mod it doesn't have. If it has all good mods, empty slot has no value
                if(loom.type == 'Shield') {
                    if(!checkForMod('trimpAttack', index, location)){
                        steps = game.heirlooms[loom.type].trimpAttack.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = av/100;
                        eff += tempEff;
                    }
                    else if(!checkForMod('voidMaps', index, location)){
                        steps = game.heirlooms[loom.type].voidMaps.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (steps[2]/100);
                        eff += tempEff;
                    }
                    else if(!checkForMod('critChance', index, location)){
                        steps = game.heirlooms[loom.type].critChance.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * cmb)/(ccb * cmb + 1 - ccb);
                        eff += tempEff;
                    }
                    else if(!checkForMod('critDamage', index, location)){
                        steps = game.heirlooms[loom.type].critDamage.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * ccb)/(cmb * ccb + 1 - ccb);
                        eff += tempEff;
                    }
                }
                if(loom.type == 'Staff') {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    av = steps[0] + ((steps[1] - steps[0])/2);
                    if(!checkForMod('MinerSpeed', index, location) || !checkForMod('metalDrop', index, location) || !checkForMod('DragimpSpeed', index, location) || !checkForMod('gemsDrop', index, location)){
                        eff += 0.75*av/100;
                    }
                    else if(!checkForMod('FarmerSpeed', index, location) || !checkForMod('LumberjackSpeed', index, location)) {
                        eff += 0.5*av/100;
                    }
                }
                break;
                //trimpHealth?
        }
    }
    if(upgrade) return bestUpgrade;
    return eff;
}


var hrlmProtBtn1 = document.createElement("DIV");
hrlmProtBtn1.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn1.setAttribute('onclick', 'protectHeirloom(this, true)');
hrlmProtBtn1.innerHTML = 'Protect/Unprotect';  //since we cannot detect the selected heirloom on load, ambiguous name
hrlmProtBtn1.id='protectHeirloomBTN1';
var hrlmProtBtn2 = document.createElement("DIV");
hrlmProtBtn2.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn2.setAttribute('onclick', 'protectHeirloom(this, true)');
hrlmProtBtn2.innerHTML = 'Protect/Unprotect';
hrlmProtBtn2.id='protectHeirloomBTN2';
var hrlmProtBtn3 = document.createElement("DIV");
hrlmProtBtn3.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn3.setAttribute('onclick', 'protectHeirloom(this, true)');
hrlmProtBtn3.innerHTML = 'Protect/Unprotect';
hrlmProtBtn3.id='protectHeirloomBTN3';
document.getElementById('equippedHeirloomsBtnGroup').appendChild(hrlmProtBtn1);
document.getElementById('carriedHeirloomsBtnGroup').appendChild(hrlmProtBtn2);
document.getElementById('extraHeirloomsBtnGroup').appendChild(hrlmProtBtn3);


function protectHeirloom(element, modify){
    var selheirloom = game.global.selectedHeirloom;  //[number, location]
    var heirloomlocation = selheirloom[1];
    var heirloom = game.global[heirloomlocation];
    if (selheirloom[0] != -1)
        var heirloom = heirloom[selheirloom[0]];
    //hard way ^^, easy way>>
    //var heirloom = getSelectedHeirloom();
    if (modify)    //sent by onclick of protect button, to toggle the state.
        heirloom.protected = !heirloom.protected;

    if (!element) { //then we came from newSelectHeirloom
        if (heirloomlocation.includes("Equipped"))
            element = document.getElementById('protectHeirloomBTN1');
        else if (heirloomlocation == "heirloomsCarried")
            element = document.getElementById('protectHeirloomBTN2');
        else if (heirloomlocation == "heirloomsExtra")
            element = document.getElementById('protectHeirloomBTN3');
    }
    if (element)
        element.innerHTML = heirloom.protected ? 'UnProtect' : 'Protect';
}

//wrapper for selectHeirloom, to handle the protect button
function newSelectHeirloom(number, location, elem){
    selectHeirloom(number, location, elem);
    protectHeirloom();
}

//replacement function that inserts a new onclick action into the heirloom icons so it can populate the proper Protect icon. (yes this is the best way to do it.)
function generateHeirloomIcon(heirloom, location, number){
    if (typeof heirloom.name === 'undefined') return "<span class='icomoon icon-sad3'></span>";
    var icon = (heirloom.type == "Shield") ? 'icomoon icon-shield3' : 'glyphicon glyphicon-grain';
	var animated = (game.options.menu.showHeirloomAnimations.enabled) ? "animated " : "";
	var html = '<span class="heirloomThing ' + animated + 'heirloomRare' + heirloom.rarity;
    if (location == "Equipped") html += ' equipped';
    var locText = "";
    if (location == "Equipped") locText += '-1,\'' + heirloom.type + 'Equipped\'';
    else locText += number + ', \'heirlooms' + location + '\'';
    html += '" onmouseover="tooltip(\'Heirloom\', null, event, null, ' + locText + ')" onmouseout="tooltip(\'hide\')" onclick="newSelectHeirloom(';
    html += locText + ', this)"> <span class="' + icon + '"></span></span>';
    return html;
}
