--Include different creation scripts

\i /clobnet/v0.8/sql/create_clinical_table.sql;
\i /clobnet/v0.8/sql/create_laboratory_table.sql;
\i /clobnet/v0.8/sql/create_height_weight_table.sql;
\i /clobnet/v0.8/sql/create_operations_table.sql;
\i /clobnet/v0.8/sql/create_diagnoses_table.sql;
\i /clobnet/v0.8/sql/create_pathology_table.sql;
\i /clobnet/v0.8/sql/create_medication_table.sql;
\i /clobnet/v0.8/sql/create_datasets_table.sql;
\i /clobnet/v0.8/sql/create_chemotherapy_table.sql;

--Parse data into these tables (project / input spesific stuff)

\i /clobnet/v0.8/sql/parse_clinical.sql;
\i /clobnet/v0.8/sql/parse_laboratory.sql;
\i /clobnet/v0.8/sql/parse_height_weight.sql;
\i /clobnet/v0.8/sql/parse_operations.sql;
\i /clobnet/v0.8/sql/parse_diagnoses.sql;
\i /clobnet/v0.8/sql/parse_pathology.sql;
\i /clobnet/v0.8/sql/parse_medication.sql;
\i /clobnet/v0.8/sql/parse_chemotherapy.sql;

--Grant rights for frontend to read these tables

GRANT SELECT ON clinical_data TO php;
GRANT SELECT ON laboratory_data TO php;
GRANT SELECT ON height_weight_data TO php;
GRANT SELECT ON operations_data TO php;
GRANT SELECT ON diagnoses_data TO php;
GRANT SELECT ON pathology_data TO php;
GRANT SELECT ON medication_data TO php;
GRANT SELECT ON chemotherapy_data TO php;
GRANT SELECT, INSERT ON datasets TO php;