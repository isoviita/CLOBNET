var __currentPage;
var __laboratoryData = [];
var __chemoCycleData = [];
var __chemoDays = [];
var __colorScheme = ['#1ABC9C', '#2ECC71', '#3498DB', '#9b59b6', '#34495E', '#F1C40F', '#E67E22', '#E74C3C', '#ECF0F1', '#95A5A6', '#16A085', '#27AE60', '#2980B9', '#8E44AD', '#2C3E50', '#F39C12', '#D35400', '#C0392B', '#BDC3C7', '#7F8C8D'];
var __colorSchemeShade = ['#16A085', '#27AE60', '#2980B9', '#8E44AD', '#2C3E50', '#F39C12', '#D35400', '#C0392B', '#BDC3C7', '#7F8C8D'];
var __pseudonyms = [];
var __currentIndex = 0;
var __modelData = [];
var __distinctDiagnoses = [];
var __currentPseudonym;

$(document).ready(function() {
	$(document).on('click', '#loadPatientData', loadPatientData);
	$(document).on('click', '.chemoRow', loadChemoCycleChildren);
	$(document).on('keyup', '#pseudonymField', searchFieldKeyUp);
	$(document).on('focusout', '#pseudonymField', hideSuggest);
	$(document).on('change', '.labSlider', cropLabPlot);
	$(document).on('click', '.suggestion', clickSuggestion);

	__currentPage = document.location.href.match(/[^\/]+$/)[0];
	__currentPseudonym = $('#pseudonym').text();
	if(__currentPage.indexOf('clinical.php') > -1){
		loadChemoDays();
		loadPseudonyms();
		loadChemoCycleData();
		loadPathologyTexts();
		loadDistinctDiagnoses();
		loadMedication();
		loadBMIRange();
		loadASARange();
		loadElectiveSurgeryCount();
	}
	else if(__currentPage.indexOf('machine-learning.php') > -1){
		loadModelData();
	}
	else if(__currentPage.indexOf('documentation.php') > -1){
		loadDocumentation();
	}
});

var loadDocumentation = function(e){
	$.ajax({
		method: 'GET',
		url: 'README.md',
		success: function(response){
			var converter = new showdown.Converter();
			var html = converter.makeHtml(response);
			$('#documentation').html(html);
		},
		failure: function(response){
		}
	});	
}

var loadASARange = function(e){
	var payload = {};
	payload.pseudonym = __currentPseudonym;
	payload.loadASARange = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			var min = response.min;
			var max = response.max;

			if(min == max && min > 0){
				$('#asa-class').text(min);
			}
			else if(min != max && min > 0){
				$('#asa-class').text(min+' - '+max);
			}
		},
		failure: function(response){
		}
	});	
};


var loadElectiveSurgeryCount = function(e){
	var payload = {};
	payload.pseudonym = __currentPseudonym;
	payload.loadElectiveSurgeryCount = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			$('#elective-surgeries-count').text(response.count);
		},
		failure: function(response){
		}
	});	
};

var loadBMIRange = function(e){
	var payload = {};
	payload.pseudonym = __currentPseudonym;
	payload.loadBMIRange = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			var min = Math.round(parseFloat(response.min)*10.0)/10.0;
			var max = Math.round(parseFloat(response.max)*10.0)/10.0;
			console.log(min, max);
			if(min == max && min > 0){
				$('#bmi-data').text(min);
			}
			else if(min != max && min > 0){
				$('#bmi-data').text(min+' - '+max);
			}
		},
		failure: function(response){
		}
	});	
};

