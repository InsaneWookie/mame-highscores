ALTER TABLE game ADD COLUMN decoded_on timestamp with time zone;

UPDATE game SET decoded_on = "createdAt" WHERE has_mapping = true;