
var pg = require('pg');


var client = new pg.Client('postgres://postgres:postgres@localhost/mame-highscores-sails');

function encode_utf8(s) {
  var j = JSON.stringify(s);
  return j.substring(1, j.length - 1);
}


client.connect(function(err) {

  var test = [1,2,3,4,5,6,7,8,9,10];
  //for(i = 0; i< 10000; i++){
  //test.forEach(function(bla){
    var bad = 'A\u0000\u0000æ';
    var good = encode_utf8(bad);
    console.log(bad);
    console.log(good);
    //console.log(gooder);
    client.query('INSERT INTO game (name) VALUES ($1) returning id', [good], function(foo, bar){
      console.log('first query')
      console.log(bar);
      console.log(foo);

      client.query('INSERT INTO score (game_id, name) VALUES ($1, $2) returning id', [bar.rows[0].id, 'test'], function(foo2, bar2){
        console.log('second query')

        console.log(bar2)

      });

    });
  //});
  //}
});






