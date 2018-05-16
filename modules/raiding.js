
//Global Variables
var prestiged = false;

//Called by AT.
function raiding() {
    if (getPageSetting("PrestigeRaiding")) {
        prestigeRaiding();
    }
}

function prestigeRaiding() {
    if (game.global.world === game.options.menu.mapAtZone.setZone && game.options.menu.mapAtZone.enabled === 1) {
        if (getPageSetting('AutoMaps') === 1 && game.global.mapsActive && !prestiged) {
            toggleAutoMaps();
            game.options.menu.repeatUntil.enabled = 2;
            game.global.repeatMap = false;
        }
        else if (getPageSetting('AutoMaps') === 0 && game.global.preMapsActive && !prestiged) {
            game.global.repeatMap = true;
            plusPres();
            buyMap();
            selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1].id);
            runMap();
            prestiged = true;
        }
        else if (prestiged && game.global.preMapsActive) {
            recycleMap();
            toggleAutoMaps();
            game.options.menu.mapAtZone.enabled = 0;
        }
    }
    if (game.global.world === game.options.menu.mapAtZone.setZone + 1) {
        game.options.menu.mapAtZone.enabled = 1;
        game.options.menu.mapAtZone.setZone = nextMapAtZone(game.options.menu.mapAtZone.setZone);
        prestiged = false;
    }

    if (game.global.world === 230)
    {
        game.options.menu.mapAtZone.enabled = 1;
        game.options.menu.mapAtZone.setZone = 495;
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
    if (currentModifier === 1) {
        return zone + 4;
    }
    else if (currentModifier === 5) {
        return zone + 11;
    }
    else {
        return -1;
    }
}

