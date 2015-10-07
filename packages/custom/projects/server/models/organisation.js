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
    },
    legal_status: {
        type: String,
        required: true,
        trim: true
    },
    history_status: {
        type: String,
        required: true,
        trim: true
    },
    int_links: {
        type: String,
        required: true,
        trim: true
    },
//    prev_projects: {
//        type: Array,
//        required: true
//    }
    bank_account: {
        type: Schema.ObjectId,
        ref: 'BankAccount'
    }
  });
  
  var BankAccountSchema = new Schema({
      bank_contact_details: {
          type: String,
          required: true,
          trim: true
      },
      iban: {
          type: String,
          required: true,
          trim: true
      },
      swift: {
          type: String,
          required: true,
          trim: true
      },
      holder_name: {
          type: String
      }
  });

  mongoose.model('Organisation', OrganisationSchema);
  mongoose.model('BankAccount', BankAccountSchema);
