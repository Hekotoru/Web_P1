/*Repo: https://github.com/Hekotoru/Web_P1*/

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8081;
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/404', function(req, res) {
	res.status(404).send();
});

app.get('/protected',function(req, res) {
	res.status(401).send();
});

app.get('/error',function(req,res){
	res.status(500).send();
});

app.get('/noimplemented',function(req,res){

});

app.get('/login',function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/login',function(req,res){
	var username = req.body.username;
	var password = req.body.password;

	var jsonResponse = {
		"username" : username,
		"password" : password
	}
	res.type('json').status(200).send(jsonResponse);
});

app.get('*', function(req, res) {
	var ports = req.get('host').split(":");
	/*
	console.log("Method:" + req.method);
	console.log("Path:" + req.path);
	console.log("Port:" + ports[1]);
	*/
	var arrHeaders;
	arrHeaders = [];
	var HeaderJson = JSON.parse(JSON.stringify(req.headers));
	for( var value in HeaderJson)
	{
		arrHeaders.push(HeaderJson[value]);
	}
	/*console.log("Headers:"+ HeaderJson);*/
	var HtJson = {
		"method" : req.method,
		"path" : req.path,
		"host" : ports[0],
		"port" : ports[1],
		"header": arrHeaders
	}
	res.send(HtJson);
});

app.listen(port, function(){

})
