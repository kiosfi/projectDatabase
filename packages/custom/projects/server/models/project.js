'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

// Note that the Finnish translations for the field names are listed in
// packages/custom/projects/public/assets/json/projectConstants.json

var ProjectSchema = new Schema({
    /**
     * This piece of metadata tells the version number of the scheme. It is used
     * for updating old entries to the newest version during runtime.
     */
    schema_version: {           // Current version is 9.
        type: Number,
        required: true,
        default: 1
    },
    /**
     * Security level of the project. The value should be one of the following
     * strings: "Julkinen" (public), "Luottamuksellinen" (confidential) or
     * "Salainen" (secret). For the time being, this is just a string and
     * doesn't affect access control.
     */
    security_level: {           // "Turvaluokitus"
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
    project_ref: {              // "Tunnus"
        type: String,
        required: true
    },
    /**
     * Title of the project.
     */
    title: {                    // "Nimi"
        type: String,
        required: true,
        trim: true
    },
    /**
     * Name of the coordinator of the project.
     */
    coordinator: {          // "Koordinaattori" (or "esittelijä" in reports)
        type: String,
        required: true
    },
    /**
     * ID of the organisation in charge of this project.
     */
    organisation: {             // "Järjestö"
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
    state: {                    // "Tila"
        type: String,
        default: 'rekisteröity',
        required: true
    },
    /**
     * The purpose of this flag is to indicate that the current state of the
     * project is incomplete, i.e. the values of some of its fields are about
     * to change later on. This field was added in schema version 9.
     */
    incomplete: {
        type: Boolean
    },
    /**
     * Date when the application was filed.
     */
    reg_date: {                 // "Rekisteröimispvm"
        type: Date,
        default: Date.now
    },
    /**
     * Funding of the project. Note that the granted sum is stored in
     * <tt>project.approved.granted_sum_eur</tt>.
     *
     */
    funding: {
        /**
         * The applied funding in local currency.
         */
        applied_curr_local: {   // "Haettu avustus" (paikallinen valuutta)
            type: Number
        },
        /**
         * The currency unit (e.g. USD) used in the target country. This field
         * was added in schema version 5.
         */
        curr_local_unit: {      // "Paikallinen rahayksikkö"
            type: String,
            trim: true
        },
        /**
         * The applied funding in euros.
         */
        applied_curr_eur: {     // "Haettu avustus (EUR)"
            type: Number
        },
        /**
         * The total sum of payments so far to the project, in euros. The
         * default value for this field was defined in schema version 6 as a
         * bugfix.
         */
        paid_eur: {             // "Maksettu (EUR)"
            type: Number,
            default: 0
        },
        /**
         * The amount left (i.e. <tt>project.approved.granted_sum_eur</tt> minus
         * <tt>project.funding.paid_eur</tt>) to pay. This field is redundant.
         *
         */
        left_eur: {             // "Jäljellä (EUR)"
            type: Number
        }
    },
    /**
     * Duration of the project in months.
     */
    duration_months: {          // "Kesto (kk)"
        type: Number,
        trim: true
    },
    /**
     * Additional project description in Finnish.
     */
    description: {              // "Kuvaus"
        type: String,
        trim: true
    },
    /**
     * Additional project description in English.
     */
    description_en: {           // "Kuvaus (englanniksi)"
        type: String,
        trim: true
    },
    /**
     * The Finnish name of this field is currently "Toiminnot".
     */
    methods: {                  // "Toiminnot"
        type: Array
    },
    /**
     * The Finnish version of this field was previously known as "Tausta".
     * Currently, the name of the field is "Ihmisoikeuskonteksti" though. The
     * name of this field was changed form "background" to "context" in schema
     * version 5 to prevent confusion with the new field "background_check".
     */
    context: {                  // "Ihmisoikeuskonteksti"
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
    target_group: {             // "Hyödynsaajat"
        type: String,
        trim: true
    },
    /**
     * The Finnish name of this field is "Henkilöresurssit". This field was
     * added in schema version 5.
     */
    human_resources: {          // "Henkilöresurssit"
        type: String,
        trim: true
    },
    /**
     * The Finnish translation of this field was previously known as
     * "Gender-analyysi" (hence the naming), but is now known as
     * "Tasa-arvonäkökulma ja muut läpileikkaavat teemat", which is a broader
     * topic.
     */
    gender_aspect: {    // "Tasa-arvonäkökulma ja muut läpileikkaavat teemat"
        type: String,
        trim: true
    },
    /**
     * A textual description on how to consider the most vulnerable target
     * groups of the project. This field was added in schema version 4.
     */
    vulnerable_groups: {        // "Haavoittuvimpien ryhmien huomioon ottaminen"
        type: String,
        trim: true
    },
    /**
     * The current Finnish name for this field is "Päätavoitteet".
     */
    project_goal: {             // "Hankkeen päätavoitteet"
        type: String,
        trim: true
    },
    /**
     * The planned results for the project. The Finnish name of this field is
     * "Tulostavoitteet". It was earlier known as "Odotettavissa olevat
     * keskeiset tulokset". This field was added in schema version 9.
     */
    planned_results: {
        type: String,           // "Tulostavoitteet"
        trim: true
    },
    /**
     * The current Finnish name for this field is "Indikaattotit".
     *
     * The name of this field was changed from <tt>sustainability_risks</tt> to
     * <tt>indicators</tt> in schema version 9.
     */
    risk_control: {             // "Riskinhallinnan kuvaus"
        type: String,
        trim: true
    },
    /**
     * The current Finnish name for this field is "Indikaattotit".
     *
     * The name of this field was changed from <tt>sustainability_risks</tt> to
     * <tt>indicators</tt> in schema version 9.
     */
    indicators: {               // "Indikaattorit"
        type: String,
        trim: true
    },
    /**
     * The current Finnish name for this field is "Evaluointi ja vaikuttavuuden
     * arviointi".
     */
    reporting_evaluation: {     // "Evaluointi ja vaikuttavuuden arviointi"
        type: String,
        trim: true
    },
    /**
     * The current Finnish name for this field is "Muualta haettu rahoitus".
     */
    other_donors_proposed: {    // "Muualta haettu rahoitus"
        type: String,
        trim: true
    },
    /**
     * The current Finnish name for this field is "DAC". It is a code used by
     * Finnish Foreign Ministry to denote countries.
     */
    dac: {                      // "DAC"
        type: String,
        trim: true
    },
    /**
     * The country where the project is mean to take place. This field was added
     * in schema version 9.
     */
    country: {                  // "Maa"
        type: String,
        trim: true
    },
    /**
     * The Finnish name for this field was "Alue / Maa" before schema version 9.
     * Now it's called "Alue".
     */
    region: {                   // "Alue"
        type: String,
        trim: true
    },
    /**
     * This field contains a textual description on the referees for the
     * project. This field was added in schema version 4.
     */
    referees: {                 // "Suosittelijat"
        type: String,
        trim: true
    },
    /**
     * Background check for the project and its organisation. This field was
     * added in the schema version 5.
     */
    background_check: {         // "Taustaselvitys"
        type: String,
        trim: true
    },
    /**
     * Textual description about how the project will be funded. This field was
     * added in schema version 4.
     */
    budget: {                   // "Budjetti ja omarahoitusosuus"
        type: String,
        trim: true
    },
    /**
     * This field contains a textual description for how this project fits into
     * the strategy of KIOS. This field was added in schema version 4.
     */
    fitness: {                  // "Sopivuus KIOSin strategiaan"
        type: String,
        trim: true
    },
    /**
     * This field describes the capacity and expertise of the organisation to
     * carry out this project. This field was added in schema version 4.
     */
    capacity: {                 // "Järjestön kapasiteetti ja asiantuntijuus"
        type: String,
        trim: true
    },
    /**
     * An assessment about the feasibility of this project. This field was added
     * in schema version 4.
     */
    feasibility: {              // "Toteutettavuus ja riskit"
        type: String,
        trim: true
    },
    /**
     * This field describes the potential effects of the project. This field was
     * added in schema version 4.
     */
    effectiveness: {            // "Tuloksellisuus, vaikutukset ja vaikuttavuus"
        type: String,
        trim: true
    },
    /**
     * This field contains the information about the proposed funding for the
     * project. It is displayed in the registration report.
     *
     * This field was added in schema version 4.
     */
    proposed_funding: {         // "Esitys"
        type: String,
        trim: true
    },
    /**
     * This field contains extra notes about the project.
     *
     * This field was added in schema version 8.
     */
    special_notes: {            // "Erityisiä huomioita"
        type: String,
        trim: true
    },
    /**
     * This fields contains a checklist of required appendices and it was added
     * in schema version 4. Currently, the values inside this object will be
     * supplied when changing state to <tt>in_review</tt>. They all need to be
     * supplied before changing state to <tt>approved</tt>. This is currently
     * not enforced by the system though.
     */
    required_appendices: {      // "Vaaditut liitteet"
        proj_budget: {          // "Hankebudjetti"
            type: Boolean
        },
        references: {           // "Suositukset"
            type: Boolean
        },
        annual_budget: {        // "Vuosibudjetti"
            type: Boolean
        },
        rules: {                // "Säännöt"
            type: Boolean
        },
        reg_cert: {             // "Rekisteröintitodistus"
            type: Boolean
        },
        annual_report: {        // "Vuosikertomus"
            type: Boolean
        },
        audit_reports: {        // "Tilintarkastukset"
            type: Boolean
        }
    },
    /**
     * This is the second state of a project that comes right after the state
     * "registered".
     */
    in_review: {                // "Käsittelyssä"
        date: {                 // "Rekisteröity käsittelyyn"
            type: Date
        },
        user: {                 // "Tiedot lisäsi"
            type: String
        },
        comments: {             // "Kommentit"
            type: String
        }
    },
    /**
     * This state begins after review.
     */
    approved: {                 // "Hyväksytty"
        date: {                 // "Rekisteröity hyväksytyksi"
            type: Date
        },
        user: {                 // "Tiedot lisäsi"
            type: String
        },
        /**
         * The board meeting where the approval was given for the project. This
         * field was added in the schema version 5.
         */
        board_meeting: {        // "Hallituksen kokous"
            type: String,
            trim: true
        },
        /**
         * The decision of the board. This field was added in the schema version
         * 5.
         */
        decision: {             // "Päätös"
            type: String,
            trim: true
        },
        approved_date: {        // "Hyväksymispäivämäärä"
            type: Date
        },
        /**
         * The entity that approved the project. The options are
         * "UM" (Ulkoministeriö), "Hallituksen kokous", or "Toiminnanjohtaja".
         */
        approved_by: {          // "Hyväksyjä"
            type: String
        },
        board_notified: {       // "Hallitukselle tiedoksi"
            type: Date
        },
        granted_sum_eur: {      // "Myönnetty avustus (EUR)"
            type: Number
        },
        /**
         * The Finnish name of this field is currently "Oikeudellinen fokus".
         */
        themes: {               // "Oikeudellinen fokus"
            type: Array
        }
    },
    rejected: {                 // "Hylätty"
        date: {                 // "Hylkäyspäivämäärä"
            type: Date
        },
        user: {                 // "Tiedot lisäsi"
            type: String
        },
        rejection_categories: { // "Hylkäyssyyt"
            type: Array
        },
        rejection_comments: {   // "Kommentit"
            type: String
        }
    },
    signed: {                   // "Allekirjoitettu"
        date: {                 // "Rekisteröity allekirjoitetuksi"
            type: Date
        },
        user: {                 // "Tiedot lisäsi"
            type: String
        },
        /**
         * The person signing the project (from the applicant organisation).
         */
        signed_by: {            // "Allekirjoittaja"
            type: String
        },
        signed_date: {          // "Allekirjoituspäivämäärä"
            type: Date
        },
        /**
         * Contains the dates and sums of planned payments. Each object in this
         * array contains the fields <tt>date</tt> and <tt>sum_eur</tt> with
         * corresponding meanings. For the array of completed payments, see
         * <tt>project.payments</tt>
         */
        planned_payments: {     // "Suunnitellut maksut"
            type: Array
        },
        /**
         * Contains the dates and deadlines for intermediary reports. The
         * objects in this array have the titles of the expected reports
         * contained in the field <tt>report</tt> and the date in the
         * <tt>date</tt> field.
         */
        intreport_deadlines: {  // "Raporttien eräpäivät"
            type: Array
        }
    },
    /**
     * Contains the dates and sums of completed payments. Each object in this
     * array contains the fields <tt>date</tt> and <tt>sum_eur</tt> with
     * corresponding meanings. For the array of planned payments, see
     * <tt>project.payments</tt>
     */
    payments: {                 // "Toteutuneet maksut"
        type: Array
    },
    /**
     * An array of objects containing the following fields:<tt>reportNumber</tt>,
     * <tt>date</tt>, <tt>user</tt>, <tt>budget</tt>, <tt>communication</tt>,
     * <tt>evaluation</tt>, <tt>methods</tt>, <tt>objectives</tt>,
     * <tt>planned_payments</tt>, <tt>overal_rating_kios</tt>, and
     * <tt>comments</tt>.
     */
    intermediary_reports: {
        type: Array
    },
    end_report: {               // "Loppuraportti"
        date: {                 // "Loppurapotti rekisteröity"
            type: Date
        },
        user: {                 // "Tiedot lisäsi"
            type: String
        },
        /**
         * This field was added in the schema version 7.
         */
        budget: {               // "Budjetin toteutuminen ja raportoitu summa"
            type: String,
            trim: true
        },
        audit: {                // "Tilintarkastukset"
            date: {             // "Päivämäärä"
                type: Date
            },
            review: {           // "Arvio"
                type: String
            }
        },
        approved_by: {          // "Hyväksyjä"
            type: String
        },
        approved_date: {        // "Hyväksymispäivämäärä"
            type: Date
        },
        general_review: {       // "Yleisarvio"
            type: String
        },
        methods: {              // "Toiminnot"
            type: Array
        },
        objective: {            // "Tärkeimmät tulokset"
            type: String
        },
        /**
         * The board meeting where the end report was approved. This field was
         * added in the schema version 7.
         */
        board_meeting: {        // "Hallituksen kokous"
            type: String,
            trim: true
        },
        /**
         * Since schema version 3, this file is used for the proposed end
         * resolution for the project. The name of this field was changed from
         * "comments" to "proposition".
         */
        proposition: {          // "Ehdotus"
            type: String,
            trim: true
        },
        /**
         * This field was added in the schema version 7.
         */
        conclusion: {           // "Päätös"
            type: String,
            trim: true
        },
        /**
         * The estimated number of people, whom this project has directly helped.
         */
        direct_beneficiaries: { // "Suoria hyödynsaajia"
            type: Number,
            trim: true
        },
        /**
         * The estimated number of people, who have received indirect benefits
         * from this project.
         */
        indirect_beneficiaries: {   // "Epäsuoria hyödynsaajia"
            type: Number,
            trim: true
        },
        /**
         * A numerical grade for the success of the project. The grading system
         * is as follows: 4 (succeeded better than anticipated), 3 (succeeded
         * as planned), 2 (did not succeed as planned due to an external cause),
         * 1 (did not succeed as planned due to neglection by the organisation).
         */
        grade: {                // "Numeerinen arvio"
            type: Number,
            trim: true
        },
        processed: {            // "Käsitelty"
            type: Boolean,
            default: false
        }
    },
    ended: {                    // "Päättynyt"
        date: {                 // "Rekisteröitynyt päättyneeksi"
            type: Date
        },
        user: {                 // "Tiedot lisäsi"
            type: String
        },
        end_date: {             // "Päättymispäivämäärä"
            type: Date
        },
        board_notified: {       // "Hallitukselle tiedoksi"
            type: Date
        },
        approved_by: {          // "Hyväksyjä"
            type: String
        },
        other_comments: {       // "Kommentit"
            type: String
        }
    },
    updated: {                  // "Päivitetty"
        type: Array
    },
    /**
     * An array containing the metadata of the project's appendix files. The
     * objects in this array contain the following fields:
     * <tt>category</tt> (String) for the category of the appendix,
     * <tt>custom_category</tt> (String) for a custom category (with the
     * <tt>category</tt> having value "Muu..."), <tt>mime_type</tt> (String) for
     * the MIME type of the appendix file, <tt>date</tt> (String) for the upload
     * date of the appendix, <tt>original_name</tt> (String) for the original
     * filename of the appendix, <tt>url</tt> (String) for the URL for fetching
     * the appendix file from the server.
     */
    appendices: {               // "Liitteet"
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
