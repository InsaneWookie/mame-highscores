
## Installation

```bash
$ npm install
```

## Getting Started
Looks like some fuctionality doesn't work with the latest version of Node so using docker is the best option for now


```bash
#start services
docker-compose up  

#create databaes
docker-compose exec db psql -U postgres -c "create database \"mame-highscores\""

#insert a game record
docker-compose exec db psql -U postgres -c "INSERT INTO game VALUES (1, 'dkong', 'Donkey Kong (US set 1)', true, '2014-09-26 06:29:30.450146+00', 13, NULL, NULL, '2014-09-26 06:29:30.450146+00', 'd', '{\"score\",\"name\"}', '{\"by\":\"score\",\"order\":\"desc\"}', '1981', '2014-07-03 05:08:51.073+00', '2014-07-03 05:08:51.073+00');" "mame-highscores"

#easiest to shell into the container
docker exec -it mame-highscores_app_1 bash

#once in th container 

#start the backend 
npm install
npm run migrate
npm run start:dev


#create another shell into the container
docker exec -it mame-highscores_app_1 bash

#start the frontend
cd frontend
npm install
npm run start
```

Visit browser at http://localhost:4200

Sign up and create a new user for the default group. Invite code is: `abc123`


## Test

create test database
docker-compose exec db psql -U postgres -c "create database \"mame-highscores-test\""
migrate test db
npm run migrate -- -c test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

##Frontend

See README.md in `frontend` folder

