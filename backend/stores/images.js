const { DataObject, DataStore } = require("./__models");

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	description: { patch: true },
	mime: { }
}

class Image extends DataObject {
	constructor(store, keys, data) {
		super(store, keys, data);
	}
}

class ImageStore extends DataStore {
	constructor(app, db) {
		super(app, db)
	}

	async init() {
		await this.db.query(`
			create table if not exists images (
				id serial primary key,
				hid text,
				name text,
				description text,
				mime text
			)
		`)
	}

	async create(data = {}) {
		try {
			var c = await this.db.query(`insert into images (
				hid,
				name,
				description,
				mime
			) VALUES (find_unique('images'), $1,$2,$3)
			returning *`,
			[data.name, data.description, data.mime])
		} catch(e) {
			console.log(e);
	 		return Promise.reject(e.message);
		}
		
		return await this.get(c.rows[0].hid);
	}

	async get(hid) {
		try {
			var data = await this.db.query(`select * from images where hid = $1`, [hid]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.[0]) return new Image(this, KEYS, data.rows[0]);
		else return new Image(this, KEYS, { });
	}

	async getID(id) {
		try {
			var data = await this.db.query(`select * from images where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.[0]) return new Image(this, KEYS, data.rows[0]);
		else return new Image(this, KEYS, { });
	}

	async getAll() {
		try {
			var data = await this.db.query(`select * from images order by id asc`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.length) return data.rows.map(x => new Image(this, KEYS, x));
		else return undefined;
	}

	async getByHids(hids) {
		try {
			var data = await this.db.query(`select * from images where hid = any($1) order by id asc`, [hids]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		if(data.rows?.length) return data.rows.map(x => new Image(this, KEYS, x));
		else return undefined;
	}

	async update(id, data = {}) {
		try {
			await this.db.query(`update images set ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} where id = $1`,[id, ...Object.values(data)]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}

		return await this.getID(id);
	}

	async delete(id) {
		try {
			await this.db.query(`delete from images where id = $1`, [id]);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		return;
	}

	async deleteAll() {
		try {
			await this.db.query(`delete from images`);
		} catch(e) {
			console.log(e);
			return Promise.reject(e.message);
		}
		
		return;
	}
}

module.exports = (app, db) => new ImageStore(app, db);