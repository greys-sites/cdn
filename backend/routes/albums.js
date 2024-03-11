module.exports = (app) => {
	app.post('/api/albums', app.auth, async (req, res) => {
		console.log(req.body)
		var {
			name,
			description,
			hid,
			cover_url
		} = req.body;

		var album = await app.stores.albums.create({
			name,
			description,
			hid,
			cover_url
		});
		
		return res.status(200).send(album);
	})
	
	app.get('/api/albums', app.auth, async (req, res) => {
		var albums = await app.stores.albums.getAll();

		res.status(200).send(albums);
	})

	app.get('/api/albums/:hid', async (req, res) => {
		var hid = req.params.hid;
		var album = await app.stores.albums.get(hid);
		if(!album?.id) return res.status(404).send('Album not found.');

		await album.getImages();

		res.status(200).send(album);
	})

	app.post('/api/albums/delete/:hid', app.auth, async (req, res) => {
		var album = await app.stores.albums.get(req.params.hid);
		if(!album?.id) return res.status(404).send('Album not found.');

		await album.delete();
		res.status(200).send();
	})

	app.patch('/api/albums/:hid', app.auth, async (req, res) => {
		var hid = req.params.hid;
		var alb = await app.stores.albums.get(hid);
		if(!alb?.id)
			return res.status(404).send('Album not found.');

		var {
			name,
			description,
			hid: newhid,
			cover_url: cover
		} = req.body;

		console.log(hid. newhid);
		if(newhid && newhid !== hid) {
			var imgs = await alb.getImages();
			console.log(imgs);
			for(var img of imgs) {
				img.album = newhid;
				await img.save();
			}
		}

		alb.name = name;
		alb.description = description;
		alb.hid = newhid ?? hid;
		alb.cover_url = cover;
		await alb.save();
		
		return res.status(200).send(alb);
	})
}