DROP TABLE IF EXISTS pathology_data;
CREATE TABLE pathology_data (
	id SERIAL,
	pseudonym VARCHAR(20),
	question TEXT,
	answer TEXT,
	answer_id INT,
	assay_type VARCHAR(512),
	date_of_sampling DATE,
	sender VARCHAR(512)
);