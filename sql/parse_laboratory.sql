--labrat is a table from CRC service

INSERT INTO laboratory_data (patient_id, date, fmdate)

SELECT DISTINCT
	patient_id,
	naytteenotto,
	to_char(naytteenotto, 'DD/MM/YYYY')
FROM
	labrat;

/* CA12-5 */

/* some lab values have no value that can be cast straight to floats, so they are first converted like this */
UPDATE labrat set tulos_teksti = 0 WHERE tulos_teksti LIKE 'Alle%' AND tutkimus LIKE 'P-CA12-5 (6364)';
UPDATE labrat set tulos_teksti = -1 WHERE tulos_teksti LIKE 'lausunto' AND tutkimus LIKE 'P-CA12-5 (6364)';

UPDATE laboratory_data SET pseudonym = clinical_data.pseudonym FROM clinical_data WHERE laboratory_data.patient_id = clinical_data.patient_id;

UPDATE
	laboratory_data
SET
	CA125 = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'P-CA12-5 (6364)' AND
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE) AND
	labrat.tulos_teksti NOT LIKE '%Yli%';
;

UPDATE labrat set tulos_teksti = 'Alle 5' WHERE tulos_teksti LIKE '0' AND tutkimus LIKE 'P-CA12-5 (6364)';
UPDATE labrat set tulos_teksti = 'lausunto' WHERE tulos_teksti LIKE '-1' AND tutkimus LIKE 'P-CA12-5 (6364)';


/* HE-4 */

UPDATE labrat set tulos_teksti = '1501' WHERE tulos_teksti LIKE 'Yli 1500' AND tutkimus LIKE 'S-HE4 (12906)';
UPDATE labrat set tulos_teksti = '19' WHERE tulos_teksti LIKE 'Alle 20' AND tutkimus LIKE 'S-HE4 (12906)';

UPDATE
	laboratory_data
SET
	he4 = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'S-HE4 (12906)' AND
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

UPDATE labrat set tulos_teksti = 'Yli 1500' WHERE tulos_teksti LIKE '1501' AND tutkimus LIKE 'S-HE4 (12906)';
UPDATE labrat set tulos_teksti = 'Alle 20' WHERE tulos_teksti LIKE '19' AND tutkimus LIKE 'S-HE4 (12906)';

/* Trombocytes */

UPDATE
	laboratory_data
SET
	tromb = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'B-Trom (2791)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND	
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

/* Hb */

UPDATE
	laboratory_data
SET
	hb = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'B-Hb (1552)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND	
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

/* Leuk */

UPDATE
	laboratory_data
SET
	leuk = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'B-Leuk (2218)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND	
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

/* Neut */

UPDATE
	laboratory_data
SET
	neut = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'B-Neut (3238)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND	
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

/* P-Krea */

UPDATE
	laboratory_data
SET
	krea = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'P-Krea (2142)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND	
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

/* Na */

UPDATE
	laboratory_data
SET
	na = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'P-Na (3622)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;

/* ALAT */

UPDATE
	laboratory_data
SET
	alat = CAST (labrat.tulos_teksti AS float)
FROM
	labrat
WHERE
	labrat.tutkimus LIKE 'P-ALAT (1024)' AND
	labrat.tulos_teksti NOT LIKE 'hyytynyt' AND
	labrat.tulos_teksti NOT LIKE 'ei tehty' AND
	labrat.tulos_teksti NOT LIKE 'POISTETTU' AND
	labrat.tulos_teksti NOT LIKE 'Alle %' AND
	laboratory_data.patient_id = labrat.patient_id AND
	laboratory_data.date = CAST(labrat.naytteenotto AS DATE)
;


/* Remove lines without any lab values */

DELETE FROM laboratory_data WHERE
	ca125 IS NULL AND
	he4 IS NULL AND
	hb IS NULL AND
	tromb IS NULL AND
	neut IS NULL AND
	na IS NULL AND
	krea IS NULL AND
	ALAT IS NULL AND
	leuk IS NULL;