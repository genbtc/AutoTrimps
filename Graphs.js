//Import the Chart Libraries
var head = document.getElementsByTagName('head')[0];
var chartscript = document.createElement('script');
chartscript.type = 'text/javascript';
chartscript.src = 'https://code.highcharts.com/highcharts.js';
head.appendChild(chartscript);


//Create the graph button and div
var newItem = document.createElement("TD");
newItem.appendChild(document.createTextNode("Graphs"));
newItem.setAttribute("class", "btn btn-default");
newItem.setAttribute("onclick", "autoToggleGraph(); drawGraph();");
var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);
document.getElementById("settingsRow").innerHTML += '<div id="graphParent" style="display: none;"><div id="graph" style="margin-bottom: 2vw;margin-top: 2vw;"></div></div>';

//Create the dropdown for what graph to show
var graphList = ['HeliumPerHour', 'Helium', 'Clear Time', 'Void Maps', 'Loot Sources', 'Run Time', 'Void Map History', 'Coord', 'Gigas', 'Lastwarp', 'Trimps','Nullifium Gained'];
var btn = document.createElement("select");
btn.id = 'graphSelection';
if(game.options.menu.darkTheme.enabled == 2) btn.setAttribute("style", "color: #C8C8C8");
else btn.setAttribute("style", "color:black");
btn.setAttribute("class", "settingBtn");
btn.setAttribute("onmouseover", 'tooltip(\"Graph\", \"customText\", event, \"What graph would you like to display?\")');
btn.setAttribute("onmouseout", 'tooltip("hide")');
btn.setAttribute("onchange", "setGraphData(document.getElementById('graphSelection').value)");
for (var item in graphList) {
    var option = document.createElement("option");
    option.value = graphList[item];
    option.text = graphList[item];
    btn.appendChild(option);
}
document.getElementById('graphParent').appendChild(btn);

//refresh graph button - probably don't need different variables but I don't know what I'm doing!
var btn1 = document.createElement("button");
var u = document.createTextNode("Refresh");
btn1.appendChild(u);
btn1.setAttribute("onclick", "drawGraph()");
btn1.setAttribute("class", "settingBtn");
if(game.options.menu.darkTheme.enabled != 2) btn1.setAttribute("style", "color:black");
document.getElementById('graphParent').appendChild(btn1);

//clear data button
var btn2 = document.createElement("button");
var t = document.createTextNode("Clear All Data");
btn2.appendChild(t);
btn2.setAttribute("onclick", "clearData(); drawGraph();");
btn2.setAttribute("class", "settingBtn");
if(game.options.menu.darkTheme.enabled != 2) btn2.setAttribute("style", "color:black");
document.getElementById('graphParent').appendChild(btn2);


//textbox for clear data button
var textboxbtn3 = document.createElement("input");
textboxbtn3.setAttribute("id", "deleteSelectedTextBox");
textboxbtn3.setAttribute("style", "width: 80px;margin-left: 250px; margin-right: 5px; color:black");
document.getElementById('graphParent').appendChild(textboxbtn3);

//delete selected button
var btn3 = document.createElement("button");
var tt = document.createTextNode("Delete Selected Portal");
btn3.appendChild(tt);
btn3.setAttribute("onclick", "deleteSelected(); drawGraph();");
btn3.setAttribute("class", "settingBtn");
if(game.options.menu.darkTheme.enabled != 2) btn3.setAttribute("style", "color:black");
document.getElementById('graphParent').appendChild(btn3);

//Create Graphs export button.
var btnExp = document.createElement("button");
var exp = document.createTextNode("Export your Graph Database");
btnExp.appendChild(exp);
btnExp.setAttribute("class", "settingBtn");
if(game.options.menu.darkTheme.enabled != 2)
    btnExp.setAttribute("style", "margin-left: 250px; margin-right: 5px; color:black");
else
    btnExp.setAttribute("style", "margin-left: 250px; margin-right: 5px;");
document.getElementById('graphParent').appendChild(btnExp);
btnExp.setAttribute("onclick", 'GraphsImportExportTooltip(\'ExportGraphs\', null, \'update\')');

