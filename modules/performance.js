;(function(M, W)
{
	M["performance"] = {};
	M["performance"].isAFK = false; //start with AFK disabled

	// Save updateLabels Trimps game functions, to restore it after we disable it.
	M["performance"].updateLabels = W.updateLabels;

	// Game Wrapper to insert DOM elements into
	M["performance"].$wrapper = document.getElementById('wrapper');

	// AFK OVERLAY CSS Style
	document.head.appendChild(document.createElement('style')).innerHTML = `
	.at-afk-overlay 
	{
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100vw;
		height: 100vh;
		background-color: black;
		color: white;
		z-index: 9001;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-flex-wrap: nowrap;
		-ms-flex-wrap: nowrap;
		flex-wrap: nowrap;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-align-content: stretch;
		-ms-flex-line-pack: stretch;
		align-content: stretch;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.at-afk-overlay-disabled
	{
		display: none !important;
	}

	.at-afk-overlay-title
	{
		font-size: 24pt;
	}

	.at-afk-zone, .at-afk-helium, .at-afk-status
	{
		font-size: 20pt;
	}

	.at-afk-overlay-disable-btn
	{
		width: 250px;
		height: 60px;
		background-color: #e74c3c;
		color: white;
		border: 2px solid white;
		text-align: center;
		line-height: 60px;
		font-size: 20pt;
		margin-top: 25px;
	}

	.at-afk-overlay-disable-btn:hover
	{
		cursor: pointer;
		background-color: #c0392b;
		transition: all 300ms linear;
	}`;

	// The overlay
	M["performance"].AFKOverlay = document.createElement('div');
	M["performance"].AFKOverlay.className = 'at-afk-overlay at-afk-overlay-disabled';

	// Title
	var AFKOverlayTitle = document.createElement('p');
	AFKOverlayTitle.innerText = 'TRIMPS - AFK';
	AFKOverlayTitle.className = 'at-afk-overlay-title'

	// Zone
	M["performance"].AFKOverlayZone = document.createElement('p');
	M["performance"].AFKOverlayZone.innerText = 'Current zone: -';
	M["performance"].AFKOverlayZone.className = 'at-afk-zone'

	// Helium
	M["performance"].AFKOverlayHelium = document.createElement('p');
	M["performance"].AFKOverlayHelium.innerText = 'Current helium: -';
	M["performance"].AFKOverlayHelium.className = 'at-afk-helium'

	// Status
	M["performance"].AFKOverlayStatus = document.createElement('p');
	M["performance"].AFKOverlayStatus.innerText = 'Status: -';
	M["performance"].AFKOverlayStatus.className = 'at-afk-status'

	// Disable(Back) button
	M["performance"].AFKOverlayDisable = document.createElement('div');
	M["performance"].AFKOverlayDisable.innerText = 'I\'m Back';
	M["performance"].AFKOverlayDisable.className = 'at-afk-overlay-disable-btn'

	M["performance"].AFKOverlayDisable.addEventListener('click', function()
	{
		M["performance"].DisableAFKMode();
	});

	// Bundle them together
	M["performance"].AFKOverlay.appendChild(AFKOverlayTitle);
	M["performance"].AFKOverlay.appendChild(M["performance"].AFKOverlayZone);
	M["performance"].AFKOverlay.appendChild(M["performance"].AFKOverlayHelium);
	M["performance"].AFKOverlay.appendChild(M["performance"].AFKOverlayStatus);
	M["performance"].AFKOverlay.appendChild(M["performance"].AFKOverlayDisable);
    
    // Insert the afk page, at the top level <body> tag
	document.body.appendChild(M["performance"].AFKOverlay);

	M["performance"].EnableAFKMode = function EnableAFKMode()
	{
		M["performance"].isAFK = true;
		M["performance"].AFKOverlay.classList.remove('at-afk-overlay-disabled');
		M["performance"].$wrapper.style.display = 'none';
        //This is the whole meat - replaces the update function with nothing (means save resources)
		W.updateLabels = function() {};
        enableDebug = false;
	}

	M["performance"].DisableAFKMode = function DisableAFKMode()
	{
		M["performance"].isAFK = false;
		M["performance"].$wrapper.style.display = 'block';
		M["performance"].AFKOverlay.classList.add('at-afk-overlay-disabled');
        W.updateLabels = M["performance"].updateLabels;
        enableDebug = true;
	}

	M["performance"].UpdateAFKOverlay = function UpdateAFKOverlay()
	{
		M["performance"].AFKOverlayZone.innerText = 'Current Zone: ' + game.global.world;
		M["performance"].AFKOverlayHelium.innerText = 'Current Helium: ' + prettify(Math.floor(game.resources.helium.owned));
		M["performance"].AFKOverlayStatus.innerHTML = 'Current Status: ' + getAutoMapsStatus()[0];
	}

})(MODULES, window);
