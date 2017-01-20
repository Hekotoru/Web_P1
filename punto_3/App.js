var express = require('express');
var app = express();
var port = 8081;


app.get('/home', function(req, res) {
	var HeaderJson = JSON.stringify(req.headers);
	console.log("Headers:"+ HeaderJson);
});

app.listen(port, function(){

})
