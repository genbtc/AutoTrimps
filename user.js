// ==UserScript==
// @name         AutoTrimps-genBTC
// @namespace    https://github.com/genbtc/AutoTrimps
// @version      2.2
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC
// @include        *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-script';
script.src = 'https://genbtc.github.io/AutoTrimps/AutoTrimps2.js';
document.head.appendChild(script);
