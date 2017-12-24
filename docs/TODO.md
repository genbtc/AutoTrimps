-    createSetting('BetterAutoFight', ['Better AutoFight OFF', 'Better Auto Fight 1', 'Better Auto Fight 2'], '3-Way Button, Recommended [ON], or Advised to use [OFF] for low level players under 1 million HE.  Will automatically handle fighting. #2 is the new one (benefits higher level players), #1 is the old algorithm (if you have any issues).<br>BAF#1 does: (1)Click Fight if we are dead and already have enough for our breed timer, and fighting would not add a significant amount of time:(&lt;2 sec). (2) Send Trimps to fight now if it takes less than 0.5 seconds to create a new group of soldiers, if we havent bred fully yet. <br>The new BAF#2 additionally does: (3) Click fight anyway if we are dead and stuck in a loop due to Dimensional Generator (z230+) and we can get away with adding time to it(although can happen at any zone) Pseudocode:(RemainingTime + ArmyAdd.Time &lt; GeneTimer) and (4) Clicks fight anyway if we are dead and have &gt;=31 NextGroupTimer and deal with the consequences by firing genetecists afterwards. <br>OFF: Can now be used as to use the in-game AutoFight with no downsides.(will autofight after portal), Recommended OFF for lowlevel. ', 'multitoggle', 1, null, "Core");
- a toggle that can let AT do Bionic Wonderland maps if they haven't ever been done before?
  (in the same vein, check for "Speed" achievements for unique maps and do them if they're not done yet and possible)

- AUTOMAPS: Decide whether map stacks can help speed you up or not:
If you're more limited by you being dead and your lack of health, than damage output, its probably more likely to not be worth it.
also if you don't have the overkill perk increasing damage can get inefficient when damage output is wasted
so keeping a good "survivability to damage output" ratio is better than optimizing "damage output"
keep a count of how long you were dead and how long you were doing damage
if you're never dead, then the damage boost from map stacks is USUALLY worth it. (cant say for sure but im pretty sure)
I still think you'd have to run 1 full map to know for sure if its worth it. then extrapolate that out times 10
Summary:
never dead -> damage boost helps when not "early game when you're ripping through bad guys"
almost never alive, frequently dead -> if more damage output than damage taken (and enough hp to react to fast guys), go on, otherwise farm
occasionally dead and dies faster than breeding -> needs more damage
occasionally dead and dies slower than breeding -> advance


230+ regular maps should really be treated differently from corruption
they don't have block pierce, and no special abilities

            Voidmaps:
            //TODO: Account for magmated voidmaps. (not /2)
            //TODO: Account for daily.
On Voids Diff:
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


TODO LIST: 8/17/2016

Near Future:
------------
Essence graph
Add notes to graph runs.
 it doesnt go into the map bonus mode soon enough because of the fact that its gauging the zone on non-corrupted enemies
  //we will get at least 85 toxstacks from the 1st voidmap UNLESS we have overkill, then we dont get enough.
if a new fight group is available and anticipation stacks aren't 30, abandon and grab a new group

  
New Features To Add:
----------------
Documentation (started)
Update README (always do this)
Code Comments (getting better)


Bugs To Fix:
----------------

Bone Portal messes with graphs / Importing a savedgame in progress produces bad graphs


Other Improvements:
----------------
Void Map Farming
    - based on how much damage you do rather than your health/survival

Programming/CodeWise:
----------------------
Rewrite the automaps way of deciding/picking/buying/running maps.
Also while doing this, determine more refined rules for entering the 3 modes: want dmg/want health/farming


Done:
------
Visible Version Status Number in UI