MODULES["jobs"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["jobs"].scientistRatio = 25;        //ratio for scientists. (totalRatios / this)
MODULES["jobs"].scientistRatio2 = 10;       //used for lowlevel and Watch challenge
MODULES["jobs"].magmamancerRatio = 0.1;     //buys 10% of your gem resources per go.
//Worker Ratios = [Farmer,Lumber,Miner]
MODULES["jobs"].autoRatio8 = [1,1,100];
MODULES["jobs"].autoRatio7 = [1,1,24];
MODULES["jobs"].autoRatio6 = [1,12,12];
MODULES["jobs"].autoRatio5 = [1,2,22];
MODULES["jobs"].autoRatio4 = [1,1,10];
MODULES["jobs"].autoRatio3 = [3,1,4];
MODULES["jobs"].autoRatio2 = [3,3,5];
MODULES["jobs"].autoRatio1 = [1,1,1];
MODULES["jobs"].customRatio;    //set this like above and it will Auto use it.

function safeBuyJob(jobTitle, amount) {
    if (!Number.isFinite(amount) || amount === 0 || typeof amount === 'undefined' || Number.isNaN(amount)) {
        //debug("Exiting out of buyjob early " + jobTitle + " " + amount,"jobs");
        return false;
    }
    var old = preBuy2();
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var result;
    if (amount < 0) {
        amount = Math.abs(amount);
        game.global.firing = true;
        game.global.buyAmt = amount;
        result = true;
    } else{
        game.global.firing = false;
        game.global.buyAmt = amount;
        //if can afford, buy what we wanted,
        result = canAffordJob(jobTitle, false) && freeWorkers>0;
        if (!result) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
            //if we can't afford it, try to use 'Max' and try again.
            result = canAffordJob(jobTitle, false) && freeWorkers>0;
        }
    }
    if (result) {
        debug((game.global.firing ? 'Firing ' : 'Hiring ') + prettify(game.global.buyAmt) + ' ' + jobTitle + 's', "jobs", "*users");
        buyJob(jobTitle, true, true);
    }
    postBuy2(old);
    return true;
}

function safeFireJob(job,amount) {
    //do some jiggerypokery in case jobs overflow and firing -1 worker does 0 (java integer overflow)
    var oldjob = game.jobs[job].owned;
    if (oldjob == 0 || amount == 0)
        return 0;
    var test = oldjob;
    var x = 1;
    if (amount != null)
        x = amount;
    if (!Number.isFinite(oldjob)){
        while (oldjob == test) {
            test-=x;
            x*=2;
        }
    }
    var old = preBuy2();
    game.global.firing = true;
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    while (x >= 1 && freeWorkers == Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed) {
        game.global.buyAmt = x;
        buyJob(job, true, true);
        x*=2;
    }
    postBuy2(old);
    return x/2;
}


