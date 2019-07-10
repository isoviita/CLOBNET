DROP TABLE IF EXISTS diagnoses_data;
CREATE TABLE diagnoses_data (
	id serial,
	pseudonym varchar(20),
	date date,
	code varchar(20)
);