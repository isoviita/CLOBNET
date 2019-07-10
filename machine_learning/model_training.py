#import database connection
from db_connect import conn as conn

#import functions file
import functions as f

#import general modules
import warnings, sys, datetime, json, hashlib

#import different data-handling modules
import numpy as np
from random import randrange
from sklearn.metrics import roc_auc_score, roc_curve, auc
from sklearn.externals import joblib
from sklearn.model_selection import train_test_split, LeaveOneOut

#import sklearn classifiers
from sklearn import preprocessing, svm, linear_model, tree
from sklearn.naive_bayes import BernoulliNB
from sklearn.linear_model import LogisticRegression

#filter out warnings from terminal feed
# warnings.filterwarnings("ignore")

cur = conn.cursor()
le, loo = preprocessing.LabelBinarizer(), LeaveOneOut()

#Wether or not to print anything to terminal
printing = True

if(printing):
	print '=================================='
	print 'CLOBNET 0.8'

#global variables for different functions, these are needed for exporting classifiers to SQL and pickle.
scalename, currentName, currentPrediction, currentSQL, currentAUC, currentSensitivity, currentSpecificity, currentDatasetSize, currentTrainingsetSize, currentTestingsetSize, currentScaling, currentCrossvalidation, currentAUCData, pickle, dataset_id = '', '', '', '', 0, 0, 0, 0, 0, 0, '', '', [], '', 0

#Data arrays
X_train, X_test, y_train, y_test, input_vectors, input_pieces, targets = [], [], [], [], [], [], []

#minimum limits for specificity and sensitivity (percent) and AUC, if not met classifier results are not shown.
limit, AUClimit = 0, 0

#get last id of saved classifiers, zero for empty table
lastid = 0
cur.execute('SELECT max(id) FROM classificators')
dataset = cur.fetchall()
try:
	lastid = dataset[0][0]+1
except:
	lastid = 0

#create the array of different classifiers. This will be looped thorugh.
clfs = []
clfs.append((BernoulliNB(), 'Bernoulli Naive Bayes'))
clfs.append((LogisticRegression(), 'Logistic Regresion'))
clfs.append((tree.DecisionTreeClassifier(), 'Decision Tree Classifier'))

#This function dumps trained classificator to pickle and saves performance data to SQL.
def dumpClassificator(clf):
	global scalename, currentName, currentPrediction, currentSQL, currentAUC, currentSensitivity, currentSpecificity, currentDatasetSize, currentTrainingsetSize, currentTestingsetSize, currentScaling, currentCrossvalidation, lastid, currentAUCData, pickle, printing, dataset_id, input_pieces

	#Create the new pickle id and current timestamp
	pickle, timestamp = str(lastid)+str(randrange(1000000, 9999999)), str(datetime.datetime.now().isoformat())	
	query = 'INSERT INTO classificators (pickle, auc_data, timestamp, name, prediction, sql_query, auc, sensitivity, specificity, dataset_size, trainingset_size, testingset_size, scaling, crossvalidation, dataset_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
	
	#insert model into the database
	cur.execute(query, (pickle, json.dumps(str(currentAUCData)), timestamp, currentName, currentPrediction, currentSQL, currentAUC, currentSensitivity, currentSpecificity, currentDatasetSize, currentTrainingsetSize, currentTestingsetSize, currentScaling, currentCrossvalidation, dataset_id));
	conn.commit()

	#create pickle from the model and dump a pickle file
	joblib.dump(clf, 'pickles/'+pickle+'.pkl') 
	lastid += 1
	
	#if the model is a decision tree, dump also a .dot file for decision tree and make a conversion to png with decoded variable names:
	if 'Decision Tree Classifier' in currentName:
		f.exportDecisionTree(clf, pickle, input_pieces, 'decision_trees')

