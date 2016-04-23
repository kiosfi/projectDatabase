'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var ProjectSchema = new Schema({

    /**
     * This piece of metadata tells the version number of the scheme. It is used
     * for updating old entries to the newest version during runtime.
     */
    schema_version: {
        type: Number, // Current version is 4.
        required: true,
        default: 4
    },
    /**
     * Security level of the project. The value should be one of the following
     * strings: "Julkinen" (public), "Luottamuksellinen" (confidential) or
     * "Salainen" (secret). For the time being, this is just a string and
     * doesn't affect access control.
     */
    security_level: {
        type: String,
        required: true,
        default: "Julkinen"
    },
    /**
     * Reference number of the project. It's an integer whose two first (most
     * significant) digits specify the year in which the project applied for
     * funding and last three (least significant) digits are a number
     * identifying the project against projects with same year of application.
     */
    project_ref: {
        type: String,
        required: true
    },
    /**
     * Title of the project.
     */
    title: {
        type: String,
        required: true,
        trim: true
    },
    /**
     * Name of the coordinator of the project.
     */
    coordinator: {
        type: String,
        required: true
    },
    /**
     * ID of the organisation in charge of this project.
     */
    organisation: {
        type: Schema.ObjectId,
        ref: 'Organisation',
        required: true
    },
    /**
     * State of the project. Must be one of the following strings:
     * "rekisteröity" (registered), "käsittelyssä" (processing), "hyväksytty"
     * (approved), "hylätty" (denied), "allekirjoitettu" (signed),
     * "väliraportti" (intermediary report), "loppuraportti" (final report),
     * "päättynyt" (ended).
     */
    state: {
        type: String,
        default: 'rekisteröity',
        required: true
    },
    /**
     * Date when the application was filed.
     */
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
        type: Array
    },
    /**
     * The Finnish version of this field was previously known as "Tausta".
     * Currently, the name of the field is "Ihmisoikeuskonteksti" though.
     */
    background: {
        type: String,
        trim: true
    },
    /**
     * This field contains a textual description on the target group of the
     * project.
     *
     * Before schema version 4, this field was known as "beneficiaries". It has
     * been renamed to avoid confusion with the fields in end_report state.
     */
    target_group: {
        type: String,
        trim: true
    },
    /**
     * The Finnish translation of this field was previously known as
     * "Gender-analyysi" (hence the naming), but is now known as
     * "Tasa-arvonäkökulma ja muut läpileikkaavat teemat", which is a broader
     * topic.
     */
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
        /**
         * Since schema version 3, this file is used for the proposed end
         * resolution for the project.
         */
        comments: {
          type: String
        },
        /**
         * The estimated number of people, whom this project has directly helped.
         */
        direct_beneficiaries: {
            type: Number,
            trim: true
        },
        /**
         * The estimated number of people, who have received indirect benefits
         * from this project.
         */
        indirect_beneficiaries: {
            type: Number,
            trim: true
        },
        /**
         * A numerical grade for the success of the project. The grading system
         * is as follows: 4 (succeeded better than anticipated), 3 (succeeded
         * as planned), 2 (did not succeed as planned due to an external cause),
         * 1 (did not succeed as planned due to neglection by the organisation).
         */
        grade: {
            type: Number,
            trim: true
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
    },
    /**
     * An array containing paths of the appendix files of a project.
     */
    appendices: {
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