//Hires and Fires all workers (farmers/lumberjacks/miners/scientists/trainers/explorers)
function buyJobs() {
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    var farmerRatio = parseInt(getPageSetting('FarmerRatio'));
    var lumberjackRatio = parseInt(getPageSetting('LumberjackRatio'));
    var minerRatio = parseInt(getPageSetting('MinerRatio'));
    var totalRatio = farmerRatio + lumberjackRatio + minerRatio;
    var scientistRatio = totalRatio / MODULES["jobs"].scientistRatio;
    if (game.jobs.Farmer.owned < 100) {
        scientistRatio = totalRatio / MODULES["jobs"].scientistRatio2;
    }

    //FRESH GAME LOWLEVEL NOHELIUM CODE.
    if (game.global.world == 1 && game.global.totalHeliumEarned<=5000){
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9){
            if (game.resources.food.owned > 5 && freeWorkers > 0){
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned)
                    safeBuyJob('Farmer', 1);
                else if (game.jobs.Farmer.owned > game.jobs.Lumberjack.owned && !game.jobs.Lumberjack.locked)
                    safeBuyJob('Lumberjack', 1);
            }
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (game.resources.food.owned > 20 && freeWorkers > 0){
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned && !game.jobs.Miner.locked)
                    safeBuyJob('Miner', 1);
            }
        }
        return;
    //make sure the game always buys at least 1 farmer, so we can unlock lumberjacks.
    } else if (game.jobs.Farmer.owned == 0 && game.jobs.Lumberjack.locked && freeWorkers > 0) {
        safeBuyJob('Farmer', 1);
    //make sure the game always buys 10 scientists.
    } else if (getPageSetting('MaxScientists')!=0 && game.jobs.Scientist.owned < 10 && scienceNeeded > 100 && freeWorkers > 0 && game.jobs.Farmer.owned >= 10) {
        safeBuyJob('Scientist', 1);
    }
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    if (game.global.challengeActive == 'Watch'){
        scientistRatio = totalRatio / MODULES["jobs"].scientistRatio2;
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire){
            //so the game buys scientists first while we sit around waiting for breed timer.
            var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
            if (game.jobs.Scientist.owned < buyScientists && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.1){
                var toBuy = buyScientists-game.jobs.Scientist.owned;
                var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
                if((buyScientists > 0 && freeWorkers > 0) && (getPageSetting('MaxScientists') > game.jobs.Scientist.owned || getPageSetting('MaxScientists') == -1))
                    safeBuyJob('Scientist', toBuy <= canBuy ? toBuy : canBuy);
            }
            else
                return;
        }
    }
    else
    {   //exit if we are havent bred to at least 90% breedtimer yet...
        var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
        if (!(game.global.challengeActive == "Trapper") && game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire) {
            if (breeding > game.resources.trimps.realMax() * 0.33) {
                freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
                //only hire if we have less than 300k trimps (dont spam up the late game with meaningless 1's)
                if (freeWorkers > 0 && game.resources.trimps.realMax() <= 3e5) {
                    //do Something tiny, so earlygame isnt stuck on 0 (down to 33% trimps. stops getting stuck from too low.)
                    safeBuyJob('Miner', 1);
                    safeBuyJob('Farmer', 1);
                    safeBuyJob('Lumberjack', 1);
                }
            }
            //standard quit routine if <90% breed:
            return;
        }
        //continue if we have >90% breedtimer:
    }
    var subtract = 0;
    //used multiple times below: (good job javascript for allowing functions in functions)
    function checkFireandHire(job,amount) {
        freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
        if (amount == null)
            amount = 1;
        if (canAffordJob(job, false, amount) && !game.jobs[job].locked) {
            if (freeWorkers < amount)
                subtract = safeFireJob('Farmer');
            safeBuyJob(job, amount);
        }
    }
    //Scientists:
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    var ms = getPageSetting('MaxScientists');
    if (ms!=0 && !game.jobs.Scientist.locked && !breedFire) {
        var buyScientists = Math.floor((scientistRatio / totalRatio) * totalDistributableWorkers) - game.jobs.Scientist.owned - subtract;
        var sci = game.jobs.Scientist.owned;
        if((buyScientists > 0 && freeWorkers > 0) && (ms > sci || ms == -1)) {
            var n = ms - sci;
            if (ms == -1)
                n=buyScientists;
            else if (n < 0)
                n=0;
            if (buyScientists > n)
                buyScientists = n;
            safeBuyJob('Scientist', buyScientists);
        }
    }
    //Meteorologists
    if (game.jobs.Meteorologist.locked == 0) {
        checkFireandHire('Meteorologist');
    }
    //Trainers:
    if (getPageSetting('MaxTrainers') > game.jobs.Trainer.owned || getPageSetting('MaxTrainers') == -1) {
        // capped to tributes percentage.
        var trainerpercent = getPageSetting('TrainerCaptoTributes');
        if (trainerpercent > 0 && !game.buildings.Tribute.locked) {
            var curtrainercost = game.jobs.Trainer.cost.food[0]*Math.pow(game.jobs.Trainer.cost.food[1], game.jobs.Trainer.owned);
            var curtributecost = getBuildingItemPrice(game.buildings.Tribute, "food", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level);
            if (curtrainercost < curtributecost * (trainerpercent/100))
                checkFireandHire('Trainer');
        }
        // regular
        else
            checkFireandHire('Trainer');
    }
    //Explorers:
    if (getPageSetting('MaxExplorers') > game.jobs.Explorer.owned || getPageSetting('MaxExplorers') == -1) {
        checkFireandHire('Explorer');
    }

    //Buy Farmers:
    //Buy/Fire Miners:
    //Buy/Fire Lumberjacks:
    function ratiobuy(job, jobratio) {
        if(!game.jobs[job].locked && !breedFire) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
            var toBuy = Math.floor((jobratio / totalRatio) * totalDistributableWorkers) - game.jobs[job].owned - subtract;
            var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
            var amount = toBuy <= canBuy ? toBuy : canBuy;
            if (amount != 0) {
                safeBuyJob(job, amount);
                //debug("Ratio Buying Job: " + job + " " + amount + " " + jobratio, "jobs"); 
            }
            return true;
        }
        else
            return false;
    }
    ratiobuy('Farmer', farmerRatio);
    if (!ratiobuy('Miner', minerRatio) && breedFire && game.global.turkimpTimer === 0)
        safeBuyJob('Miner', game.jobs.Miner.owned * -1);
    if (!ratiobuy('Lumberjack', lumberjackRatio) && breedFire)
        safeBuyJob('Lumberjack', game.jobs.Lumberjack.owned * -1);

    //Magmamancers code:
    if (game.jobs.Magmamancer.locked) return;
    //game.jobs.Magmamancer.getBonusPercent(true);
    var timeOnZone = Math.floor((new Date().getTime() - game.global.zoneStarted) / 60000);
    // Add 5 minutes for zone-time for magmamancer mastery
    if (game.talents.magmamancer.purchased) {
        timeOnZone += 5;
    }
    // Add some minutes for Still Magmamancing master
    if (game.talents.stillMagmamancer.purchased) {
        timeOnZone += game.global.spireRows;
    }
    var stacks2 = Math.floor(timeOnZone / 10);
    if (getPageSetting('AutoMagmamancers') && stacks2 > tierMagmamancers) {
        var old = preBuy2();
        game.global.firing = false;
        game.global.buyAmt = 'Max';
        game.global.maxSplit = MODULES["jobs"].magmamancerRatio;    // (10%)
        //fire dudes to make room.
        var firesomedudes = calculateMaxAfford(game.jobs['Magmamancer'], false, false, true);
        //fire (10x) as many workers as we need so "Max" (0.1) can work, because FreeWorkers are considered as part of the (10%) calc
        var inverse = (1 /  MODULES["jobs"].magmamancerRatio);
        firesomedudes *= inverse;
        if (game.jobs.Farmer.owned > firesomedudes)
            safeFireJob('Farmer', firesomedudes);
        else if (game.jobs.Lumberjack.owned > firesomedudes)
            safeFireJob('Lumberjack', firesomedudes);
        else if (game.jobs.Miner.owned > firesomedudes)
            safeFireJob('Miner', firesomedudes);
        //buy the Magmamancers
        game.global.firing = false;
        game.global.buyAmt = 'Max';
        game.global.maxSplit = MODULES["jobs"].magmamancerRatio;
        buyJob('Magmamancer', true, true);
        postBuy2(old);
        debug("Bought " + (firesomedudes/inverse) + ' Magmamancers. Total Owned: ' + game.jobs['Magmamancer'].owned, "magmite", "*users");
        tierMagmamancers += 1;
    }
    else if (stacks2 < tierMagmamancers) {
        tierMagmamancers = 0;
    }
    
    //Some kind of Protection or error checking. not needed much?
    if ((game.resources.trimps.owned - game.resources.trimps.employed) < 2) {
        var a = (game.jobs.Farmer.owned > 2)
        if (a)
            safeFireJob('Farmer', 2);
        var b = (game.jobs.Lumberjack.owned > 2)
        if (b)
            safeFireJob('Lumberjack', 2);
        var c = (game.jobs.Miner.owned > 2)
        if (c)
            safeFireJob('Miner', 2);
        if (a || b || c)
            debug("Job Protection Triggered, Number Rounding Error: [f,l,m]= " + a + " " + b + " " + c,"other");
    }
}
var tierMagmamancers = 0;


