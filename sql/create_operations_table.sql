DROP TABLE IF EXISTS operations_data;
CREATE TABLE operations_data (
	id serial,
	pseudonym varchar(20),
	decision_date date,
	operation_date date,
	emergency smallint,
	main_operation smallint,
	asa_class int,
	ncsp_code varchar(20),
	diagnosis_code varchar(20)
);