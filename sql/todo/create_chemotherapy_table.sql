DROP TABLE IF EXISTS chemotherapy_data;
CREATE TABLE chemotherapy_data (
	id SERIAL,
	pseudonym VARCHAR(20),
	weight float,
	height float,
	calculated_bsa float,
	used_bsa float,
	calcluation_date date,
	cycle_start_date date,
	cycle_end_date date,
	generic_name varchar(512),
	used_dose float,
	regular_dose float,
	dose_unit varchar(512),
	administration_route varchar(256),
	administration_number int,
	administration_date date,
	cycle_duration int,
	regimen_name varchar(512),
	regimen_number varchar(512),
);