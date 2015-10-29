'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var ProjectSchema = new Schema({
    project_ref: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    coordinator: {
      type: String,
      required: true
    },
    organisation: {
        type: Schema.ObjectId,
        ref: 'Organisation',
        required: true
    },
    state: {
        type: String,
        default: 'rekisteröity',
        required: true
    },
    reg_date: {
        type: Date,
        default: Date.now
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
    },
    description_en: {
        type: String,
        required: true,
        trim: true
    },
    categories: {
        type: Array
    },
    background: {
        type: String,
        required: true,
        trim: true
    },
    beneficiaries: {
        type: String,
        required: true,
        trim: true
    },
    gender_aspect: {
        type: String,
        required: true,
        trim: true
    },
    project_goal: {
        type: String,
        required: true,
        trim: true
    },
    sustainability_risks: {
        type: String,
        required: true,
        trim: true
    },
    reporting_evaluation: {
        type: String,
        required: true,
        trim: true
    },
    other_donors_proposed: {
        type: String,
        required: false,
        trim: true
    },
    dac: {
        type: String,
        required: true,
        trim: true
    },
    region: {
        type: String,
        required: true,
        trim: true
    },
    in_review: {
      type: Schema.ObjectId,
      ref: 'InReview'
    },
    approved: {
      type: Schema.ObjectId,
      ref: 'Approved'
    },
    rejected: {
      type: Schema.ObjectId,
      ref: 'Rejected'
    },
    signed: {
      type: Schema.ObjectId,
      ref: 'Signed'
    },
    intermediary_report: {
      type: Schema.ObjectId,
      ref: 'IntReport'
    },
    end_report: {
      type: Schema.ObjectId,
      ref: 'EndReport'
    },


});

ProjectSchema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: 'project_ref',
    startAt: 15000
});

ProjectSchema.path('title').validate(function (title) {
    return !!title;
}, 'Nimi ei voi olla tyhjä');

ProjectSchema.path('coordinator').validate(function (coordinator) {
    return !!coordinator;
}, 'Koordinaattorin nimi ei voi olla tyhjä');

ProjectSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate({path: 'organisation', model: 'Organisation'})
    .exec(cb);
};

mongoose.model('Project', ProjectSchema);
