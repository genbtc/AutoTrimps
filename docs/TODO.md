Document Code Structure: (for other developers): see main-doc.txt 
----------------
Main-Documentation (main-doc.txt)
TODO List (this file - TODO.md)
Update README.md/changelog(.json?)/version # (manually for now)
Code Comments (getting better)

Near Future:
------------------------
WebSite https://autotrimps.site - even just a link to github, or link to tutorials on how to install.
-GRAPHS!
TODO 1: Add notes or labels to graph runs.  (to indicate which settings we used)
TODO 1: HighCharts annotations module for "notes" comments to indicate which graph runs were what.
TODO: IMPLEMENTING A STANDARD FOR CLOUD GRAPH STATISTICS: 
      -now : Highest zone, helium, bones, Perk preset/ratios.
      -next: ATSettings, MODULES, which graphs were clicked on.


new TODO LIST: 3/3/2018 and 3/4/2018 extended to 3/7 still working on it as of 3/20.
-------------------------------------
XXXX: AutoPerks - background thread / web worker    
XXXX: AutoPerks - allocate speed improvement, shortcuts, (36 million iterations and 15 seconds @ 720Qa HE)
            - maybe slow due to OO structure and repeated resolutions for pass2.
TODO: Perky - implement Altizar Perky new Perk manager interface
TODO: SPAM tab - more granular settings. maybe every module could have its own toggle? - working on it.
TODO: "Map Special Modifier": Special Modifiers, Perfect Sliders (way more fragments), Extra Zones (+0 to +10)
    with a save config option
    if you create a config with FA and +5 zones, and save it, next time you/the script creates a map, it will remember the setting
    so if you want you can use the script to create 3 setups (there are 3 slots to save your config)
    + maps should be only created at poison zones and when they will provide new equipment
    prestigious when you need prestiges, lmc when you need more lvls in your eq
    perfect sliders when you can afford it
    make perfect sliders like if you're able to afford 3x the cost of it in frags, just buy it. otherwise no. and it will be rarer that way but still useful
    another valid idea is burn out all your frags on perfect near the end i guess
