'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Validations
 */
ProjectSchema.path('title').validate(function(title) {
  return !!title;
}, 'Nimi ei voi olla tyhjä');

ProjectSchema.path('status').validate(function(status) {
  return !!status;
}, 'Tila ei voi olla tyhjä');

mongoose.model('Project', ProjectSchema);
