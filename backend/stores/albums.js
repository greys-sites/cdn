const { DataObject, DataStore } = require("./__models");

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	description: { patch: true },
	cover_url: { patch: true },
	images: { patch: true }
}

class Album extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}

	async getalbums() {
		var images = await this.store.app.stores.images.getByHids(this.images);
		this.imageItems = images;

		return images;
	}
}

class AlbumStore extends DataStore {
	constructor(app, db) {
		super(app, db)
	}

	async init() {
		await this.db.query(`
			create table if not exists albums (
				id serial primary key,
				hid text,
				name text,
				description text,
				cover_url text,
				images text[]
			)
		`)
	}

	async create(data = {}) {
		try {
			var c = await this.db.query(`insert into albums (
				hid,
				name,
				description,
				cover_url,
				images
			) VALUES (find_unique('albums'), $1,$2,$3,$4)
			returning *`,
			[data.name, data.description, data.cover_url,
			 data.images ?? []])
		} catch(e) {
			console.log(e);
	 		return Promise.reject(e.message);
		}
		
		return await this.get(c.rows[0].hid);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from albums where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.[0]) return new Album(this, KEYS, data.rows[0]);
		else return new Album(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from albums where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.[0]) return new Album(this, KEYS, data.rows[0]);
		else return new Album(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from albums order by id asc`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.length) return data.rows.map(x => new Album(this, KEYS, x));
		else return undefined;
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`update albums set ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} where id = $1`,[id, ...Object.values(data)]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}

		return await this.getID(id);
	}

	async delete(id) {
		try {
			await this.db.query(`delete from albums where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from albums`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		return;
	}
}

module.exports = (app, db) => new AlbumStore(app, db);