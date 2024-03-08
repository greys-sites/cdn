require('dotenv').config();
const express = require('express');
const cp = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ?? 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cp())

const ACCEPTED = ['image/jpeg', 'image/png', 'image/gif'];
const storage = multer.memoryStorage();
app.upload = multer({
	storage,
	fileFiler: (req, file, cb) => {
		if(ACCEPTED.includes[file.mimetype]) cb(null, true);
		else cb(null, false);
	}
});

const TOKEN = process.env.ACCESS_TOKEN; // for api

app.auth = (req, res, next) => {
	var m = req.method;
	if(m == 'POST' && !req.body) return next();
	var ck = req.cookies?.user;
	var tk = req.headers['authorization'] ?? ck?.token;
	if(!tk || tk !== TOKEN) {
		switch(m) {
			case 'GET':
				return res.send(PAGES.login);
			case 'POST':
				return res.status(400).send({error: 'Unauthorized.'});
			default:
				return next();
		}
	}

	next();
}

async function setup() {
	if(!fs.existsSync(__dirname + '/files'))
		fs.mkdirSync(__dirname + '/files');

	const db = await require(__dirname + '/stores/__db')(app);
	app.db = db;

	let files;
	files = fs.readdirSync(__dirname + '/routes');
	for(var f of files)
		await require(__dirname + '/routes/' + f)(app);

	app.post('/login', (req, res) => {
		console.log(req.body);
		var token = req.body?.token;

		if(token !== TOKEN)
			return res.status(401).send('Invalid login.');

		res.cookie('user', {
			token
		})

		return res.status(200).send();
	})

	app.get('/verify', (req, res) => {
		var token = req.headers['authorization'];

		if(token !== TOKEN)
			return res.status(401).send('Invalid login.');

		res.cookie('user', {
			token
		})

		return res.status(200).send();
	})
	
	app.use(express.static(__dirname + '/files'));

	app.listen(PORT)
}

setup()
	.then(() => console.log('Server running on port ' + PORT))
	.catch(console.error);