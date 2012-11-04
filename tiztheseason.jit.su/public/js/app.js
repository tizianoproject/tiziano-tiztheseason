$("a#link").bind("click", onClickHandler );
function onClickHandler(e){
	console.log( "onClickHandler:", $(this).attr("href") );
	filepicker.exportFile(
		$(this).attr("href"),
		{mimetype:'image/png'},
		function(FPFile){
			console.log(FPFile.url);
		}
	);
	return false
}

function onChangeHandler(e ){
	if( e.filename != "undefined") onCompleteHandler(e)
	else onErrorHandler(e);
}

function onCompleteHandler( fpfile ){
    $(".confirm").html("<h2>Success</h2>");
    $(".confirm").html('<p>You just uploaded '+
    fpfile.filename+'! '+
    'You can download the file at '+ 
    "<a href='#' id='link'><img src='" + fpfile.url + "' border='0' /></a></p>" );

    $(".confirm").show();
}
function onErrorHandler( fperror ){
    console.log("onErrorHandler:", fperror );
}

function sendMail(){
}