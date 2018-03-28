;(function(M)
{
	M["fightinfo"] = {};
	M["fightinfo"].$worldGrid = document.getElementById('grid');
	M["fightinfo"].$mapGrid = document.getElementById('mapGrid');

	// Powerful imps
	M["fightinfo"].powerful =
	[
		"Improbability",
		"Omnipotrimp",
		"Mutimp",
		"Hulking_Mutimp"
	];

	// Exotic imps
	M["fightinfo"].exotics =
	[
		"Feyimp",
		"Tauntimp",
		"Venimp",
		"Whipimp",
		"Magnimp",
		"Goblimp",
		"Flutimp",
		"Jestimp",
		"Titimp",
		"Chronoimp"
	];

	//Colors for special imps (This has been disabled)
	M["fightinfo"].colors =
	{
		bone: '#ffffff',
		exotic: '#000000',
		powerful: '#000000'
	}

	M["fightinfo"].lastProcessedWorld = null;
	M["fightinfo"].lastProcessedMap = null;

	function Update()
	{
		// Check if we should update world or map info
		if(game.global.mapsActive)
		{
			// Check if current map already infoed
			// Can't do this because of map repeating
			/*if(M["fightinfo"].lastProcessedMap === null || M["fightinfo"].lastProcessedMap !== game.global.lookingAtMap)
				M["fightinfo"].lastProcessedMap = game.global.lookingAtMap;
			else
				return;*/

			// Cell data
			var cells = game.global.mapGridArray;

			// DOM rows
			var $rows = Array.prototype.slice.call(M["fightinfo"].$mapGrid.children);
		}
		else
		{
			// Check if current world already infoed
			if(M["fightinfo"].lastProcessedWorld === null || M["fightinfo"].lastProcessedWorld !== game.global.world)
				M["fightinfo"].lastProcessedWorld = game.global.world;
			else
				return;

			// Cell data
			var cells = game.global.gridArray;

			// DOM rows
			var $rows = Array.prototype.slice.call(M["fightinfo"].$worldGrid.children);
		}

		// Rows are in inverse order somewhy
		$rows = $rows.reverse();

		// DOM cells
		var $cells = [];

		// Loop through DOM rows and concat each row's cell-element into $cells
		$rows.forEach(function(x)
		{
			$cells = $cells.concat(Array.prototype.slice.call(x.children));
		});

		// Process all cells
		for(var i = 0; i < $cells.length; i++)
		{
			// DOM cell
			var $cell = $cells[i];

			// Cell data
			var cell = cells[i];


			if(cell.name.toLowerCase().indexOf('skele') > -1)					// Skeletimp cell
			{
				if(cell.special.length === 0)
					$cell.innerHTML = "<span class=\"glyphicon glyphicon-italic\"></span> ";

				$cell.title = cell.name;
				//$cell.style.color = M["fightinfo"].colors.bone; //(This changes the colour of the glyph - bad bc it overrides trimps and looks bad against corruption etc)
				$cell.style.textShadow = '0px 0px 10px #ffffff';
			}

			else if(M["fightinfo"].exotics.indexOf(cell.name) > -1)				// Exotic cell
			{
				if(cell.special.length === 0)
					$cell.innerHTML = "<span class=\"glyphicon glyphicon-sunglasses\"></span> ";

				$cell.title = cell.name;
				//$cell.style.color = M["fightinfo"].colors.exotic; //(This changes the colour of the glyph - bad bc it overrides trimps and looks bad against corruption etc)
				$cell.style.textShadow = '0px 0px 10px #fb753f';
			}

			else if(M["fightinfo"].powerful.indexOf(cell.name) > -1)			// Powerful imp
			{
				if(cell.special.length === 0)
					$cell.innerHTML = "<span class=\"glyphicon glyphicon-hazard\"></span> ";

				$cell.title = cell.name;
				//$cell.style.color = M["fightinfo"].colors.powerful; //(This changes the colour of the glyph - bad bc it overrides trimps and looks bad against corruption etc)
				$cell.style.textShadow = '0px 0px 10px #8c0000';
			}

			//This shit doesn't work and I don't know why (What is the celltitle??? is it the name of the nature? Imps are labelled Toxic/Gusty/Frozen but that didin't work either)
			if(cell.name.toLowerCase().indexOf('poison') > -1)				// Poison Token cell
			{
			  if(cell.special.length === 0)
			    $cell.innerHTML = "<span class=\"glyphicon glyphicon-flask\"></span> ";

			  $cell.title = cell.name;
			  //$cell.style.color = M["fightinfo"].colors.exotic; //(This changes the colour of the glyph - bad bc it overrides trimps and looks bad against corruption etc)
			  $cell.style.textShadow = '0px 0px 10px #ffffff';
			}
			if(cell.name.toLowerCase().indexOf('wind') > -1)				// Wind Token cell
			{
			  if(cell.special.length === 0)
			    $cell.innerHTML = "<span class=\"icomoon icon-air\"></span> ";

			  $cell.title = cell.name;
			  //$cell.style.color = M["fightinfo"].colors.exotic; //(This changes the colour of the glyph - bad bc it overrides trimps and looks bad against corruption etc)
			  $cell.style.textShadow = '0px 0px 10px #ffffff';
			}
			if(cell.name.toLowerCase().indexOf('ice') > -1)				// Ice Token cell
			{
			  if(cell.special.length === 0)
			    $cell.innerHTML = "<span class=\"glyphicon glyphicon-certificate\"></span> ";

			  $cell.title = cell.name;
			  //$cell.style.color = M["fightinfo"].colors.exotic; //(This changes the colour of the glyph - bad bc it overrides trimps and looks bad against corruption etc)
			  $cell.style.textShadow = '0px 0px 10px #ffffff';
			}
		}
	}

	M["fightinfo"].Update = Update;
})(MODULES);
