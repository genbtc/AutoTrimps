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

	// Colors for special imps
	M["fightinfo"].colors =
	{
		bone: '#ecf0f1',
		exotic: '#1abc9c',
		powerful: '#e74c3c'
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
					$cell.innerHTML = 'S';

				$cell.title = cell.name;
				$cell.style.color = M["fightinfo"].colors.bone;
				$cell.style.textShadow = '0px 0px 5px rgba(255, 255, 255, 1)';
			}
			else if(M["fightinfo"].exotics.indexOf(cell.name) > -1)				// Exotic cell
			{
				if(cell.special.length === 0)
					$cell.innerHTML = 'E';

				$cell.title = cell.name;
				$cell.style.color = M["fightinfo"].colors.exotic;
				$cell.style.textShadow = '0px 0px 5px rgba(255, 255, 255, 1)';
			}
			else if(M["fightinfo"].powerful.indexOf(cell.name) > -1)			// Powerful imp
			{
				if(cell.special.length === 0)
					$cell.innerHTML = 'P';

				$cell.title = cell.name;
				$cell.style.color = M["fightinfo"].colors.powerful;
				$cell.style.textShadow = '0px 0px 5px rgba(255, 255, 255, 1)';
			}		
		}
	}

	M["fightinfo"].Update = Update;
})(MODULES);
