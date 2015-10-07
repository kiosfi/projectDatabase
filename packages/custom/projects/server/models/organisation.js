'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Project = require('./project.js');

  var OrganisationSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    representative: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    tel: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    website: {
      type: String,
      required: true,
      trim: true
    }
  });

  mongoose.model('Organisation', OrganisationSchema);
