
/*
	Rich Gallery - Current Version - 1.0
	Current Implementation - Only 1 RichGallery per page.
*/


//User Settings
var rg_rowCount_minWidth = [
	//Set number of previews in a row to the minimum screen width (Highest to Lowest order).
	[4, 960],
	[3, 640],
	[2, 0]
];

//Optional Settings
var rg_container_id = "rich_gallery";
var rg_data_xml = "rg_dropdownData.xml";

//Computational Global Variables - Do Not Touch
var rg_container = "#" + rg_container_id;
var rg_rowCount = 0;
var rg_previewList = [];
var rg_dropdownObjectList = [];
var rg_templates = { dropdown: "" };
var rg_activeDropdown = 0;

//Events
$(document).ready(function () {
	//Load rg_data_xml Data to Memory
	rg_readDropdownData();

	//Load Template to Memory
	rg_loadTemplate();

	//Add RG preview-id data-attributes to original HTML
	rg_addDataAndCreateList(rg_container);

	//Counts preview boxes per row From screenWidth/user settings
	rg_getRowCount();

	//Window Resize - Calculate preview boxes in a row through user settings
	$(window).on('resize', function () {
		rg_getRowCount();
	});

	//Click Action Creates or Clears Dropdown
	$(rg_container + ' > .rg-preview').click(function () {
		var previewId = $(this).attr('data-rg-id');
		rg_insertDropdown(rg_container, previewId);
	});
});


/*
	Intialize
*/

//Assign rg_container preview boxes data-rg-id
function rg_addDataAndCreateList(container) {
	
	//ID's start at 1 to allow for easy row_count calculations
	var count = 1;
	$(container + ' > .rg-preview').each(function () {
		$(this).attr('data-rg-id', count);
		rg_previewList.push(this);
		count++;
	});
}

//Load Template to Memory
function rg_loadTemplate() {
	rg_templates.dropdown = $('#rg-dropdownTemplate').html();
}

//Load rg_data_xml Data to Memory -- *This can be edited to add extra [[fields]]
function rg_readDropdownData() {
	$.ajax({
		type: "GET",
		async: false,
		url: rg_data_xml,
		dataType: "xml",
		success: function (xml) {

			//Creates ID to match preview data-rg-id
			var id = 1;

			//Loop and Read
			$(xml).find('dropdown').each(function (index) {

				//Get data entries from file
				var content = $(this).find("content").text();

				//Create DropdownObject
				var newDropdownObject = new rg_dropdownObject(id, content);

				//Add each work entry to workList
				rg_dropdownObjectList.push(newDropdownObject);

				id++;
			});
		}
	});
}

//Set Row Count global variable
function rg_getRowCount() {

	//Screen width = window width
	var screenWidth = $(window).width();

	//Set Row count depending on screenWidth
	for (i = 0; i < rg_rowCount_minWidth.length; i++) {
		if (screenWidth > rg_rowCount_minWidth[i][1]) {

			//Clear Dropdown if there is a change in rowCount
			if (rg_rowCount != rg_rowCount_minWidth[i][0]) {
				rg_clearDropdown();
				rg_rowCount = rg_rowCount_minWidth[i][0];
			}
			break;
		}
	}
}


/*
	Create and Clear Dropdowns
*/

//Create and Destroy Dropdown box
function rg_insertDropdown(container, previewId)
{
	if (previewId == rg_activeDropdown)
	{
		rg_clearDropdown();
	}
	else
	{
		var previewRowEnd = roundNumberUp(previewId, rg_rowCount);

		//If previewRowEnd < total previews, then the last preview is the end.
		if (previewRowEnd > rg_previewList.length)
		{
			previewRowEnd = rg_previewList.length;
		}


		//Clear Dropdowns
		rg_clearDropdown();
		rg_getDataToTemplate(previewId);

		//Place after previewRowEnd
		$(container + ' > .rg-preview[data-rg-id="' + previewRowEnd + '"]').after(rg_getDataToTemplate(previewId));

		//Set globalVariable rg_activeDropdown to previewId
		rg_activeDropdown = previewId;
	}
}

//Replaces template with rg_data_xml Data -- *This can be edited to add extra [[fields]]
function rg_getDataToTemplate(previewId)
{
	var dropdownData = rg_dropdownObjectList[previewId - 1];
	return rg_templates.dropdown.replace("[[html]]", dropdownData.content);
}

//Clears Dropdowns
function rg_clearDropdown() {
	rg_activeDropdown = 0;
	$('.rg-dropdown-container').remove();
}



/*
	Classes
*/

//Dropdown Object -- *This can be edited to add extra [[fields]]
function rg_dropdownObject(id, content) {
	this.id = id;
	this.content = content;
}


/*
	Helpers
*/

//Round Number Up
function roundNumberUp(numberToRound, numberGoal)
{
	return Math.ceil(numberToRound / numberGoal) * numberGoal;
}