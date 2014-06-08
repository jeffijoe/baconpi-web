/**
 * Agent
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    deviceName: {
      type: 'string',
      required: true
    },
    macAddress: {
      type: 'string',
      required: true,
      unique: true
    },
    userId: {
      type: 'string',
      required: true
    }
  }

};