TODO: (from old TODO LIST: 8/17/2016) BionicW toggle that can let AT do Bionic Wonderland maps if they haven't ever been done before?
    (in the same vein, check for "Speed" achievements for unique maps and do them if they're not done yet and possible)
TODO: for alfa166: "Bionic OverBurner" :smiley: Make it Configurable to run BW 470 one time at z480 to unlock and run BW485, (with the +5 map kit)
TODO: Make a more configurable Auto Spend Nulli function for 2018
TODO: Should invent a tool/script to plug in the version numbers, changelogs, docs.
TODO: Instead of hard-coded changelog, Break changelog out into a seperate file and HTTPRequest it, parse it and run it through a standardized display function.
    Pull external .JSON Changelog and stuff from this site's API (obviously have to create a new server endpoint PHP script)
TODO: Modular Structured load of the modules/*.js files is less than robust now. Check status of each loaded, tally a count, double check success.
     -FAR: In this way, the tracking and loading of modules can be timestamped and version controlled for itemization and aggregate cloud managed.
FAR TODO: Cloud management of Save Files (already uploading save files and naming them. just need to download)
FAR TODO: Cloud distributed graphs. Show similar users graphs? (STARTED)
    -Could just upload all the graphs after every run (how to detect full run?)
FAR TODO: Theoretically the graphs database can be used as a pro-active future prediction model and conditions can be inferred from past runs.
    Example: If Helium per/hour is ABOUT to go down based on previous cached runs (during the ambiguity period of about a few zones), portal earlier.
    Think like Grace %% setting but automatic.
FAR TODO: Analysis of the Userbase and custom settings, even make queries to ask server for better decision making based on global multi-client probability state
TODO: Develop an internal utility for me to Scrape/Grep/Grok the .json analytics files already on the server.
FAR TODO: Import/Export/Append Graphs. is delete working on refresh? 
FAR TODO: Graphs encoding vs. storage is wasteful of space. We need more. Compress data or RLE it
TODO: Structure of Graphs.js is very wonky and can be re-sorted, nested somehow.
TODO: Keep generating content in this file very late at night, that nobody can see or care about - real smart use of my time.


Bugs To Fix:
----------------
Last github pull request is from 2016 = needs to be cleared. Has useful code that could be imported into Settings file for version comparisons and settings migrations/in-place upgrades.
All Issues from January to February have been resolved.
Any Issues remaining from prior 2017 should be disregarded.
BUG 1: Bone Portal messes with graphs / Importing a savedgame in progress produces bad graphs
BUG 2: The graphs still can miss time and have gaps/skips and has zone innacuracies, additionally it can fail to track Trimps data entirely during background window Javascript AFK/idle/catchup mode.
BUG 2: Overkill and certain graphs can skip progress and get mis-aligned if the script was paused or was backgrounded.


Done Did:
----------
Done: Visible Version Status Number in UI / Startup popup messages
Done: Essence graph
Done: Renamed Module names: Some stuff is named auto, some stuff isnt. Its AutoTrimps so isn't everything auto? Redundant? 
Done: Renamed NewUI2.js as SettingsGUI - needs new name, some love.
Done: Add autotrimps.site data json upload capability (thanks to Swiffy)
Done: BUG 1: Liquification - the Auto-Skip-tons-of-zones-in-beginning - causes overkill graph to be off by a LOT.
Not actually a thing: "Max Magmamancers By Zone #" so we can buy them at the start, to gain 5% attack for the first 10 minutes, usually for cases when the void zone which is the same as the portal zone, and you want to stack that level up with all you've got. 
    -5% Attack is only given after 5 minutes. Misunderstanding.
Done: AutoTrimps Presets dropdown list to name, save, reload different profiles
Done: Partially: Split SettingsGUI.js up into front-end DOM+GUI, back-end functions for Settings/Modules/Profiles, and createSettings+descriptions.
Done: Fluffy XP Graph
Done: Pin the ATSettings Tab MenuBar + Minimize,Maximize,Close buttons.
Done: TODO: Graphs, make 2 arrows to cycle sequentially through the graphs without using the dropdown everytime.
Done: TODO: Put changelog show/hide popup Button into settings
Done: PrintChangelog: print changelog function should be refactored: another function should be made to create a DOM element for all the changelog lines, scrape the API data into it, and then print tooltip with header/footer.

Other Improvements:
------------------
AUTOMAPS:
Rewrite the automaps way of deciding/picking/buying/running maps. (convo below)
---------------------------------------------------------------------------------
-: Decide whether map stacks can help speed you up or not:
If you're more limited by you being dead and your lack of health, than damage output, its probably more likely to not be worth it.
also if you don't have the overkill perk increasing damage can get inefficient when damage output is wasted
so keeping a good "survivability to damage output" ratio is better than optimizing "damage output"
keep a count of how long you were dead and how long you were doing damage
if you're never dead, then the damage boost from map stacks is USUALLY worth it. (cant say for sure but im pretty sure)
I still think you'd have to run 1 full map to know for sure if its worth it. then extrapolate that out times 10
-: Summary:
never dead -> damage boost helps when not "early game when you're ripping through bad guys"
almost never alive, frequently dead -> if more damage output than damage taken (and enough hp to react to fast guys), go on, otherwise farm
occasionally dead and dies faster than breeding -> needs more damage
occasionally dead and dies slower than breeding -> advance
Also while doing this, determine more refined rules for entering the 3 modes: want dmg/want health/farming

-:230+ regular maps should really be treated differently from corruption
they don't have block pierce, and no special abilities
-it doesnt go into the map bonus mode soon enough because of the fact that its gauging the zone on non-corrupted enemies
 //we will get at least 85 toxstacks from the 1st voidmap UNLESS we have overkill, then we dont get enough.
 //if a new fight group is available and anticipation stacks aren't 30, abandon and grab a new group
 

VOIDMAPS:
Void Map Farming - based on how much damage you do rather than your health/survival
---------------------------------------------------------------------------------
-:Voidmaps:
    //TODO: Account for magmated voidmaps. (not /2)
    //TODO: Account for daily.
-:On Voids Diff:
if you have enough HP to survive poisonous without genetecists, i guess its easy
poison is really bad before you get geneticists for example
before you have geneticists poisonous is just awful
if you block everything, heinous is awful
if you almost block everything, destructive is awful
and then the double hit is somewhere in the middle
yeah i think they shift a lot depending on how strong you are
if you're strong enough that doing voids at 190 is a joke but can't do them later after you finish corrupted for example
for me right now I usually block close to 100% of the damage, which is why destruction and heinous are worst
poison is completely trivial when the maps are already easy
destruction = % damage, heinous = crit
if you're trying to do the void maps before you're actually strong though poison is a killer
yea thats a good point, people doing them at the challenge boundary vs at the end of their run
I also thing the difficulty check should consider block, if it doesn't already do that
i always found poison to be the most obnoxious of them early on because when you don't even have geneticists to fire to make breeding faster again it just takes sooo long
for a large part of the game I only did VMs when I could completely block everything, which made them trivial            
