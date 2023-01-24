const fs = require('fs');
const MIME_MAP = {
	'image/jpeg': 'jpeg',
	'image/gif': 'gif',
	'image/png': 'png'
}

const TEMPLATES = {
	images: fs.readFileSync(__dirname + '/../templates/images.html', 'utf8'),
	upload: fs.readFileSync(__dirname + '/../pages/upload.html', 'utf8')
}

module.exports = (app) => {
	app.get('/upload', (req, res) => {
		res.send(TEMPLATES.upload.replace('', ''));
	})

	app.post('/upload', app.upload.array('files',10), app.auth, async (req, res) => {
		var errs = [];
		var descs = req.body?.descriptions?.length ? JSON.parse(req.body.descriptions) : [];
		for(var i = 0; i < req.files.length; i++) {
			var f = req.files[i];
			try {
				var c = await app.stores.images.create({
					name: f.originalname,
					description: descs[i],
					mime: MIME_MAP[f.mimetype]
				})
				console.log(c);

				fs.writeFileSync(`${__dirname}/../files/${c.hid}.${MIME_MAP[f.mimetype]}`, f.buffer);
			} catch(e) {
				var eobj = {
					file: f.originalname,
					error: e.message ?? e
				}
				console.error(eobj);
				errs.push(eobj)
			}
		}

		if(errs.length) return res.status(500).send(errs);
		else return res.status(200).send();
	})

	app.get('/images', async (req, res) => {
		var images = await app.stores.images.getAll();
		var html;
		if(images?.length) html = images.map(i => `<img src='/${i.hid}.${i.mime}' />`).join('<br />');
		else html = '<p>No images to show :(</p>';
		res.send(TEMPLATES.images.replace('$IMAGES', html));
	})

	app.get('/images/:hid', async (req, res) => {
		var image = await app.stores.images.get(req.params.hid);
		image.path = `/${image.hid}.${image.mime}`;
		res.send(image);
	})
}