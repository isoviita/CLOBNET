--This script creates a table for basic clinical data.
--Columns are specific for HERCULES ovarian cancer project.

DROP TABLE IF EXISTS clinical_data;
CREATE TABLE clinical_data (

	--Basic data

	id SERIAL PRIMARY KEY,
	pseudonym VARCHAR(10),
	patient_id INT,
	age_at_diagnosis FLOAT,
	height_at_diagnosis FLOAT,
	weight_at_diagnosis FLOAT,
	status varchar(20),
	
	--Disease-spesific data

	figo_2014_stage VARCHAR(10),
	primary_therapy_outcome VARCHAR(255),
	treatment_strategy VARCHAR(255)

);