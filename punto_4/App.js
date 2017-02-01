/*Repo: https://github.com/Hekotoru/Web_P1*/

var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var multer = require('multer');
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var uuid = require('uuid-v4');
var yamlConfig = require('node-yaml-config');
var redis = require('redis');
var redisYml = yamlConfig.load('./redis.yml');
var sqlite3Yml = yamlConfig.load('./sqlite.yml');
var app = express();
var port = 8081;
var path = require('path');
var redisClient = redis.createClient(redisYml.port, redisYml.host);
app.use(express.static('public'));
var db = new sqlite3.Database(sqlite3Yml.path, sqlite3.OPEN_READWRITE);
var validUUID = true;

// db.serialize(function() {
// 	db.run("CREATE TABLE movies (id TEXT PRIMARY KEY, name TEXT, description TEXT, keywords TEXT,image TEXT, smallThumbnail TEXT, mediumThumbnail TEXT, largeThumbnail TEXT)");
// });
redisClient.on('connect', function () {
	console.log('Redis connected');
});

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/img')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) return cb(err)
			cb(null, raw.toString('hex') + path.extname(file.originalname))
		});
	}
});
var upload = multer({
	storage: storage
});

app.engine('handlebars', exphbs({
	defaultLayout: 'index'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

function verifyUUID(newUUID) {
	db.get("SELECT * FROM movies where id = (?)", newUUID, function (err, row) {
		if (row > 0) {
			validUUID = false;
		}
	});
	return validUUID;
}

app.get('/movies', function (req, res) {
	db.serialize(function() {
        db.all("SELECT * FROM movies", function(err, row) {
			// console.log(row);
            res.render('listMovies', {
                movies: row
            });
        });
    })
});

app.get('/movies/json', function (req, res) {
		db.serialize(function() {
        db.all("SELECT * FROM movies", function(err, row) {
            res.send(row)
        });
    })
});

app.get('/movies/list', function (req, res) {
	db.serialize(function() {
		db.all("SELECT * FROM movies", function(err, row) {
            row.forEach(function(element) {
                element.keywords = element.keywords.split(',');
            }, this);
			// console.log(row);
            res.render('listMovies', {
                movies: row
            });
        });
    })
});

app.get('/movies/list/json', function (req, res) {
	db.serialize(function() {
        db.all("SELECT * FROM movies", function(err, row) {
            res.send(row)
        });
    })
});

app.get('/movies/details/:id', function (req, res) {
	db.serialize(function() {
		db.all("SELECT * FROM movies WHERE id=?",req.param("id"), function(err, row) {
			// console.log(row);
            res.render('detailMovies', {
                movies: row
            });
        });
    })
});

app.get('/movies/create', function (req, res) {
	res.render('createMovies');
});

app.post('/movies/create', upload.single('Image'), function (req, res) {
	var newUUID = uuid();
	var Name = req.body.Name;
	var Description = req.body.Description;
	var Keywords = req.body.Keywords;
	var Image = req.file.originalname;
	console.log(req.file);
	console.log(Name);
	var validateName, validateDescription, validateKeywords, validateImage;
	var validateInputName, validateInputDescription, validateInputKeywords, validateInputImage;
	validateInputName = validateInputDescription = validateInputKeywords = validateInputImage = "form-control-error";
	validateName = validateDescription = validateKeywords = validateImage = "has-error";

	if (Name != '') {
		validateName = "has-success";
		validateInputName = "form-control-success";
	}
	if (Description != '') {
		validateDescription = "has-success";
		validateInputDescription = "form-control-success"
	}
	if (Keywords != '') {
		validateKeywords = "has-success";
		validateInputKeywords = "form-control-success";
	}
	if (Image != '') {
		validateImage = "has-success";
		validateInputKeywords = "form-control-success";
	}
	if (validateImage == "has-error" || validateKeywords == "has-error" ||
		validateName == "has-error" || validateDescription == "has-error") {
		res.render('createMovies', {
			validateName: validateName,
			validateInputName: validateInputName,
			validateDescription: validateDescription,
			validateKeywords: validateKeywords,
			validateImage: validateImage,
			validateInputImage: validateInputImage
		});
	}
	db.serialize(function() {
		while (!verifyUUID(newUUID)) {
			newUUID = uuid();
		}
		var query = db.prepare("INSERT INTO movies values (?,?,?,?,?)");
        query.run(newUUID, Name, Description, Keywords, "/img/"+req.file.filename);
        query.finalize();
	});
	redisClient.set('hector:Images', "/img/"+req.file.filename);
	res.redirect('/movies');
});

app.get('/404', function (req, res) {
	res.status(404).send();
});

app.get('/protected', function (req, res) {
	res.status(401).send();
});

app.get('/error', function (req, res) {
	res.status(500).send();
});

app.all('/notimplemented', function (req, res) {
	res.set('Allow', ['GET', 'POST', 'PUT']);
	switch (req.method) {
		case "GET":
			res.status(200).send();
			break;
		case "POST":
			res.status(200).send();
			break;
		case "PUT":
			res.status(200).send();
			break;
		default:
			res.status(501).send();
	}
});

app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

	var jsonResponse = {
		"username": username,
		"password": password
	}
	res.type('json');
	res.status(200).send(jsonResponse);
});

app.get('*', function (req, res) {
	var ports = req.get('host').split(":");
	/*
	console.log("Method:" + req.method);
	console.log("Path:" + req.path);
	console.log("Port:" + ports[1]);
	*/
	var arrHeaders;
	arrHeaders = [];
	var HeaderJson = JSON.parse(JSON.stringify(req.headers));
	for (var value in HeaderJson) {
		arrHeaders.push(HeaderJson[value]);
	}
	/*console.log("Headers:"+ HeaderJson);*/
	var HtJson = {
		"method": req.method,
		"path": req.path,
		"host": ports[0],
		"port": ports[1],
		"header": arrHeaders
	}
	res.send(HtJson);
});

app.listen(port, function () {

})