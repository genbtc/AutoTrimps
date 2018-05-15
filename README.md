# AutoTrimps + genBTC
![Donate](https://blockchain.info/Resources/buttons/donate_64.png)
<a href="bitcoin:1genbtcPLjAEk6RnfC66chYniFKfP7vAS">1genbtcPLjAEk6RnfC66chYniFKfP7vAS</a>No one has donated bitcoin yet - be the first and I will be ever eternally grateful<br />
Automation script for the idle incremental game Trimps, originally based on the zininzinin fork and modified by genBTC (genr8_ on discord)<br />

[![Join the chat at https://gitter.im/AutoTrimps/Lobby](https://badges.gitter.im/AutoTrimps/Lobby.svg)](https://gitter.im/AutoTrimps/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
## Discussion / Discord Channel
<a href="https://discord.gg/0VbWe0dxB9kIfV2C"><img src="https://pbs.twimg.com/profile_images/568588143226413056/9Lwrixxj.png" width=48></a>
Discord is a chat program. Come to talk about AutoTrimps, for help, or suggestions for new features : https://discord.gg/0VbWe0dxB9kIfV2C (same one as zininzinin)

## Current Version (full changes below) - Ongoing Development!
- This version has beta changes by genBTC, forked from GenBTC. Including Autostance 3, Update to Swiffy Overlay, and Merging of buttons. Please tell me about bugs on Discord
- Mar 24, BATTLECALC CHANGES:
- BattleCalc.js - getBattleStats() updated for the stuff added to AutoStance 1 a while ago, Life,C2,StillRowing, Copied from game code.
- Mar 24, EQUIPMENT CHANGES:
- Equip.js - Now supports higher cap numbers such as 200. Lower cap for liquified and overkilled zones:
- If a zone is liquified its 10% of your cap.
- If its a quick zone that you might complete in under 25 seconds its also 10% of your cap (based on last zone).
- hidden variable MODULES["equipment"].capDivisor = 10;   //number to divide your normal cap by
- Spire is explicitly leveled to your full 100% cap.
- Also above MaxMapBonusAfterZone the armor equip is leveled to full cap as well, as an attempt to get more Armor (working on it).
- Sorry for any bugs or undocumenteds in the meantime.
- Old Original Zeker450 AutoPerk Preset was changed 2 days ago without notice also. This is your notice That is now called #2, And there is a new one called #3 That it his latest change.
- v2.1.6.5-stable - Mar 24, Set up <a href='https://genbtc.github.io/AutoTrimps-stable'>Stable Repository</a> for the faint of heart. Equipment changes, see README at <a href='https://github.com/genbtc/AutoTrimps/blob/gh-pages/README.md'>GitHub</a> and check commit history; Sorry for any breakages.
- v2.1.6.9 - March 23, New: AutoMaps setting combined with RunUniqueMaps. Be advised, the variable has changed from boolean false,true to a value 0,1,2. Settings file has been migrated as such. New: Map SpecialMod is extremely beta and can break your game. Geneticist Infinity fixed. New AGU Settings for 60% Void. Graphs fixes. AutoMaps changes. Equipment level cap improvements.
- v2.1.6.8 - March 22, Settings GUI, make better. Up/Down graph buttons. Warning notices on import/export. Internal code fixes, gameplay unchanged.
- v2.1.6.7 - March 20, Moved all the Settings around on you :) Enjoy the new layout. Display Tab: EnhanceGrid + Go AFK Mode. Pinned AT Tab menu bar to top when scrolling.  Graph: Graph: FluffyXP . Continue Development on long TODO list...
- v2.1.6.6 - March 13, Geneticist management changes. Equipment code improvements. scriptLoad improvements. attempt to track errors.
- v2.1.6.5 - March 7, Save/Reload Profiles in Import/Export. Magmamancer graph. Magmite/Magma Spam disableable.
- v2.1.6.4 - March 4, 2018 Basic Analytics are now being collected. Read about it in the tooltip of the new button on the Import/Export tab . Overkill Graph fixed for Liquification.  Setting Max Explorers to infinity as they are not that useless anymore. Update battlecalc for Fluffy & Ice on Autostance2.
- v2.1.6.3 - March 3, 2018 AutoPerks: Capable/Curious/Cunning, BaseDamageCalc: C2,StillRowing,Strength in Health,Ice,Fluffy,Magmamancer - Fix bugs in autoperks around capable/fluffy allocating looting + more bugs
- v2.1.6.2 - March 2, 2018
- v2.1.6.1 - March 1, 2018
- v2.1.6.0 - December 23, 2018
- v2.1.5.7 - November 7,2017 = Merge in DerSkagg's GoldenUpgrades Mod (Pull request #90) (thanks Derskagg)
- v2.1.5.6 - August 26, 2017 = Merge ALL of Unihedro branch back into genBTC branch. (thanks UniHedro)
- v2.1.5.4 - August 26, 2017 = Added AutoDimGen + little fixes (FirenX)
took a break
- v2.1.5.3 - January 10, 2017 genbtc-1-10-2016+Modular (meant 2017 lol)

## Script Installation
**Please backup your game via export before and during use to prevent losing your save due to corruption!**

***Option 1***: Install TamperMonkey (Chrome) or GreaseMonkey (Firefox)

**EASY INSTALL click here: https://github.com/slivermasterz/AutoTrimps/raw/master/install.user.js** (the Monkeys will detect this and prompt you to install it)

Overly detailed Chrome/TamperMonkey Instructions:
- Open the TamperMonkey dashboard and go to utilities – in the URL box paste https://github.com/genbtc/AutoTrimps/raw/gh-pages/.user.js and click IMPORT
- Alternatively, paste the contents of `.user.js` into a user script (pay attention, it says .user.js - this contains 4 lines of code that loads AutoTrimps2.js)
- The script should automatically load everytime you go to https://trimps.github.io or the game on Kongregate
- You will know you have the script loaded if you see the Automation and Graphs buttons in the game menu at the bottom
- DO NOT PASTE THE FULL 2000+ line contents of the script into TamperMonkey! It will not work properly!
- The .user.js file is a "stub" or "loader" that references the AutoTrimps2.js file which is where the actual script is located.
- The purpose of .user.js is so that you don't have to rely on TamperMonkey's update functionality - instead it will automaticaly download the updated copy from the URL provided everytime its loaded.

FireFox/GreaseMonkey instructions:
- GreaseMonkey identifies userscripts by visiting a URL that ends with ".user.js" in them:
- Visit this URL, and Agree to install the userscript:  https://github.com/genbtc/AutoTrimps/raw/gh-pages/.user.js

***Option 2***: Via a Bookmark (does not work with Kongregate - maybe it does now that I added an include kongregate line to the file)
- Create new bookmark and set its target to:
```js
javascript:with(document)(head.appendChild(createElement('script')).src='https://genbtc.github.io/AutoTrimps/AutoTrimps2.js')._
```
- This bookmark button has to be clicked manually after you go to https://trimps.github.io

***Option 3***: Paste into console (last resort for debugging, dont do this)

Chrome Instructions
- You can copy and paste the entire contents of AutoTrimps2.js into the Dev Console (F12 in chrome) of the page. (make sure the dropdown box to the left of "Preserve Log" is set to "top" - or "mainFrame (indexKong.html)" for kongregate.

Firefox Instructions
- Push Ctrl+Shift+K to go into console and look for the "Select an iframe" icon, and choose http://trimps.github.io/indexKong.html

Notes:
If you would like to use only the graphs module, replace `AutoTrimps2.js` with `Graphs.js` in the bookmark or your userscript.
Feel free to submit any bugs/suggestions as issues here on github.

***LowLevelPlayer Notes:***

***PSA: AutoTrimps was not designed for  new/low-level players.***

The fact that it works at all is misleading new players into thinking its perfect. Its not. If your highest zone is under z60, you have not unlocked the stats required, and have not experienced the full meta with its various paradigm shifts. If you are just starting, my advice is to play along naturally and use AutoTrimps as a tool, not a crutch. Play with the settings as if it was the game, Dont expect to go unattended, if AT chooses wrong, and make the RIGHT choice yourself. Additionally, its not coded to run one-time challenges for you, only repeatable ones for helium. During this part of the game, content is king - automating literally removes the fun of the game. If you find that many flaws in the automation exist for you, level up. Keep in mind the challenge of maintaining the code is that it has to work for everyone. AT cant see the future and doesnt run simulations, it exists only in the present moment. Post any suggestions on how it can be better, or volunteer to adapt the code, or produce some sort of low-level player guide with what youve learned. Happy scripting! -genBTC

## Current feature changes by genBTC
- Current as of :
- *** 11/7/2017, v2.1.5.7 Merge DerSkagg PullRequest In***
- New AutoGoldenUpgrades - After max void golden upgrades, alternate between buying helium and battle upgrades. Or Choose a Zone to switch over completely at.
- *** 8/26/2017, v2.1.5.6 Merge Unihedro Branch In***
- Uni changes include: Dont buy Coords, Trimple Z#, Scryer Suicide Z#, Safety First, Forced Prestige Z#, Prefer Metal Maps, Nursery Count Pre-Spire, Finish Challenge2, DontCare/PowerSaving/DontRushVoids, Prestige Skip 2, Auto Eggs.
- See his branch here @  https://github.com/Unihedro/AutoTrimps
- Past Changes:
- *** April Unihedro Branch Changes ***
- 4/17 v2.1.5.5u3 - fix improvedautostorage hijack
- Fixed a certain specific stupid bug caused by how graph overwrites some functions unnecessarily
- 4/16 v2.1.5.5u2 - do more map stacks if not enoughHealth
- No longer forces Buy Storage off
- 4/15 v2.1.5.5u1 - new settings BuyOvclock
- 4/14 v2.1.5.4u6 - Improved nurseries map and betterautostorage
- 4/14 v2.1.5.4u5 - Auto Eggs</b>, some more 4.3 support
- 4/12 v2.1.5.4u4 - AutoTrimps lifecycle changes
- 4/11 v2.1.5.4u3 - fixed spire farming, autogen supply zone
- 4/10 v2.1.5.4u2 - PrestigeSkip2
- 4/09 v2.1.5.4u1 - Magma: AutoGen, AutoGen2
- 4/08 v2.1.5.3u6 - ForcePresZ
- 4/07 + 4/06:
- U5: FinishC2, PowerSaving
- U4: PreferMetal, PreSpireNurseries
- U3: LinearZ, SupplyWall, OneTimeOnly
- U2: TrimpleZ, ScryerDieZ, IgnoreCrits
- U1: Don't buy Coords / Skip challenge maps
- ***1/10/2017***
- new setting Buy Warp to Hit Coord (genbtc page)
- AutoStance support for Plague/Bogged Daily
- Update Map Sliders decisions - less loot% reduction
- ***12/23/2016***
- v2.1.5.2-genbtc-12-23-2016+Modular
- ***12/20***
- Gear tab to Settings UI. Customize your equip level cap.
- Internally Disable Farm mode if we have nothing left to farm for (no prestiges,capped equip) to prevent infinite farming.
- ***12/19***
- Skip prestige if >=2 unbought prestiges (maps settings)
- Bug Fixes + redo geneticists buying again.
- NEW: Add Map Bonus Graph
- ***12/18***
- Fixed: dynamic prestige not reverting to dagger after the target zone is reached
- Graphs - clear time, removed #2s, (essence graph might be messed up but its fixed now)
- Change forceAbandonTrimps "sitting around breeding forever when not on full anti stacks" from 60 seconds to 31.
- Fix BAF2 #4 for players without geneticists.
- Buildings cost efficiency + jobs low level fixes
- Some low level jobs and Buildings fixes.
- ***12/14***
- NEW: AutoAllocatePerks (genbtc settings) - uses AutoPerks ratio system to Auto Spend Helium during AutoPortal
- ***12/12***
- Fix: HeHrBuffer will now portal midzone if you exceed 5x your buffer
- ***12/10***
- New: AutoStartDaily option (read tooltip)
- New way to buy geneticists (fast)
- ***12/9***
- Fixed: DynamicPrestige=-1 wasnt disabling it
- Fixed: needPrestige conflicting with needFarmSpire
- ***12/8***
- FarmWithNomStacks changes (read tooltip)
- Nom stacks now calced by Autostance1
- Default VoidDifficultyCheck is now defaulting to 6
- ***12/6***
- AutoMagmiteSpender now has a new cost efficiency algorithm.(read new tooltip)
- AT now does its Nursery map for Blacksmithery owners at z50 not z60, to prevent breeding time-stalls.(+fixed bug)
- ***12/4***
- Completely rewrite lots of the Graphs.js code.
- Converted the codebase into individual files, to help people find stuff.
- For automaps, Not enough Health doesnt do 10 maps anymore, it only does 1.
- Adjust enoughHealth calculation for people without D stance.
- Add a farm lower level zones option (maps settings tab).
- ***12/2***
- Changed Automaps farming/damage/health calculations. AutoMaps farms above 16x now. (10x in Lead, 10x in Nom with the Farm on >7 NOMstacks option).
- Hover over the Farming/Advancing/WantMoreDamage status area to see the precise number now. Read the AutoMaps tooltip in settings for slightly more information.
- Add dailymods: weakness, rampage, oddtrimpnerf, eventrimpbuff, badStrength, badMapStrength, bloodthirst to Autostance1. (and AS2 has minDmg, maxDmg too)
- ***11/29***
- Puts a 5 second pause in between cycling AutoMagmiteSpender from "on portal" to "always" so you can switch it to "off" without it spending all your magmite.
- Make multi-toggle tooltip title give the name of all 3 options to be more descriptive.
- new calcBadGuyDmg function, used in DynamicGyms.
- stop using stopScientistsatFarmers and use MaxScientists instead.
- hire 1 miner,farmer,lumber each cycle even if our breed timer is low to do something tiny, so earlygame isnt stuck on 0
- fix/re-arrange lazy Trainers duplicate code
- exit autostance if Formations isnt done (like level <60)
- Lead damage stacks were wrongly on 0.0005, its 0.0003.
- Trimpicide Mod #1: consider Titimp = forceAbandon and kill titimp if theres less than 5 seconds left on it or, we stand to gain more than 5 antistacks.
- Trimpicide Mod #2: if we're sitting around breeding for >60s  while being over 5 anti stacks away from target.
- Include beta autostance2 code that im working on so I dont have a bunch of crazy local commits.
- ***11/26***
- Patch corruption detection, and Scryer tooltips
- Dynamic Gyms - dont buy gyms if your block is higher than enemy attack
- Auto Magmamancer management after 10 mins
- Auto Finish Daily on portal (genbtc settings)
- Gym Wall (genbtc settings)
- ***11/23***
- Auto Magmite Spender can now be toggled to Always Run
- AutoTrimpicide/Force-Abandon is now toggleable
- New Better AutoFight #2(optional)
- <a href="https://puu.sh/srfQq/38a0be6656.png" target="#">New Hover tooltips: Screenshot</a> beta0.1, more to come
- ***11/22***
- Auto Spend Magmite before portaling - (setting in genBTC page)- Part 1 buys any permanent one-and-done upgrades in order from most expensive to least. Part 2 then finds/buys the cheapest non-permanent multi-upgrade and repeats itself until you cant buy anymore.
- Buy 2 buildings instead of 1 if we have the mastery
- Entirely remove high lumberjack ratio during Spire.
- During Magma with 3000+ Tributes, switch to 1/12/12 auto-worker-ratios instead of 1/2/22.
- Add a 10 second timeout Popup window that can postpone Autoportal when clicked.
- Added a No Nurseries Until setting, in genBTC page
- ***11/20***
- Fixed spire map bug
- Added new ratios to AutoPerks (ZXV3,truth_late)
- AutoFight if timer is <0.5 not <0.1 now
- ***11/19***
- Doesnt run the 10 maps for Mapbonus before Spire now. Please increase/adjust your MinutesBeforeSpire Timer accordingly (the 10 maps were never accounted for in that timer).
- Re-arranged all the categories in the settings window and updated tooltips
- Kill your trimps (AutoTrimpicide) for Anti-Stacks more often

## Gap in Changelog exists here.

## Prior feature changes by genBTC (up to date as of 8/5/2016):
- Minutes to Farm Before Spire - force some time to be spent so you can for sure complete Spire (recommended: 3-10 minutes)
- Auto Upgrade Heirlooms - spends ALL your nullifium on the recommended upgrades
- Auto Golden Upgrades = Buys all the Golden Helium, Battle, or Voids when available.
- Always Runs 10 maps for 200% map bonus before attempting Spire (happens after the first death if you don't select "Map At Spire" in regular Trimps settings)
- AutoHeirlooms2 - new algorithm to sort/carry/recycle the Heirlooms (the original had a bug)
- Cap Trainers to a % of Tributes - Only buy a trainer when its cost is less than X% of the cost of a tribute. Prevents from competing with food resources, if you care.
- Run Bionic Before Spire - meant as a one time function (like max tox is) to farm the Bionic Wonderland maps for a LONG time(2 hours-ish) before entering Spire. (not HE/hr efficient)
- Dynamic Prestige: Skip prestiges at the beginning of the run which saves time, and delay them until the end when you need them most and can provide resources from farming too)
- Helium per Hour Portal "Buffer" - now you can customize how much He/Hr is allowed to drop before portaling
- Auto Robo Trimp - activate the MagnetoShriek ability on the bosses every 5 levels starting from the level you specify. (recommended set to 60)

## Individual changes (from pinned messages on the Discord channel)
- 7/30 Patch heirlooms2 not carrying all protected heirlooms due to some indexing bug
- 7/28 Add 3 new graphs. Update Graphs, fix He/hr shifted by 1 bug.
- 7/27 Works on level 1 fresh new games a lot better, and added a new function Auto Upgrade Heirlooms which spends ALL your nullifium on the advised upgrade automatically
Also bugfix Adjust storage buying so that the script cannot buy a storage building before it is unlocked at level 1 and 70%
- 7/23 Important Fix for Heirloom2 and fix tooltips.
Reason: It was trying too hard to maintain equal shield/staff amounts, now it will not leave any better heirlooms (rarity/mods) in the temporary "extras" pile.
- 7/23 ~~Automatically gets 10 map stacks During Spire.~~
- 7/22 Add new feature: Auto Golden Upgrades (in genBTC advanced settings)
- 7/22 Brand new AutoHeirlooms2 algorithm & Dynamic Prestige Algorithm (by Hyppy)
There is a new setting in the genBTC settings called "AutoHeirlooms2" and this will override the original.
I have not immediately switched over because Heirlooms are sensitive and I dont want to be responsible for anyone's heirlooms losses
So when you enable this new setting for the new algorithm, Take notice of what is going on, and manually "Protect" button any heirlooms you need to before portal-recycling
This image is a quick documentation of the heirloom carry bug, and the fix: https://puu.sh/qb6zj/903364c3d2.png
- 7/21 Fix helium per hour portal bug.
- 7/20 Dynamic Prestige now works with Helium Per Hour Autoportal setting! It uses the Last Run's portal zone in this situation.
- 7/17 Add Corruption handling for 2 of the corruption types (Strong and Tough).
- 7/16 Dynamic Prestige has been altered, if you are having a bug, reload, toggle your prestige dropdown setting to something else, and back, and portal to start a fresh run.
- 7/16 Added a new "Protect Heirloom" button in the Heirlooms dialog: Mark certain heirlooms from being auto-recycled on portal if/when a better one is found by the AutoHeirloom script.
- 7/6  New EasyMode Worker Ratios, >1000 tributes = 1/1/10 and >1500 tributes = 1/2/22

## Feature changes added by genBTC since before 4/27/2016 and Trimps version 3.22:
- Change Genetecist Timer to 10 sec instead of 11sec. (was commonly showing 11.4s because it rounds. that is too much)
- 'Farm on >7 NomStacks': During Nom, take precautions not to get too many stacks. (On Improbability(cell 100). Meant to be used with DisableFarming (otherwise farming would take care of this, but its slower). If Improbability already has 5 NomStacks, stack 30 Anticipation. If the Improbability has >7 NomStacks on it, get +200% dmg from MapBonus. If we still cant kill it, enter Farming mode at 30 stacks, Even with DisableFarming On!')
- Dynamic Siphonology - only when needed based on (Enemyhealth / baseDamage)
Created a new setting in the advanced options. "Dynamic Siphonology".
It will switch to the proper Map-level as soon as the current map is completed.
So you can choose original behavior of always using the lowest level map,
or the modified behavior, which increases the map level based on your damage.
The old behavior of "no siphonology at all when using DisableFarming" is no longer applied, under any circumstance.
- Skip Gear Level 58&59: Dont Buy Gear during level 58 and 59, wait till level 60, when cost drops down to 10%.
- Cap Equip to 10: Do not level equipment past 10. Similar to LimitEquipment, Helps for early game when the script wants to level your tier2s to 40+, but unlike LimitEquipment, should not impact Zone 60+.
- Delay Armor When needed: Delay buying armor prestige upgrades during Want More Damage or Farming automap-modes.
- Add console debug messages to the map selection/buying/running section.
- Put a numerical status on the "Farming"&"Want more Damage" UI indicator.
This way you can see things progressing, instead of wondering what is going on.
The number pertains to Enemy Health / Base Damage(non-stance). Above 16 means farm. Below 10 means stop farming.
- Farm @ cell 61 (megamining) not 82 (megafarming).
- Farm if enemyHealth divided by baseDamage (in X stance) is between 10 and 16. (Used to be 10 and 15).
Means it will farm very slightly less.
- Take Map Bonus +%Damage into account for farming decisions. (so you can farm less.)
- Stop from firing all scientists when it reaches the threshhold. (250k farmers)
Farmers will be maintained at the current level, not fired entirely. I
- Add WarpStation Cap (deltaGiga+baseWarp) feature.
Stop making warpstations if we are past the deltagiga + base
warpstations (and no giga upgrade is available). Will also remove the
green highlight around the icon. This will save you metal to use on
weapons,armor, etc.
NOTE: (the cap will ONLY work on incremental buys, it will not come into
effect when the game uses a gigastation and immediately BULK-buys as
many warpstations as it can afford. In this way it can buy over the cap. I think this is actually preferrable.)
- Add an Export/Import/Reset AutoTrimps settings buttons.
- Add a seperate "genBTC's settings UI" button,
- Better Tooltip Help

**Voidmaps and Toxicity changes:**

- Voidmaps: Do voids @ cell 96 Instead of 98. (to prevent overkill). Before, it only applied to Tox runs.
- Voidmap + Max-Tox runs: If we need to do a voidmap and have already more than 1415 stacks, (smallest voidmap is 85 cells)  consider tox-stack finished.
- For normal-tox: Instead of starting the voidmap at 1400 stacks, start at (1500-theVoidmap.size) in case its an 85 cell voidmap.
- Regular Tox-Run:  Avoid another non-unique map cycle due to having the amount of tox stacks we need.
- Max-Tox Run: During a Toxicity + Max Tox run AutoPortal, unset the MaxTox setting from the settings page, so we dont' run 2 Max-Tox's in a row (will go back to normal Tox run).

## Original zininzinin version's historical changes
See changelog at the original version's github page: https://github.com/zininzinin/AutoTrimps/blob/c8eac4c80d0a1a5ebe36bc44c7655c335a2dea7b/README.md#recent-changes


## Easy explanation of Colors for EquipUpgrades / prestiges highlights
- white - Upgrade is not available
- yellow - Upgrade is not affordable
- orange - Upgrade is affordable, but will lower stats
- red - Yes, do it now!

## Confusing original explanation of colors, (gl trying to understand this!)
- Red text on Equip - it's best in its category in terms of stat per resource. This also compares Gyms with Shields.
- Orange text - Upgrade is available and improving this will make the upgrade actually reduce stat in question and it's best in its category in terms of stat per resource.
- Yellow text - Upgrade is available and improving this will make the upgrade actually reduce stat in question
- White border - upgrade is not yet available
- Yellow border - upgrade is available, but not affordable
- Orange border - upgrade is available, affordable, but will actually reduce stat in question
- Red border - you have enough resources to level equip after upgrade to surpass it's current stats.
- Green border on buildings - Best for gems


## Detailed Code Documentation:
Read docs/main-doc.txt or docs/TODO.md for more complete info, the below is somewhat outdated.

Since javascript is easily human readable, Much can be learned by reading the source code, starting with this knowledge:

The script was faux-modularized on 12/4/2016, with the modules residing in the '/modules/' dir. This means that although the files are seperate, they are all still required for the script to run. In addition, the interoperability of the modules is still undocumented, and some(most) rely on other modules. Sometime in the future, you will be able to load/use different verisons of the various modules.
AutoTrimps2.js is the main file that loads the modules, and then runs its mainLoop.

The mainLoop() consists of the following subroutine functions, all of which are enable-able/disable-able by their buttons.:
-     exitSpireCell();        //"Exit Spire After Cell" (other.js)
-     workerRatios();         //"Auto Worker Ratios"
-     buyUpgrades();          //"Buy Upgrades"
-     autoGoldenUpgrades();   //"AutoGoldenUpgrades" (genBTC settings area)
-     buyStorage();           //"Buy Storage"
-     buyBuildings();         //"Buy Buildings"
-     buyJobs();              //"Buy Jobs"
-     manualLabor();          //"Auto Gather/Build"
-     autoMap();              //"Auto Maps"
-     autoBreedTimer();          //"Genetecist Timer" / "Auto Breed Timer"
-     autoPortal();           //"Auto Portal" (hidden until level 40)
-     autoHeirlooms2();  or  autoHeirlooms(); //"Auto Heirlooms 2" (genBTC settings area) or //"Auto Heirlooms"
-     autoNull();             //"Auto Upgrade Heirlooms" (genBTC settings area)
-     toggleAutoTrap();       //"Trap Trimps"
-     autoRoboTrimp();        //"AutoRoboTrimp" (genBTC settings area)
-     autoLevelEquipment();   //"Buy Armor", "Buy Armor Upgrades", "Buy Weapons","Buy Weapons Upgrades"
-     autoStance();           //"Auto Stance"
-     betterAutoFight();      //"Better Auto Fight"
-     prestigeChanging2();    //"Dynamic Prestige" (genBTC settings area)
-     userscripts();          //Runs any user provided scripts - by copying and pasting a function named userscripts() into the Chrome Dev console. (F12)

Once you have determined the function you wish to examine, CTRL+F to find it and read its code. There are lots of comments. In this way you can determine why AutoTrimps is acting a certain way.
