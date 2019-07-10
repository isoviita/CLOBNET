INSERT INTO medication_data(
	pseudonym,
	start_date,
	end_date,
	brand_name,
	substance,
	atc_code,
	home_medication,
	administration_unit,
	dose,
	administration_code,
	administration_definition,
	administration_dose,
	regular_daily_dose,
	on_demand_dose
)

SELECT
	CAST(patient_id as VARCHAR(20)),
	alkuaika_pvm,
	loppuaika_pvm,
	kauppanimi,
	vaikuttava_aine,
	atc_koodi,
	kotilaake,
	annostelu_annos_yksikko,
	vahvuus,
	antotapa_koodi,
	annostelu_tyyppi_selite,
	annostelu_annos,
	annostelu_saan_pvm_annos,
	annostelu_tarv_annos
FROM
	laakemaarays;

UPDATE
	medication_data
SET
	pseudonym = clinical_data.pseudonym
FROM 
	clinical_data
WHERE
	medication_data.pseudonym = CAST(clinical_data.patient_id as VARCHAR(20));