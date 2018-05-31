

//Global Variables
var prestiged = false;
var mapAtZone = nextMapAtZone(game.global.world - 1);
var gameMapAtZoneEnabled = game.options.menu.mapAtZone.enabled;

//Called by AT.
function raiding() {

    prestigeRaiding();

    if (getPageSetting("AutomateAT")) {
        if (game.global.challengeActive === "Daily") {
            autoTrimpSettings["VoidMaps"].value = getPageSetting("DailyVMZone") > 0 ? getPageSetting("DailyVMZone") : autoTrimpSettings["VoidMaps"].value;
            autoTrimpSettings["ExitSpireCell"].value = 100;
            gameMapAtZoneEnabled = 1;
        }
        else if (game.global.challengeActive === "") {
            autoTrimpSettings["VoidMaps"].value = getPageSetting("FillerVMZone") > 0 ? getPageSetting("FillerVMZone") : autoTrimpSettings["VoidMaps"].value;
            autoTrimpSettings["ExitSpireCell"].value = getPageSetting("FillerSpireCell") > 0 ? getPageSetting("FillerSpireCell") : autoTrimpSettings["ExitSpireCell"].value;
            gameMapAtZoneEnabled = 0;
        }
    }

    if (game.global.world < getPageSetting("RaidingStartZone")) {
        mapAtZone = nextMapAtZone(getPageSetting("RaidingStartZone") - 1);
    }
    else if (game.global.world + 15 < mapAtZone || mapAtZone < game.global.world)
    {
        mapAtZone = nextMapAtZone(game.global.world - 1);
    }
}

function prestigeRaiding() {
    if (game.global.world === mapAtZone) {
        if (getPageSetting('AutoMaps') === 1 && !prestiged) {
            game.options.menu.mapAtZone.enabled = 0;
            autoTrimpSettings["AutoMaps"].value = 0;
            if (!game.global.switchToMaps) {
                mapsClicked();
            }
            mapsClicked();
            game.options.menu.repeatUntil.enabled = 2;
            game.global.repeatMap = true;
        }
        else if (getPageSetting('AutoMaps') === 0 && game.global.preMapsActive && !prestiged) {
            getPageSetting("PrestigeRaiding") === 0 ? plusPres() : bestGear();
            if (buyMap() > 0) {
                selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
                runMap();
            }
            prestiged = true;
        }
        else if (prestiged && game.global.preMapsActive) {
            recycleMap();
            game.options.menu.mapAtZone.enabled = gameMapAtZoneEnabled ? 1 : 0;
            autoTrimpSettings["AutoMaps"].value = 1;
            mapAtZone = nextMapAtZone(mapAtZone);
            prestiged = false;
        }
    }
}


//Helper Scripts
function plusPres() {
    document.getElementById("biomeAdvMapsSelect").value = "Random";
    document.getElementById('advExtraLevelSelect').value = plusMapToRun(game.global.world);
    document.getElementById('advSpecialSelect').value = "p";
    document.getElementById("lootAdvMapsRange").value = 0;
    document.getElementById("difficultyAdvMapsRange").value = 9;
    document.getElementById("sizeAdvMapsRange").value = 9;
    document.getElementById('advPerfectCheckbox').checked = false;
    if (updateMapCost(true) > game.resources.fragments.owned) {
        document.getElementById('advSpecialSelect').value = 0;
    }
    updateMapCost();
}

function bestGear() {
    document.getElementById("biomeAdvMapsSelect").value = "Random";
    document.getElementById('advSpecialSelect').value = "p";
    document.getElementById("lootAdvMapsRange").value = 0;
    document.getElementById("difficultyAdvMapsRange").value = 0;
    document.getElementById("sizeAdvMapsRange").value = 9;
    document.getElementById('advPerfectCheckbox').checked = false;
    document.getElementById('advExtraLevelSelect').value = game.global.world%10<5 ? 5 - game.global.world%10 :10;
    if (updateMapCost(true) > game.resources.fragments.owned)
    {
        document.getElementById('advSpecialSelect').value = 0;
    }
    while (updateMapCost(true) > game.resources.fragments.owned)
    {
        document.getElementById('advExtraLevelSelect').value--;
    }
    updateMapCost();
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
    if (currentModifier === 0) {
        return 1 + zone;
    }
    else if (currentModifier >= 5) {
        return 16 - currentModifier + zone;
    }
    else {
        return 5 - currentModifier + zone;
    }
}

