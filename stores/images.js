const util = require('util');

const KEYS = {
	id: { },
	hid: { },
	name: { patch: true },
	description: { patch: true },
	mime: { }
}

class Image {
	constructor(store, keys, data) {
		this.store = store;
		this.KEYS = keys;
		for(var k in keys)
			this[k] = data[k];
	}

	[util.inspect.custom](depth, opts) {
		var {store, ...rest} = this;

		return rest;
	}

	toJSON() {
		var {
			store,
			KEYS,
			...rest
		} = this;

		return rest;
	}

	async fetch() {
		var data = await this.store.getID(this.id);
		for(var k in this.KEYS)
			this[k] = data[k];

		return this;
	}

	async save() {
		var obj = await this.verify((this.id != null));

		var data;
		if(this.id) data = await this.store.update(this.id, obj, this.old);
		else data = await this.store.create(obj);
		for(var k in this.KEYS) this[k] = data[k];
		this.old = Object.assign({}, data);
		return this;
	}

	async delete() {
		await this.store.delete(this.id);
	}

	async verify(patch = true) {
		var obj = {};
		var errors = []
		for(var k in this.KEYS) {
			if(!this.KEYS[k].patch && patch) continue;
			if(this[k] === undefined) continue;
			if(this[k] === null) {
				obj[k] = null;
				continue;
			}

			var test = true;
			if(this.KEYS[k].test) test = await this.KEYS[k].test(this[k]);
			if(!test) {
				errors.push(this.KEYS[k].err);
				continue;
			}
			if(this.KEYS[k].transform) obj[k] = this.KEYS[k].transform(this[k]);
			else obj[k] = this[k];
		}

		if(errors.length) throw new Error(errors.join("\n"));
		return obj;
	}
}

class ImageStore {
	constructor(app, db) {
		this.app = app;
		this.db = db;
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
			var data = await this.db.query(`select * from images`);
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