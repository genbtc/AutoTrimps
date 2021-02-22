// ==UserScript==
// @name         AutoTrimps-genBTC
// @namespace    https://github.com/maurezen/AutoTrimps
// @version      2.1.6.9-genbtc-3-23-2018
// @updateURL    https://github.com/genbtc/AutoTrimps/user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC, maurezen
// @include        *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-script';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://maurezen.github.io/AutoTrimps/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
//script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);

// This File is Deprecated, please use .user.js instead (with the leading dot) so TamperMonkey/Greasemonkey can detect it as a script automatically.
// Other than that they are identical and no change is required on your part if everything is working already.

//You can use the following to auto-load your own forked repo as a local directory served from a local HTTPS webserver. 
//the other bookmarklet wont load locally - the script.id will tell it to pull the rest of modules from the given URL.
//javascript:with(document)(script = createElement('script'), script.src='https://localhost:4443/AutoTrimps2.js', script.id='AutoTrimps-script',head.appendChild(script))._