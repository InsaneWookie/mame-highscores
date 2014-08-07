/**
* Score.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: 'string',
  	score: 'string',

  	 game: {
  	 	model: 'Game',
        columnName: 'game_id'
  	 },

  	 alias: { 
  	 	model: 'Alias',
  	 	columnName: 'alias_id'
  	 },

  	toJSON: function() {
	    var obj = this.toObject();
	    //if(!Array.isArray(obj.game)){
	    //	delete obj.game;
	  	//}
	    //delete obj.user;
	    return obj;
    }
  }

  
  
};

