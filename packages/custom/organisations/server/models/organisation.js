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
    representative: {
        type: String,
        required: true,
        trim: true
    },
    exec_manager: {
        type: String,
        required: true,
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
    nat_local_links: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    other_funding: {
        type: String,
        required: true,
        trim: true
    },
    bank_account: {
        type: Schema.ObjectId,
        ref: 'BankAccount',
        required: true
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

OrganisationSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate({path: 'bank_account', model: 'BankAccount'}).exec(cb);
};

module.exports = mongoose.model('Organisation', OrganisationSchema);
module.exports = mongoose.model('BankAccount', BankAccountSchema);
