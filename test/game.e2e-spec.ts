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
import { GameService } from '../src/game/game.service';
import { GameController } from "../src/game/game.controller";
import { ScoredecoderService } from "../src/scoredecoder/scoredecoder.service";
import { JwtStrategy } from "../src/jwt.strategy";
import { LoggerModule } from "../src/logger.module";
import { PassportModule } from "@nestjs/passport";

describe('AppController (e2e)', () => {
  let app;
  let jwtService;
  let gameService : GameService;

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

        LoggerModule,

        AuthModule


      ],
      controllers: [GameController],
      providers: [GameService, JwtStrategy, ScoredecoderService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    gameService = moduleFixture.get<GameService>(GameService);
  });

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
    let machine2 = Object.assign(new Machine(), {name: 'Test machine 2', group: group, api_key: 'abc123'});
    await machineRepo.save([machine, machine2]);

    let user = new User();
    user.username = 'test1';
    user.email = 'mamehighscores+test1@gmail.com';
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

  describe('#updateScoreAliasesByGame()', () => {

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
    });

    /**
     * Test that linking score to alias works correctly
     */
    it("should update alias", async () => {

       var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

      await fixtureSetup(gameData);

      const scoreRepo : Repository<Score> = getRepository(Score);      

      const gameRepo : Repository<Game> = getRepository(Game); 
      const aliasRepo : Repository<Alias> = getRepository(Alias);
      const machineRepo = getRepository(Machine);
      const game = await gameRepo.findOne({name: gameData.name});
      const alias = await aliasRepo.findOne({name: 'ABC'});
      const machine = await machineRepo.findOne({api_key: '1A2B3C'});

      assert.notStrictEqual(undefined, game);
      assert.notStrictEqual(undefined, alias);
      assert.notStrictEqual(undefined, machine);

      await scoreRepo.save(Object.assign(new Score(), {game, alias: null, name: 'ABC', score: '1234', machine}));

      const score = await scoreRepo.findOne({name: 'ABC', relations: ['alias'] });
      assert.equal(null, score.alias);

      await gameService.updateScoreAliasesByGame(1, game, () => {});

      const updatedScore = await scoreRepo.findOne({name: 'ABC', relations: ['alias'] });

      assert.equal(alias.id, updatedScore.alias.id);

    });

  });

  afterAll(async () => {
    await app.close();
  });
});