var loadMedication = function(e){
	var payload = {};
	payload.pseudonym = __currentPseudonym;
	payload.loadMedication = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			var homeOngoing = [];
			var homeHistory = [];
			var hospitalHistory = [];
			for(var j = 0; j < response.length; j++){
				if(response[j].home_medication == "1"){
					if(response[j].end_date){
						homeHistory.push(response[j]);
					}
					else{
						homeOngoing.push(response[j]);
					}
				}
				else{
					hospitalHistory.push(response[j]);
				}
			}

			const na = homeOngoing;
			const listItems = na.map((item, index) => createRegularMedicationRow(item, index));
			ReactDOM.render(
				listItems, document.getElementById('regular-medication-table-body')
				);
			$('#medications-count').text(homeOngoing.length);
			$('#regular-medication-table').prepend('<thead><tr><th scope="col">ATC</th><th scope="col">Name</th><th scope="col">Routine</th><th scope="col">Dose</th><th scope="col">Substance</th><th scope="col">Usage</th><th scope="col">Start</th><th scope="col">Info</th></tr></thead>');
			
			const hh = homeHistory;
			const hhListItems = hh.map((item, index) => createHistoryMedicationRow(item, index));
			ReactDOM.render(
				hhListItems, document.getElementById('history-home-medication-table-body')
				);

			$('#history-home-medication-table').prepend('<thead><tr><th scope="col">ATC</th><th scope="col">Name</th><th scope="col">Routine</th><th scope="col">Dose</th><th scope="col">Substance</th><th scope="col">Usage</th><th scope="col">Start</th><th scope="col">End</th><th scope="col">Info</th></tr></thead>');

			const hhh = hospitalHistory;
			const hhhListItems = hhh.map((item, index) => createHistoryMedicationRow(item, index));
			ReactDOM.render(
				hhhListItems, document.getElementById('history-hospital-medication-table-body')
				);

			$('#history-hospital-medication-table').prepend('<thead><tr><th scope="col">ATC</th><th scope="col">Name</th><th scope="col">Routine</th><th scope="col">Dose</th><th scope="col">Substance</th><th scope="col">Usage</th><th scope="col">Start</th><th scope="col">End</th><th scope="col">Info</th></tr></thead>');

		},

		failure: function(response){
		}
	});	
};

var loadDistinctDiagnoses = function(){
	var payload = {};
	payload.pseudonym = __currentPseudonym;	
	payload.loadDistinctDiagnoses = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			__distinctDiagnoses = response;
			populateChronicDiseases();
		},
		failure: function(response){
		}
	});	
}

var loadModelData = function(){
	var payload = {};
	payload.loadModelData = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			__modelData = response;
			populateModelTable();				
		},
		failure: function(response){
		}
	});		
};

var populateChronicDiseases = function(){
	var mcc = ['I20', 'I21', 'I22', 'I23', 'I24', 'I25'];
	var asthma = 'J45';
	var ht = 'I10';
	var fa = 'I48';
	var chd = 'I50';
	var dm = ['E10', 'E11'];

	var diagnoseString = __distinctDiagnoses.join('-');

	$('#mcc-boolean').text('No');
	for(var i = 0; i < mcc.length; i++){
		if(diagnoseString.indexOf(mcc) > -1){
			$('#mcc-boolean').text('Yes');
		}
	}

	$('#dm-boolean').text('No');
	for(var i = 0; i < mcc.length; i++){
		if(diagnoseString.indexOf(dm) > -1){
			$('#dm-boolean').text('Yes');
		}
	}	

	$('#asthma-boolean').text('No');
	if(diagnoseString.indexOf(asthma) > -1){
		$('#asthma-boolean').text('Yes');
	}

	$('#ht-boolean').text('No');
	if(diagnoseString.indexOf(ht) > -1){
		$('#ht-boolean').text('Yes');
	}

	$('#fa-boolean').text('No');
	if(diagnoseString.indexOf(fa) > -1){
		$('#fa-boolean').text('Yes');
	}

	$('#chd-boolean').text('No');
	if(diagnoseString.indexOf(chd) > -1){
		$('#chd-boolean').text('Yes');
	}

	console.log(__distinctDiagnoses);
};

var populateModelTable = function(){
	const models = __modelData;
	const tableRows = models.map((item) => 
		<tr data-toggle="modal" data-target="#model-modal"className="model_row" id={item.pickle} key={item.pickle}>
		<td>{item.pickle}</td>
		<td>{finnishDate(item.timestamp)}</td>
		<td>{item.name}</td>
		<td>{item.prediction}</td>
		<td>{item.crossvalidation}</td>
		<td>{Math.round(item.auc*100.0)/100}</td>
		<td>{Math.round(item.sensitivity)}</td>
		<td>{Math.round(item.specificity)}</td>
		</tr>
		);

	ReactDOM.render(
		tableRows, document.getElementById('model-table-body')
		);
	$('.model_row').on('click tap', function(){
		populateModelModal($(this).attr('id'));
	});
	$('#model-table').DataTable();
};

var populateModelModal = function(id){
	$('#model-auc').attr('src','/auc_curves/'+id+'.png');
	console.log('woop');
	console.log(id);
}

var loadPathologyTexts = function(){
	var payload = {};
	payload.pseudonym = __currentPseudonym;
	payload.loadPathologyTexts = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			const pa = response;
			const patItems = pa.map((item, index) => createPathologyText(item, index));
			ReactDOM.render(
				patItems, document.getElementById('pathology-div')
				);
		},
		failure: function(response){
		}
	});	
};

