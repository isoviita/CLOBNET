--This is a test file for pathology text natural language processing

DROP TABLE IF EXISTS pathology_sentences;
CREATE TABLE pathology_sentences (
id serial,
pathology_id int,
sentence text

);

DROP TABLE IF EXISTS pathology_similarity;
CREATE TABLE pathology_similarity (
id serial,
pathology_id_1 int,
pathology_id_2 int,
similarity float

);

--Extract sentences from the text
INSERT INTO pathology_sentences (
pathology_id,
sentence
)

SELECT patologia_vastaus_id, unnest(string_to_array(lausuntoteksti, '. ')) FROM patologia_tutkimus_vastaus;

DELETE from pathology_sentences WHERE length(sentence) < 6;

GRANT ALL ON pathology_similarity TO php;
GRANT ALL ON pathology_sentences TO php;