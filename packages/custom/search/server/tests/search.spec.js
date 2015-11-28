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
var bank_account;
var organisation;


describe('<Unit Test>', function () {
    describe('Model Project:', function () {
        beforeEach(function (done) {
            this.timeout(10000);

            bank_account = new BankAccount({
                "bank_contact_details": "Branch, address",
                "iban": "abcdefg1234",
                "swift": "OKOYFI",
                "holder_name": "John Smith"});
            bank_account.save();
            organisation = new Organisation({
                "name": "Rights Activists",
                "representative": "Representative",
                "exec_manager": "Manager A",
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
                "history_status": "historical status",
                "int_links": "international links",
                "nat_links": "local human rights org",
                "bank_account": bank_account});
            organisation.save();
            project1 = new Project(
                    {"title": "Human rights",
                        "coordinator": "Teppo Tenhunen",
                        "organisation": organisation,
                        "reg_date": "12.10.2014",
                        "state": "rekisteröity",
                        "funding": {
                            "applied_curr_local": 50000,
                            "applied_curr_eur": 10000},
                        "duration_months": 30,
                        "description": "A short description of project",
                        "description_en": "Description in english",
                        "categories": [
                            "naiset",
                            "yleiset ihmisoikeudet"
                        ],
                        "background": "Project background",
                        "beneficiaries": "The project benefits...",
                        "gender_aspect": "Gender aspects include...",
                        "project_goal": "Project goal is...",
                        "sustainability_risks": "Some data here",
                        "reporting_evaluation": "Data",
                        "other_donors_proposed": "Donated amount",
                        "dac": "abcd123",
                        "region": "Itä-Aasia"});
            project1.save();
            project2 = new Project(
                    {"title": "Humans",
                        "coordinator": "Teppo Tenhunen",
                        "organisation": organisation,
                        "reg_date": "12.9.2014",
                        "state": "rekisteröity",
                        "funding": {
                            "applied_curr_local": 50000,
                            "applied_curr_eur": 11000},
                        "duration_months": 12,
                        "description": "A short description of project",
                        "description_en": "Description in english",
                        "categories": [
                            "lapset"
                        ],
                        "background": "Project background 2",
                        "beneficiaries": "The project benefits such and such",
                        "gender_aspect": "Gender aspects include this and that",
                        "project_goal": "Project goal is...",
                        "sustainability_risks": "Some data here",
                        "reporting_evaluation": "More data",
                        "other_donors_proposed": "Donated amount",
                        "dac": "abcd123",
                        "region": "Itä-Aasia"
                    });
            project2.save();
            done();
        });

        describe('Method SearchByState', function () {

            it('should find projects by their state', function (done) {

                this.timeout(10000);
                var state = "rekisteröity";
                var query = Project.find({"state": state});

                return query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    done();
                });
            });
        });

        describe('Method searchOrg', function () {

            it('should find organisations by their name', function (done) {

                this.timeout(10000);
                var search = "Rights Activists";
                var param = new RegExp(search, "i");
                var query = Organisation.findOne({"name": param});

                return query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.name).to.be("Rights Activists");
                    done();
                });
            });
        });


        afterEach(function (done) {
            this.timeout(10000);
            project1.remove();
            project2.remove();
            organisation.remove();
            bank_account.remove();
            done();
        });
    });
});
