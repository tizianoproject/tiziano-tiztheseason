var spawn = require('child_process').spawn,
    aws2js = require('aws2js'),
    http = require('http'),
    urlutil = require('url')
    mime = require('mime'),
    Buffers = require('buffers');

var settings = {
    s3: {
        key: 'key',
        secret: 'secret',
        bucket: 'bucket',
        path: '/path/',
        endpoint: 's3.amazonaws.com'
    },
    imageFormats: {
        thumbnail: '-thumbnail 250x250^> -gravity center -extent 177x177 -filter Lanczos png24:-',
        full: '-resize 1024x768 jpg:-',
    }
};

var s3 = aws2js.load('s3', settings.s3.key, settings.s3.secret);
s3.setBucket(settings.s3.bucket);

// Initiate a request
var req = http.get(urlutil.parse('http://placekitten.com/200/300'), function(res) {
    // Set format name and fetch arguments from settings
    var format ='thumbnail';
    var args = settings.imageFormats[format];

    // Spawn ImageMagic convert process
    var proc = spawn('convert', ['-'].concat(args.split(' ')));
    proc.stderr.on('data', function(err) {
        console.log('Conversion failed:', err.toString());
    });

    // Pipe the result to our convert process
    res.pipe(proc.stdin);

    // We have to store the conversion result in a buffer because S3
    // requires exact Content-Length header
    var buffer = new Buffers();

    proc.stdout.on('data', buffer.push.bind(buffer));
    proc.stdout.on('end', function() {
        var type = res.headers['Content-Type'];
        var extension = mime.extension(type);
        var path = settings.s3.path + shortid.generate() + '.' + extension + ':' format; // We append the format to make it easier to have several images with the same name
        
        // S3 requires headers
        var headers = {
            'content-type': type,
            'x-amz-acl': 'public-read'
        };

        s3.putBuffer(path, buffer.toBuffer(), false, headers, function(err) {
            if (err) return console.error('Error storing:', err.toString());

            console.log('Stored image:', path);
        });
    });
});