/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
        mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount');

var project1;
var project2;
var project3;
var bank_acct;
var org;
var approved;
var date = new Date().toISOString();

describe('<Unit Test>', function () {
    describe('Model Project:', function () {
        beforeEach(function (done) {
            this.timeout(10000);

            bank_acct = new BankAccount({
                "bank_contact_details": "Branch, address",
                "iban": "abcdefg1234",
                "swift": "OKOYFI",
                "holder_name": "John Smith"
            });
            bank_acct.save();
            org = new Organisation({
                "schema_version": 3,
                "name": "Rights Activists",
                "representative": {
                    "name": "Representative",
                    "email": "email@email.com",
                    "phone": "12345"
                },
                "exec_manager": "Manager A",
                "communications_rep": "rep",
                "address": {
                    "street": "Street 123911",
                    "postal_code": "22039",
                    "city": "Oslo",
                    "country": "Norway"
                },
                "tel": "123445",
                "email": "email@org.com",
                "website": "www.org.com",
                "legal_status": "legal status",
                "description": "description",
                "int_links": "international links",
                "nat_local_links": "local human rights org",
                "other_funding_budget": "funding",
                "accounting_audit": "audit",
                "background": "background",
                "bank_account": bank_acct,
                "special_notes": "special notes",
                "updated": []
            });
            org.save();

            project1 = new Project({
                "schema_version": 12,
                "security_level": "Julkinen",
                "project_ref": "15006",
                "title": "Human rights",
                "date": date,
                "coordinator": "Teppo Tenhunen",
                "organisation": org,
                "reg_date": new Date(2015, 11 - 1, 30 + 1),
                "state": "allekirjoitettu",
                "incomplete": true,
                "funding": {
                    "applied_curr_local": 50000,
                    "curr_local_unit": "INR",
                    "applied_curr_eur": 10000,
                    "paid_eur": 200000,
                    "left_eur": 200000
                },
                "duration_months": 30,
                "description": "A short description of project",
                "description_en": "Description in english",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen",
                        "comment": "Diipa daa"
                    },
                    {
                        "level": "Kansallinen",
                        "name": "Tietoisuuden lisääminen",
                        "comment": "Blaa blaa"
                    },
                    {
                        "level": "Paikallinen",
                        "name": "Kampanjointi ja/tai lobbaus",
                        "comment": "Sepi sepi"
                    },
                    {
                        "level": "Yhteisö",
                        "name": "Vaikuttamistyö",
                        "comment": "Hokkus pokkus"
                    }
                ],
                "context": "Project background",
                "target_group": "The project benefits...",
                "human_resources": "The human resources...",
                "gender_aspect": "Gender aspects include...",
                "vulnerable_groups": "Vulnerable groups are...",
                "project_goal": "Project goal is...",
                "planned_results": "The planned results are...",
                "risk_control": "Some data here",
                "reporting_evaluation": "Data",
                "other_donors_proposed": "Donated amount",
                "dac": "abcd123",
                "country": "Intia",
                "region": "Itä-Aasia",
                "referees": "Referees",
                "background_check": "Background check",
                "budget": "Budjet",
                "fitness": "Fitness to the strategy of KIOS",
                "capacity": "Capacity and expertise of the organisation",
                "feasibility": "Feasibility",
                "effectiveness": "Effectiveness",
                "proposed_funding": "Proposal",
                "special_notes": "Special notes",
                "required_appendices": {
                    "proj_budget": false,
                    "references": true,
                    "annual_budget": false,
                    "rules": true,
                    "reg_cert": true,
                    "annual_report": false,
                    "audit_reports": false
                },
                "in_review": {
                    "date": date,
                    "user": "Pekka Puupää",
                    "comments": "Jep jep"
                },
                "approved": {
                    "date": date,
                    "user": "Maria",
                    "board_meeting": "1/2018",
                    "decision": "Hyväksytään.",
                    "approved_date": date,
                    "approved_by": "Toiminnanjohtaja",
                    "board_notified": date,
                    "granted_sum_eur": 60000,
                    "themes": [
                        "Oikeusvaltio ja demokratia"
                    ],
                    "themes_disambiguation": " "
                },
                "signed": {
                    "date": date,
                    "user": "Maria",
                    "signed_by": "Maija Meri",
                    "signed_date": date,
                    "planned_payments": [
                        {
                            "sum_eur": 5000,
                            "date": date
                        },
                        {
                            "sum_eur": 5000,
                            "date": date
                        }
                    ],
                    "intreport_deadlines": [
                        {
                            "date": date,
                            "report": "1. väliraportti"
                        }
                    ]
                },
                "payments": [{
                        "payment_number": 1,
                        "payment_date": new Date(2016, 11 - 1, 30 + 1),
                        "sum_eur": 200000}
                ],
                "updated": []
            });
            project1.save();
            project2 = new Project({
                "schema_version": 12,
                "security_level": "Julkinen",
                "project_ref": "15009",
                "title": "Humans",
                "date": date,
                "coordinator": "Teppo Tenhunen",
                "organisation": org,
                "reg_date": new Date(2015, 11 - 1, 30 + 1),
                "state": "hyväksytty",
                "funding": {
                    "applied_curr_local": 50000,
                    "curr_local_unit": "INR",
                    "applied_curr_eur": 11000,
                    "paid_eur": 0,
                    "left_eur": 12000
                },
                "duration_months": 12,
                "description": "A short description of project",
                "description_en": "Description in english",
                "context": "Project background 2",
                "target_group": "The project benefits such and such",
                "human_resources": "The human resources...",
                "gender_aspect": "Gender aspects include this and that",
                "vulnerable_groups": "Vulnerable groups are...",
                "project_goal": "Project goal is...",
                "planned_results": "The planned results are...",
                "risk_control": "Some data here",
                "reporting_evaluation": "More data",
                "other_donors_proposed": "Donated amount",
                "dac": "abcd123",
                "country": "Laos",
                "region": "Itä-Aasia",
                "referees": "Referees",
                "background_check": "Background check",
                "budget": "Budjet",
                "fitness": "Fitness to the strategy of KIOS",
                "capacity": "Capacity and expertise of the organisation",
                "feasibility": "Feasibility",
                "effectiveness": "Effectiveness",
                "proposed_funding": "Proposal",
                "special_notes": "Special notes",
                "required_appendices": {
                    "proj_budget": false,
                    "references": true,
                    "annual_budget": false,
                    "rules": true,
                    "reg_cert": true,
                    "annual_report": false,
                    "audit_reports": false
                },
                "in_review": {
                    "date": date,
                    "user": "Pekka Puupää",
                    "comments": "Jep jep"
                },
                "approved": {
                    "date": date,
                    "user": "Maria",
                    "board_meeting": "1/2018",
                    "decision": "Hyväksytään.",
                    "approved_date": new Date(2015, 12 - 1, 4 + 1),
                    "approved_by": "Toiminnanjohtaja",
                    "board_notified": new Date(2015, 12 - 1, 4 + 1),
                    "themes": [
                        "Oikeus koskemattomuuteen ja inhimilliseen kohteluun",
                        "Ihmisoikeuspuolustajat"
                    ],
                    "granted_sum_eur": 12000
                },
                "updated": []
            });
            project2.save();
            project3 = new Project({
                "schema_version": 12,
                "security_level": "Julkinen",
                "project_ref": "15010",
                "title": "Earth Life",
                "date": date,
                "coordinator": "Maija Maa",
                "organisation": org,
                "reg_date": new Date(2015, 11 - 1, 30 + 1),
                "state": "hyväksytty",
                "incomplete": true,
                "funding": {
                    "applied_curr_local": 50000,
                    "curr_local_unit": "INR",
                    "applied_curr_eur": 11000,
                    "paid_eur": 0,
                    "left_eur": 12000
                },
                "duration_months": 12,
                "description": "A short description of project",
                "description_en": "Description in english",
                "context": "Project background 2",
                "target_group": "The project benefits such and such",
                "human_resources": "The human resources...",
                "gender_aspect": "Gender aspects include this and that",
                "vulnerable_groups": "Vulnerable groups are...",
                "project_goal": "Project goal is...",
                "planned_results": "The planned results are...",
                "risk_control": "Some data here",
                "reporting_evaluation": "More data",
                "other_donors_proposed": "Donated amount",
                "dac": "abcd123",
                "country": "Laos",
                "region": "Itä-Aasia",
                "referees": "Referees",
                "background_check": "Background check",
                "budget": "Budjet",
                "fitness": "Fitness to the strategy of KIOS",
                "capacity": "Capacity and expertise of the organisation",
                "feasibility": "Feasibility",
                "effectiveness": "Effectiveness",
                "proposed_funding": "Proposal",
                "special_notes": "Special notes",
                "required_appendices": {
                    "proj_budget": false,
                    "references": true,
                    "annual_budget": false,
                    "rules": true,
                    "reg_cert": true,
                    "annual_report": false,
                    "audit_reports": false
                },
                "in_review": {
                    "date": date,
                    "user": "Pekka Puupää",
                    "comments": "Jep jep"
                },
                "approved": {
                    "user": "Maria",
                    "approved_date": new Date(2015, 12 - 1, 4 + 1),
                    "approved_by": "Toiminnanjohtaja",
                    "board_notified": new Date(2015, 12 - 1, 4 + 1),
                    "methods":
                            [{
                                    "level": "Paikallinen",
                                    "name": "Alueellinen yhteistyö"
                                },
                                {
                                    "level": "Kansallinen",
                                    "name": "Vaikuttamistyö"
                                }],
                    "themes":
                            ["Oikeus koskemattomuuteen ja inhimilliseen kohteluun",
                                "Ihmisoikeuspuolustajat"],
                    "granted_sum_eur": 12000
                },
                "updated": []
            });
            project3.save();
            done();
        });

        describe('Method searchPayments', function () {

            it('should find payments by searched field', function (done) {

                this.timeout(10000);

                var queries = [{"title": new RegExp('human rights', 'i')},
                    {"payments": {$exists: true, $gt: {$size: 0}}}]
                Project.find({$and: queries}, function (err, projs) {
                    expect(err).to.be(null);
                    expect(projs.length).to.be(1);
                    expect(projs[0].title).to.be("Human rights");
                    done();
                });
            });

        });

        describe('Method searchOrgs', function () {

            it('should find organisations by searched field', function (done) {

                this.timeout(10000);

                var queries = [{"name": new RegExp('activists', 'i')}]
                Organisation.find({$and: queries}, function (err, orgs) {
                    expect(err).to.be(null);
                    expect(orgs.length).to.be(1);
                    expect(orgs[0].exec_manager).to.be("Manager A");
                    done();
                });
            });

        });

        describe('Method searchProjects', function () {

            it('should find projects with two params', function (done) {

                this.timeout(10000);
                var params = [{"state": new RegExp('hyväksytty', 'i')}, {"region": new RegExp('aasia', 'i')}]
                var query = Project.find({$and: params});

                query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    expect(data[0].dac).to.be("abcd123");
                    done();
                });
            });

            it('should find projects with three params', function (done) {

                this.timeout(10000);
                var params = [{"state": new RegExp('hyväksytty', 'i')}, {"region": new RegExp('aasia', 'i')},
                    {"coordinator": new RegExp('maija m', 'i')}]
                var query = Project.find({$and: params});

                query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(1);
                    expect(data[0].region).to.be("Itä-Aasia");
                    done();
                });
            });

            it('should find projects by date', function (done) {

                this.timeout(10000);
                var params = [{"reg_date": {$gte: new Date(2015, 11 - 1, 30 + 1).toISOString()}}]
                var query = Project.find({$and: params});

                query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(3);
                    expect(data[0].dac).to.be("abcd123");
                    done();
                });
            });

            it('should find projects by organisation fields', function (done) {

                this.timeout(10000);

                Project.find({organisation: org._id}, function (err, projs) {
                    expect(err).to.be(null);
                    expect(projs.length).to.be(3);
                    expect(projs[0].dac).to.be("abcd123");
                    done();
                });
            });


        });

        afterEach(function (done) {
            this.timeout(10000);
            project1.remove();
            project2.remove();
            project3.remove();
            org.remove();
            bank_acct.remove();
            done();
        });
    });
});
