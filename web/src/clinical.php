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
<body id="basic-anchor" >
	<?php include('pieces/topbar.php'); ?>
	<div class="modal fade" id="chemo-modal">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">

				<!-- Modal Header -->
				<div class="modal-header">
					<h4 class="modal-title">Chemotherapy</h4>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>

				<!-- Modal body -->
				<div class="modal-body" id="chemo-modal-body">
					Modal body..
				</div>

				<!-- Modal footer -->
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
				</div>

			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-lg-3 col-md-3">
				<div class="row">
					<div class="col-12">
						<p>&nbsp</p>

					</div>
				</div>
				<ul class="list-group" id="side-navigation">
					<button type="button" class="list-group-item list-group-item-action active">Navigation</button>
					<a class="list-group-item list-group-item-action" href="#basic-anchor">Basic info</a>
					<a class="list-group-item list-group-item-action" href="#medication-anchor">Medication</a>					
					<a class="list-group-item list-group-item-action" href="#laboratory-anchor">Laboratory</a>
					<a class="list-group-item list-group-item-action" href="#chemotherapy-anchor">Chemotherapy</a>
					<a class="list-group-item list-group-item-action" href="#pathology-anchor">Pathology</a>
				</ul>
			</div>
			<div class="col-lg-9 col-md-9 col-sm 12-col-xs-12">
				<div class="row">
					<div class="col-12">
						<p>&nbsp</p>

					</div>
				</div>
				<div class="row">
					<div class="col-md-6 col-sm-12">
						<h1>Clinical Data</h1>
						<p>Search and view patient clinical data from database.</p>
					</div>
					<div class="col-md-6 col-sm-12">
						<div class="input-group-append">
							<input id="pseudonymField" type="text" class="form-control" placeholder="<?php echo $searchPlaceholder; ?>" aria-label="Recipient's username" aria-describedby="basic-addon2" autofocus  autocomplete="off">
							<button class="btn btn-primary" type="button" id="loadPatientData">Search</button>
							<button class="btn btn-primary" id="goToPrevious" type="button">Previous</button>
							<button class="btn btn-primary" id="goToNext" type="button">Next</button>
						</div>
						<div id="pseudonym-suggest" class="hidden-element"></div>
					</div>
				</div>

				<?php if(isset($_SESSION['currentPatient']) && $_SESSION['currentPatient'] != '') : ?>	
					<div class="row">
						<div class="col-12">
							<h2>Basic info</h2>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs12">
							<table>
								<tr>
									<td class="table-row-title">Pseudonym</td>
									<td class="table-row-data" id="pseudonym"><?php echo $patientData['pseudonym']; ?></td>
								</tr>
								<tr>
									<td class="table-row-title">Age at diagnosis</td>
									<td class="table-row-data"><?php echo $patientData['age_at_diagnosis']; ?></td>
								</tr>
								<tr>
									<td class="table-row-title">Progression free survival (PFS)</td>
									<td class="table-row-data">N/A</td>
								</tr>	
								<tr>
									<td class="table-row-title">Platinum free interval (PFI)</td>
									<td class="table-row-data">N/A</td>
								</tr>	
							</table>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs12">
							<table>
								<tr>
									<td class="table-row-title">Figo 2014 stage</td>
									<td class="table-row-data"><?php echo $patientData['figo_2014_stage']; ?></td>
								</tr>
								<tr>
									<td class="table-row-title">Treatment strategy</td>
									<td class="table-row-data"><?php echo $patientData['treatment_strategy']; ?></td>
								</tr>
								<tr>
									<td class="table-row-title">Primary therapy outcome</td>
									<td class="table-row-data"><?php echo $patientData['primary_therapy_outcome']; ?></td>
								</tr>
								<tr>
									<td class="table-row-title">Vital status</td>
									<td class="table-row-data"><?php echo $patientData['status']; ?></td>
								</tr>
							</table>
						</div>
					</div>

					<br>

					<div class="row">
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<h3>Chronic diseases</h3>
							<div id="chronic-diseases">
								<table>
									<tr>
										<td class="table-row-title">Diabetes</td>
										<td class="table-row-data" id="dm-boolean">N/A</td>
									</tr>
									<tr>
										<td class="table-row-title">Coronary disease</td>
										<td class="table-row-data" id="mcc-boolean">N/A</td>
									</tr>
									<tr>
										<td class="table-row-title">Hypertension</td>
										<td class="table-row-data" id="ht-boolean">N/A</td>
									</tr>
									<tr>
										<td class="table-row-title">Congestive heart disease</td>
										<td class="table-row-data" id="chd-boolean">N/A</td>
									</tr>
									<tr>
										<td class="table-row-title">Atrial fibrillation</td>
										<td class="table-row-data" id="fa-boolean">N/A</td>
									</tr>									
									<tr>
										<td class="table-row-title">Asthma</td>
										<td class="table-row-data" id="asthma-boolean">N/A</td>
									</tr>
								</table>
							</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<h3>Other</h3>
							<table>
								<tr>
									<td class="table-row-title">ASA class</td>
									<td class="table-row-data" id="asa-class">N/A</td>
								</tr>
								<tr>
									<td class="table-row-title">Body mass index (BMI)</td>
									<td class="table-row-data" id="bmi-data">N/A</td>
								</tr>

								<tr>
									<td class="table-row-title"><a href="#medication-anchor">No. of regular medications</a></td>
									<td class="table-row-data" id="medications-count">N/A</td>
								</tr>

								<tr>
									<td class="table-row-title">No. of elective surgeries</td>
									<td class="table-row-data" id="elective-surgeries-count">N/A</td>
								</tr>								

							</table>					
						</div>
					</div>

					<div class="row">
						<div class="spacer"></div>
						<div class="col-12">
							<h2 id="laboratory-anchor">Laboratory</h2>
							<canvas id="labPlot" style="height:300px;width:600px;"></canvas>
							<div class="slidecontainer">
								<p>Crop start and end points:</p>
								<input type="range" min="0" max="100" value="0" class="slider labSlider" id="labStartPoint">
								<input type="range" min="0" max="100" value="100" class="slider labSlider" id="labEndPoint">
							</div>					
						</div>
					</div>

					<div class="row">
						<div class="spacer"></div>
						<div class="col-12">
							<h2 id="medication-anchor">Medication</h2>
							<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
								<li class="nav-item">
									<a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#ongoing-medication-tab" role="tab" aria-controls="pills-home" aria-selected="true">Ongoing @home</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#history-home-medication-tab" role="tab" aria-controls="pills-profile" aria-selected="false">History @home</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#history-hospital-medication-tab" role="tab" aria-controls="pills-profile" aria-selected="false">History @hospital</a>
								</li>								
							</ul>
							<div class="tab-content" id="pills-tabContent">

								<div class="tab-pane fade show active" id="ongoing-medication-tab" role="tabpanel" aria-labelledby="pills-home-tab">
									<table class="table table-hover" id="regular-medication-table">
										<tbody id="regular-medication-table-body">
										</tbody>
									</table>
								</div>

								<div class="tab-pane fade" id="history-home-medication-tab" role="tabpanel" aria-labelledby="pills-profile-tab">
									<table class="table table-hover" id="history-home-medication-table">
										<tbody id="history-home-medication-table-body">
										</tbody>
									</table>
								</div>

								<div class="tab-pane fade" id="history-hospital-medication-tab" role="tabpanel" aria-labelledby="pills-profile-tab">
									<table class="table table-hover" id="history-hospital-medication-table">
										<tbody id="history-hospital-medication-table-body">
										</tbody>
									</table>
								</div>

							</div>
						</div>
					</div>					

					<div class="row">
						<div class="spacer"></div>
						<div class="col-12">
							<h2 id="chemotherapy-anchor">Chemotherapy</h2>
							<table class="table table-hover" id="chemo-table">
								<tbody id="chemo-table-body">

								</tbody>
							</table>
						</div>
					</div>		

					<div class="row">
						<div class="spacer"></div>
						<div class="col-12">
							<h2 id="pathology-anchor">Pathology</h2>
							<div id="pathology-div"></div>
						</table>
					</div>

					<div id="last-spacer">
					</div>
				</div>	
			<?php endif; ?>
		</div>
	</div>
</body>
</html>