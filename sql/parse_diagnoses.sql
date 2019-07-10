TRUNCATE diagnoses_data;

INSERT INTO diagnoses_data (
	pseudonym,
	date,
	code
	)

SELECT
	cast(patient_id as VARCHAR),
	dgn_pvm::date,
	diagnoosi
FROM
	diagnoosit;

UPDATE diagnoses_data SET pseudonym = clinical_data.pseudonym FROM clinical_data WHERE clinical_data.patient_id = CAST(diagnoses_data.pseudonym as INT);