<html>
<?php include_once('pieces/head.php'); ?>
<body>
	<?php include('pieces/topbar.php'); ?>
	<div class="modal fade" id="model-modal">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">

				<!-- Modal Header -->
				<div class="modal-header">
					<h4 class="modal-title">Model info</h4>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>

				<!-- Modal body -->
				<div class="modal-body" id="chemo-modal-body">
					<img id="model-auc"></img>
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
			<div class="col-12">
				<p>&nbsp</p>
				
			</div>
		</div>
		<div class="row">
			<div class="col-md-6 col-sm-12">
				<h1>Machine learning</h1>
				<p>Information on the models trained with CLOBNET.</p>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<div class="table-responsive">
					<table id="model-table" class="table table-striped">
						<thead>
							<tr>
								<th>ID</th>
								<th>Date</th>
								<th>Type</th>
								<th>Prediction</th>
								<th>Cross-validation</th>
								<th>AUC</th>
								<th>Sensitivity</th>
								<th>Specificity</th>
							</tr>
						</thead>
						<tbody id="model-table-body">
						</tbody>
						<tfoot>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>