<?php 
session_start();
include_once('includes/functions.php');

$searchPlaceholder = "Pseudonym";

if(isset($_SESSION['currentPatient']) && $_SESSION['currentPatient'] != ''){
	$patientData = loadPatientData($_SESSION['currentPatient']);
	$searchPlaceholder = $_SESSION['currentPatient'];
}
?>
<html>
<?php include_once('pieces/head.php'); ?>
<body>
	<?php include('pieces/topbar.php'); ?>
	<div class="container">
		<div class="row">
			<div class="col-12">
				<p>&nbsp</p>
				
			</div>
		</div>
		<div class="row">
			<div class="col-md-6 col-sm-12">
				<h1>Dataset</h1>
				<p>Information about the dataset currently loaded to CLOBNET.</p>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3 col-sm-6 col-xs-12">
				<div class="left">
					<i class="fas fa-external-link-alt"></i>
				</div>
				<div class="right">
					<div>Number of patients</div>
					<div>80</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>