/*
// IMPORT BUTTON IS NOT FINISHED. DO NOT USE! = ONLY FOR DEVELOPERS WHO CAN FIX IT

//Create Graphs import button.
var btnImp = document.createElement("button");
var imp = document.createTextNode("Replace your Graph Database");
btnImp.appendChild(imp);
btnImp.setAttribute("class", "settingBtn");
if(game.options.menu.darkTheme.enabled != 2)
    btnImp.setAttribute("style", "color:black");
document.getElementById('graphParent').appendChild(btnImp);
btnImp.setAttribute("onclick", 'GraphsImportExportTooltip(\'ImportGraphs\', null, \'update\')');

//Create Graphs append  button.
var btnImpApp = document.createElement("button");
var impapp = document.createTextNode("Append to your Graph Database");
btnImpApp.appendChild(impapp);
btnImpApp.setAttribute("class", "settingBtn");
if(game.options.menu.darkTheme.enabled != 2)
    btnImpApp.setAttribute("style", "color:black");
document.getElementById('graphParent').appendChild(btnImpApp);
btnImpApp.setAttribute("onclick", 'GraphsImportExportTooltip(\'AppendGraphs\', null, \'update\')');
*/

//tips bottom line
var tips = document.createElement('div');
tips.innerHTML = 'Tips: You can zoom by dragging a box around an area. You can turn series off by clicking them on the legend. To delete a portal, Type its portal number in the box and press Delete Selected';
document.getElementById('graphParent').appendChild(tips);

function GraphsImportExportTooltip(what, isItIn, event) {
	if (game.global.lockTooltip) 
        return;
	var elem = document.getElementById("tooltipDiv");
	swapClass("tooltipExtra", "tooltipExtraNone", elem);
	var ondisplay = null; // if non-null, called after the tooltip is displayed
	var tooltipText;
	var costText = "";
	if (what == "ExportGraphs"){
		tooltipText = "This is your GRAPH DATABASE save string. There are many like it but this one is yours. Save this save somewhere safe so you can save time next time. <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + JSON.stringify(allSaveData) + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
		if (document.queryCommandSupported('copy')){
			costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
			ondisplay = function(){
				document.getElementById('exportArea').select();
				document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
				    document.getElementById('exportArea').select();
					  try {
						document.execCommand('copy');
					  } catch (err) {
						document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
					  }
				});
            };
		}
        else {
            ondisplay = function(){
                document.getElementById('exportArea').select();
            };
		}
		costText += "</div>";
	}
	if (what == "ImportGraphs"){
        //runs the loadGraphs() function.
		tooltipText = "Replaces your GRAPH DATABASE with this save string! It'll be fine, I promise.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
		costText="<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); loadGraphs();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
		ondisplay = function () {
			document.getElementById('importBox').focus();
        };
    }
	if (what == "AppendGraphs"){
        //runs the appendGraphs() function.
		tooltipText = "Appends to your GRAPH DATABASE with this save string (combines them)! It'll be fine, I hope.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
		costText="<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); appendGraphs();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
		ondisplay = function () {
			document.getElementById('importBox').focus();
        };
    }    
    game.global.lockTooltip = true;
    elem.style.left = "33.75%";
    elem.style.top = "25%";
	document.getElementById("tipTitle").innerHTML = what;
	document.getElementById("tipText").innerHTML = tooltipText;
	document.getElementById("tipCost").innerHTML = costText;
	elem.style.display = "block";
	if (ondisplay !== null)
		ondisplay();
}

//function to take the text string, and use it to load and overwrite your saved data (for graphs)
function loadGraphs() {
    var thestring = document.getElementById("importBox").value.replace(/(\r\n|\n|\r|\s)/gm,"");
    var tmpset = JSON.parse(thestring);
    if (tmpset == null)
        return;
    //should have done more error checking with at least an error message.
    allSaveData = tmpset;
    //refresh
    drawGraph();
}

//function to take the text string, and use it to load and append your saved data (for graphs) to the old database 
function appendGraphs() {
    //currently overwrites:
    /*
    var thestring = document.getElementById("importBox").value.replace(/(\r\n|\n|\r|\s)/gm,"");
    var tmpset = JSON.parse(thestring);
    if (tmpset == null)
        return;
    //should have done more error checking with at least an error message.
    allSaveData = tmpset;
    */
    //refresh
    drawGraph();
}

function clearData(portal) {
    if(portal) {
        while(allSaveData[0].totalPortals < game.global.totalPortals - portal) allSaveData.shift();
    }
    else {
        while(allSaveData[0].totalPortals < game.global.totalPortals) allSaveData.shift();
    }
}

