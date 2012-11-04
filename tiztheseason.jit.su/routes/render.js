var gm = require("gm")
  , imageMagick = gm.subClass({ imageMagick: true });

var Meme = {
	initialize: function(){
//		flipImage( "./public/images/world-venues-logo.png", "./public/images/city-edited.png" );
		createText( "I am thankful for Jon Vidar creating new jobs", "./public/images/chrisaiv.png")
		uploadImage( "./public/images/tizi-jobs.jpg", "./public/images/auto-orient.png" );
	},
	flipImage: function ( input, output ){
		imageMagick( input )
	//	.flip()
		.flop()
		.write( output, function(err){
			if(err) throw new Error(err);
		})
	},
	createText: function( message, filename ){
		imageMagick(800, 600, "#ddff99f3")
		.font("Arial.TTF")
		.fontSize(12)
		.strokeWidth(1)
		.drawText(10, 50, message )
		.write( filename, onCompleteHandler)
		function onCompleteHandler(err){
			if(err) throw new Error(err);
			layerImages( "./public/images/chrisaiv.png", "./public/images/city-edited.png", "./public/images/new.png"  )
		}	
	},
	layerImages: function( top, bottom, output ){
		imageMagick( top ).append( bottom, false  )
		.write( output, function(err){
			if(err) throw new Error(err);
		})
	},
	uploadImage: function( input, output ){
	}
}

exports.index = function(req, res){
  res.render('render', { title: 'Express' });
};

exports.upload = function( req, res ){
  res.render('upload', { title: 'Express' });
}