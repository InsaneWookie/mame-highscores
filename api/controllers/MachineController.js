/**
 * MachineController
 *
 * @description :: Server-side logic for managing Machines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * Generates a new api key for the machine
   * @param req
   * @param res
   */
  new_key: function(req, res){

    var params = req.allParams();
    var machineId = params.id;

    //TODO: check that the user has access to this machine

    var newApiKey = Machine.generateApiKey();

    Machine.update(machineId, { api_key: newApiKey }).exec(function(err, machines){
      if(err) { return res.serverError(err); }

      res.json(machines[0]);
    });
  }
};