function deleteSelected() {
    var txtboxvalue = document.getElementById('deleteSelectedTextBox').value;
    if (txtboxvalue == "")
        return;
    for (var i = allSaveData.length-1; i >= 0; i--) {
        if (allSaveData[i].totalPortals == txtboxvalue)
            allSaveData.splice(i, 1);
    }
}

function autoToggleGraph() {
    if (game.options.displayed) toggleSettingsMenu();
    var aset = document.getElementById('autoSettings');
    if (aset) {
        if (aset.style.display === 'block') aset.style.display = 'none';
    }
    var item = document.getElementById('graphParent');
    if (item.style.display === 'block') item.style.display = 'none';
    else {
        item.style.display = 'block';
        setGraph();
    }
}

function autoPlusGraphMenu() {
    var item = document.getElementById('graphParent');
    if (item.style.display === 'block') item.style.display = 'none';
    toggleSettingsMenu();
}
var chart1;
function setGraph(title, xTitle, yTitle, valueSuffix, formatter, series, yType) {
    chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'graph',
            zoomType: 'xy'
        },
        title: {
            text: title,
            x: -20 //center
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                animation: false,
                marker: {
                    enabled: false
                }
            }
        },
        xAxis: {
            floor: 1,
            title: {
                text: xTitle
            },
        },
        yAxis: {
            title: {
                text: yTitle
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            type: yType,
            dateTimeLabelFormats: { //force all formats to be hour:minute:second
            second: '%H:%M:%S',
            minute: '%H:%M:%S',
            hour: '%H:%M:%S',
            day: '%H:%M:%S',
            week: '%H:%M:%S',
            month: '%H:%M:%S',
            year: '%H:%M:%S'
        }
        },
        tooltip: {
        	pointFormatter: formatter,
        	valueSuffix: valueSuffix
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series
    });
}

function setColor(tmp) {
    for (var i in tmp) {
        if (i == tmp.length - 1) {
            tmp[i].color = '#FF0000'; //Current run is in red
        } else {
            tmp[i].color = '#90C3D4'; //Old runs are in blue
        }
    }
    return tmp;
}

function pushData() {
    console.log('Starting Zone ' + game.global.world);
    allSaveData.push({
        totalPortals: game.global.totalPortals,
        heliumOwned: game.resources.helium.owned,
        currentTime: new Date().getTime(),
        portalTime: game.global.portalTime,
        resources: game.resources,
        world: game.global.world,
        challenge: game.global.challengeActive,
        voids: game.global.totalVoidMaps,
        heirlooms: game.stats.totalHeirlooms,
        nullifium: recycleAllExtraHeirlooms(true),
        gigas: game.upgrades.Gigastation.done,
        trimps: game.resources.trimps.realMax(),
        coord: game.upgrades.Coordination.done,
        lastwarp: game.global.lastWarp
    });
    //only keep 10 portals worth of runs to prevent filling storage
    clearData(10);
    localStorage.setItem('allSaveData', JSON.stringify(allSaveData));
}


function gatherInfo() {
    if (allSaveData === null) {
        allSaveData = [];
    }
    //clear filtered loot data upon portaling. <5 check to hopefully throw out bone portal shenanigans
    if(allSaveData[allSaveData.length -1].totalPortals != game.global.totalPortals && game.global.world < 5) {
    	for(var r in filteredLoot) {
    		for(var b in filteredLoot[r]){
    			filteredLoot[r][b] = 0;
    		}
    	}
    }
    
    if (allSaveData.length === 0) {
        pushData();
    } else if (allSaveData[allSaveData.length - 1].world != game.global.world) {
        pushData();
    }


    // graphData = setColor(graphData);


}

function drawGraph() {
        setGraphData(document.getElementById('graphSelection').value);
}

