

//Global Variables
var prestiged = false;
var originalVMZone = -1;
var originalExitSpireCell = -1;
var mapAtZone = nextMapAtZone(game.global.world - 1);

//Called by AT.
function raiding() {

    if (getPageSetting("RaidingStartZone") !== -1 && game.global.world >= getPageSetting("RaidingStartZone") && game.global.world + 15 < mapAtZone) {
        mapAtZone = nextMapAtZone(game.global.world - 1);
    }
    prestigeRaiding();

    if (getPageSetting("AutomateAT")) {
        originalVMZone = originalVMZone === -1 ? autoTrimpSettings["VoidMaps"].value : originalVMZone;
        originalExitSpireCell = originalExitSpireCell === -1 ? autoTrimpSettings["ExitSpireCell"].value : originalExitSpireCell;
        if (game.global.challengeActive === "Daily") {
            autoTrimpSettings["VoidMaps"].value = getPageSetting("DailyVMZone") > 0 ? getPageSetting("DailyVMZone") : originalVMZone;
            autoTrimpSettings["ExitSpireCell"].value = 100;
        }
        else if (game.global.challengeActive === "") {
            autoTrimpSettings["VoidMaps"].value = getPageSetting("FillerVMZone") > 0 ? getPageSetting("FillerVMZone") : originalVMZone;
            autoTrimpSettings["ExitSpireCell"].value = getPageSetting("FillerSpireCell") > 0 ? getPageSetting("FillerSpireCell") : originalExitSpireCell;
        }
    }
    else {
        autoTrimpSettings["VoidMaps"].value = originalVMZone;
        autoTrimpSettings["ExitSpireCell"].value = originalExitSpireCell;
    }
}

function prestigeRaiding() {
    if (game.global.world === mapAtZone) {
        if (getPageSetting('AutoMaps') === 1 && !prestiged) {
            forceAbandonTrimps();
            autoTrimpSettings["AutoMaps"].value = 0;
            game.options.menu.repeatUntil.enabled = 2;
            game.global.repeatMap = true;
        }
        else if (getPageSetting('AutoMaps') === 0 && game.global.preMapsActive && !prestiged) {
            plusPres();
            buyMap();
            selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
            runMap();
            prestiged = true;
        }
        else if (prestiged && game.global.preMapsActive) {
            recycleMap();
            autoTrimpSettings["AutoMaps"].value = 1;
            mapAtZone = nextMapAtZone(mapAtZone);
            prestiged = false;
        }
    }
}


//Helper Scripts
function plusPres(){
    document.getElementById("biomeAdvMapsSelect").value = "Random";
    document.getElementById('advExtraLevelSelect').value = plusMapToRun(game.global.world);
    document.getElementById('advSpecialSelect').value = "p";
    document.getElementById("lootAdvMapsRange").value = 0;
    document.getElementById("difficultyAdvMapsRange").value = 9;
    document.getElementById("sizeAdvMapsRange").value = 9;
    document.getElementById('advPerfectCheckbox').checked = false;
    updateMapCost();
}

function bestGear() {
    document.getElementById("biomeAdvMapsSelect").value = "Random";
    document.getElementById('advSpecialSelect').value = 0;
    document.getElementById("lootAdvMapsRange").value = 0;
    document.getElementById("difficultyAdvMapsRange").value = 0;
    document.getElementById("sizeAdvMapsRange").value = 9;
    document.getElementById('advPerfectCheckbox').checked = false;
    document.getElementById('advExtraLevelSelect').value = 10;
    while (updateMapCost(true) > game.resources.fragments.owned)
    {
        document.getElementById('advExtraLevelSelect').value--;
    }
}


function plusMapToRun(zone) {
    var currentModifier = (zone - 235) % 15;
    if (currentModifier === 1) {
        if (zone % 10 === 1) {
            return 4;
        }
        else if (zone % 10 === 6) {
            return 5;
        }
    }
    else if (currentModifier === 5) {
        if (zone % 10 === 5) {
            return 6;
        }
        else if (zone % 10 === 0) {
            return 5;
        }
    }
    return 0;
}

function nextMapAtZone(zone) {
    var currentModifier = (zone - 235) % 15;
    if (currentModifier < 5) {
        return 5 - currentModifier + zone;
    }
    else {
        return 16 - currentModifier + zone;
    }
}