def generateDataset(target, restrictions, input_labels, labels_to_categorize, table, testset_size, label):
	global X_train, X_test, y_train, y_test, input_vectors, input_pieces, targets, scalename, currentName, currentPrediction, currentSQL, currentAUC, currentSensitivity, currentSpecificity, currentDatasetSize, currentTrainingsetSize, currentTestingsetSize, currentScaling, currentCrossvalidation, lastid, currentAUCData, pickle
	currentPrediction = label

	#This part is somewhat research-spesific and needs to be altered, as different models are trained.

	#Construct the SQL query:
	SQL = 'SELECT '+target[0]+', '+",".join(map(str, input_labels))+' FROM '+table+' WHERE '+target[1]+' IS NOT NULL AND '+' IS NOT NULL AND '.join(map(str, input_labels))+" IS NOT NULL AND "+restrictions;

	#Set SQL string as global current and fetch the data
	currentSQL = SQL
	cur.execute(SQL)
	dataset = cur.fetchall()

	#Create dictionary for categorical arrays:
	categorical_input_arrays = {}
	for label in categorical_inputs:
		categorical_input_arrays[label] = []

	#Use first item in SQL rows as targets, append the rest either to array to be processed or to be used straightly
	for i in dataset:

		# add firts column to targets
		targets.append(i[0])

		#add categorical columns to dictionary
		for j in xrange(0, len(categorical_inputs)):
			categorical_input_arrays[categorical_inputs[j]].append(i[j+1])

		#add rest i.e. numericals and booleans to input_vectors
		input_vectors.append(i[len(categorical_inputs)+1:])

	#Construct label arrays for human-readable decision trees:	
	input_pieces.extend(input_labels[len(categorical_inputs):])

	#loop through categoricals, get distinctive labels from SQL, fit and use label encoder and add result to input_vectors
	for label in list(categorical_input_arrays):
		cur.execute('SELECT DISTINCT '+label+' FROM '+table+' ')
		label_set = []
		for l in cur.fetchall():
			label_set.append(l[0])

		#fit labelencoder, construct input_pieces, append encoded vector to input vectors:
		le.fit(label_set)
		for cl in le.classes_:
			input_pieces.extend([label+': '+cl])
		to_append = le.transform(categorical_input_arrays[label])
		for k in range (0, len(to_append)):
			input_vectors[k] = np.hstack((np.array(input_vectors[k]), np.array(to_append[k])))			

	#Constructing the main sets: training features and targets, testing features and targets.
	input_vectors = np.array(input_vectors)

	#Scale the input vectors:
	if scalename == 'scale':
		input_vectors = preprocessing.scale(input_vectors)
	elif scalename == 'maxabs':
		input_vectors = preprocessing.maxabs_scale(input_vectors)

	targets = np.array(targets)
	X_train, X_test, y_train, y_test = train_test_split(input_vectors, targets, test_size=testset_size, random_state=42, stratify=targets)

	dataset_json = {}
	dataset_json['training_input'] = X_train.tolist()
	dataset_json['training_output'] = y_train.tolist()
	dataset_json['testing_input'] = X_test.tolist()
	dataset_json['testing_output'] = y_test.tolist()

	json_dump = json.dumps(dataset_json)
	json_hash = hashlib.sha224(json_dump).hexdigest()

	#check if identical dataset is already stored:
	cur.execute("SELECT id FROM datasets WHERE hash like '"+json_hash+"'")
	res = cur.fetchall()
	store_dataset = False

	try:
		dataset_id = res[0][0]
	except:
		store_dataset = True
		#if no identical dataset, select max id and add one to that:
		q = 'SELECT max(id) FROM datasets';
		cur.execute(q)
		res2 = cur.fetchall()
		try:
			dataset_id = res2[0][0]+1
		except:
			dataset_id = 1

	if(store_dataset):
		q = 'INSERT INTO datasets (id, hash, dataset) VALUES (%s, %s, %s)'
		cur.execute(q, (dataset_id, json_hash, json_dump))
		conn.commit()

	if(printing):
		f.printDatasetInfo(label, len(dataset), 0.33,len(y_train), len(y_test), scalename, SQL)

	#update the current dataset sizes
	currentTrainingsetSize, currentTestingsetSize = len(y_train), len(y_test)

