--Creates temporary tables from CSV and runs parser script to import data to CLOBNET clinical table.
CREATE TEMP TABLE clinical_import (
	id serial,
	patient_id varchar(10),
	krea_at_dg varchar(10),
	height_at_diagnosis varchar(10),
	weight_at_diagnosis varchar(10),
	age_at_diagnosis varchar(10),
	previous_cancer varchar(30),
	previous_cancer_year varchar(50),
	progression varchar(10),
	progression_date varchar(10),
	time_to_progression varchar(30),
	platinum_free_interval varchar(30),
	date_of_death varchar(10),
	time_to_death varchar(30),
	figo_2014_stage varchar(10),
	pad_id varchar(50),
	treatment_strategy varchar(20),
	time_of_diagnosis varchar(30),
	primary_therapy_outcome varchar(255),
	oper1_date varchar(30),
	oper1_cancelled varchar(20),
	oper1_peritoneal_carcinomatosis_pelvic varchar(20),
	oper1_peritoneal_carcinomatosis_subdiaphragmatic varchar(20),
	oper1_peritoneal_carcinomatosis_disseminated varchar(20),
	oper1_carcinomatosis_small_bowel_mesentery varchar(20),
	oper1_carcinomatosis_large_bowel_mesentery varchar(20),
	oper1_invasion_to_bowel_mucosae varchar(20),
	oper1_omental_largest_nodule_less_than_2 varchar(20),
	oper1_omental_largest_nodule_2_to_5 varchar(20),
	oper1_omental_largest_nodule_over_5 varchar(20),
	oper1_right_ovary_largest_diameter varchar(20),
	oper1_left_ovary_largest_diameter varchar(20),
	oper1_pelvic_lymph_node_metastasis varchar(20),
	oper1_para_aortic_lymph_node_metastasis varchar(20),
	oper1_spleen_metastasis varchar(20),
	oper1_invasion_to_abdominal_wall varchar(20),
	oper1_residual_tumor_size varchar (20),
	oper1_dissemination_index varchar (20),
	oper1_residual_tumor varchar(20),
	pseudonym varchar(20),
	status varchar(20)
);

\COPY clinical_import ( patient_id, krea_at_dg, height_at_diagnosis, weight_at_diagnosis, age_at_diagnosis, previous_cancer, previous_cancer_year, progression, progression_date, time_to_progression, platinum_free_interval, date_of_death, time_to_death, figo_2014_stage, pad_id, treatment_strategy, time_of_diagnosis, primary_therapy_outcome, oper1_date, oper1_cancelled, oper1_peritoneal_carcinomatosis_pelvic, oper1_peritoneal_carcinomatosis_subdiaphragmatic, oper1_peritoneal_carcinomatosis_disseminated, oper1_carcinomatosis_small_bowel_mesentery, oper1_carcinomatosis_large_bowel_mesentery, oper1_invasion_to_bowel_mucosae, oper1_omental_largest_nodule_less_than_2, oper1_omental_largest_nodule_2_to_5, oper1_omental_largest_nodule_over_5, oper1_right_ovary_largest_diameter, oper1_left_ovary_largest_diameter, oper1_pelvic_lymph_node_metastasis, oper1_para_aortic_lymph_node_metastasis, oper1_spleen_metastasis, oper1_invasion_to_abdominal_wall, oper1_residual_tumor_size, oper1_dissemination_index, oper1_residual_tumor, pseudonym ) FROM '/clobnet/import/clinical.csv' DELIMITER ',' QUOTE '"' CSV;

--Make some filtering:
--Remove patients without diagnosis time or age
DELETE FROM clinical_import WHERE time_of_diagnosis = '';
DELETE FROM clinical_import WHERE CAST(age_at_diagnosis as int) <0;

--Typecast and copy to CLOBNET table
INSERT INTO
	clinical_data (pseudonym, patient_id, age_at_diagnosis, height_at_diagnosis, weight_at_diagnosis, figo_2014_stage, primary_therapy_outcome, treatment_strategy)
SELECT
	pseudonym,
	CAST(patient_id AS INT),
	CASE
		WHEN age_at_diagnosis NOT LIKE '' THEN CAST(REPLACE(age_at_diagnosis, ',', '.') AS FLOAT)
	END AS age_at_diagnosis,
	CASE
		WHEN height_at_diagnosis NOT LIKE '' THEN CAST(REPLACE(height_at_diagnosis, ',', '.') AS FLOAT)
	END AS height_at_diagnosis,
	CASE
		WHEN weight_at_diagnosis NOT LIKE '' THEN CAST(REPLACE(weight_at_diagnosis, ',', '.') AS FLOAT)
	END AS weight_at_diagnosis,
	figo_2014_stage,
	primary_therapy_outcome,
	treatment_strategy
FROM
	clinical_import;

--Set if known alive or dead
UPDATE clinical_data SET status = 'Deceased' WHERE CAST(clinical_data.patient_id AS BIGINT) IN (SELECT patient_id FROM kuolinaika);
UPDATE clinical_data SET status = 'Alive' WHERE CAST(clinical_data.patient_id AS BIGINT) IN (SELECT patient_id FROM labrat WHERE patient_id NOT IN (SELECT patient_id FROM kuolinaika));


--Drop temporary table
DROP TABLE clinical_import;

--Allow frontend access data
GRANT SELECT ON clinical_data TO php;