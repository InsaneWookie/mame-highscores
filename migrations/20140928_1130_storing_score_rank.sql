ALTER TABLE score ADD COLUMN rank INTEGER;

UPDATE score s SET rank = r.rank
FROM (SELECT id, rank()
      OVER (PARTITION BY game_id
      ORDER BY (0 || regexp_replace(score, E'[^0-9]+','','g'))::bigint DESC ) as rank
      FROM
      score ) r
WHERE s.id = r.id;