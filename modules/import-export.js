MODULES["import-export"] = {};

//2018 AutoTrimps - genBTC, copied from SettingsGUI.js
//Create settings profile selection dropdown box in DOM. (import/export section)
var $settingsProfiles;
function settingsProfileMakeGUI() {
    var $settingsProfilesLabel = document.createElement("Label");
    $settingsProfilesLabel.id = 'settingsProfiles Label';
    $settingsProfilesLabel.innerHTML = "Settings Profile: ";
    if (game.options.menu.darkTheme.enabled == 2) $settingsProfilesLabel.setAttribute("style", "margin-left: 1.2vw; margin-right: 0.8vw; color: #C8C8C8; font-size: 0.8vw;");
    else $settingsProfilesLabel.setAttribute("style", "margin-left: 1.2vw; margin-right: 0.8vw; color:white; font-size: 0.8vw;");
    $settingsProfiles = document.createElement("select");
    $settingsProfiles.id = 'settingsProfiles';
    $settingsProfiles.setAttribute('class', 'noselect');
    $settingsProfiles.setAttribute('onchange', 'settingsProfileDropdownHandler()');
    var oldstyle = 'text-align: center; width: 160px; font-size: 1.1vw;';
    if(game.options.menu.darkTheme.enabled != 2) $settingsProfiles.setAttribute("style", oldstyle + " color: black;");
    else $settingsProfiles.setAttribute('style', oldstyle);
    //Create settings profile selection dropdown
    var $settingsProfilesButton = document.createElement("Button");
    $settingsProfilesButton.id = 'settingsProfiles Button';
    $settingsProfilesButton.setAttribute('class', 'btn btn-info');
    $settingsProfilesButton.innerHTML = "&lt;Delete Profile";
    $settingsProfilesButton.setAttribute('style', 'margin-left: 0.5vw; margin-right: 0.5vw; font-size: 0.8vw;');
    $settingsProfilesButton.setAttribute('onclick','onDeleteProfileHandler()');
    //Add the $settingsProfiles dropdown to UI
    var $ietab = document.getElementById('Import Export');
    //Any ERRORs here are caused by incorrect order loading of script and you should reload until its gone.(for now)
    $ietab.insertBefore($settingsProfilesLabel, $ietab.childNodes[1]);
    $ietab.insertBefore($settingsProfiles, $ietab.childNodes[2]);
    $ietab.insertBefore($settingsProfilesButton, $ietab.childNodes[3]);
    //populate with a Default (read default settings):
    var innerhtml = "<option id='customProfileCurrent'>Current</option>";
    //populate with a Default (read default settings):
    innerhtml += "<option id='customProfileDefault'>Reset to Default</option>";
    //Append a 2nd default item named "Save New..." and have it tied to a write function();
    innerhtml += "<option id='customProfileNew'>Save New...</option>";
    //dont forget to populate the rest of it with stored items:
    $settingsProfiles.innerHTML = innerhtml;
}
settingsProfileMakeGUI();

//This switches into the new profile when the dropdown is selected.
//it is the "onchange" handler of the settingsProfiles dropdown
//Asks them do a confirmation check tooltip first. The
function settingsProfileDropdownHandler() {
    if ($settingsProfiles == null) return;
    var index = $settingsProfiles.selectedIndex;
    var id = $settingsProfiles.options[index].id;
    //Current: placeholder.
    if (id == 'customProfileCurrent')
        return;
    cancelTooltip();
//Default: simply calls Reset To Default:
    if (id == 'customProfileDefault')
        //calls a tooltip then resetAutoTrimps() below
        ImportExportTooltip('ResetDefaultSettingsProfiles');
//Save new...: asks a name and saves new profile
    else if (id == 'customProfileNew')
        //calls a tooltip then nameAndSaveNewProfile() below
        ImportExportTooltip('NameSettingsProfiles');
//Reads the existing profile name and switches into it.
    else if (id == 'customProfileRead')
        //calls a tooltip then confirmedSwitchNow() below
        ImportExportTooltip('ReadSettingsProfiles');
    //NOPE.XWait 200ms for everything to reset and then re-select the old index.
    //setTimeout(function(){ settingsProfiles.selectedIndex = index;} ,200);
    return;
}

function confirmedSwitchNow() {
    if ($settingsProfiles == null) return;
    var index = $settingsProfiles.selectedIndex;
    var profname = $settingsProfiles.options[index].text;
    //load the stored profiles from browser
    var loadLastProfiles = JSON.parse(localStorage.getItem('ATSelectedSettingsProfile'));
    if (loadLastProfiles != null) {
        var results = loadLastProfiles.filter(function(elem,i){
            return elem.name == profname;
        });
        if (results.length > 0) {
            resetAutoTrimps(results[0].data,profname);
            debug("Successfully loaded existing profile: " + profname, "profile");
        }
    }
}

