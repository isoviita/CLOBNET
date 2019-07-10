--This script creates a table for basic laboratory data.
--Columns are specific for HERCULES ovarian cancer project.

DROP TABLE IF EXISTS laboratory_data;
CREATE TABLE laboratory_data (
	id SERIAL,
	pseudonym varchar(20),
	patient_id int,
	date DATE,
	ca125 FLOAT,
	he4 FLOAT,
	hb FLOAT,
	tromb FLOAT,
	neut FLOAT,
	na FLOAT,
	krea FLOAT,
	leuk FLOAT,
	alat FLOAT,

	--For FileMaker purposes
	fmdate varchar(20)
);