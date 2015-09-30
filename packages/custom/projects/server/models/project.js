'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  coordinator: {
    type: String,
    required: true,
    trim: true
  },
  organisation: {
    type: Schema.ObjectId,
    ref: 'Organisation'
  },
  status: {
    type: String,
    required: true,
    trim: true
  },
  reg_date: {
    type: String,
    required: true
  },
  funding: {
    applied_curr_local: {
      type: String,
      required: true,
      trim: true
    },
    applied_curr_eur: {
      type: String,
      required: true,
      trim: true
    },
    granted_curr_local: {
      type: String,
      required: false,
      trim: true
    },
    granted_curr_eur: {
      type: String,
      required: false,
      trim: true
    }
  },
  duration_months: {
    type: Number,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

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

ProjectSchema.path('title').validate(function(title) {
  return !!title;
}, 'Nimi ei voi olla tyhjä');

ProjectSchema.path('coordinator').validate(function(coordinator) {
  return !!coordinator;
}, 'Koordinaattorin nimi ei voi olla tyhjä');

ProjectSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate({path: 'organisation', model: 'Organisation'}).exec(cb);
};

mongoose.model('Project', ProjectSchema);
mongoose.model('Organisation', OrganisationSchema);