def testModel(clf):
	global scalename, currentName, currentPrediction, currentSQL, currentAUC, currentSensitivity, currentSpecificity, currentDatasetSize, currentTrainingsetSize, currentTestingsetSize, currentScaling, currentCrossvalidation, lastid, currentAUCData, X_train, X_test, y_train, y_test, input_vectors, targets, limit, pickle, printing

	#1. Test performance with testing set cross-validation:
	true_positive, true_negative, false_positive, false_negative, y_scores, y_trues = 0, 0 ,0 ,0, [], []

	#Using testing set, loop through it and make prediction. Add to result counters to calculate performance
	for l in range(0, len(X_test)):
		prediction = clf.predict([X_test[l]])

		y_trues.append(y_test[l])
		y_scores.append(clf.predict_proba([X_test[l]])[0][1])

		if y_test[l] == True:
			#True positive
			if prediction[0] == True:
				true_positive += 1
			#False negative
			else:
				false_negative += 1
		else:
			#True negative
			if prediction[0] == False:
				true_negative += 1
			#False positive:
			else:
				false_positive += 1

	#Calculate model performance
	sensitivity, specificity = round(100*true_positive/(false_negative+true_positive), 2), round(100*true_negative/(false_positive+true_negative), 2)
	y_true, y_score = np.array(y_trues), np.array(y_scores)
	AUC = roc_auc_score(y_trues, y_scores)

	#If performance matches criteria, dump classificator to SQL and pickle and print results to terminal, too.
	if sensitivity > limit and specificity > limit and AUC > AUClimit:

		currentAUC, currentSpecificity, currentSensitivity, currentScaling, currentCrossvalidation, currentAUCData = AUC, specificity, sensitivity, scalename, 'Testing set', []
		currentAUCData.append(y_trues)
		currentAUCData.append(y_scores)
		fpr, tpr, thresholds = roc_curve(y_true, y_score)

		#Export classificator data
		dumpClassificator(clf)
		f.saveAUCPlot(fpr, tpr, AUC, pickle, 'auc_curves', currentName, sensitivity, specificity)
		if(printing):
			f.printModelInfo(currentCrossvalidation, true_positive, true_negative, false_positive, false_negative, specificity, sensitivity, AUC)

		currentAUC, currentSpecificity, currentSensitivity, currentScaling, currentCrossvalidation, currentAUCData = 0, 0, 0, '', '', []

	#2. Make model evaluation using Leave-one-out cross-validation:
	cvtrue_positive, cvtrue_negative, cvfalse_positive, cvfalse_negative, y_scores, y_trues  = 0, 0, 0 ,0, [], []

	for train, test in loo.split(input_vectors):
		cvX_train, cvX_test, cvy_train, cvy_test = input_vectors[train], input_vectors[test], targets[train], targets[test]

		clf.fit(cvX_train, cvy_train)
		cvprediction = clf.predict(cvX_test)
		y_scores.append(clf.predict_proba(cvX_test)[0][1])
		y_trues.append(cvy_test[0])

		if cvy_test == True:
			#True positive
			if cvprediction[0] == True:
				cvtrue_positive += 1
			#False negative
			else:
				cvfalse_negative += 1
		else:
			#True negative
			if cvprediction[0] == False:
				cvtrue_negative += 1
			#False positive:
			else:
				cvfalse_positive += 1

	sensitivity, specificity = round(100*cvtrue_positive/(cvfalse_negative+cvtrue_positive), 2), round(100*cvtrue_negative/(cvfalse_positive+cvtrue_negative), 2)
	y_true, y_score = np.array(y_trues), np.array(y_scores)
	AUC = roc_auc_score(y_true, y_score)

	if sensitivity > limit and specificity > limit  and AUC > AUClimit:

		currentAUC, currentSpecificity, currentSensitivity, currentScaling, currentCrossvalidation, currentAUCData = AUC, specificity, sensitivity, scalename, 'LOOCV', []
		currentAUCData.append(y_trues)
		currentAUCData.append(y_scores)
		fpr, tpr, thresholds = roc_curve(y_true, y_score)

		dumpClassificator(clf)
		f.saveAUCPlot(fpr, tpr, AUC, pickle, 'auc_curves', currentName, sensitivity, specificity)
		if(printing):
			f.printModelInfo(currentCrossvalidation, true_positive, true_negative, false_positive, false_negative, specificity, sensitivity, AUC)
		
		currentAUC, currentSpecificity, currentSensitivity, currentScaling, currentCrossvalidation, currentAUCData = 0, 0, 0, '', '', []

####################
# Main functionality
####################

#0. Input labels to be used from SQL. Categoricals are separated  as these need binarization:
categorical_inputs = ['figo_2014', 'o1_ro_ld', 'o1_lo_ld', 'o1_ln_2', 'o1_ln_25', 'o1_ln_5', 'o1_residual_tumor_size']
numerical_and_boolean_inputs = ['ca125_at_diagnosis', 'age_at_dg', 'o1_dissemination', 'o1_per_car_diss', 'o1_per_car_pelvic', 'o1_per_car_subd', 'o1_car_sm', 'tromb_at_diagnosis', 'hb_at_diagnosis', 'leuk_at_diagnosis', 'pds', 'na_at_diagnosis', 'previous_i_dg', 'previous_k_dg', 'previous_c_dg', 'previous_n_dg', 'previous_f_dg', 'previous_o_dg', 'previous_e_dg']
input_labels = categorical_inputs + numerical_and_boolean_inputs

 #in SQL tested if these are true
positive_case = 'prd'
all_cases = 'pfi is not null'
table = 'preprocessed_5'
label_for_prediction = 'Platinum resistance'
restrictions = "ca125_at_diagnosis > 0 AND o1_dissemination > 0 AND figo_2014 in ('IIIB', 'IIIC', 'IVA', 'IVB')"
scalename = 'maxabs'
testset_size = 0.33

#1. Generate a dataset
generateDataset((positive_case, all_cases), restrictions, input_labels, categorical_inputs, table, testset_size, label_for_prediction)

#2. Loop through model array and make fitting and evaluation:
n = 1
for clf in clfs:
	if(printing):
		print str(n)+'. Testing '+clf[1]+'...'	
	currentName = clf[1]
	n += 1
	clf[0].fit(X_train, y_train)		#Fit the model to training set
	testModel(clf[0])					#Make the testing & exporting
	