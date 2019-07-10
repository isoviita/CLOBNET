TRUNCATE height_weight_data;

INSERT INTO height_weight_data (pseudonym, date)
SELECT
	cast(patient_id as VARCHAR),
	tapahtuma_pvm
FROM
	pituus_paino;

UPDATE
	height_weight_data
SET
	weight = CAST(pituus_paino.havaintoarvo AS float)
FROM
	pituus_paino
WHERE
	CAST(pituus_paino.patient_id as VARCHAR) = height_weight_data.pseudonym AND
	pituus_paino.tapahtuma_pvm = height_weight_data.date AND
	pituus_paino.suure_selite LIKE 'Paino%';

UPDATE
	height_weight_data
SET
	height = CAST(pituus_paino.havaintoarvo AS float)
FROM
	pituus_paino
WHERE
	CAST(pituus_paino.patient_id as VARCHAR) = height_weight_data.pseudonym AND
	pituus_paino.tapahtuma_pvm = height_weight_data.date AND
	pituus_paino.suure_selite LIKE 'Pituus%';

DELETE FROM height_weight_data where height is null AND weight is null;

UPDATE height_weight_data SET pseudonym = clinical_data.pseudonym FROM clinical_data WHERE clinical_data.patient_id = CAST(height_weight_data.pseudonym as INT);