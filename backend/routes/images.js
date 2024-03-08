const fs = require('fs');
const MIME_MAP = {
	'image/jpeg': 'jpeg',
	'image/gif': 'gif',
	'image/png': 'png'
}

module.exports = (app) => {
	app.post('/api/upload', app.upload.array('files',10), app.auth, async (req, res) => {
		var errs = [];
		var descs = req.body?.descriptions?.length ? JSON.parse(req.body.descriptions) : [];
		var hids = req.body?.hids?.length ? JSON.parse(req.body.hids) : [];
		var album = req.body?.album ?? null;
		for(var i = 0; i < req.files.length; i++) {
			var f = req.files[i];
			try {
				var c = await app.stores.images.create({
					hid: hids[i] ?? null,
					name: f.originalname,
					description: descs[i],
					mime: MIME_MAP[f.mimetype],
					album
				})

				c.path = `/${c.hid}.${c.mime}`;

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
		else return res.status(200).send(c);
	})

	app.get('/api/images', app.auth, async (req, res) => {
		var images = await app.stores.images.getAll();
		for(var image of images) {
			image.path = `/${image.hid}.${image.mime}`;
		}
		
		res.status(200).send(images);
	})

	app.get('/api/images/:hid', async (req, res) => {
		var image = await app.stores.images.get(req.params.hid);
		if(!image?.id) return res.status(404).send('Image not found.');

		image.path = `/${image.hid}.${image.mime}`;
		res.status(200).send(image);
	})

	app.post('/api/delete/:hid', app.auth, async (req, res) => {
		var image = await app.stores.images.get(req.params.hid);
		if(!image?.id) return res.status(404).send('Image not found.');

		await image.delete();
		await fs.unlinkSync(`${__dirname}/../files/${image.hid}.${image.mime}`);
		res.status(200).send();
	})

	app.patch('/api/images/:hid', app.auth, async (req, res) => {
		var hid = req.params.hid;
		var img = await app.stores.images.get(hid);
		if(!img?.id)
			return res.status(404).send('Image not found.');

		var {
			name,
			description,
			hid: newhid,
			album
		} = req.body;

		console.log(req.body);

		img.name = name;
		img.description = description;
		img.hid = newhid ?? hid;
		img.album = album;
		await img.save();
		await fs.renameSync(`${__dirname}/../files/${hid}.${img.mime}`, `${__dirname}/../files/${img.hid}.${img.mime}`)
		console.log(img);

		return res.status(200).send(img);
	})
}