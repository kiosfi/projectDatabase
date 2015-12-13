'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    project_ref: {
        type: String,
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
            type: Number
        },
        applied_curr_eur: {
            type: Number
        },
        paid_eur: {
            type: Number
        },
        left_eur: {
            type: Number
        }
    },
    duration_months: {
        type: Number,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    description_en: {
        type: String,
        trim: true
    },
    methods: {
        type: Array,
    },
    background: {
        type: String,
        trim: true
    },
    beneficiaries: {
        type: String,
        trim: true
    },
    gender_aspect: {
        type: String,
        trim: true
    },
    project_goal: {
        type: String,
        trim: true
    },
    sustainability_risks: {
        type: String,
        trim: true
    },
    reporting_evaluation: {
        type: String,
        trim: true
    },
    other_donors_proposed: {
        type: String,
        trim: true
    },
    dac: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    in_review: {
        date: {
          type: Date
        },
        user: {
          type: String
        },
        comments: {
          type: String
        }
    },
    approved: {
        date: {
          type: Date
        },
        user: {
          type: String
        },
        approved_date: {
          type: Date
        },
        approved_by: {
          type: String
        },
        board_notified: {
          type: Date
        },
        granted_sum_eur: {
          type: Number
        },
        themes: {
          type: Array
        }
    },
    rejected: {
        date: {
          type: Date
        },
        user: {
          type: String
        },
        rejection_categories: {
          type: Array
        },
        rejection_comments: {
          type: String
        }
    },
    signed: {
        date: {
          type: Date
        },
        user: {
          type: String
        },
        signed_by: {
          type: String
        },
        signed_date: {
          type: Date
        },
        planned_payments: {
          type: Array
        },
        intreport_deadlines: {
          type: Array
      }
    },
    payments: {
      type: Array
    },
    intermediary_reports:
    {
      type: Array
    },
    end_report: {
        date: {
          type: Date
        },
        user: {
          type: String
        },
        audit: {
            date: {
              type: Date
            },
            review: {
              type: String
            }
        },
        approved_by: {
          type: String
        },
        approved_date: {
          type: Date
        },
        general_review: {
          type: String
        },
        methods: {
          type: Array
        },
        objective: {
          type: String
        },
        comments: {
          type: String
        },
        processed: {
          type: Boolean,
          default: false
        }
    },
    ended: {
        date: {
          type: Date
        },
        user: {
          type: String
        },
        end_date: {
          type: Date
        },
        board_notified: {
          type: Date
        },
        approved_by: {
          type: String
        },
        other_comments: {
          type: String
      }
    },
    updated: {
        type: Array
    }

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
    }).populate([
        {path: 'organisation', model: 'Organisation'}
      ]).exec(cb);
};

mongoose.model('Project', ProjectSchema);
