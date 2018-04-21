var settings = {
  set: function() {
  // Core settings
    this.core.gather: getPageSetting("ManualGather2");
    this.core.upgrades: getPageSetting("BuyUpgrades");
    this.core.trapping: getPageSetting("TrapTrimps");
    this.core.breedTimer: getPageSetting("ManageBreedTimer");
    this.core.patience: getPageSetting("UsePatience");
    this.core.genTimer: getPageSetting("GeneticistTimer");
    this.core.spireTimer: getPageSetting("SpireBreedTimer"):
    this.core.autoPerks: getPageSetting("AutoAllocatePerks");
    this.core.autoStartDaily: getPageSetting("AutoStartDaily");
    this.core.autoEndDaily: getPageSetting("AutoFinishDaily");
    this.core.autoEndDailyZone: getPageSetting("AutoFinishDailyZone");
    this.core.finishC2: getPageSetting("FinishC2");
    this.core.autoEggs: getPageSetting("AutoEggs");
    this.core.manualCoords: getPageSetting("ManualCoords");
    this.core.autoPortal: getPageSetting("AutoPortal");
    this.core.HeliumHrChallenge: getPageSetting("HeliumHourChallenge");
    this.core.customAutoPortal: getPageSetting("CustomAutoPortal");
    this.core.heHrNotBefore: getPageSetting("HeHrDontPortalBefore");
    this.core.heHrBuffer: getPageSetting("HeliumHrBuffer");
    this.core.pauseScript: getPageSetting("PauseScript");
    
  // Building settings
    this.buildings.buyStorage: getPageSetting("BuyStorage");
    this.buildings.buyBuildings: getPageSetting("BuyBuildings");
    this.buildings.warpCap: getPageSetting("WarpstationCap");
    this.buildings.warpCoordBuy: getPageSetting("WarpstationCoordBuy");
    this.buildings.maxHut: getPageSetting("MaxHut");
    this.buildings.maxHouse: getPageSetting("MaxHouse");
    this.bulidings.maxMansion: getPageSetting("MaxMansion");
    this.buildings.maxHotel: getPageSetting("MaxHotel");
    this.buildings.maxResort: getPageSetting("MaxResort");
    this.buildings.maxGateway: getPageSetting("MaxGateway");
    this.buildings.maxWormhole: getPageSetting("MaxWormhole");
    this.buildings.maxCollector: getPageSetting("MaxCollector");
    this.buildings.maxGym: getPageSetting("MaxGym");
    this.buildings.maxTribute: getPageSetting("MaxTribute");
    this.buildings.gymWall: getPageSetting("GymWall");
    this.buildings.firstGiga: getPageSetting("FirstGigastation");
    this.buildings.deltaGiga: getPageSetting("DeltaGigastation");
    this.buildings.warpWall: getPageSetting("WarpstationWall3");
    this.buildings.maxNursey: getPageSetting("MaxNursery");
    this.buildings.noNurseriesUntil: getPageSetting("NoNurseriesUntil");
    this.buildings.preSpireNurseries: getPageSetting("PreSpireNurseries");
    
   // Jobs settings
    this.jobs.buyJobs: getPageSetting("BuyJobs");
    this.jobs.workerRatios: getPageSetting("WorkerRatios");
    this.jobs.autoMagnamancers: getPageSetting("AutoMagnamancers");
    this.jobs.farmerRatio: getPageSetting("FarmerRatio");
    this.jobs.lumberRatio: getPageSetting("LumberjackRatio");
    this.jobs.minerRatio: getPageSetting("MinerRatio");
    this.jobs.maxScientists: getPageSetting("MaxScientists");
    this.jobs.maxExplorers: getPageSetting("MaxExplorers");
    this.jobs.maxTrainers: getPageSetting("MaxTrainers");
    this.jobs.trainerCapToTributes: getPageSetting("TrainerCaptoTributes");
    this.jobs.breedFire: getPageSetting("BreedFire");
    
  // Gear settings
    this.gear.buyArmor: getPageSetting("BuyArmor");
    this.gear.buyArmorUpgrades: getPageSetting("BuyArmorUpgrades");
    this.gear.buyWeapons: getPageSetting("BuyWeapons");
    this.gear.buyWeaponUpgrades: getPageSetting("BuyWeaponUpgrades");
    this.gear.capEquip2: getPageSetting("CapEquip2");
    this.gear.dynPrestige2: getPageSetting("DynamicPrestige2");
    this.gear.prestige: getPageSetting("Prestige");
    this.gear.forcePresZ: getPageSetting("ForcePresZ");
    this.gear.PrestigeSkipMode: getPageSetting("PrestigeSkipMode");
    this.gear.PrestigeSkip2: getPageSetting("PrestigeSkip2");
    this.gear.delayArmorWhenNeeded: getPageSetting("DelayArmorWhenNeeded");
    this.gear.buyShieldblock: getPageSetting("BuyShieldblock");
    
  // Map settings
    this.maps.automaps: getPageSetting("AutoMaps");
    this.maps.dynSiphon: getPageSetting("DynamicSiphonology");
    this.maps.preferMetal: getPageSetting("PreferMetal");
    this.maps.maxMapBonusAfterZone: getPageSetting("MaxMapBonusAfterZone");
    this.maps.disableFarm: getPageSetting("DisableFarm");
    this.maps.lowerFarmZ: getPageSetting("LowerFarmingZone");
    this.maps.maxStackForSpire: getPageSetting("MaxStacksForSpire");
    this.maps.minutesBeforeSpire: getPageSetting("MinutestoFarmBeforeSpire");
    this.maps.ignoreSpiresUntil: getPageSetting("IgnoreSpiresUntil");
    this.maps.runBionicBeforeSpire: getPageSetting("RunBionicBeforeSpire");
    this.maps.exitSpireCell: getPageSetting("ExitSpireCell");
    this.maps.corruptionCalc: getPageSetting("CorruptionCalc");
    this.maps.farmWhenNomStacks7: getPageSetting("FarmWhenNomStacks7");
    this.maps.voidMaps: getPageSetting("VoidMaps");
    this.maps.runNewVoids: getPageSetting("RunNewVoids");
    this.maps.runNewVoidsUntil: getPageSetting("RunNewVoidsUntil");
    this.maps.voidCheck: getPageSetting("VoidCheck");
    this.maps.maxTox: getPageSetting("MaxTox");
    this.maps.TrimpleZ: getPageSetting("TrimpleZ");
    this.maps.advMapSpecialMod: getPageSetting("AdvMapSpecialModifier");
    
  // Combat settings
    this.combat.betterAutoFight: getPageSetting("BetterAutoFight");
    this.combat.autoStance: getPageSetting("AutoStance");
    this.combat.ignoreCrits: getPageSetting("IgnoreCrits");
    this.combat.powerSaving: getPageSetting("PowerSaving");
    this.combat.forceAbandon: getPageSetting("ForceAbandon");
    this.combat.dynGyms: getPageSetting("DynamicGyms");
    this.combat.autoRoboTrimp: getPageSetting("AutoRoboTrimp");
    
  // Scryer settings
    this.scryer.useScryer: getPageSetting("UseScryerStance");
    this.scryer.useScryerWhenOverkill: getPageSetting("ScryerUseWhenOverkill");
    this.scryer.minZ: getPageSetting("ScryerMinZone");
    this.scryer.maxZ: getPageSetting("ScryerMaxZone");
    this.scryer.useInMaps: getPageSetting("ScryerUseinMaps2");
    this.scryer.useInVoidMaps: getPageSetting("ScryerUseinVoidMaps2");
    this.scryer.useInSpire: getPageSetting("ScryerUseinSpire2");
    this.scryer.skipBoss: getPageSetting("ScryerSkipBoss2");
    this.scryer.skipCorrupteds: getPageSetting("ScryerSkipCorrupteds2");
    this.scryer.dieToUseS: getPageSetting("ScryerDieToUseS");
    this.scryer.dieZ: getPageSetting("ScryerDieZ");
    
  // Magma settings
    this.magma.useAutoGen: getPageSetting("UseAutoGen");
    this.magma.autoGen2: getPageSetting("AutoGen2");
    this.magma.autoGen2End: getPageSetting("AutoGen2End");
    this.magma.autoGen2SupplyEnd: getPageSetting("AutoGen2SupplyEnd");
    this.magma.autoGen3: getPageSetting("AutoGen3");
    this.magma.autoGenDC: getPageSetting("AutoGenDC");
    this.magma.autoGenC2: getPageSetting("AutoGenC2");
    this.magma.autoGen2Override: getPageSetting("AutoGen2Override");
    this.magma.autoMagmiteSpender2: getPageSetting("AutoMagmiteSpender2");
    this.magma.supplyWall: getPageSetting("SupplyWall");
    this.magma.oneTimeOnly: getPageSetting("OneTimeOnly");
    this.magma.magmiteExplain: getPageSetting("MagmiteExplain");
    
  // Heirloom settings
    this.heirlooms.autoHeirlooms: getPageSetting("AutoHeirlooms");
    this.heirlooms.autoHeirlooms2: getPageSetting("AutoHeirlooms2");
    this.heirlooms.autoUpgradeHeirlooms: getPageSetting("AutoUpgradeHeirlooms");
    
  // Golden settings
    this.golden.autoGolden: getPageSetting("AutoGoldenUpgrades");
    this.golden.goldStrat: getPageSetting("goldStrat");
    this.golden.goldAlternating: getPageSetting("goldAlternating");
    this.golden.goldZone: getPageSetting("goldZone");
    this.golden.goldNoBattle: getPageSetting("goldNoBattle");
    
  // Nature settings
    this.nature.autoTokens: getPageSetting("AutoNatureTokens");
    this.nature.autoPoison: getPageSetting("autoPoison");
    this.nature.autoWind: getPageSetting("autoWind");
    this.nature.autoIce: getPageSetting("autoIce");
    
  // Display settings
    this.display.enhanceGrids: getPageSetting("EnhanceGrids");
    this.display.enableAFK: getPageSetting("EnableAFK");
    this.display.changeLog: getPageSetting("ChangeLog");
    this.display.spamGeneral: getPageSetting("SpamGeneral");
    this.display.spamUpgrades: getPageSetting("SpamUpgrades");
    this.display.spamEquipment: getPageSetting("SpamEquipment");
    this.display.spamMaps: getPageSetting("SpamMaps");
    this.display.spamOther: getPageSetting("SpamOther");
    this.display.spamBuilding: getPageSetting("SpamBuilding");
    this.display.spamJobs: getPageSetting("SpamJobs");
    this.display.spamGraphs: getPageSetting("SpamGraphs");
    this.display.spamMagmite: getPageSetting("SpamMagmite");
    this.display.spamPerks: getPageSetting("SpamPerks");
    
  // Import/export settings
    this.importexport.settingsPorfiles: getPageSetting("settingsProfiles");
    this.importexport.allowSettingsUpload: getPageSetting("allowSettingsUpload");
  }
  
}
