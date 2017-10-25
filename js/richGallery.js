
//Rich Gallery - Current Version - 1.0

//User Settings
var rg_rowCount_minWidth = [
	[4, 960],
	[3, 640],
	[2, 0]
];

//Computational Global Variables - Do Not Touch
var rg_rowCount = 0;
var rg_previewList = [];
var rg_expandObjectList = [];
var rg_templates = { expand: "" };
var rg_activeExpand = 0;


//Events
$(document).ready(function () {
	////Load Data to Memory
	rg_readExpandData();

	////Load Template to Memory
	rg_loadTemplate();

	//Add RG preview-id data-attributes to original HTML
	rg_addDataAndCreateList('#rich_gallery');

	//Counts preview boxes per row From screenWidth/user settings
	rg_getRowCount();

	//Window Resize - Calculate preview boxes in a row through user settings
	$(window).on('resize', function () {
		rg_getRowCount();
	});

	//Click
	$('#rich_gallery > .rg-preview').click(function () {
		//Potential multiple containers?
		var container = '#rich_gallery';
		var previewId = $(this).attr('data-rg-id');

		rg_insertExpand(container, previewId);
	});
});



//Initialize
function rg_addDataAndCreateList(container) {
	var count = 1;
	$(container + ' > .rg-preview').each(function () {
		$(this).attr('data-rg-id', count);
		rg_previewList.push(this);
		count++;
	});
}

function rg_loadTemplate() {
	rg_templates.expand = $('#rg-expandTemplate').html();
}

function rg_readExpandData() {
	$.ajax({
		type: "GET",
		async: false,
		url: "rg_expandData.xml",
		dataType: "xml",
		success: function (xml) {

			var id = 1;
			//Loop and Read
			$(xml).find('expand').each(function (index) {

				//Get data entries from file
				var content = $(this).find("content").text();

				//Create ExpandObject
				var newExpandObject = new rg_expandObject(id, content);

				//Add each work entry to workList
				rg_expandObjectList.push(newExpandObject);

				id++;
			});
		}
	});
}


//Set Row Count global variable
function rg_getRowCount() {
	var screenWidth = $(window).width();
	for (i = 0; i < rg_rowCount_minWidth.length; i++) {
		if (screenWidth > rg_rowCount_minWidth[i][1]) {
			if (rg_rowCount != rg_rowCount_minWidth[i][0]) {
				rg_clearExpand();
				rg_rowCount = rg_rowCount_minWidth[i][0];
			}
			break;
		}
	}
}


//Create and Destroy expand box
function rg_insertExpand(container, previewId)
{
	if (previewId == rg_activeExpand)
	{
		rg_clearExpand();
	}
	else
	{
		var previewRowEnd = roundNumberUp(previewId, rg_rowCount);

		//If previewRowEnd < total previews, then the last preview is the end.
		if (previewRowEnd > rg_previewList.length)
		{
			previewRowEnd = rg_previewList.length;
		}


		//Clear Expands
		rg_clearExpand();
		rg_getDataToTemplate(previewId);

		//Place after previewRowEnd
		$(container + ' > .rg-preview[data-rg-id="' + previewRowEnd + '"]').after(rg_getDataToTemplate(previewId));

		//Set globalVariable rg_activeExpand to previewId
		rg_activeExpand = previewId;
	}
}

function rg_getDataToTemplate(id)
{
	var expandData = rg_expandObjectList[id - 1];
	return rg_templates.expand.replace("[[html]]", expandData.content);
}

function rg_clearExpand() {
	rg_activeExpand = 0;
	$('.rg-expand-container').remove();
}



//Expand Object Class
function rg_expandObject(id, content) {
	this.id = id;
	this.content = content;
}



//Helpers
function roundNumberUp(numberToRound, numberGoal)
{
	return Math.ceil(numberToRound / numberGoal) * numberGoal;
}