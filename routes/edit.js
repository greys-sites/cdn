const fs = require('fs');
const MIME_MAP = {
	'image/jpeg': 'jpeg',
	'image/gif': 'gif',
	'image/png': 'png'
}

const TEMPLATES = {
	edit: fs.readFileSync(__dirname + '/../templates/edit.html', 'utf8')
}

const COMPS = {
	form: require('../components/edit')
}

module.exports = (app) => {
	app.get('/edit/:hid', app.auth, async (req, res) => {
		var hid = req.params.hid;
		var img = await app.stores.images.get(hid);
		if(!img?.id) return res.send('Image not found :(');

		return res.send(
			TEMPLATES.edit
				.replace('$FORM', COMPS.form(img))
		);
	})

	app.post('/edit/:hid', app.auth, async (req, res) => {
		var hid = req.params.hid;
		var img = await app.stores.images.get(hid);
		if(!img?.id)
			return res.status(404).send('Image not found.');

		var {
			name,
			description
		} = req.body;

		img.name = name;
		img.description = description;
		await img.save()

		return res.redirect(`/images`);
	})
}