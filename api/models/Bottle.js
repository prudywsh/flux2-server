/**
 * Bottle.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

      name : {
          type: 'string',
          required: true,
      },

      shortName: {
          type: 'string',
          required: true,
          unique: true
      },

      quantityPerBox: {
          type: 'integer',
          required: true,
      },

      sellPrice: {
          type: 'integer',
          required: true,
      },

      supplierPrice: {
          type: 'integer',
          required: true,
      },

      originalStock: {
          type: 'integer',
          required: true,
      },

  },

};

