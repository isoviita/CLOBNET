INSERT INTO chemotherapy_data (
	pseudonym,
	patient_medication_id,
	patient_cycle_id,
	startday,
	calculation_date,
	calculated_bsa,
	used_bsa,
	serial_number,
	cycle_id,
	cycle_name,
	cycle,
	cycle_start_date,
	cycle_end_date,
	generic_name,
	dose,
	administration_serial_number,
	administration_definition,
	cycle_basic_dose,
	cycle_dose_definition,
	used_dose,
	adminisitration_id,
	administration_start_date,
	administration_end_date,
	height,
	weight	
)

SELECT
	cast(patient_id as VARCHAR(20)),
	potilaan_syopalaake_numero,
	potilaan_hoitokuuri_numero,
	aloituspaiva,
	laskenta_pvm,
	laskettu_pinta_ala,
	kaytetty_pinta_ala,
	jarjestysnumero,
	hoitokuuri_numero,
	hoitokuurin_nimi,
	sykli,
	sykli_aloituspvm,
	sykli_viimeinenpvm,
	geneerinen_nimi,
	vahvuus,
	antojarjestysnumero,
	antotapa_selite,
	hoitokuurin_perusannosmaara,
	annoskaava_selite,
	kaytetty_annos,
	potilaan_syopal_antok_numero,
	aloitusaika_pvm,
	lopetusaika_pvm,
	pituus,
	paino	
FROM
	kemokur;

UPDATE
	chemotherapy_data
SET
	pseudonym = clinical_data.pseudonym
FROM 
	clinical_data
WHERE
	chemotherapy_data.pseudonym = CAST(clinical_data.patient_id as VARCHAR(20));