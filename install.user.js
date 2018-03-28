// ==UserScript==
// @name         AutoTrimps-genBTC
// @namespace    https://github.com/genbtc/AutoTrimps
// @version      2.1.6.9-genbtc-3-23-2018
// @updateURL    https://github.com/genbtc/AutoTrimps/install.user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC
// @include        *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-script';
//This can be edited to be your own Github Repository URL.
script.src = 'https://kfrowde.github.io/AutoTrimps/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);