//called by ImportExportTooltip('NameSettingsProfiles')
function nameAndSaveNewProfile() {
    //read the name in from tooltip
    try {
        var profname = document.getElementById("setSettingsNameTooltip").value.replace(/[\n\r]/gm, "");
        if (profname == null) {
            debug("Error in naming, the string is empty.", "profile");
            return;
        }
    } catch (err) {
        debug("Error in naming, the string is bad." + err.message, "profile");
        return;
    }
    var profile = {
        name: profname,
        data: JSON.parse(serializeSettings())
    }
    //load the old data in,
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    //rewrite the updated array in
    var presetlists = [profile];
    //add the two arrays together, string them, and store them.
    safeSetItems('ATSelectedSettingsProfile', JSON.stringify(oldpresets.concat(presetlists)));
    debug("Successfully created new profile: " + profile.name, "profile");
    ImportExportTooltip('message', 'Successfully created new profile: ' + profile.name);
    //Update dropdown menu to reflect new name:
    let optionElementReference = new Option(profile.name);
    optionElementReference.id = 'customProfileRead';
    if ($settingsProfiles == null) return;
    $settingsProfiles.add(optionElementReference);
    $settingsProfiles.selectedIndex = $settingsProfiles.length-1;
}

//event handler for profile delete button - confirmation check tooltip
function onDeleteProfileHandler() {
    ImportExportTooltip('DeleteSettingsProfiles');  //calls a tooltip then onDeleteProfile() below
}
//Delete Profile runs after.
function onDeleteProfile() {
    if ($settingsProfiles == null) return;
    var index = $settingsProfiles.selectedIndex;
    //Remove the option
    $settingsProfiles.options.remove(index);
    //Stay on the same index (becomes next item) - so we dont have to Toggle into a new profile again and can keep chain deleting.
    $settingsProfiles.selectedIndex = (index > ($settingsProfiles.length-1)) ? $settingsProfiles.length-1 : index;
    //load the old data in:
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    //rewrite the updated array in. string them, and store them.
    var target = (index-3); //subtract the 3 default choices out
    oldpresets.splice(target, 1);
    safeSetItems('ATSelectedSettingsProfile', JSON.stringify(oldpresets));
    debug("Successfully deleted profile #: " + target, "profile");
}

//Populate dropdown menu with list of AT SettingsProfiles
function initializeSettingsProfiles() {
    if ($settingsProfiles == null) return;
    //load the old data in:
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    oldpresets.forEach(function(elem){
        //Populate dropdown menu to reflect new name:
        let optionElementReference = new Option(elem.name);
        optionElementReference.id = 'customProfileRead';
        $settingsProfiles.add(optionElementReference);
    });
    $settingsProfiles.selectedIndex = 0;
}
initializeSettingsProfiles();


//Handler for the popup/tooltip window for Import/Export/Default
function ImportExportTooltip(what, event) {
    if (game.global.lockTooltip)
        return;
    var $elem = document.getElementById("tooltipDiv");
    swapClass("tooltipExtra", "tooltipExtraNone", $elem);
    var ondisplay = null; // if non-null, called after the tooltip is displayed
    var tooltipText;
    var costText = "";
    var titleText = what;
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
        debug(tooltipText, "profile");
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
        tooltipText = "<img src='" + basepath + "mi.png'>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>Thats all the help you get.</div></div>";
    } else if (what == 'ReadSettingsProfiles') {
        //Shows a Question Popup to READ the profile:
        titleText = '<b>Loading New AutoTrimps Profile...</b><p>Current Settings will be lost';
        tooltipText = '<b>NOTICE:</b> Switching to new AutoTrimps settings profile!!!! <br>All current settings <b>WILL</b> be lost after this point. <br>You might want to cancel, to go back and save your existing settings first....';
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 10vw' onclick='cancelTooltip(); confirmedSwitchNow();'>Confirm and Switch Profiles</div><div style='margin-left: 15%' class='btn btn-info' style='margin-left: 5vw' onclick='cancelTooltip();'>Cancel</div></div>";
    } else if (what == 'ResetDefaultSettingsProfiles') {
        //Shows a Question Popup to RESET to DEFAULT the profile:
        titleText = '<b>Loading AutoTrimps Default Profile...</b><p>Current Settings will be lost!';
        tooltipText = '<b>NOTICE:</b> Switching to Default AutoTrimps settings profile!!!! <br>All current settings <b>WILL</b> be lost after this point. <br>You might want to cancel, to go back and save your existing settings first.... <br>This will <b><u>Reset</u></b> the script to factory settings.';
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 10vw' onclick='cancelTooltip(); resetAutoTrimps(); settingsProfiles.selectedIndex = 1;'>Reset to Default Profile</div><div style='margin-left: 15%' class='btn btn-info' style='margin-left: 5vw' onclick='cancelTooltip();'>Cancel</div></div>";
    } else if (what == 'NameSettingsProfiles') {
        //Shows a Question Popup to NAME the profile
        titleText = "Enter New Settings Profile Name";
        tooltipText = "What would you like the name of the Settings Profile to be?<br/><br/><textarea id='setSettingsNameTooltip' style='width: 100%' rows='1'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 10vw' onclick='cancelTooltip(); nameAndSaveNewProfile();'>Import</div><div class='btn btn-info' style='margin-left: 5vw' onclick='cancelTooltip();document.getElementById(\"settingsProfiles\").selectedIndex=0;'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('setSettingsNameTooltip').focus();
        };
    } else if (what == 'DeleteSettingsProfiles') {
        //Shows a Question Popup to DELETE the profile:
        titleText = "<b>WARNING:</b> Delete Profile???"
        tooltipText = "You are about to delete the <B><U>"+`${settingsProfiles.value}`+"</B></U> settings profile.<br>This will not switch your current settings though. Continue ?<br/>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); onDeleteProfile();'>Delete Profile</div><div style='margin-left: 15%' class='btn btn-info' onclick='cancelTooltip();'>Cancel</div></div>";
    } else if (what == 'message') {
        titleText = "Generic message";
        tooltipText = event;
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' style='width: 50%' onclick='cancelTooltip();'>OK</div></div>";
    }
    //Common:
    game.global.lockTooltip = true;
    $elem.style.left = "33.75%";
    $elem.style.top = "25%";
    document.getElementById("tipTitle").innerHTML = titleText;
    document.getElementById("tipText").innerHTML = tooltipText;
    document.getElementById("tipCost").innerHTML = costText;
    $elem.style.display = "block";
    if (ondisplay !== null)
        ondisplay();
}
//reset autotrimps to defaults (also handles imports)
function resetAutoTrimps(imported,profname) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpSettings');
        //delete,remake,init defaults, recreate everything:
        autoTrimpSettings = imported ? imported : new Object(); //load the import.
        var $settingsRow = document.getElementById("settingsRow");
        $settingsRow.removeChild(document.getElementById("autoSettings"));
        $settingsRow.removeChild(document.getElementById("autoTrimpsTabBarMenu"));
        automationMenuSettingsInit();
        initializeAllTabs();
        initializeAllSettings();
        initializeSettingsProfiles();
        updateCustomButtons();
        saveSettings();
        checkPortalSettings();
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
    if (imported) {
        debug("Successfully imported new AT settings...", "profile");
        if (profname)   //pass in existing profile name to use:
            ImportExportTooltip("message", "Successfully Imported Autotrimps Settings File!: " + profname);
        else            //or prompt to create a new name:
            ImportExportTooltip('NameSettingsProfiles');
    } else {
        debug("Successfully reset AT settings to Defaults...", "profile");
        ImportExportTooltip("message", "Autotrimps has been successfully reset to its defaults!");
    }
}

