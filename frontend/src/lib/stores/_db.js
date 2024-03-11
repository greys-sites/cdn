import pg from 'pg';
import {
	PGUSER,
	PGPASSWORD,
	PGHOST,
	PGPORT,
	PGDATABASE
} from '$env/static/private';

const pool = new pg.Pool({
	user: PGUSER,
	password: PGPASSWORD,
	host: PGHOST,
	port: PGPORT,
	database: PGDATABASE
});

async function setup() {
	await pool.query(`
		CREATE OR REPLACE FUNCTION gen_hid() RETURNS TEXT AS $$
			select string_agg(substr('abcdefghijklmnopqrstuvwxyz0123456789', ceil(random() * 36)::integer, 1), '') from generate_series(1, 5)
		$$ LANGUAGE SQL VOLATILE;
		
		CREATE OR REPLACE FUNCTION find_unique(_tbl regclass) RETURNS TEXT AS $$
			DECLARE nhid TEXT;
			DECLARE res BOOL;
			BEGIN
				LOOP
					nhid := gen_hid();
					EXECUTE format(
						'SELECT (EXISTS (
							SELECT FROM %s
							WHERE hid = %L
						))::bool',
						_tbl, nhid
					) INTO res;
					IF NOT res THEN RETURN nhid; END IF;
				END LOOP;
			END
		$$ LANGUAGE PLPGSQL VOLATILE;
	`)
}

await setup();

export default pool;