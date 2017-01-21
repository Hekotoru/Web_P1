/*Repo: https://github.com/Hekotoru/Web_P1*/

var express = require('express');
var app = express();
var port = 8081;


app.get('*', function(req, res) {
	var ports = req.get('host').split(":");
	/*
	console.log("Method:" + req.method);
	console.log("Path:" + req.path);
	console.log("Port:" + ports[1]);
	*/
	/*Realizar mapeo de lo que viene en req.headers ->credito Diego Mena*/
	var arrHeaders = Object.keys(req.headers).map(function(i) {
		return req.headers[i].toString() });
	var HeaderJson = JSON.stringify(arrHeaders);
	/*console.log("Headers:"+ HeaderJson);*/
	var HtJson = {
		"method" : req.method,
		"path" : req.path,
		"host" : ports[0],
		"port" : ports[1],
		"header": HeaderJson
	}
	res.send(HtJson);
});

app.listen(port, function(){

})