function setGraphData(graph) {
    var title, xTitle, yTitle, yType, valueSuffix, series, formatter;
    var oldData = JSON.stringify(graphData);
    valueSuffix = '';
    
    formatter =  function () {
        var ser = this.series;
        return '<span style="color:' + ser.color + '" >●</span> ' +
                ser.name + ': <b>' + 
                Highcharts.numberFormat(this.y, 0,'.', ',') + valueSuffix + '</b><br>';
            };
            
    switch (graph) {
        case 'Clear Time':
            var graphData = [];
            var currentPortal = -1;
            var currentZone = -1;
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    //push a 0 to index 0 so that clear times line up with x-axis numbers
                    graphData[graphData.length -1].data.push(0);
                }
                if(currentZone < allSaveData[i].world && currentZone != -1) {
                    graphData[graphData.length - 1].data.push(Math.round((allSaveData[i].currentTime - allSaveData[i-1].currentTime) / 1000));
                }
                
                //first time through, push 0s to zones we don't have data for. Probably only occurs if script is loaded in the middle of a run where it was previously not loaded (haven't tested this)
                //this functionality could fix some of the weirdness in graphs from using bone portal?
                if(currentZone == -1) {
                    var loop = allSaveData[i].world - 1;
                    while (loop > 0) {
                        graphData[graphData.length -1].data.push(0);
                        loop--;
                    }
                }
                currentZone = allSaveData[i].world;

            }
            title = 'Time to clear zone';
            xTitle = 'Zone';
            yTitle = 'Clear Time';
            yType = 'Linear';
            valueSuffix = ' Seconds';
            break;
        case 'Helium':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                }
                graphData[graphData.length - 1].data.push(allSaveData[i].heliumOwned);
            }
            title = 'Helium';
            xTitle = 'Zone';
            yTitle = 'Helium';
            yType = 'Linear';
            break;
        case 'HeliumPerHour':
            var currentPortal = -1;
            var currentZone = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                    if(allSaveData[i].world == 1)
                        graphData[graphData.length -1].data.push(0);
                    
                    if(currentZone == -1 || allSaveData[i].world != 1) {
                        var loop = allSaveData[i].world;
                        while (loop > 0) {
                            graphData[graphData.length -1].data.push(0);
                            loop--;
                        }
                    }
                }
                if(currentZone < allSaveData[i].world && currentZone != -1) {
                    graphData[graphData.length - 1].data.push(Math.floor(allSaveData[i].heliumOwned / ((allSaveData[i].currentTime - allSaveData[i].portalTime) / 3600000)));
                }
            
                currentZone = allSaveData[i].world;
                
            }
            title = 'Helium/Hour';
            xTitle = 'Zone';
            yTitle = 'Helium';
            yType = 'Linear';
            break;
            
            case 'Void Maps':
            var currentPortal = -1;
            var totalVoids = 0;
            var theChallenge = '';
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    if(currentPortal == -1) {
                        theChallenge = allSaveData[i].challenge;
                        currentPortal = allSaveData[i].totalPortals;
                        graphData.push({
                        name: 'Void Maps',
                        data: [],
                        type: 'column'
                    });
                        continue;
                    }
                    graphData[0].data.push([allSaveData[i-1].totalPortals, totalVoids]);
                    theChallenge = allSaveData[i].challenge;
                    totalVoids = 0;
                    currentPortal = allSaveData[i].totalPortals;
                }
                if(allSaveData[i].voids > totalVoids) {
                     totalVoids = allSaveData[i].voids;
                 }
            }
            title = 'Void Maps Per Portal';
            xTitle = 'Portal';
            yTitle = 'Void Maps';
            yType = 'Linear';
            break;
      
        case 'Nullifium Gained':
        var currentPortal = -1;
        var totalNull = 0;
        var theChallenge = '';
        graphData = [];
        var averagenulli = 0;
        var sumnulli = 0;
        var count = 0;
        for (var i in allSaveData) {
            if (allSaveData[i].totalPortals != currentPortal) {
                if(currentPortal == -1) {
                    theChallenge = allSaveData[i].challenge;
                    currentPortal = allSaveData[i].totalPortals;
                    graphData.push({
                    name: 'Nullifium Gained',
                    data: [],
                    type: 'column'
                });
                    continue;
                }
                graphData[0].data.push([allSaveData[i-1].totalPortals, totalNull]);
                count++;
                sumnulli += totalNull;
                //console.log("nulli was: " + totalNull + " " + count + " @ " + allSaveData[i].totalPortals);   //debug
                theChallenge = allSaveData[i].challenge;
                totalNull = 0;
                currentPortal = allSaveData[i].totalPortals;
                
            }
            if(allSaveData[i].nullifium > totalNull) {
                totalNull = allSaveData[i].nullifium;                
            }
        }
        averagenulli = sumnulli / count;
        //console.log("Average nulli was: " + averagenulli);
        title = 'Nullifium Gained Per Portal';
        if (averagenulli)
            title = "Average " + title + " = " + averagenulli;
        xTitle = 'Portal';
        yTitle = 'Nullifium Gained';
        yType = 'Linear';
        break;

            case 'Loot Sources':
            graphData = [];
            graphData[0] = {name: 'Metal', data: lootData.metal};
            graphData[1] = {name: 'Wood', data: lootData.wood};
            graphData[2] = {name: 'Food', data: lootData.food};
            graphData[3] = {name: 'Gems', data: lootData.gems};
            title = 'Loot Sources';
            xTitle = 'Time';
            yTitle = 'percentage looted (of all resources gained)';
            valueSuffix = '%';
            formatter = function () {
              return Highcharts.numberFormat(this.y,1);
            };
            break;

            
            case 'Run Time':
            var currentPortal = -1;
            var theChallenge = '';
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    if(currentPortal == -1) {
                        theChallenge = allSaveData[i].challenge;
                        currentPortal = allSaveData[i].totalPortals;
                        graphData.push({
                        name: 'Run Time',
                        data: [],
                        type: 'column'
                    });
                        continue;
                    }
                    var theOne = allSaveData[i-1];
                    var runTime = theOne.currentTime - theOne.portalTime;
                    graphData[0].data.push([theOne.totalPortals, runTime]);
                    theChallenge = allSaveData[i].challenge;
                    currentPortal = allSaveData[i].totalPortals;
                }
            }
            title = 'Total Run Time';
            xTitle = 'Portal';
            yTitle = 'Time';
            yType = 'datetime';
            formatter =  function () {
                var ser = this.series;
                return '<span style="color:' + ser.color + '" >●</span> ' +
                        ser.name + ': <b>' +
                        Highcharts.dateFormat('%H:%M:%S', this.y) + '</b><br>';
            
            };
            break;
            
            case 'Void Map History':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                }
                graphData[graphData.length - 1].data.push(allSaveData[i].voids);
            }
            title = 'Void Map History';
            xTitle = 'Zone';
            yTitle = 'Number of Void Maps';
            yType = 'Linear';
            break;
               
            
            title = 'MetalCost of Equipment to Buildings\' Ratio - (Artisan vs Resourceful)';
            xTitle = 'Zone';
            yTitle = 'Percent';
            yType = 'Linear';
            break;
            
            case 'Coord':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                }
                if (allSaveData[i].coord)
                    graphData[graphData.length - 1].data.push(allSaveData[i].coord);
            }
            title = 'Coordination History';
            xTitle = 'Zone';
            yTitle = 'Coordination';
            yType = 'Linear';
            break;
            
            case 'Gigas':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                }
                if (allSaveData[i].gigas >= 0)
                    graphData[graphData.length - 1].data.push(allSaveData[i].gigas);
            }
            title = 'Gigastation History';
            xTitle = 'Zone';
            yTitle = 'Number of Gigas';
            yType = 'Linear';
            break;

            case 'Lastwarp':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                }
                if (allSaveData[i].lastwarp >= 0)
                    graphData[graphData.length - 1].data.push(allSaveData[i].lastwarp);
            }
            title = 'Warpstation History';
            xTitle = 'Zone';
            yTitle = 'Previous Giga\'s Number of Warpstations';
            yType = 'Linear';
            break; 

            case 'Trimps':
            var currentPortal = -1;
            graphData = [];
            for (var i in allSaveData) {
                if (allSaveData[i].totalPortals != currentPortal) {
                    graphData.push({
                        name: 'Portal ' + allSaveData[i].totalPortals + ': ' + allSaveData[i].challenge,
                        data: []
                    });
                    currentPortal = allSaveData[i].totalPortals;
                }
                if (allSaveData[i].trimps >= 0)
                    graphData[graphData.length - 1].data.push(allSaveData[i].trimps);
            }
            title = 'Total Trimps';
            xTitle = 'Zone';
            yTitle = 'Cumulative Number of Trimps';
            yType = 'Linear';
            break;                        
            
    }
    if (oldData != JSON.stringify(graphData)) {
        setGraph(title, xTitle, yTitle, valueSuffix, formatter, graphData, yType);
    }
}