var loadPseudonyms = function(e){
	var payload = {};
	payload.loadPseudonyms = true;
	$.ajax({
		method: 'POST',
		url: 'loadData.php',
		dataType: 'json',
		data: payload,
		success: function(response){
			__pseudonyms = response;
			initiateSearchBar();
		},
		failure: function(response){
		}
	});	
};

//Set functionality for next and previous patient in search bar.
var initiateSearchBar = function(e){
	__currentIndex = __pseudonyms.indexOf(__currentPseudonym);
	if(__currentIndex == 0){
		$('#goToPrevious').addClass('disabled');
			$('#goToNext').on('click', function(e){
				$('#pseudonymField').val(__pseudonyms[__currentIndex+1]);
				loadPatientData();
			});
		}
		else if(__currentIndex == __pseudonyms.length -1){
			$('#goToNext').addClass('disabled');
				$('#goToPrevious').on('click', function(e){
					$('#pseudonymField').val(__pseudonyms[__currentIndex-1]);
					loadPatientData();
				});
			}
			else{
				$('#goToPrevious').on('click', function(e){
					$('#pseudonymField').val(__pseudonyms[__currentIndex-1]);
					loadPatientData();
				});
				$('#goToNext').on('click', function(e){
					$('#pseudonymField').val(__pseudonyms[__currentIndex+1]);
					loadPatientData();
				});		
			}
		};
		var clickSuggestion = function(e){
			$('#pseudonymField').val($(this).attr('data-suggest'));
			loadPatientData();
		}

		var searchFieldKeyUp = function(e){
			if(e.keyCode == 13){
				e.preventDefault();
				loadPatientData();
			}
			else{
				var suggests = [];
				for(var i = 0; i < __pseudonyms.length; i++){
					if(__pseudonyms[i].indexOf($('#pseudonymField').val()) > -1){
					suggests.push(__pseudonyms[i]);
				}
			}
			const list = suggests.splice(0,10);
				const listItems = list.map((item) => 
					<div key={item} data-suggest={item} className="suggestion">
					{item}
					</div>
					);
					ReactDOM.render(
						listItems, document.getElementById('pseudonym-suggest')
							);		
							$('#pseudonym-suggest').removeClass('hidden-element');
						}
					};

					var hideSuggest = function(e){
						$('#pseudonym-suggest').addClass('hidden-element');
					};


	//From the search button, sets new current patient pseudonym and refreshes clinical.php to retrieve the information.
	var loadPatientData = function(e){
		var pseudonym = $('#pseudonymField').val();
		var payload = {};
		payload.pseudonym = pseudonym;
		payload.setPatient = true;
		$.ajax({
			method: 'POST',
			url: 'loadData.php',
			dataType: 'json',
			data: payload,
			success: function(response){
				location.reload(true);
			},
			failure: function(response){
			}
		});	
	};

	var loadChemoCycleData = function(e){
		var payload = {};
		payload.pseudonym = __currentPseudonym;
		payload.loadChemoCycleData = true;
		$.ajax({
			method: 'POST',
			url: 'loadData.php',
			dataType: 'json',
			data: payload,
			success: function(response){
				const na = response;
				const listItems = na.map((item, index) => createChemoRow(item, index));
				ReactDOM.render(
					listItems, document.getElementById('chemo-table-body')
					);
				$('#chemo-table').prepend('<thead><tr><th scope="col">Cycle start</th><th scope="col">Cycle end</th><th scope="col">Cycle name</th></tr></thead>');
			},
			failure: function(response){
			}
		});	
	};

	var loadChemoCycleChildren = function(e){
		var chemoId = $(this).attr('data-chemoid');
		var payload = {};
		payload.chemoId = chemoId;
		payload.loadChemoCycleChildren = true;
		$.ajax({
			method: 'POST',
			url: 'loadData.php',
			dataType: 'json',
			data: payload,
			success: function(response){
				const na = response;
				const listItems = na.map((item, index) => createChemoNode(item, index));
				ReactDOM.render(
					listItems, document.getElementById('chemo-modal-body')
					);
			},
			failure: function(response){
			}		
		});
	};

	//Load days of chemo administrations
	var loadChemoDays = function(e){
		var chemoId = $(this).attr('data-chemoid');
		var payload = {};
		payload.pseudonym = __currentPseudonym;
		payload.loadChemoDays = true;
		$.ajax({
			method: 'POST',
			url: 'loadData.php',
			dataType: 'json',
			data: payload,
			success: function(response){
				__chemoDays = response;
				loadLaboratoryData();
			},
			failure: function(response){
			}		
		});
	};				

	var loadLaboratoryData = function(e){
		var payload = {};
		payload.pseudonym = __currentPseudonym;
		payload.loadLaboratoryData = true;
		$.ajax({
			method: 'POST',
			url: 'loadData.php',
			dataType: 'json',
			data: payload,
			success: function(response){
				__laboratoryData = response;
				plotLaboratorydata();
			},
			failure: function(response){
			}
		});	
	};

	var cropLabPlot = function(e){
		var start = $('#labStartPoint').val();
		var end = $('#labEndPoint').val();
		plotLaboratorydata(start, end);
	};

	var plotLaboratorydata = function(cutStart, cutEnd){

		var target = 'labPlot';
		if(__laboratoryData.length > 1){

			var lastday = new Date(__laboratoryData[__laboratoryData.length - 1]['date'].replace(/-/g,'/'));
				var firstday = new Date(__laboratoryData[0]['date'].replace(/-/g,'/'));
					var diff = Math.ceil(Math.abs( lastday - firstday)/1000/24/3600)+30;
						var labels = new Array(diff);
							var ca125 = new Array(diff);
								var he4 = new Array(diff);
									var hb = new Array(diff);
										var krea = new Array(diff);
											var alat = new Array(diff);
												var leuk = new Array(diff);
													var na = new Array(diff);
														var chemos = new Array(diff);
															var tromb = new Array(diff);
																var thisday;
																var barPercentage;
																var labelDate;

																for(var i = 0; i<__laboratoryData.length; i++){
																	if(__laboratoryData[i]['ca125'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		ca125[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['ca125']);
																	}
																	if(__laboratoryData[i]['he4'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		he4[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['he4']);
																	}
																	if(__laboratoryData[i]['hb'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		hb[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['hb']);
																	}
																	if(__laboratoryData[i]['leuk'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		leuk[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['leuk']);
																	}	
																	if(__laboratoryData[i]['krea'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		krea[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['krea']);
																	}
																	if(__laboratoryData[i]['alat'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		alat[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['alat']);
																	}
																	if(__laboratoryData[i]['na'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		na[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['na']);
																	}
																	if(__laboratoryData[i]['tromb'] != null){
																		thisday = new Date(__laboratoryData[i]['date'].replace(/-/g,'/'));
																		tromb[Math.ceil(Math.abs(thisday - firstday)/1000/24/3600)] = parseFloat(__laboratoryData[i]['tromb']);
																	}
																}

																for(var i = 0; i < labels.length; i++){
																	var labelDate = new Date(firstday);
																	labelDate.setDate(labelDate.getDate() + i);
																	var dateLabel = labelDate.getDate()+'.'+(labelDate.getMonth()+1)+'.'+labelDate.getFullYear();
																	labels[i] = dateLabel;

																	var isoDate = labelDate.getFullYear();
																	if(labelDate.getMonth() < 9){
																		isoDate += '-0'+(labelDate.getMonth()+1);
																	}
																	else{
																		isoDate += '-'+(labelDate.getMonth()+1);	
																	}
																	if(labelDate.getDate() < 9){
																		isoDate += '-0'+(labelDate.getDate());
																	}
																	else{
																		isoDate += '-'+(labelDate.getDate());
																	}											

				//Add a chemo bar if is adminstered on this day
				if(__chemoDays.indexOf(isoDate)> -1){
																chemos[i] = 500;
															}
														}

														if(!cutEnd && !cutStart){
															$('.labSlider').attr('max', labels.length);
															$('#labEndPoint').val(labels.length);
														}

														if(!cutStart){
															cutStart = 0;
														}
														if(!cutEnd){
															cutEnd = labels.length;
														}
			//Create plot
			var ctx = document.getElementById(target);
				var data = {
					labels: labels.slice(cutStart, cutEnd),
					datasets: [
					{
						type: 'line',
						label: 'CA12-5',
						data: ca125.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[0],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'line',
						label: 'Hb',
						data: hb.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[7],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},	        
					{
						type: 'line',
						label: 'S-HE-4',
						data: he4.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[4],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'line',
						label: 'Leuk',
						data: leuk.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[5],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'line',
						label: 'Krea',
						data: krea.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[6],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'line',
						label: 'ALAT',
						data: alat.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[2],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'line',
						label: 'Na',
						data: na.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[8],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'line',
						label: 'Tromb',
						data: tromb.slice(cutStart, cutEnd),
						fill: false,
						borderColor: __colorSchemeShade[9],
						pointRadius: 1,
						lineTension: 0.2,
						spanGaps: true,
					},
					{
						type: 'bar',
						label: 'Chemotherapy',
						borderWidth: 3,
						data: chemos.slice(cutStart, cutEnd),
						backgroundColor: __colorSchemeShade[5],
						borderColor: __colorSchemeShade[5],
					}			
					]
				};

				var barPercentage = diff/100;

				var labChart = new Chart(ctx, {
					type: 'bar',
					data: data,
					options: {
						animation: false,
						legend:{
							display:true
						},
						scales:{
							xAxes: [{

								ticks: {
									min: 0
								}
							}],
							yAxes: [{

							}]
						}

					}
				});
			}
		};

//Functions to create React elements
var createChemoRow = function(rowData, index){
	return (
		<tr data-chemoid={rowData['patient_cycle_id']} data-toggle="modal" data-target="#chemo-modal" className="chemoRow" key={rowData['patient_cycle_id']+'-'+index}>
		<td>{finnishDate(rowData['cycle_start_date'])}</td>
		<td>{finnishDate(rowData['cycle_end_date'])}</td>
		<td>{rowData['cycle_name']}</td>
		</tr>
		);
};

var createRegularMedicationRow = function(d, i){
	var dose;
	if(d.regular_daily_dose){
		dose = 'x '+d.regular_daily_dose;
	}
	else if(d.administration_definition == 'Erillisen ohjeen mukaan'){
		dose = 'eom';
	}
	else{
		dose = 'x '+d.on_demand_dose+' '+d.administration_unit;
	}
	return (
		<tr key = {i}>
		<td>{d.atc_code}</td>
		<td className="sentence-case">{d.brand_name.toLowerCase()}</td>
		<td>{dose}</td>
		<td>{d.dose}</td>
		<td>{ellipsis(d.substance)}</td>
		<td>{d.administration_definition}</td>
		<td>{finnishDate(d.start_date)}</td>		
		<td><a target="laaketietokanta" href={'https://www.terveysportti.fi/terveysportti/dlr_laake.koti?p_hakuehto='+d.brand_name+' '+d.dose}><i className="fas fa-external-link-alt"></i></a></td>
		</tr>
		);
};

var createHistoryMedicationRow = function(d, i){
	var dose;
	if(d.regular_daily_dose){
		dose = 'x '+d.regular_daily_dose;
	}
	else if(d.administration_definition == 'Erillisen ohjeen mukaan'){
		dose = 'eom';
	}
	else{
		dose = 'x '+d.on_demand_dose+' '+d.administration_unit;
	}
	return (
		<tr key = {i}>
		<td>{d.atc_code}</td>
		<td className="sentence-case">{d.brand_name.toLowerCase()}</td>
		<td>{dose}</td>
		<td>{d.dose}</td>
		<td>{ellipsis(d.substance)}</td>
		<td>{d.administration_definition}</td>
		<td>{finnishDate(d.start_date)}</td>	
		<td>{finnishDate(d.end_date)}</td>
		<td><a target="laaketietokanta" href={'https://www.terveysportti.fi/terveysportti/dlr_laake.koti?p_hakuehto='+d.brand_name+' '+d.dose}><i className="fas fa-external-link-alt"></i></a></td>
		</tr>
		);
};


var ellipsis = function(text){
	var maxLength = 20;
	if(text.length > maxLength - 3){
		return text.substr(0, maxLength -3)+'...';
	}
	else{
		return text;
	}
}

var createChemoNode = function(rowData, index){
	return(
		<div key={rowData.patitent_cycle_id}>
		<h3>{rowData.cycle_name+' '+rowData.cycle_basic_dose+' '+rowData.cycle_dose_definition+' '+rowData.administration_definition}</h3>
		<p className="muted">{finnishDate(rowData.administration_start_date)}</p>
		<p>Dose: {rowData.used_dose}<br />Used area: {rowData.used_bsa} m²</p>
		</div>
		);
};

var createPathologyText =function(d,i){
	return(
		<div className="pathologyText" key={d.answer_id+'-'+i}>
		<h5>{d.assay_type} <span className="muted">{d.answer_id}</span></h5>
		<span className="muted">{d.sender}</span><br />
		<span className="muted">{finnishDate(d.date_of_sampling)}</span><br />
		<p>{d.question}</p>
		<p className="pathology-answer">{d.answer}</p>
		</div>
		);
};

	// Parses date format to normal Finnish form of DD.MM.YYYY from ISO encoded YYYY-MM-DD
	var finnishDate =function(date){
		if(date){
			var parts = date.split('-');
				return parts[2]+'.'+parts[1]+'.'+parts[0];
			}
			else{
				return false;
			}
		};