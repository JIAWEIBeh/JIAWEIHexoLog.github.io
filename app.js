var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');

const port = 1000;

http.createServer(function (request, response) {

    if(request.url.split(/[\?\&]/)[0].indexOf('html')>-1){
    	response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    }else if(request.url.split(/[\?\&]/)[0].indexOf('json')>-1){
		response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    }else if(request.url.split(/[\?\&]/)[0].indexOf('md')>-1){
    	response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    }else if(request.url.split(/[\?\&]/)[0].indexOf('css')>-1){
    	response.writeHead(200, {'Content-Type': 'text/css'});
    }else if(request.url.split(/[\?\&]/)[0].indexOf('ico')>-1){
    	response.writeHead(200, {'Content-Type': 'image/vnd.microsoft.icon'});
    	fs.readFile(request.url.split(/[\?\&]/)[0].substr(1), function (err, data) {
		  if (err){
		  	console.log(err)
		  	//throw err
		  };
		  response.end(data);
		});
		return '';
    }else{
    	response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    }
    
    console.log(request.url);

    if(request.url=='/'){
    	fs.readFile('index.html', function (err, data) {
		  if (err){
		  	console.log(err)
		  	//throw err
		  };
		  var strr = iconv.decode(data,'utf-8');
		  response.end(strr);
		});
		return '';
    }
    
    // 发送响应数据 "Hello World"
    
    fs.readFile(request.url.split(/[\?\&]/)[0].substr(1), function (err, data) {
	  if (err){
	  	console.log(err)
	  	//throw err
	  };
	  var strr = iconv.decode(data,'utf-8');
	  response.end(strr);
	});
}).listen(port);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:'+port+'/');
