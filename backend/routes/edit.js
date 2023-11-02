const fs = require('fs');
const MIME_MAP = {
	'image/jpeg': 'jpeg',
	'image/gif': 'gif',
	'image/png': 'png'
}

module.exports = (app) => {
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

		return res.status(200).send(img);
	})
}