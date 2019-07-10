TRUNCATE pathology_data;
INSERT INTO pathology_data (
	pseudonym,
	question,
	answer,
	answer_id,
	assay_type,
	date_of_sampling,
	sender
)

SELECT
	cast(patient_id as VARCHAR),
	kliiniset_esitiedot,
	lausuntoteksti,
	CAST(patologia_tutkimus_id as INT),
	CAST(tutkimus as TEXT),
	naytteenottohetki::DATE,
	CAST(lahettaja AS VARCHAR)
FROM
	patologia_tutkimus_vastaus;

UPDATE pathology_data SET pseudonym = clinical_data.pseudonym FROM clinical_data WHERE clinical_data.patient_id = CAST(pathology_data.pseudonym as INT);