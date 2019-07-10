\COPY laboratory_data TO '/clobnet/v0.8/export/laboratory_data.csv' DELIMITER ',' CSV HEADER;
\COPY diagnoses_data TO '/clobnet/v0.8/export/diagnoses_data.csv' DELIMITER ',' CSV HEADER;
\COPY operations_data TO '/clobnet/v0.8/export/operations_data.csv' DELIMITER ',' CSV HEADER;
\COPY clinical_data TO '/clobnet/v0.8/export/clinical_data.csv' DELIMITER ',' CSV HEADER;
\COPY height_weight_data TO '/clobnet/v0.8/export/height_weight_data.csv' DELIMITER ',' CSV HEADER;
\COPY pathology_data TO '/clobnet/v0.8/export/pathology_data.csv' DELIMITER ',' CSV HEADER;