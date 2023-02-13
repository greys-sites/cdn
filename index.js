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

const USER = process.env.ACCESS_USER;
const PASS = process.env.ACCESS_PASS;

const PAGES = {
	login: fs.readFileSync(__dirname + '/pages/login.html', 'utf8'),
	index: fs.readFileSync(__dirname + '/pages/index.html', 'utf8')
}


app.auth = (req, res, next) => {
	var m = req.method;
	if(m == 'POST' && !req.body) return next();
	var ck = req.cookies?.user;
	if(!ck || (
		ck.name !== USER ||
		ck.password !== PASS
	)) {
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

	// app.use(express.static(__dirname + '/pages'));
	app.get('/', app.auth, (req, res) => {
		res.send(PAGES.index)
	})

	app.post('/login', (req, res) => {
		console.log(req.body);
		var name = req.body?.name;
		var password = req.body?.password;

		if(!name || !password) return res.status(400).send('Bad request.');
		if(name !== USER || password !== PASS)
			return res.status(401).send('Invalid login.');

		res.cookie('user', {
			name,
			password
		})

		return res.redirect('/');
	})
	
	app.use(express.static(__dirname + '/files'));

	app.listen(PORT)
}

setup()
	.then(() => console.log('Server running on port ' + PORT))
	.catch(console.error);