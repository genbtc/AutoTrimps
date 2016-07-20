# AutoTrimps + genBTC
Automation script for the idle incremental game Trimps  

**Installation instructions at the bottom of this README**
**Please backup your game via export before and during use to prevent losing your save due to corruption!**

## Changed by genBTC:
- Better Help-Tooltips
- Add seperated  "genBTC's settings UI" button,
- Add Export/Import/Reset autotrimps settings buttons.
- Add WarpStation Cap (deltaGiga+baseWarp) feature.
Stop making warpstations if we are past the deltagiga + base
warpstations (and no giga upgrade is available). Will also remove the
green highlight around the icon. This will save you metal to use on
weapons,armor, etc.
NOTE: (the cap will only work on incremental buys, it will not come into
effect when the game uses a gigastation and immediately bulk-buys as
many warpstations as it can afford. I think this is preferrable.)
- Stop from firing all scientists when it reaches the threshhold. (250k farmers)
Farmers will be maintained at the current level, not fired entirely. I
corrected the commented explanation, since the number it stops buying at
is 250k farmers, not 100k.
- Take Map Bonus +%Damage into account for farming decisions. (so you can farm less.)
- Farm if enemyhealth : basedamage is between 10 and 16. (Used to be 10 and 15). 
Means it will farm very slightly less.
- Farm @ cell 61 (megamining) not 82 (megafarming).
- Put a numerical status on the "Farming"&"Want more Damage" UI indicator.
This way you can see things progressing, instead of wondering what is going on.
The number pertains to Enemy Health / Base Damage(non-stance). Above 16 means farm. Below 10 means stop farming.
- Add console debug messages to the map selection/buying/running section.
- Delay Armor When needed: Delay buying armor prestige upgrades during Want More Damage or Farming automap-modes.
- Cap Equip to 10: Do not level equipment past 10. Similar to LimitEquipment, Helps for early game when the script wants to level your tier2s to 40+, but unlike LimitEquipment, does not impact Zone 60+.
- Skip Gear Level 58&59: Dont Buy Gear during level 58 and 59, wait till level 60, when cost drops down to 10%.
- Dynamic Siphonology - only when needed based on (Enemyhealth / baseDamage)
Created a new setting in the advanced options. "Dynamic Siphonology".
It will switch to the proper Map-level as soon as the current map is completed.
So you can choose original behavior of always using the lowest level
map, or the modified behavior, which increases the map level based on your damage.
The old behavior of "no siphonology at all when using DisableFarming" is
no longer applied, under any circumstance.
- 'Farm on >7 NomStacks': During Nom, take precautions not to get too many stacks. (On Improbability(cell 100). Meant to be used with DisableFarming (otherwise farming would take care of this, but its slower). If Improbability already has 5 NomStacks, stack 30 Anticipation. If the Improbability has >7 NomStacks on it, get +200% dmg from MapBonus. If we still cant kill it, enter Farming mode at 30 stacks, Even with DisableFarming On!')
- Change Genetecist Timer to 10 sec instead of 11sec. (was commonly showing 11.4s because it rounds. that is too much)
- Commit Changes from other branches as of 4/27/2016 to work with Trimps version 3.22 (and any internal syntax bug fixes)

**Voidmaps and Toxicity changes:**

Voidmaps:
- Do voids @ cell 96 Instead of 98. (to prevent overkill). This change
was tried to be committed before by spindrjr, but it only applied to Tox runs.

Voidmap + Max-Tox runs:
- If we need to do a voidmap and have already more than 1415 stacks,
(smallest voidmap is 85 cells)  consider tox-stack finished.
For normal-tox:
- Instead of starting the voidmap at 1400 stacks, start at
(1500-theVoidmap.size) in case its an 85 cell voidmap.

Regular Tox-Run:
- Avoid another non-unique map cycle due to having the amount of tox
stacks we need.

Max-Tox Run:
- During a Toxicity + Max Tox run AutoPortal, unset the MaxTox setting
from the settings page, so we dont' run 2 Max-Tox's in a row (will go
back to normal Tox run).

## Original Version's Previous Recent changes

4/28/2016
- The script will no longer run while the perks screen is up to try to prevent reported NaN issue.

4/5/2016
- Added new advanced option Coordination Abandon to automatically abandon the army if a new army is ready and we have a new coordination that has not been accounted for in the current army.

3/31/2016
- Added a warning for incorrectly configured void maps and auto portals. If you have your void maps set to complete after the script thinks it will portal, it will warn you, and give you it's estimated portal level (I think I still remember what levels the autoPortals with difficulty checks complete, for example crushed at 126, but if you find a discrepancy please let me know). It will also warn of void maps set to complete on even levels during Lead challenge. The script has no knowledge of when it will portal when set on He/hr so it does not consider this case for the warning.
- The script will now buy as many warpstations as it can afford at once in an attempt to help performance issues on some machines.
- Fixed a bug where the script would use up all available fragments making maps but not running them (prestige/shouldfarm/siphonology interaction)

3/27/2016
- Fixed a bug where some Lead and Watch damage adjustments were not being taken into account correctly, causing autoStance to let Trimps die prematurely.

3/23/2016
- Added a run time graph that displays the total run time for each of your portals. 
- Large numbers should now be thousands delimited

3/22/2016
- Prestige setting will now default to Polierarm instead of Off. Added some clarification about its function to the tooltip.

3/21/2016-2
- Fixed a bug that could cause autoportal function to fall-though to custom auto-portal when selecting Watch or Lead
- Added gems drops to mods efficiency calculations at .75 weight. Increased dragimp efficiency weighting to .75. This puts metalDrop, metalEfficiency, gemDrop, and gemEfficiency all weighted the same at .75. Farmer/lumberjack efficiency are at .5. Nothing else is considered (for staffs).
- Settings now only save when you change a setting along with some other tweaks to loading and initializing the scripts.

3/21/2016
- Added support for Lead and Watch challenges. During Lead challenge, the script will only enter maps in odd zones past cell 50. Void maps will be completed at cell 97. Void maps should be done on an odd zone but the script will NOT enforce that.
- Geneticists will now only be hired while in damage stance (dominance if available or nostance)
- He/hr display has been removed from graphs as it was added to base game.
- HIGHLY EXPERIMENTAL, NOT RELEASED: I have been messing around with a graphs function to track loot gains by their sources (production/jest/chrono vs looted) for the purposes of determining heirloom staff mod values. I'm not comfortable putting this in the main release yet as it overwrites a few core game functions (namely the main function that distributes resources). If you would like to try it out, load the spin branch script, which will point to the graphs.js with it active. If you don't know what I just said or how to do it, it might not be for you at this time.

3/18/2016
- Fixed an issue that could cause the script to use up all available fragments (and all subsequently acquired fragments) making maps while trying to farm for voids.
- (actually sometime 3/16 I think) Fixed an issue that could cause farming mode to get stuck on if you had farming disabled with the advanced option.

3/15/2016
- Fixed an issue that could cause autoMaps to try prestiging on the wrong level map.

3/14/2016
- (Untested) Added an advanced option to disable the 'farming' section of the autoMaps algorithm. This should make it always kick back out to the zone after reaching 10 map stacks. Farming to prepare for void maps should remain intact. 

3/10/2016
- AutoStance now only swaps stances when soldiers are alive, in attempt to avoid a reported block multiplying issue.

3/9/2016
- New Void Maps graph which shows you the maximum amount of void maps you saved up in a run. So if you save all yours up before running them, this basically shows you the total void maps (and thus heirlooms) you found on that run. It may miss one void map if you were to enter the zone in which you want to void map (which is when the graph data is gathered), and then find a void map before starting your void maps. This should be pretty limited, though. Bone portals will break the data for the current run. I think it should still get the correct max for the remainder of the run (under the 'new' portal number), but the one test case I have seems too low by 1, so it may just be wrong for the before and after portals.
- Added consideration of metal drop mod to empty mod slot calculations
- Fixed an issue where a siphonology adjusted map may be used when trying to get prestige (and thus not get the prestige!)

3/7/2016 -2 
- Added metal drop to efficiency calculations, weighted same as miner efficiency.
- Fixed a bug where the script could portal before doing void maps if your army was too strong after finishing a challenge.

3/7/2016
- Auto Heirlooms feature added. When enabled, the script will evaluate and 'carry' the best heirlooms, as well as suggest upgrades for equipped heirlooms based on their effect per cost. **For carrying, the script will only compare and swap out higher rarity/better items with the SAME TYPE. This means if you want to keep the best shield and staff, you need to already have a shield and staff in there.** As of right now, the evaluations are based ONLY on the following mods (listed by their precedence/weighting):
  - Shield: Void Map Drop Chance/Trimp Attack, Crit Chance/Crit Damage
  - Staff: Miner Efficiency, Lumberjack/Farmer/Dragimp Efficiency
  - This also means that recommended upgrades are only suggested for these mods (as compared to any other of the evaluated mods present). If you have an item with only one evaluated mod, it will always be the 'recommended' upgrade. For the purposes of carrying, rarity trumps all of the stat evaluations.
  - I believe the evaluations for the damage stats (crit and trimp attack), are based on fairly accurate calculations of the overall effect on your dps (if you are good at this kind of math stuff I would love for you to scrutinize the calculations). Other stats are evaluated on a sort of weighting system, with Void Map Drop Chance weighted at 1 (equal to the evaluations of dps stats, therefore all of the considered shield stats are currently weighted equally). Staff stats are weighted as miner efficiency .75 and farmer/lumber/dragimp as .5 (though they are only weighed against other staff stats right now).
- It should be noted with this patch introducing ways to increase your critical hits and damage by quite a bit, that the script has never (and currently does not) consider crits in any of its damage calculations for you. It does not seem to have a place in the standard speed-running portion of a run, and should just naturally give you better performance during 'farming' phases and void maps. As with any feature/subject, I am open to discussion/suggestions.
- The custom autoPortal setting now includes an associated challenge selection. This should facilitate running challenges but continuing to a higher desired level to run void maps for heirlooms.
- All automatic tooltip closing should now be gone, thanks to some source code edits by Greensatellite.
- Fixed a few bugs with autoMaps status display
- Fixed a bug with checks for the scientist challenges
- Fixed a bug with equipment efficiency function checking cost based on global buy amount

3/2/2016
- Graph series now includes challenge name. Will be undefined for data gathered before running this version.

2/26/2016
- New option to pause the script under advanced settings.
- autoStorage will now check storage against jestimp gains in maps and buy enough storage for them.
- Changed voidmap difficulty check to be based on Voidsnimp instead of boss (however you spell that crap).

2/25/2016 update 2
- autoMaps status will now show how close you are to meeting a void map difficulty check, in %
- autoMaps status will now show how many more void maps it has to run while running them
- map creation logic should now make metal maps when trying to farm, and de-value size (followed by loot) when trying to farm. For reference, when not trying to farm, it de-values loot, followed by difficulty. And in zones above 70, all maps should be metal regardless of creation reason (Otherwise they are random).

2/25/2016
- (experimental) Added the status of autoMaps below the autoMaps button to give you an idea of what it's thinking.

2/24/2016 update 2
- autoMaps will now abandon the army for the purposes of prestige mapping and void mapping
- Added special conditions to the void maps difficulty check for toxicity and balance
- Added an advanced setting for void maps difficulty check. It is the number of hits in dominance stance you want to be able to take before attempting a void map. Higher values make the script get you stronger before trying. Defaults to 2 if user has entered 0 or less.
- <strike>Void maps difficulty check has become more `stringint` by a factor of 4 (wants to be able to take 4 hits in dominance as opposed to 1 before)</strike>
- Void maps difficulty check should now factor in Balance and Toxicity stacks modifiers.
- Fixed a few bugs with void maps, including one that would cause them to be skipped completely.

2/24/2016
- New option for Trapping trimps. When on, it will turn on auto-build traps, automatically build and collect traps when needed. For those that don't really need traps, interference if you happen to keep it on should be minimal.
- New advanced option to run new void maps. When on, the script will attempt to run voids maps acquired after the zone designated to run void maps. eg. if you clear all your void maps at your regularly set zone of 60, but your run continues and you acquire one at 65, it will attempt to run it with this on. With this option off, void maps are ONLY run on the set level, and void maps acquired after the fact are never attempted.
- New advanced settings section of the UI, toggleable by clicking the button. Limit equipment, breed fire, max toxicity stacks, and run new voids options have all been moved here.
- Removed the settings 'Buy Gyms', 'Buy Tributes' and 'Buy Nurseries' as they were redundant with their corresponding 'Max' settings, which can be set to 0 to turn off purchasing.
- No upgrades or buildings are now purchased before Miners and Scientists are unlocked, to help ease low-helium early game.
- Warpstations are now purchased slightly slower when the window has focus, to hopefully tax some systems less. If you experience temporary browser freezing when purchasing a gigastation and subsequent warpstations, I recommend running in Chrome.
- Fixed the helium/hour graph to line up correctly zone numbers on the axis in all (hopefully?) cases. Undone still is helium graph (but who cares about that one, right?)
- Graph data is now limited to the past 10 portals to prevent filling up the local storage and causing save failures.
- Fixed a bug that would crash the script when using he/hr autoPortal with no challenge setting.

2/23/2016
- Adjusted void maps difficulty check to check for 1-shotting in dominance stance (and if so won't attempt the map, and if so it SHOULD try to farm to be able to clear it)
- Adjusted void maps setting to only run void maps ON the zone set, not above.
- Made some minor improvements to low-helium early game. Auto Gather should now behave mostly appropriately just after portaling.

2/22/2016 - Update 2
- (Experimental) added siphonology logic. You should see lower level maps being used when you are pushing through more difficult content if you have the siphonology perk.
- (Experimental) added a failsafe difficulty check to void maps. If the boss of a void map can 1-shot you in nostance, it should not be attempted.
- Added UI option for max toxicity stacks. When this mode is on, during a toxicity run the script will get max tox stacks before killing an improbability (so zones 60 and above only). You generally only turn this on for one run to get a very large total helium value for purchasing bone portals. The helium per hour will be terrible and the run itself will take over 24 hours minimum.
- Clicking on the zone timer will now toggle the paused mode.
- Script will no longer continue to run the block trying to get shieldblock.
- Removed the while loop that fired geneticists to speed breed time in case it was related to game freezing issue

2/22/2016
- Nursery purchases will now be limited by cost of collectors before warpstations are unlocked
- Couple of nursery purchase bugs fixed
- Fixed a bug with wormholes being purchased before they were unlocked
- Fixed a bug where autostance was using dominance before it was available

2/21/2016
- Void maps option. For now just a manual entry of what zone you want all your void maps completed. If you are on a tox run, it will get max tox stacks first.
- New option for number of wormholes to purchase
- New option for breed firing (see below)
- Tooltips are no longer spam closed on buying upgrades or buildings.
- Fix for gateway/collector housing issues. Building logic will no longer consider purchasing gateways if they cannot be afforded right now. This will hopefully prevent the suspension of all housing purchases to collect fragments to buy a gateway.
- (Experimental)Several logic changes to improve helium per hour, mostly focused around avoiding pauses to wait for breeding to fill the bar. Included in this is a new option that will fire all lumberjacks and miners to get them breeding when needed. 
- Adjusted Automation settings sizes to be slightly smaller, 6 per row
- Adjusted colors for dark theme. Must reload while dark theme is active.
- Misc bugfixes

2-16-2016
- Graphs now only update on-demand. This means when clicking the graphs button, or clicking the new refresh button while in the graphs.
- Enabled graphs zooming. Drag a box around area you wish to zoom in on. For those of you who didn't know, you can also toggle on/off series by clicking on the portal number on the right.
- Removed the resources graph and replaced it with a zone clear time graph. This graph shows your zone clear time in seconds. The x- axis value should correspond to the clear time for that zone (value at x-axis 10 is how long it took you to clear zone 10, in seconds).
- Graphs module should be able to be used stand-alone

Some older date 2/10/2016?
- Added option to include a challenge in helium per hour autoPortal setting. For example with electricity runs where your helium/hr can continue to grow after clearing the challenge, you would select Helium Per Hour as your autoportal setting, and choose Electricity from the second dropdown that appears. AutoPortal won't portal with a challenge active, so any zones prior to finishing a challenge where your he/hr dropped won't cause a portal, but any after finishing the challenge will.
- (Experimental) Added an auto-portal option that unlocks after you clear zone 80. Support for repeatable challenges, helium per hour, and custom zone portals. Electricity and crushed options will require automaps to be on.
- Added a clear data button to graphs which will clear all data, excluding the current portal.
- Made some adjustments to geneticist timer code to avoid long delays waiting for breed bar to fill after purchasing large amounts of housing.
- Nom and Toxicity breed timer now set at 15 sec when using Manage breed timer option.
- On a toxicity run, manually entering the following into the console will force the script to get max toxicity stacks on all zones 60 and above, for a max helium run for bone portal: `heliumGrowing = true`. Make sure to set it back to false after your long run(or reload).

## Installation
**Please backup your game via export before and during use to prevent losing your save due to corruption!**

If you would like to use only the graphs module, replace `AutoTrimps2.js` with `Graphs.js` in the bookmark or your userscript.

- Install greasemonkey/tampermonkey
- Open the tampermonkey dashboard and go to utilities – in the URL box paste https://raw.githubusercontent.com/genbtc/AutoTrimps/gh-pages/user.js and import
- Alternatively, paste the contents of `user.js` into a user script - go to https://trimps.github.io
- You will know you have the script loaded if you see the Automation and Graphs buttons in the game menu at the bottom

V2 is now bookmark compatible. Create new bookmark and set its target to:

```js
javascript:with(document)(head.appendChild(createElement('script')).src='https://genbtc.github.io/AutoTrimps/AutoTrimps2.js')._
```

You can also paste V2 into the console of the page. Geez so many options :/

Feel free to submit any bugs/suggestions as issues here on github.

I'm going to open up my discord channel for chat. Here is the link if you would like to come hang and chat about AutoTrimps: https://discord.gg/0VbWe0dxB9kIfV2C

## Colors for upgrades highlights

- Red text on Equip - it's best in its category in terms of stat per resource. This also compares Gyms with Shields.
- Orange text - Upgrade is avaliable and improving this will make the upgrade actually reduce stat in question and it's best in its category in terms of stat per resource.
- Yellow text - Upgrade is avaliable and improving this will make the upgrade actually reduce stat in question
- White border - upgrade is not yet available
- Yellow border - upgrade is available, but not affordable
- Orange border - upgrade is available, affordable, but will actually reduce stat in question
- Red border - you have enough resources to level equip after upgrade to surpass it's current stats.
- Green border on hoses - Best for gems 
