
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

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

