<?php

//The file containing main support functions for CLOBNET frontend.
include_once('db-connect.php');


function loadModelData(){
	global $db;
	$returnArray = [];
	$prep = "SELECT * FROM classificators";
	$result = pg_prepare($db, "loadModelData", $prep);
	if($result){
		$result = pg_execute($db, "loadModelData", array());
		while($row = pg_fetch_assoc($result)){
			unset($row['id']);
			unset($row['auc_data']);
			array_push($returnArray, $row);
		}
	}
	return $returnArray;

}

//Function to retrieve basic clinical information from db
function loadPatientData($pseudonym){
	global $db;
	$prep = "SELECT * FROM clinical_data WHERE pseudonym LIKE $1 LIMIT 1";
	$result = pg_prepare($db, "loadPatientData", $prep);
	if($result){
		$result = pg_execute($db, "loadPatientData", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			return $row;
		}
	}
}

function loadBMIRange($pseudonym){
	global $db;
	$returnArray = [];
	$prep = "SELECT min(weight*10000/height/height) as min, max(weight*10000/height/height) as max FROM height_weight_data WHERE pseudonym LIKE $1 AND weight > 0 and height > 0";
	$result = pg_prepare($db, "loadBMIRange", $prep);
	if($result){
		$result = pg_execute($db, "loadBMIRange", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			$returnArray = $row;
		}
	}
	return $returnArray;
}

function loadASARange($pseudonym){
	global $db;
	$returnArray = [];
	$prep = "SELECT min(asa_class) as min, max(asa_class) as max FROM operations_data WHERE pseudonym LIKE $1 AND asa_class > 0";
	$result = pg_prepare($db, "loadASARange", $prep);
	if($result){
		$result = pg_execute($db, "loadASARange", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			$returnArray = $row;
		}
	}
	return $returnArray;
}

function loadElectiveSurgeryCount($pseudonym){
	global $db;
	$prep = "SELECT count(*) as count FROM operations_data WHERE main_operation = 1 AND emergency = 0  AND pseudonym LIKE $1";
	$result = pg_prepare($db, "loadASARange", $prep);
	if($result){
		$result = pg_execute($db, "loadASARange", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			return $row;
		}
	}
}

//Load laboratory data
function loadLaboratoryData($pseudonym){
	global $db;
	$returnArray = [];
	$prep = "SELECT * FROM laboratory_data WHERE pseudonym LIKE $1 ORDER BY date ASC";
	$result = pg_prepare($db, "loadLaboratoryData", $prep);
	if($result){
		$result = pg_execute($db, "loadLaboratoryData", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			unset($row['id']);
			unset($row['pseudonym']);
			unset($row['patient_id']);
			unset($row['fmdate']);
			array_push($returnArray, $row);
		}
	}
	return $returnArray;
}

//Gets patient id based on pseudonym
function getPatiendId($pseudonym){
	global $db;
	$prep = "SELECT patient_id FROM clinical WHERE cohort_code LIKE $1";
	$result = pg_prepare($db, "getPatiendId", $prep);
	if($result){
		$result = pg_execute($db, "getPatiendId", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			return $row['patient_id'];
		}
	}	
}

function loadPathologyTexts($pseudonym){
	global $db;
	$returnArray = [];

	//if aloitusaika is not set, drug has not been administered.
	$prep = "SELECT * FROM pathology_data WHERE pseudonym LIKE $1 AND answer IS NOT NULL ORDER BY date_of_sampling ASC";
	$result = pg_prepare($db, "loadPathologyTexts", $prep);
	if($result){
		$result = pg_execute($db, "loadPathologyTexts", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			$row['question'] = str_replace('<br>', '', $row['question']);
			$row['answer'] = str_replace('<br>', '', $row['answer']);
			array_push($returnArray, $row);
		}
	}
	return $returnArray;
}

//Get distinct diagnoses
function loadDistinctDiagnoses($pseudonym){
	global $db;
	$returnArray = [];

	//if aloitusaika is not set, drug has not been administered.
	$prep = "SELECT DISTINCT code FROM diagnoses_data WHERE pseudonym LIKE $1 ORDER BY code DESC";
	$result = pg_prepare($db, "loadDistinctDiagnoses", $prep);
	if($result){
		$result = pg_execute($db, "loadDistinctDiagnoses", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			array_push($returnArray, $row['code']);
		}
	}
	return $returnArray;
}

//Load every pseudonym
function loadPseudonyms(){
	global $db;
	$returnArray = [];
	$prep = "SELECT pseudonym FROM clinical_data ORDER BY pseudonym ASC";
	$result = pg_prepare($db, "loadPseudonyms", $prep);
	if($result){
		$result = pg_execute($db, "loadPseudonyms", array());
		while($row = pg_fetch_assoc($result)){
			array_push($returnArray, $row['pseudonym']);
		}
	}
	return $returnArray;
}

function loadMedication($pseudonym){
	global $db;
	$returnArray = [];
	//if aloitusaika is not set, drug has not been administered.
	$prep = "SELECT DISTINCT * FROM medication_data WHERE pseudonym LIKE $1 ORDER BY administration_definition, atc_code DESC ";
	$result = pg_prepare($db, "loadRegularMedication", $prep);
	if($result){
		$result = pg_execute($db, "loadRegularMedication", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			array_push($returnArray, $row);
		}
	}
	return $returnArray;
}

//Get dates of chemotherapy administrations
function loadChemoDays($pseudonym){
	global $db;
	$returnArray = [];

	//if aloitusaika is not set, drug has not been administered.
	$prep = "SELECT administration_start_date FROM chemotherapy_data WHERE pseudonym LIKE $1 AND administration_start_date > '1-1-1900'::date";
	$result = pg_prepare($db, "loadChemoDays", $prep);
	if($result){
		$result = pg_execute($db, "loadChemoDays", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			array_push($returnArray, $row['administration_start_date']);
		}
	}
	return $returnArray;
}

//TO DO: CONVERT FOLLOWING SCRIPTS TO _DATA TABLES:

//Load data from KEMOKUR chemotherapy table. This does not have pseudonym but a patient id, so the id number is first retrieved.
function loadChemoCycleData($pseudonym){
	global $db;
	$returnArray = [];

	//if aloitusaika is not set, drug has not been administered.
	$prep = "SELECT cycle_start_date, cycle_end_date, cycle_name, patient_cycle_id FROM chemotherapy_data WHERE pseudonym LIKE $1 AND administration_start_date > '1-1-1900'::date GROUP BY (cycle_start_date, cycle_end_date, cycle_name, patient_cycle_id) ORDER BY cycle_start_date ASC";
	$result = pg_prepare($db, "loadChemoData", $prep);
	if($result){
		$result = pg_execute($db, "loadChemoData", array($pseudonym));
		while($row = pg_fetch_assoc($result)){
			array_push($returnArray, $row);
		}
	}
	return $returnArray;
}

//Load data about single cycle from KEMOKUR
function loadChemoCycleChildren($cycleId){
	global $db;
	$returnArray = [];
	$prep = "SELECT * FROM chemotherapy_data WHERE patient_cycle_id LIKE $1 AND cycle_start_date > '1-1-1900'::date";
	$result = pg_prepare($db, 'loadChemoCycleChildren', $prep);
	if($result){
		$result = pg_execute($db, 'loadChemoCycleChildren', array($cycleId));
		while($row = pg_fetch_assoc($result)){
			array_push($returnArray, $row);
		}
	}
	return $returnArray;
}

?>