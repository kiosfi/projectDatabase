'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var OrganisationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    /**
     * The current schema version of the project.
     */
    schema_version: {   // Current version is 3.
        type: Number,
        required: true,
        default: 1
    },
    representative: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    exec_manager: {
        type: String,
        trim: true
    },
    communications_rep: {
        type: String,
        trim: true
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        postal_code: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        }

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
        trim: true
    },
    /**
     * The Finnish name of this field is currently "Hallintomalli ja henkilöstö".
     */
    legal_status: {
        type: String,
        trim: true
    },
    /**
     * The Finnish name of this field is currently "Tavoitteet ja keskeiset
     * toimintatavat".
     */
    description: {
        type: String,
        trim: true
    },
    int_links: {
        type: String,
        trim: true
    },
    /**
     * This field was hidden from the views in version 1.0.10 of the Project
     * Database.
     */
    nat_local_links: {
        type: String,
        trim: true
    },
    other_funding_budget: {
        type: String,
        trim: true
    },
    accounting_audit: {
        type: String,
        trim: true
    },
    background: {
        type: String,
        trim: true
    },
    bank_account: {
        type: Schema.ObjectId,
        ref: 'BankAccount'
    },
    /**
     * This field contains extra notes about the project.
     *
     * This field was added in schema version 3.
     */
    special_notes: {
        type: String,
        trim: true
    },
    updated: {
        type: Array
    }
});

var BankAccountSchema = new Schema({
    bank_contact_details: {
        type: String,
        trim: true
    },
    iban: {
        type: String,
        trim: true
    },
    swift: {
        type: String,
        trim: true
    },
    holder_name: {
        type: String,
        trim: true
    }
});

OrganisationSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate({path: 'bank_account', model: 'BankAccount'}).exec(cb);
};

module.exports = mongoose.model('Organisation', OrganisationSchema);
module.exports = mongoose.model('BankAccount', BankAccountSchema);
