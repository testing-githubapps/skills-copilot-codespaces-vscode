// Create web server

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    if (pathname === '/') {
        var filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                response.statusCode = 404;
                response.end('File not found');
            } else {
                response.setHeader('Content-Type', 'text/html; charset=utf-8');
                response.end(data);
            }
        });
    } else if (pathname === '/comments') {
        if (request.method === 'GET') {
            response.end(JSON.stringify(comments));
        } else if (request.method === 'POST') {
            var str = '';
            request.on('data', function (chunk) {
                str += chunk;
            });
            request.on('end', function () {
                var comment = JSON.parse(str);
                comment.time = new Date();
                comments.push(comment);
                response.end(JSON.stringify(comment));
            });
        }
    } else {
        response.statusCode = 404;
        response.end('File not found');
    }
});

server.listen(8080, function () {
    console.log('Server is running');
});