function updateCustomStats() {
    var timeThisPortal = new Date().getTime() - game.global.portalTime;
    timeThisPortal /= 3600000;
    var resToUse = game.resources.helium.owned;
    var heHr = prettify(Math.floor(game.resources.helium.owned / timeThisPortal));
    document.getElementById('customHeHour').innerHTML = heHr + "/Hr";
}

var filteredLoot = {
    'produced': {metal: 0, wood: 0, food: 0, gems: 0},
    'looted': {metal: 0, wood: 0, food: 0, gems: 0}
}
var lootData = {
    metal: [], wood:[], food:[], gems:[]
};
//track loot gained. jest == from jest/chronoimp
function filterLoot (loot, amount, jest, fromGather) {
    if(loot != 'wood' && loot != 'metal' && loot != 'food' && loot != 'gems') return;
    if(jest) {
        filteredLoot.produced[loot] += amount;
        //subtract from looted because this loot will go through addResCheckMax which will add it to looted
        filteredLoot.looted[loot] -= amount;
    }
    else if (fromGather) filteredLoot.produced[loot] += amount;
    else filteredLoot.looted[loot] += amount;
    //console.log('item is: ' + loot + ' amount is: ' + amount);
}

function getLootData() {
    var loots = ['metal', 'wood', 'food', 'gems'];
    for(var r in loots){
        var name = loots[r];
        //avoid /0 NaN
        if(filteredLoot.produced[name])
        	lootData[name].push(filteredLoot.looted[name]/filteredLoot.produced[name]);
        if(lootData[name].length > 20)lootData[name].shift();
    }
}

