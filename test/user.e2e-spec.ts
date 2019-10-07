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
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from "../src/applogger.service";
import { UserService } from "../src/user/user.service";
import { JwtPayload } from "../src/auth/jwt-payload.interface";
import * as request from 'supertest';
import { UserController } from "../src/user/user.controller";
import { PassportModule } from "@nestjs/passport";
import { LoggerModule } from "../src/logger.module";


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


describe('UserController (e2e)', () => {
  let app;
  let jwtService;
  let userService : UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
          }
        }),
        TypeOrmModule.forFeature([Game, Machine, GamePlayed, User, Score, Group, UserGroup, Alias]),
        AuthModule,
        // GameModule,
        // UserModule,
        // GroupModule,
        // AliasModule,
        // ScoreModule,
        // ConfigModule,
        LoggerModule
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    userService = moduleFixture.get<UserService>(UserService);
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



  it.skip('/api/v1/user (DELETE) delete user', async () => {

    const user: JwtPayload = {
      userId: 1,
      groupId: 1
    };

    //enable admin on logged in user
    const u = await userService.findOne(1,1);
    u.isAdmin = true;
    await userService.save(u);

    //create new user
    let user2 = new User();
    user2.username = 'test2';
    user2.email = 'test2@example.com';
    user2.password = 'password';
    await userService.save(user2, 1);

    // console.log(user);
    const accessToken = jwtService.sign(user);
    // console.log(accessToken);

    await request(app.getHttpServer())
      .delete('/api/v1/user/2')
      .set('Authorization', 'Bearer ' + accessToken)
      //.send([{"id": 1,"name":"ABC"}])
      .expect(200);
    //.expect('Hello World!');

    const deleteUser = await userService.findOne(user2.id, 1);

    assert.strictEqual(deleteUser, undefined);


  });

  // it('/api/v1/alias (POST) delete alias with score', async () => {
  //
  //
  // });

  afterAll(async () => {
    await app.close();
  });
});
