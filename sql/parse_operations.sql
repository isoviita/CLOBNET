TRUNCATE operations_data;

INSERT INTO operations_data (
	pseudonym,
	decision_date,
	operation_date,
	emergency,
	main_operation,
	asa_class,
	ncsp_code,
	diagnosis_code
	)

SELECT
	cast(patient_id as VARCHAR),
	hoitopaatospvm,
	toteutunut_pvm,
	on_paivystys,
	on_paatoimenpide,
	cast(right(asa_luokka, 1) as int),
	toteutunut_toimenpide_koodi,
	diagnoosi_koodi
FROM
	leikkaus;

UPDATE operations_data SET pseudonym = clinical_data.pseudonym FROM clinical_data WHERE clinical_data.patient_id = CAST(operations_data.pseudonym as INT);