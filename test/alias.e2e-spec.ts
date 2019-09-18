import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, getRepository, Repository } from "typeorm";
import { Group } from "../src/entity/group.entity";
import { Game } from "../src/entity/game.entity";
import { Machine } from "../src/entity/machine.entity";
import { User } from "../src/entity/user.entity";
import { UserGroup } from "../src/entity/usergroup.entity";
import { Alias } from "../src/entity/alias.entity";
import * as path from "path";
import { GamePlayed } from "../src/entity/gameplayed.entity";
import { Score } from "../src/entity/score.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from "../src/auth/auth.module";
import { GameModule } from "../src/game/game.module";
import { UserModule } from "../src/user/user.module";
import { GroupModule } from "../src/group/group.module";
import { AliasModule } from "../src/alias/alias.module";
import { ScoreModule } from "../src/score/score.module";
import { ConfigModule } from "../src/config/config.module";
import * as assert from "assert";
import { AppController } from "../src/app.controller";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppLogger } from "../src/applogger.service";
import { GameService } from '../src/game/game.service';
import * as request from 'supertest';
import { AliasController } from "../src/alias/alias.controller";
import { AliasService } from "../src/alias/alias.service";
import { ScoreService } from "../src/score/score.service";
import { ScoredecoderService } from "../src/scoredecoder/scoredecoder.service";
import { JwtPayload } from "../src/auth/jwt-payload.interface";
import { PassportModule } from "@nestjs/passport";

async function fixtureSetup(gameData){

  const groupRepo = getRepository(Group);
  const gameRepo = getRepository(Game);
  const machineRepo = getRepository(Machine);
  const userRepo = getRepository(User);
  const userGroupRepo = getRepository(UserGroup);
  const aliasRepo = getRepository(Alias);


  let group = new Group();
  group.name = 'Test Group';
  await groupRepo.save(group);

  let game = new Game();
  Object.assign(game, gameData);
  await gameRepo.save(game);

  let machine = Object.assign(new Machine(), {name: 'Test machine', group: group, api_key: '1A2B3C'});
  // let machine2 = Object.assign(new Machine(), {name: 'Test machine 2', group: group, api_key: 'abc123'});
  await machineRepo.save([machine]);

  let user = new User();
  user.username = 'test1';
  user.email = 'test1@example.com';
  await userRepo.save(user);

  let userGroup = new UserGroup();
  userGroup.group = group;
  userGroup.user = user;
  await userGroupRepo.save(userGroup);

  let alias = new Alias();
  alias.userGroup = userGroup;
  alias.name = 'ABC';
  await aliasRepo.save(alias);
}


describe('AliasController (e2e)', () => {
  let app;
  let jwtService;
  // let gameService : GameService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'test',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),

        TypeOrmModule.forRoot({
          "type": "postgres",
          "host": "db",
          "port": 5432,
          "username": "postgres",
          "password": "example",
          "database": "mame-highscores-test",
          "entities": [
            path.join(__dirname + "/../src/**/**.entity{.ts,.js}")
          ],
          "migrations": ["src/migration/*{.ts,.js}"],
          "synchronize": false,
          "cli": {
            "entitiesDir": "src",
            "migrationsDir": "src/migration"
          },
          "logging": true
        }),
        TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),
        AuthModule,
        GameModule,
        UserModule,
        GroupModule,
        AliasModule,
        ScoreModule,
        ConfigModule,
      ],
      controllers: [AliasController],
      providers: [AppLogger, AliasService, GameService, ScoreService, ScoredecoderService, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);

  });

  beforeEach(async () => {

    await getConnection().query('TRUNCATE TABLE score RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE rawscore RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE alias RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE gameplayed RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE game RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE machine RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE "group" RESTART IDENTITY CASCADE');
    await getConnection().query('TRUNCATE TABLE "user_group" RESTART IDENTITY CASCADE');

    const gameData = {
      name: 'zerowing',
      has_mapping: true
    };

    await fixtureSetup(gameData);
  });



  it('/api/v1/alias (POST) delete alias without scores', async () => {

    const user: JwtPayload = {
      userId: 1,
      groupId: 1
    };

    // console.log(user);
    const accessToken = jwtService.sign(user);
    // console.log(accessToken);

    return await request(app.getHttpServer())
      .post('/api/v1/alias/delete')
      .set('Authorization', 'Bearer ' + accessToken)
      .send([{"id": 1,"name":"ABC"}])
      .expect(201)
      //.expect('Hello World!');
  });

  it('/api/v1/alias (POST) delete alias with score', async () => {

    let alias = getRepository(Alias).findOne(1);

    let score = Object.assign(new Score(), {name: 'ABC', score: '1234', alias: 1, game: 1, machine: 1});

    await getRepository(Score).save(score);

    const user: JwtPayload = {
      userId: 1,
      groupId: 1
    };

    // console.log(user);
    const accessToken = jwtService.sign(user);
    // console.log(accessToken);

    return await request(app.getHttpServer())
      .post('/api/v1/alias/delete')
      .set('Authorization', 'Bearer ' + accessToken)
      .send([{"id": 1,"name":"ABC"}])
      .expect(201)
    //.expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