setInterval(getLootData, 30000);

//overwriting default game functions!!!!!!!!!!!!!!!!!!!!!!
game.badGuys.Jestimp.loot = 
function() {
    var elligible = ["food", "wood", "metal", "science"];
				if (game.jobs.Dragimp.owned > 0) elligible.push("gems");
				if (game.jobs.Explorer.locked == 0) elligible.push("fragments");
				var roll = Math.floor(Math.random() * elligible.length);
				var item = elligible[roll];
				var amt = simpleSeconds(item, 45);
				amt = scaleToCurrentMap(amt);
				addResCheckMax(item, amt);
				filterLoot(item, amt, true);
				message("That Jestimp gave you " + prettify(amt) + " " + item + "!", "Loot", "*dice", "exotic");
				game.unlocks.impCount.Jestimp++;
};

game.badGuys.Chronoimp.loot = 
function () {
				var elligible = ["food", "wood", "metal", "science"];
				if (game.jobs.Dragimp.owned > 0) elligible.push("gems");
				if (game.jobs.Explorer.locked == 0) elligible.push("fragments");
				var cMessage = "That Chronoimp dropped ";
				for (var x = 0; x < elligible.length; x++){
					var item = elligible[x];
					var amt = simpleSeconds(item, 5);
					amt = scaleToCurrentMap(amt);
					addResCheckMax(item, amt, null, null, true);
					filterLoot(item, amt, true);
					cMessage += prettify(amt) + " " + item;
					if (x == (elligible.length - 1)) cMessage += "!";
					else if (x == (elligible.length - 2)) cMessage += ", and ";
					else cMessage += ", ";
				}
				message(cMessage, "Loot", "hourglass", "exotic");
				game.unlocks.impCount.Chronoimp++;
};

function addResCheckMax(what, number, noStat, fromGather, nonFilteredLoot) {
    filterLoot(what, number, null, fromGather);
    var res = game.resources[what];
	if (res.max == -1) {
		res.owned += number;
		if (!noStat && what == "gems") game.stats.gemsCollected.value += number;
		return;
	}
	var newMax = res.max + (res.max * game.portal.Packrat.modifier * game.portal.Packrat.level);
	newMax = calcHeirloomBonus("Shield", "storageSize", newMax);
    if (res.owned + number <= newMax) res.owned += number;
    else res.owned = newMax;
	if (nonFilteredLoot && game.options.menu.useAverages.enabled){
		addAvg(what, number);
	}
}

//END game function overwrite

var allSaveData = [];
var graphData = [];
var tmpGraphData = JSON.parse(localStorage.getItem('allSaveData'));
if (tmpGraphData !== null) {
    console.log('Got allSaveData. Yay!');
    allSaveData = tmpGraphData;
}

setInterval(gatherInfo, 1000);

