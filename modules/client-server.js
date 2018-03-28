/*
 * AutoTrimps Client-Server EndPoint Data Transferance script.
 *
 *   March 4.2018 - Simple AT data save endpoint script -- orig by Swiffy
 *
*/
//MODULES["client-server"] = {};
//The ATServer{} object has 3 commands: GetID(), SaveData(), Upload()
//All Data is uncompressed, unencrypted, plaintext for clarity. No private info is leaked.

var ATServer =
{
	//SERVER_IP: '207.246.77.188',
    SERVER_HOSTNAME: 'https://autotrimps.site/ATendpoint.php'
}

ATServer.GetID = function(callback)
{
	var req = new XMLHttpRequest();

	req.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			callback(JSON.parse(req.responseText).data.id);
		}
	}

	req.open('GET', ATServer.SERVER_HOSTNAME, true);
	req.setRequestHeader('req', 'get_id');
	req.send();
}

ATServer.SaveData = function(id, data, callback)
{
	var req = new XMLHttpRequest();

	req.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			callback(JSON.parse(req.responseText));
		}
	}

	req.open('POST', ATServer.SERVER_HOSTNAME + '?id=' + id, true);
	req.setRequestHeader('req', 'save_data');
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));
}

ATServer.Upload = function(data)
{
    ATServer.GetID(function(id)
    {
        autoTrimpSettings.analyticsID = autoTrimpSettings.analyticsID || id;
        //debug("Server generated ID: " + autoTrimpSettings.analyticsID, "other");
        ATServer.SaveData(autoTrimpSettings.analyticsID, data, function(response)
        {
            debug("Submitted analytics data w/ ID: " + autoTrimpSettings.analyticsID, "other");
        });
    });
}

//Data to be uploaded: The version of AutoTrimps and the list of your settings file. Also list of saved/named profiles.
// note to newbs: typing in autoTrimpSettings into console and expanding the arrow will show you what is all in here.
//-------------------------------------------------------------------------------------------------------------------
//TODO: This is part of the ATsettings variable management:, it might make sense to move to that file, splitting here
//-------------------------------------------------------------------------------------------------------------------

ATServer.UploadSettings = function() {
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var allProfiles = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    var ulData = {
        settings: JSON.parse(serializeSettings()),  //Line 41 utils.js - grabs fresh autoTrimpSettings from localstorage, reduces the length and parses it.
        profiles: allProfiles,  //every saved profile.
        modules: MODULES
    };
    ATServer.Upload(ulData);
    debug("AutoTrimps Settings File was Uploaded for analytics/usage! This is controlled with a new button on AT's Import/Export tab.","general");
}
if (getPageSetting('allowSettingsUpload')) {
    ATServer.UploadSettings();
}
