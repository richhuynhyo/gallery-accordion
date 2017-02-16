//Global Variables
var workList = [];
var templates = { thumb: "", detail: "" };
var rowThumbCount = 4;
var activeThumb = -1;

//Events
$(document).ready(function () {

	//Load Html Templates
	loadTemplates();

	//Load Data
	readXml();

	//Load View from Data
	initializeView();

    //Thumb Click
	$('.thumb').click(function () {
		if (activeThumb != $(this).data('id'))
		{
			displayDetailsFromThumb(this);
			activeThumb = $(this).data('id');
		}
		else
		{
			hideDetails();
			activeThumb = -1;
		}
		this.scrollIntoView(true);
    });

 
});

function loadTemplates()
{
	templates.thumb = $('#thumbTemplate').html();
	templates.detail = $('#workOverlayTemplate').html();
}

function readXml()
{
	$.ajax({
		type: "GET",
		async: false,
		url: "works.xml",
		dataType: "xml",
		success: function (xml)
		{
			var id = 0;
			$(xml).find('work').each(function (index)
			{
				//Get work entries from file
				var name = $(this).find("name").text();
				var tagline = $(this).find("tagline").text();
				var overlay = $(this).find("overlay").text();
				var date = $(this).find("date").text();
				var description = $(this).find("description").text();
				var skills = $(this).find("skills").text();
				var thumb = $(this).find("thumb").text();
				var slides = $(this).find("slides").text();
				//Get Slides

				var newWork = new work(id, name, tagline, overlay, date, description, skills, thumb, slides);

				//Add each work entry to workList
				workList.push(newWork);

				id++;
			});
		}
	});
}

function initializeView()
{
	//Set up containers from workList.Length and rowThumbCount
	var rowCount = Math.ceil(workList.length / rowThumbCount);
	var thumbsAdded = 0;
	for (row = 1; row <= rowCount; row++)
	{
		//Add container
		$('#work').append('<div class="work-container" data-thumbrow="' + row + '"></div>');

		//Add thumb-row
		$('[data-thumbrow="' + row + '"]').append('<div class="thumb-row"></div>');

		//Add thumbs
		for (i = thumbsAdded; i < (row * rowThumbCount); i++)
		{
			if (i < workList.length)
			{
				var item = workList[i];
				var thumbTemp =
					templates.thumb.replace("[[id]]", item.id)
									.replace("[[tagline]]", item.tagline)
									.replace("[[overlay]]", item.overlay)
									.replace("[[thumb]]", item.thumb);
				$('[data-thumbrow="' + row + '"] > .thumb-row').append(thumbTemp);
			}
		}
		//Set has been added, updated thumbsAdded total by adding rowThumbCount
		thumbsAdded += rowThumbCount;

		//Add detail panel
		$('[data-thumbrow="' + row + '"]').append('<div class="detail-container"></div>');
	}
}

function displayDetailsFromThumb(thumb)
{
	//get id, thumbrow, and populate template
	var workId = $(thumb).data('id');
	var thumbRow = $(thumb).closest('.work-container').data('thumbrow');
	var thumbColumn = workId % rowThumbCount;
	var item = workList[workId];
	var detailTemp =
		templates.detail.replace("[[column]]", thumbColumn)
						.replace("[[name]]", item.name)
						.replace("[[date]]", item.date)
						.replace("[[description]]", item.description)
						.replace("[[skills]]", item.skills)
						.replace("[[slides]]", item.slides);

	//clear all detail containers
	$('.detail-container').html('');

	//add html
	$('[data-thumbrow="' + thumbRow + '"] > .detail-container').append(detailTemp);
}

function hideDetails()
{
	$('.detail-container').html('');
}



//
// CLASSES
//

function work(id, name, tagline, overlay, date, description, skills, thumb, slides)
{
	this.id = id;
	this.name = name;
	this.tagline = tagline;
	this.overlay = overlay;
	this.date = date;
	this.description = description;
	this.skills = skills;
	this.thumb = thumb;
	this.slides = slides;
}