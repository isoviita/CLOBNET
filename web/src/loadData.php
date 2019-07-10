<?php

//handle client-side data requests.

session_start();
include_once('includes/functions.php');

if(isset($_POST['pseudonym']) && isset($_POST['setPatient'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	$_SESSION['currentPatient'] = $pseudonym;
	echo json_encode(array('success'=>true));

}
else if(isset($_POST['pseudonym']) && isset($_POST['loadLaboratoryData'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadLaboratoryData($pseudonym));
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadPathologyTexts'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadPathologyTexts($pseudonym));
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadChemoCycleData'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadChemoCycleData($pseudonym));
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadChemoDays'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadChemoDays($pseudonym));
}
else if(isset($_POST['chemoId']) && isset($_POST['loadChemoCycleChildren'])){
	$chemoId = pg_escape_string($_POST['chemoId']);
	echo json_encode(loadChemoCycleChildren($chemoId));
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadDistinctDiagnoses'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadDistinctDiagnoses($pseudonym));	
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadMedication'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadMedication($pseudonym));	
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadBMIRange'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadBMIRange($pseudonym));	
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadASARange'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadASARange($pseudonym));	
}
else if(isset($_POST['pseudonym']) && isset($_POST['loadElectiveSurgeryCount'])){
	$pseudonym = pg_escape_string($_POST['pseudonym']);
	echo json_encode(loadElectiveSurgeryCount($pseudonym));	
}
else if(isset($_POST['loadPseudonyms'])){
	echo json_encode(loadPseudonyms());
}
else if(isset($_POST['loadModelData'])){
	echo json_encode(loadModelData());
}
?>