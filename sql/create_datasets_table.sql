DROP TABLE IF EXISTS datasets;
CREATE TABLE datasets (
	id serial,
	hash varchar(512),
	dataset json
);