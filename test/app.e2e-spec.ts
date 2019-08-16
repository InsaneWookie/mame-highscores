import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection, getRepository } from "typeorm";
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
import { PassportModule } from '@nestjs/passport';
import * as assert from "assert";
import { AppController } from "../src/app.controller";
import { JwtPayload } from "../src/auth/jwt-payload.interface";
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from "../src/applogger.service";
import { UserService } from "../src/user/user.service";
import { AuthService } from "../src/auth/auth.service";
import { GroupService } from "../src/group/group.service";
import { MachineService } from "../src/machine/machine.service";
import { JwtStrategy } from "../src/jwt.strategy";
import { MailerService } from "../src/mailer/mailer.service";

describe('AppController (e2e)', () => {
  let app;
  let jwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          "type": "postgres",
          "host": "192.168.99.100",
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
        GameModule,
        UserModule,
        GroupModule,
        AliasModule,
        ScoreModule,
        ConfigModule,
      ],
      controllers: [AppController],
      providers: [AppLogger],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    this.jwtService = moduleFixture.get<JwtService>(JwtService);
  });



  it('/api/v1/main (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/api/v1/main')
      .expect(200)
      .expect('Hello World!');
  });

  describe('#uploadScores()', () => {


    beforeEach(async () => {

      await getConnection().query('TRUNCATE TABLE score RESTART IDENTITY CASCADE');
      await getConnection().query('TRUNCATE TABLE alias RESTART IDENTITY CASCADE');
      await getConnection().query('TRUNCATE TABLE game RESTART IDENTITY CASCADE');
      await getConnection().query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
      await getConnection().query('TRUNCATE TABLE machine RESTART IDENTITY CASCADE');
      await getConnection().query('TRUNCATE TABLE "group" RESTART IDENTITY CASCADE');


      var gameData = {
        name: 'zerowing',
        has_mapping: true
      };

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

      let user2 = Object.assign(new User(), {username: 'test2', email: 'mamehighscores+test2@gmail.com'});
      await userRepo.save(user2);
      let userGroup2 = Object.assign(new UserGroup(), {group: group, user: user2});
      await userGroupRepo.save(userGroup2);
      let alias2 = Object.assign(new Alias(), {userGroup: userGroup2, name: 'DEF'});
      await aliasRepo.save(alias2);

      let user3 = Object.assign(new User(), {username: 'group2user', email: 'mamehighscores+group2user@gmail.com'});
      await userRepo.save(user3);
      let userGroup3 = Object.assign(new UserGroup(), {group: group, user: user3});
      await userGroupRepo.save(userGroup3);
      let alias3 = Object.assign(new Alias(), {userGroup: userGroup3, name: 'DEF'});
      await aliasRepo.save(alias3);
    });

    it('/game/upload (POST)',  async () => {

      var bytes = '0000500000005000000048000000460000004400000042000026002600260000000000000026002600260000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      var newBytes = '000050000000550000005400000046000000440000004200000A000B000C000000000000000D000E000F0000000' +
        '000000026002600260000000000000026002600260000000000000026002600260000000000000006000500040003000200140013' +
        '00120011001050';

      // const user: JwtPayload = {
      //   userId: 1,
      //   groupId: 1
      // };

      // console.log(user);
      // const accessToken = this.jwtService.sign(user);
      // console.log(accessToken);

      await request(app.getHttpServer())
        .post('/api/v1/game/upload/1A2B3C').field('gamename', 'zerowing')
        //.set('Authorization', 'Bearer ' + accessToken)
        .attach('game', Buffer.from(bytes, 'hex'), 'zerowing.hi')
        .expect(201)
        .then((data) => {

           // console.log(data.body);
          const savedScores = data.body;
          assert.ok(savedScores.length > 0, 'should have saved some scores');

          assert.equal(savedScores[0].name, '...');
          assert.equal(savedScores[0].score, '50000');
        });

      return await request(app.getHttpServer())
        .post('/api/v1/game/upload/1A2B3C').field('gamename', 'zerowing')
        //.set('Authorization', 'Bearer ' + accessToken)
        .attach('game', Buffer.from(newBytes, 'hex'), 'zerowing.hi')
        .expect(201)
        .then((data) => {

           // console.log(data.body);
          const savedScores = data.body;
          assert.ok(savedScores.length === 2, 'should have saved 2 scores');

          assert.equal(savedScores[0].name, 'ABC');
          assert.equal(savedScores[0].score, '55000');

          assert.equal(savedScores[1].name, 'DEF');
          assert.equal(savedScores[1].score, '54000');
        });
    });

    //
    // describe('#updateHasMapping()', function () {
    //
    //   beforeEach(async function(){
    //
    //     var result1 = await
    //     getConnection().query('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
    //     var result = await
    //     getConnection().query('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
    //     var result2 = await
    //     getConnection().query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);
    //
    //     let a = await gameService.create({name: 'zerowing', has_mapping: false }).fetch();
    //     let b = await gameService.create({ name: 'bob', has_mapping: false }).fetch();
    //
    //   });
    //
    //
    //   it('should update has_mapping from gameMaps', function (done) {
    //
    //     gameService.findOne({name: 'zerowing'}).exec(function(err, game){
    //       assert.ok(!err);
    //       assert.ok(game, 'game not found');
    //       assert.ok(!game.has_mapping);
    //
    //       gameService.updateHasMapping(function(err){
    //         assert.ok(!err);
    //
    //         gameService.findOne({name: 'zerowing'}).exec(function(err, game) {
    //           assert.ok(!err);
    //           assert.ok(game.has_mapping);
    //
    //           done(err);
    //         });
    //       });
    //     });
    //   });
    // });
    //
    //
    // describe('#addRawScores()', function () {
    //
    //   let machine;
    //   beforeEach(async function(){
    //
    //     await getConnection().query('TRUNCATE TABLE score RESTART IDENTITY CASCADE', []);
    //     await getConnection().query('TRUNCATE TABLE alias RESTART IDENTITY CASCADE', []);
    //     await getConnection().query('TRUNCATE TABLE game RESTART IDENTITY CASCADE', []);
    //     await getConnection().query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE', []);
    //     await getConnection().query('TRUNCATE TABLE machine RESTART IDENTITY CASCADE', []);
    //     await getConnection().query('TRUNCATE TABLE "group" RESTART IDENTITY CASCADE', []);
    //
    //
    //     var gameData = {
    //       name: 'zerowing',
    //       has_mapping: false
    //     };
    //
    //
    //     let group = await Group.create({name: 'TestGroup'}).fetch();
    //     await gameService.create(gameData).fetch();
    //     machine = await Machine.create({name: 'Test machine', group: group.id}).fetch();
    //
    //   });
    //
    //   it('should add raw scores to game', async () => {
    //       let game = await gameService.findOne({name: 'zerowing'});
    //       let createdRawScore = await gameService.addRawScores(game, machine, 'DEADBEEF', 'hi');
    //       assert.ok(createdRawScore.id);
    //       assert.ok(createdRawScore.game);
    //   });
    // });


  });

  afterAll(async () => {
    await app.close();
  });
});
