CLOBNET (Cloud-based machine learning network) v0.8 consists of front-end GUI for information visualisation and viewing, postgreSQL database and Python scripts performing the machine learning analysis. At the development setting, it has been running inside Ubuntu 16.04 LTS and it does not require any proprietary software. Main incentive to create the system has been to create an ability to integrate various data sources inside a single database to be used in clinical data analysis such as machine learning. We aim to do this in as light and as straightforward way as possible. As CLOBNET is intended to be operated only in a secured internal network, no user adminsitration functionality is integrated at the moment.

CLOBNET is part of [HERCULES project](http://project-hercules.eu/) and it is maintained by Systems Biology in Cancer Group, Faculty of Medicine, University of Helsinki.

## Used software

* **PostgreSQL 9.5.13** as a database
* **Python 2.7** for machine learning analyses
* **Apache 2.4.18** for hosting the web GUI
* **PHP7.0.30** for web GUI back-end
* **npm** for hanlding various packages for web front end, such as:
	* **Grunt**
	* **React**
	* **Bootstrap 4**
	* **SCSS**
	* ...
	* These package dependencies are maintained at web/packages.json

## Folder structure
	.
	├── export					# Folder for files to be exported from CLOBNET
	├── import                  # Folder for files to be imported to CLOBNET
	├── machine_learning        # Machine learning scripts
	│	├── decision_trees 		# Trained decision trees as dot files
	│	│	└ png 				# Decision trees as png files
	│	├── auc_curves 			# AUC curves as png files
	│	└─- pickles				# ML models stored as pickles
	├── sql                   	# SQL scripts
	└── web						# Web GUI files
		├── dist 				# Grunt output location, folder to be hosted by Apache
		├── src 				# GUI dev folder
		│ 	├ js 				# Custom JS
		│ 	├ includes			# PHP scripts such as functions, database connections
		│ 	├ pieces			# Website parts such as HTML head, topbar
		│ 	└ scss				# GUI design
		└── node_modules		# npm modules

## SQL

CLOBNET database runs with PostgreSQL. All patient information is identified using a pseudonym, which is found from every table under *pseudonym* column, datatype being **varchar**. Patient data is divided into distinct tables by different iformation categories such as diagnoses, laboratory test results, operations and so on. Tables are named with *_data* ending and naming of tables and variables uses underscore and lowercase, as postgres naming is case-insensitive.

As the data to be inputted into CLOBNET can require lots of cleansing and parsing, this transformation part has to be configured on a source by source basis. Idea in CLOBNET is to first load the files into **import folder** and then hanlde data transformation and loading using SQL scripts, which can be included into *create\_and\_parse\_all\_tables.sql*. In this manner, no further scripting is needed if the data source format and file naming are kept unchanged.

### Tables

SQL script to create the tables are found in separate files under clobnet/sql/ folder. Scripts are divided to table creation and table parsing files, one for each table. A script file running all the scripts is also provided. This initiation can be done from postgres with the following command, including path to sql file:

	# \i /<clobnet-path>/sql/create_and_parse_all_tables.sql

Population of the said data tables are created with data-source spesific scripts. Separation of table creation and paring allows the initialisation of database in an uniform way regardless of the data sources and thus using same analytics and downstream pipelines for different sources.

### *classificators*

This table contains information about the machine learning models created with Python. When a model is trained, its performance information is stored to this table and the model itself is stored as a pickel to machine_learning/pickles, from where it can be accessed later. Pefrormance information is inserted by Python as the models are created and this information is visualised with GUI.

* **id** [*serial*] Model identifier, primary key
* **name** [*varchar(255)*] Name of the model eg. Support Vector Machine, Decision tree minLeaf = 5 and so on.
* **sql_query** [*text*] SQL query used by Python to get the input data for the model.
* **auc** [*float*] AUC of the model
* **sensitivity** [*float*] Sensitivity of the model
* **specificity** [*float*] Specificity of the model
* **timestamp** [*date*] Time of model creation
* **dataset_size** [*integer*] Size of the dataset used
* **trainingset_size** [*integer*] Size of used training set
* **testingset_size** [*integer*] Size of used testing set, in LOOCV 1
* **scaling** [*varchar(144)*] What kind of scaling was used
* **crossvalidation** [*varchar(144)*] What kind of cross-validation was used
* **auc_data** [*json*] Data for AUC curve, classes and their predictions per case
* **prediction** [*varchar(255)*] What prediction was done
* **pickle** [*varchar(255)*] Pickle filename
* **dataset_id** [*int*] Id of the dataset used in *datasets* table

### *datasets*

The raw dumps of the datasets used in model training are stored here for possible future validation. CLOBNET stores the dataset as JSON and calculates SHA224 hash for the dataset. If new dataset has identical information and identical hash, no new copy is stored, but current id of the same dataset is used.

* **id** [*serial*] Model identifier, primary key
* **hash** [*varchar(512)*] Hash of the dataset information
* **dataset** [*json*] Dataset stored as a json

### *chemotherapy_data*

Information on chemotherapy cycles.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient idetifier
* **patient\_medication\_id** [*varchar(40)*] Patient-specific id of the medication administered
* **patient\_cycle\_id** [*varchar(40)*] Patient-specific id of the chemotherapy cycle
* **startday** [*smallint*] Wether drug is administered on cycle starting day
* **calculation_date** [*date*] Date of drug calculations
* **calculated_bsa** [*float*]  Calculated Body Surface Area (BSA)
* **used_bsa** [*float*] BSA used in drug calculations
* **serial_number** [*smallint*] Running number of cycles
* **cycle_id** [*varchar(40)*] General id of the chemotherapy
* **cycle_name** [*varchar(255)*] Cycle name
* **cycle** [*smallint*] Number of days in cycle
* **cycle\_start\_date** [*date*] Start date of cycle
* **cycle\_end\_date** [*date*]  End date of cycle
* **generic_name** [*varchar(255)*] Generic name of cycle
* **dose** [*varchar(255)*] Dose of cycle
* **administration\_serial\_number** [*smallint*] Administration running number
* **administration_definition** [*varchar(70)*] Definition on administration
* **cycle\_basic\_dose** [*float*] Basic dose in the cycle
* **cycle\_dose\_definition** [*varchar(70)*] Definition of cycle dosing
* **used_dose** [*float*] Used dose
* **adminisitration_id** [*varchar(18)*] Id of the single administration
* **administration\_start\_date** [*date*] Start date of the drug administration
* **administration\_end\_date** [*date*] End date of the drug administration
* **height** [*float*] Height used in BSA calculation
* **weight** [*float*] Weight used in BSA calculation

### *clinical_data*

The main table containing clinical information. As the research settings vary from disease to disease and from research to research, this table is the hardest to generalize. In the initial setting, the clinical data table provides besides required identifier some more generic columns such as clinical end points but also some HERCULES program and ovarian cancer (OC) specific columns.

General columns:

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **status** [*varchar(20)*] Status of the patient wether she is alive, deceased etc.

More project-spesific columns:

* **patient_id** [*integer*] Another patient identifer used in HERCULES
* **age\_at\_diagnosis** [*float*] Age at the time of OC diagnosis
* **height\_at\_diagnosis** [*float*] Height at the time of OC diagnosis
* **weight\_at\_diagnosis** [*float*] Weight at the time of OC diagnosis
* **figo\_2014\_stage** [*varchar(10)*] FIGO 2014 stage of OC at diagnosis
* **primary\_therapy\_outcome** [*varchar(255)*] Outcome of primary therapy: complete response, progressive disease and so on.
* **treatment_strategy** ** [*varchar(255)*] Primary debulking surgery (PDS), neoadjuvant chemotherapy (NACT) or no chemo.

### *diagnoses_data*

Diagnoses by date as International Classification of Diseases 10th Revision (ICD-10) codes.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **code** [*varchar(20)*] Diagnosis as ICD-10 code
* **date** [*date*] Date of diagnosis

### *height\_weight\_data*

As the name says, stores height and weight data. No column for units, so possible unit conversion should be done before inserting data to this table.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **height** [*float*] Height
* **weight** [*float*] Weight
* **date** [*date*] Date of measurement

### *laboratory_data*

Laboratory test results are stored in rows per patient and date, every different laboratory test on their own columns. This is suitable setup for research where no bigger temporal resolution than daily values are needed and the amount of different laboratory tests are moderate. Floating point data type does not allow additional information sometimes embedded to lab time series data such as textual notes about failed test etc. Following table structure is somewhat research-specific.

Like in height and weight column, no units are specified in laboratory_data table and possible conversions should be done before data input.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **date** [*date*] Date of measurement
* **ca125** [*float*] Cancer antigen 12-5 (CA12-5), OC tumor marker
* **he4** [*float*] HE-4, another tumor marker
* **hb** [*float*] Haemoglobin
* **tromb** [*float*] Trombocyte count
* **neut** [*float*] Neutrophile count
* **na** [*float*] Sodium level
* **krea** [*float*] Creatinine 
* **leuk** [*float*] Leukocyte level
* **alat** [*float*] ALAT, alanine aminotransferase
* **fmdate** [*string*] Column for external research db purposes

### *medication_data*

Information about medications, both at home or in hospital.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **start_date** [*date*] Start date of medication
* **end_date** [*date*] Possible end date of medication
* **brand_name** [*varchar(512)*] Brand name
* **substance** [*varchar(512)*] Generic name or the substance in the medication
* **atc_code** [*varchar(512)*] ATC code
* **home_medication** [*smallint*] 1, if prescibed to home
* **administration_unit** [*varchar(512)*] Units in adminisitration
* **dose** [*varchar(128)*] Dose
* **administration_code** [*varchar(512)*] code e.g. IV, po
* **administration_definition** [*varchar(512)*] textual definition of adminisitration
* **administration_dose** [*float*] dose in administration
* **regular\_daily\_dose** [*int*] regular daily dose
* **on_demand_dose** [*varchar(512)*] dose if taken only on demand

### *operations_data*

This table stores data about the surgical operations and anesthesiology. NOMESCO Classification of Surgical Procedures (NSCP) is used as operation classification and ICD-10 as the diagnosis, if this is provided.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **decision_date** [*date*] Date when the decision to operate was made
* **operation_date** [*date*] Date when the opeartion was performed
* **emergency** [*smallint*] 1 if emergency or not planned operation, 0 if an elective surgery
* **main_operation** [*smallint*] 1 if the code is for main operation, 0 if it is a secodary operation
* **asa_class** [*integer*] ASA class for the operation, integer from 1 to 4
* **ncsp_code** [*varchar(20)*] Classification code for the surgery
* **diagnosis_code** [*varchar(20)*] Disease diagnosis

### *pathology_data*

Pathology table provides structure for basic information about pathology analysis. As some of the results or clinical background information can be extremely long texts, these are stored as text datatype.

* **id** [*serial*] Row identifier, primary key
* **pseudonym** [*varchar(20)*] Patient identifier
* **question** [*text*] The main clinical question and background information about the sample
* **answer** [*text*] Textual result of the analysis
* **answer_id** [*text*] Identifier for analysis
* **assay_type** [*varchar(512)*] Analysis type code
* **date\_of\_sampling** [*date*] Date of taking the sample to be analyzed
* **sender** [*varchar(512)*] The name of the sending organization / clinicial

### Data import

Data import functions depends on the data source. As some data in initial research setting for CLOBNET is automatically synced to SQL, only additional SQL scripts are needed to finish the ETL process. If data comes from external file, good point of file dumping is import/ folder, to where all the import scripting can be targeted.

### Data export

Default export script is **export.sql** inside sql/ folder. All of the *_data* tables are exported as their own CSV files to the export/ folder. This can be triggered from Postgres with command:

	# \i /<clobnet-path>/sql/export.sql

or from UNIX shell using **export.sh** at CLOBNET root folder. This script also packs the CSV files to a zip archive:

	$ sh export.sh

### Connecting GUI to database

The automatic initialization script **create\_and\_parse\_all\_tables.sql** grants select rights to user **php** by default. User credentials for GUI db connections are stored in web/src/includes/db-connect.php. For connection, following script from **db-connect-template.php** should be copied or renamed to **db-connect.php** and credentials filled.

	<?php
	    $host = "host = <IP adress>";
	    $port = "port = <Port>";
	    $dbname = "dbname = <DB name>";
	    $credentials = "user = <User> password=<password>";
	    $db = pg_connect( "$host $port $dbname $credentials");    
	?>

### Connecting Python to database

Similarly to connecting GUI to the database, Python connection is managed by setup file **db\_connection.py** in machine_learning/ folder. Connection is handled with psycopg2 library. Tempalte file is **db\_connection\_template.py**:

	import psycopg2

	conn = psycopg2.connect("host=<IP address> dbname=<DB name> user=<User> password=<password>")

Once the connection file is set up, this can be imported to Python scripts using the database connection:

	from db_connect import conn as conn

Depending on data handling purposes, additional right may have to be added for Python user. When allowing inserting rights, also rights to alter associated serial in postgres is needed.

## Machine Learning

Machine learning is done using Python 2.7 with scikit-learn library. CLOBNET utilizes multiple different data-analysis libraries, which are not usually readily installed with Python. These can be installed using for example *pip* on Ubuntu:

	pip install numpy scipy matplotlib pandas psycopg2 scikit-learn

### Model training *model_training.py*

Main script for model training is **model_training.py**. This scirpt accesses the database, makes model trainings set up inside the file and prints out model performances, stores them to SQL and also stores the models as pickles. Performance thresholds for model storing and information printing can be set.

#### *dumpClassificator(clf)*

Function to dump the clasificator information to SQL and pickle it. If the model is a decision tree, also tree structure is exported as .dot and sh script to convert this file to png is called. Input *clf* is a scikit-learn model. Function uses also global variables scalename, currentName, currentPrediction, currentSQL, currentAUC, currentSensitivity, currentSpecificity, currentDatasetSize, currentTrainingsetSize, currentTestingsetSize, currentScaling, currentCrossvalidation, lastid, currentAUCData, pickle and dataset_id.

#### *generateDataset(target, restrictions, input_labels, testset_size, label)*

This function generates the dataset to be used in model training. The inputs are:

* **target** [*tuple of strings*] tuple of positive samples and all the samples wanted
	* **positive samples** [*string*] SQL query, which should be true on only the positive cases
	* **all the samples** [*string*] SQL query, which should be true on all the cases
* **restrictions** [*string*] SQL query, which restricts the datset, for example 'ca125 > 0'
* **input_labels** [*array of string*] names of columns to be loaded fron SQL
* **testset_size** [*float from 0 to 1 *] Part of the dataset to be used as a testing set
* **label** [*string*] Name for the prediction
* **dataset_id** id of the dataset used

The function also saves a copy of the used dataset to SQL table *datasets*. If an identical dataset is already stored in the database, its id is reused alongside with classificator dump.

#### *testModel(clf)*

Test given function and if thresholds are topped, also runs *dumpClassificator* function. Runs both LOOCV and testing set cross-validations
