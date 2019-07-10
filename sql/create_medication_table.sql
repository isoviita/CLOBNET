DROP TABLE IF EXISTS medication_data;
CREATE TABLE medication_data(
	id serial,
	pseudonym varchar(20),
	start_date date,
	end_date date,
	brand_name varchar (255),
	substance varchar(512),
	atc_code varchar(20),
	home_medication smallint,
	administration_unit varchar(20),
	dose varchar(128),
	administration_code  varchar(20),
	administration_definition varchar(20),
	administration_dose float,
	regular_daily_dose int,
	on_demand_dose varchar(255)
);