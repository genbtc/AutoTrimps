// ==UserScript==
// @name         AutoTrimps-genBTC
// @namespace    https://github.com/genbtc/AutoTrimps
// @version      2.1.6.8-genbtc-3-22-2018+Mod+Uni+coderpatsy
// @updateURL    https://github.com/genbtc/AutoTrimps/user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC
// @include        *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-script';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://genbtc.github.io/AutoTrimps/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
//script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);

// This File is Deprecated, please use .user.js instead (with the leading dot) so TamperMonkey/Greasemonkey can detect it as a script automatically.
// Other than that they are identical and no change is required on your part if everything is working already.