//import autotrimps settings from a textbox
//For importing a new AT Config on the fly and reloading/applying all the settings.
function loadAutoTrimps() {
    //try the import
    try {
        var thestring = document.getElementById("importBox").value.replace(/[\n\r]/gm, "");
        var tmpset = JSON.parse(thestring);
        if (tmpset == null) {
            debug("Error importing AT settings, the string is empty.", "profile");
            return;
        }
    } catch (err) {
        debug("Error importing AT settings, the string is bad." + err.message, "profile");
        return;
    }
    debug("Importing new AT settings file...", "profile");
    resetAutoTrimps(tmpset);
}

//remove stale values from past autotrimps versions
function cleanupAutoTrimps() {
    for (var setting in autoTrimpSettings) {
        var $elem = document.getElementById(autoTrimpSettings[setting].id);
        if ($elem == null)
            delete autoTrimpSettings[setting];
    }
}

//export MODULE variables to a textbox
function exportModuleVars() {
    return JSON.stringify(compareModuleVars());
}

//diff two modules to find the difference;
function compareModuleVars() {
    var diffs = {};
    var mods = Object.keys(MODULES);
    for (var i=0,leni=mods.length;i<leni;i++) {
        var vars = Object.keys(MODULES[mods[i]]);
        for (var j=0,lenj=vars.length;j<lenj;j++) {
            var a = MODULES[mods[i]][vars[j]];
            var b = MODULESdefault[mods[i]][vars[j]];
            if (JSON.stringify(a)!=JSON.stringify(b)) {
                if (diffs[mods[i]] === undefined)
                    diffs[mods[i]] = {};
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
        var thestring = document.getElementById("importBox").value;
        var strarr = thestring.split(/\n/);
        for (var line in strarr) {
            var s = strarr[line];
            s = s.substring(0, s.indexOf(';')+1); //cut after the ;
            s = s.replace(/\s/g,'');    //regexp remove ALL(/g) whitespaces(\s)
            eval(s);
            strarr[line] = s;
        }
        var tmpset = compareModuleVars();
    } catch (err) {
        debug("Error importing MODULE vars, the string is bad." + err.message, "profile");
        return;
    }
    localStorage.removeItem('ATMODULES');
    safeSetItems('ATMODULES', JSON.stringify(tmpset));
}

//reset MODULE variables to default, (and/or then import)
function resetModuleVars(imported) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('ATMODULES');
        MODULES = JSON.parse(JSON.stringify(MODULESdefault));
        //load everything again, anew
        safeSetItems('ATMODULES', JSON.stringify(ATMODULES));
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}
