
Getting started

Docker:

docker-compose up -d

Start backend

`npm install -g sails`

`sails lift`

Watch frontend changes

`npm install -g @angular/cli`

`cd frontend`

`ng serve --host 0.0.0.0 --watch --poll 1000 --proxy-config proxy.conf.json`



Create database 
`docker-compose exec db psql -U postgres -c "create database \"mame-highscores\""`


Load schema
`docker-compose exec -T db psql -U postgres -d "mame-highscores" < schema.sql`
`docker-compose exec -T db psql -U postgres -d "mame-highscores" < 20140928_1130_storing_score_rank.sql`
`docker-compose exec -T db psql -U postgres -d "mame-highscores" < 20141102_1600_add_decoded_on_column.sql`



docker-compose exec app npm install

Deploying

Building front end
`ng build --prod`