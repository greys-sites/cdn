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

const ACCEPTED = ['image/jpeg', 'image/png', 'image/gif'];
const storage = multer.memoryStorage();
app.upload = multer({
	storage,
	fileFiler: (req, file, cb) => {
		if(ACCEPTED.includes[file.mimetype]) cb(null, true);
		else cb(null, false);
	}
});

app.auth = (req, res, next) => {
	if(!req.body) return next();
	var name = req.body.user;
	var pass = req.body.password;

	if((name !== process.env.ACCESS_USER) ||
	   (pass !== process.env.ACCESS_PASS))
		return res.status(400).send({error: 'Unauthorized.'});

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

	app.use(express.static(__dirname + '/pages'));
	app.use(express.static(__dirname + '/files'));

	app.listen(PORT)
}

setup()
	.then(() => console.log('Server running on port ' + PORT))
	.catch(console.error);