function workerRatios() {
    var ratioSet;
    if (MODULES["jobs"].customRatio) {
        ratioSet = MODULES["jobs"].customRatio;
    } else if (game.buildings.Tribute.owned > 6000 && mutations.Magma.active()) {
        ratioSet = MODULES["jobs"].autoRatio8;
    } else if (game.buildings.Tribute.owned > 4500 && mutations.Magma.active()) {
        ratioSet = MODULES["jobs"].autoRatio7;
    } else if (game.buildings.Tribute.owned > 3000 && mutations.Magma.active()) {
        ratioSet = MODULES["jobs"].autoRatio6;
    } else if (game.buildings.Tribute.owned > 1500) {
        ratioSet = MODULES["jobs"].autoRatio5;
    } else if (game.buildings.Tribute.owned > 1000) {
        ratioSet = MODULES["jobs"].autoRatio4;
    } else if (game.resources.trimps.realMax() > 3000000) {
        ratioSet = MODULES["jobs"].autoRatio3;
    } else if (game.resources.trimps.realMax() > 300000) {
        ratioSet = MODULES["jobs"].autoRatio2;
    } else {
        ratioSet = MODULES["jobs"].autoRatio1;
    }
    //Override normal ratios with challenge specific ones
    if (game.global.challengeActive == 'Watch'){
        ratioSet = MODULES["jobs"].autoRatio1;
    } else if (game.global.challengeActive == 'Metal'){
        ratioSet = [4,5,0]; //this challenge likes workers split half and half between farmers and lumbers (idk why)
    }
    //Install the new ratios into active settings
    setPageSetting('FarmerRatio',ratioSet[0]);
    setPageSetting('LumberjackRatio',ratioSet[1]);
    setPageSetting('MinerRatio',ratioSet[2]);
}
