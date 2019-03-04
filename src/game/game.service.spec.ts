import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from '../entity/game.entity';
import { Machine } from '../entity/machine.entity';
import { GamePlayed } from '../entity/gameplayed.entity';
import { User } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScoredecoderService } from "../scoredecoder/scoredecoder.service";
import { Repository } from "typeorm";
import { Score } from "../entity/score.entity";
import * as assert from 'assert';
// let assert = require('assert');

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
         GameService,
        { provide: getRepositoryToken(Game), useClass: Repository,},
        { provide: getRepositoryToken(GamePlayed), useClass: Repository,},
        { provide: getRepositoryToken(Score), useClass: Repository,},
        { provide: getRepositoryToken(User), useClass: Repository,},
        { provide: getRepositoryToken(Machine), useClass: Repository,},
        ScoredecoderService
      ],
    }).compile();

    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });

  describe('#filterScores()', function () {

    it('no existing scores should not filter any scores', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
      ];

      var existingScores = [];

      var filteredScores = gameService.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, newScores, 'should not have filtered any scores');

    });

    it('should filter if there are the same existing scores ', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
      ];

      var existingScores = [{name: 'ABC', score: '123'},];

      var expectedScores = [
        {name: 'TEST', score: '1234'},
      ];

      var filteredScores = gameService.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered existing scores');

    });

    it('should filter duplicate new scores', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var existingScores = [];

      var expectedScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'BOB', score: '222'},
      ];

      var filteredScores = gameService.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered duplicate scores');

    });

    it('should filter both existing scores and duplicate new scores', function () {

      var newScores = [
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'TEST', score: '1234'},
        {name: 'ABC', score: '123'},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var existingScores = [{name: 'ABC', score: '123'}];

      var expectedScores = [
        {name: 'TEST', score: '1234'},
        {name: 'BOB', score: '222'},
      ];

      var filteredScores = gameService.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered duplicate scores');

    });

    it('should filter scores with empty scores', function () {

      var newScores = [
        {name: 'TEST', score: ''},
        {name: 'ABC', score: '0'},
        {name: 'TEST', score: '0'},
        {name: 'ABC', score: ''},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var existingScores = [{name: 'ABC', score: '123'}];

      var expectedScores = [
        {name: 'ABC', score: '0'},
        {name: 'TEST', score: '0'},
        {name: 'BOB', score: '222'},
        {name: 'TEST', score: '1234'},
      ];

      var filteredScores = gameService.filterScores(newScores, existingScores);

      assert.deepEqual(filteredScores, expectedScores, 'should have filtered duplicate scores');

    });

  });

  //I think for this the easies is to just get the unique user's scores
  //that have been beaten by the top score
  //TODO: clean up the test data
  describe('#getBeatenScores()', function () {

    //most basic test to see if the structure is correct
    it('should return the correct structure', function(){

      var newScores = [{ id: 2, score: '200', name: 'BAR', alias: 2 }];

      var afterAddedScores = [
        { id: 2, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 }
      ];

      var expectedBeatenScores = {
        //game: { id: 1, name: 'test', full_name: 'Test'},
        beatenBy: { id: 2, score: '200', name: 'BAR', alias: 2 },
        beaten: [{ id: 1, score: '100', name: 'FOO', alias: 1 }]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    it('should always show the top score with that has a user', function(){

      var newScores = [
        { id: 4, score: '300', name: 'BOB', alias: null },
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var afterAddedScores = [
        { id: 4, score: '300', name: 'BOB', alias: null },
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '200', name: 'BAR', alias: 2 },
        beaten: [{ id: 1, score: '100', name: 'FOO', alias: 1 }]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    it('should not beat the same user more than once', function(){
      var newScores = [
        { id: 9, score: '9000', name: 'BOB', alias: 5 },
      ];

      var afterAddedScores = [
        { id: 9, score: '9000', name: 'BOB', alias: 5 }, //new score
        { id: 8, score: '800', name: 'FOO', alias: 1 },
        { id: 7, score: '700', name: 'FOO', alias: 1 },
        { id: 6, score: '600', name: 'BAR', alias: 2 },
        { id: 5, score: '500', name: 'ROW', alias: 4 }, //only beat the top 5
        { id: 4, score: '400', name: 'BAR', alias: 2 },
        { id: 3, score: '300', name: 'JIM', alias: 3 },
        { id: 2, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 9, score: '9000', name: 'BOB', alias: 5 },
        beaten: [
          { id: 8, score: '800', name: 'FOO', alias: 1 },
          { id: 6, score: '600', name: 'BAR', alias: 2 },
          { id: 5, score: '500', name: 'ROW', alias: 4 },
          /*{ id: 3, score: '300', name: 'JIM', alias: 3 }*/]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    it('should not beat yourself', function(){
      var newScores = [
        { id: 3, score: '300', name: 'BOB', alias: 2 },
        { id: 2, score: '200', name: 'BOB', alias: 2 }];

      var afterAddedScores = [
        { id: 3, score: '300', name: 'BOB', alias: 2 },
        { id: 2, score: '200', name: 'BOB', alias: 2 },
        { id: 1, score: '100', name: 'BAR', alias: 1 },
        { id: 4, score: '50', name: 'BOB', alias: 2 }];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '300', name: 'BOB', alias: 2 },
        beaten: [
          { id: 1, score: '100', name: 'BAR', alias: 1 }]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    //TODO: redo this test as we have changes it to the top 5 instead of top 10
    it('should only beat user if top score', function(){
      var newScores = [
        { id: 6, score: '600', name: 'BAR', alias: 2 },
      ];

      var afterAddedScores = [
        { id: 9, score: '9000', name: 'BOB', alias: 5 },
        { id: 8, score: '800', name: 'FOO', alias: 1 },
        { id: 7, score: '700', name: 'FOO', alias: 1 },
        { id: 6, score: '600', name: 'BAR', alias: 2 }, //new score
        { id: 5, score: '500', name: 'BOB', alias: 5 },
        { id: 4, score: '400', name: 'BAR', alias: 2 },
        { id: 3, score: '300', name: 'JIM', alias: 3 },
        { id: 2, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 6, score: '600', name: 'BAR', alias: 2 },
        beaten: [
          /*{ id: 3, score: '300', name: 'JIM', alias: 3 }*/]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    it('should not beat higher scores', function(){
      var newScores = [
        { id: 3, score: '200', name: 'BAR', alias: 3 },
        { id: 2, score: '50', name: 'BAR', alias: 3 }
      ];

      var afterAddedScores = [
        { id: 4, score: '300', name: 'BOB', alias: 2 },
        { id: 3, score: '200', name: 'BAR', alias: 3 },
        { id: 1, score: '100', name: 'FOO', alias: 1 },
        { id: 2, score: '50', name: 'ROW', alias: 4 },
        { id: 4, score: '20', name: 'BOB', alias: 2 } //this should not get beaten as the user has a higher score than what was newly set
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '200', name: 'BAR', alias: 3 },
        beaten: [
          { id: 1, score: '100', name: 'FOO', alias: 1 },
          { id: 2, score: '50', name: 'ROW', alias: 4 }]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    it('should not beat scores without a user', function(){
      var newScores = [
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var afterAddedScores = [
        { id: 3, score: '200', name: 'BAR', alias: 2 },
        { id: 1, score: '100', name: 'FOO', alias: 1 },
        { id: 2, score: '50', name: 'BIL', alias: null }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 3, score: '200', name: 'BAR', alias: 2 },
        beaten: [{ id: 1, score: '100', name: 'FOO', alias: 1 }]
      };

      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

    it('should only beat top 5 scores', function(){
      var newScores = [
        { id: 12, score: '9000', name: 'BOB', alias: 5 },
      ];

      var afterAddedScores = [
        { id: 12, score: '9000', name: 'BOB', alias: 5 }, //new score
        { id: 11, score: '800', name: 'FOO', alias: 1 },
        { id: 10, score: '700', name: 'FOO', alias: 1 },
        { id: 9, score: '600', name: 'BAR', alias: 2 },
        { id: 8, score: '500', name: 'ROW', alias: 4 },
        { id: 7, score: '400', name: 'BAR', alias: 2 }, //only top 5 beaten now
        { id: 6, score: '300', name: 'JIM', alias: 3 },
        { id: 5, score: '200', name: 'BAR', alias: 2 },
        { id: 4, score: '100', name: 'FOO', alias: 1 },
        { id: 3, score: '90', name: 'CAT', alias: 7 },
        { id: 2, score: '80', name: 'DOG', alias: 8 },
        { id: 1, score: '70', name: 'ABC', alias: 6 }
      ];

      var expectedBeatenScores = {
        beatenBy: { id: 12, score: '9000', name: 'BOB', alias: 5 },
        beaten: [
          { id: 11, score: '800', name: 'FOO', alias: 1 },
          { id: 9, score: '600', name: 'BAR', alias: 2 },
          { id: 8, score: '500', name: 'ROW', alias: 4 },
          /*{ id: 6, score: '300', name: 'JIM', alias: 3 },
          { id: 3, score: '90', name: 'CAT', alias: 7 }*/]
      };


      var actualBeatenScores = gameService.getBeatenScores(newScores, afterAddedScores);

      //console.log(actualBeatenScores);
      //console.log(expectedBeatenScores);
      assert.deepEqual(actualBeatenScores, expectedBeatenScores, 'Invalid beaten scores');
    });

  });
});
