
//Rich Gallery For Foundation - Current Version - 1.0




//Global Variables
var rgf_columnList = [];

//Events
$(document).ready(function () {

	rgf_addDataAndCreateList();
	//alert(rgf_columnList);


	$('#rich_gallery > .column').click(function ()
	{
		if (activeThumb != $(this).data('id'))
		{
		}
		else
		{
		}
	});


});



function rgf_addDataAndCreateList()
{
	var count = 1;
	$('#rich_gallery > .column').each(function () {
		$(this).attr("data-rgf-id", count);
		rgf_columnList.push(this);
		count++;
	});
}


