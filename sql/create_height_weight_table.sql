DROP TABLE IF EXISTS height_weight_data;

CREATE TABLE height_weight_data (
	id serial,
	weight float,
	height float,
	date date, 
	pseudonym varchar(20)
);