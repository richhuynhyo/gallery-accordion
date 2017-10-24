
//Rich Gallery - Current Version - 1.0

//var two_minWidth = 100;
//var three_minWidth = 100;
var four_minWidth = 0;

//Global Variables
var rg_previewList = [];
var rg_expandObjectList = [];
var rg_templates = { expand: "" };
var rg_screenWidth = 0;

//Events
$(document).ready(function () {
	//Get Screen Width
	rg_screenWidth = $(document).width();

	//Load Data to Memory
	rg_readExpandData();

	//Load Template to Memory
	rg_loadTemplate();

	//Add data-attributes to HTML
	rg_addDataAndCreateList('#rich_gallery');


	$('#rich_gallery > .rg-preview').click(function ()
	{
		//Potential multiple containers?
		var container = '#rich_gallery';
		var previewId = $(this).attr('data-rg-id');

		rg_insertExpand(container, previewId);

	});

});

//Init
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





function rg_addDataAndCreateList(container)
{
	var count = 1;
	$(container + ' > .rg-preview').each(function () {
		$(this).attr('data-rg-id', count);
		rg_previewList.push(this);
		count++;
	});
}

function rg_insertExpand(container, previewId)
{
	var previewRowEnd = 0;

	//Clear Expands
	rg_clearExpand();

	//Get PreviewRowEnd
	if (rg_screenWidth > four_minWidth)
	{
		previewRowEnd = roundNumberUp(previewId, 4);
	}

	rg_getDataToTemplate(previewId);

	//Place after previewRowEnd
	$(container + ' > .rg-preview[data-rg-id="' + previewRowEnd + '"]').after(rg_getDataToTemplate(previewId));
}

function rg_getDataToTemplate(id)
{
	var expandData = rg_expandObjectList[id - 1];
	return rg_templates.expand.replace("[[html]]", expandData.content);
}







function rg_clearExpand() {
	$('.rg-expand-container').remove();
}




//Class
function rg_expandObject(id, content) {
	this.id = id;
	this.content = content;
}




//Helpers
function roundNumberUp(numberToRound, numberGoal)
{
	return Math.ceil(numberToRound / numberGoal) * numberGoal;
}