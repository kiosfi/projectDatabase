/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
/*var expect = require('expect.js'),
        mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount');

var project1;
var project2;
var project3;
var bank_account;
var organisation;
var approved;

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
                        "state": "hyväksytty",
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
                        "region": "Itä-Aasia",
                        "approved": {
                                    "user": "Maria",
                                    "approved_date": "4.12.2015",
                                    "approved_by": "Toiminnanjohtaja",
                                    "board_notified": "5.12.2015",
                                    "methods": [
                                      {
                                        "level": "Paikallinen",
                                        "name": "Alueellinen yhteistyö"
                                      },
                                      {
                                        "level": "Kansallinen",
                                        "name": "Vaikuttamistyö"
                                      }
                                    ],
                                    "themes": [
                                      "Oikeus koskemattomuuteen ja inhimilliseen kohteluun",
                                      "Ihmisoikeuspuolustajat"
                                    ],
                                    "granted_sum": {
                                      "granted_curr_eur": 12000,
                                      "granted_curr_local": 50000
                                    }});
                    });
            project2.save();
            done();
        });

        describe('Method searchByRegion', function () {

            it('should find projects by their region', function (done) {

                this.timeout(10000);
                var region = "aasia";
                var param = new RegExp(region, "i");
                var query = Project.find({"region": param});

                return query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    expect(data[1].dac).to.be("abcd123");
                    done();
                });
            });
        });

        describe('Method SearchByState', function () {

            it('should find projects by their state', function (done) {

                this.timeout(10000);
                var state = "hyväksytty";

                return Project.find({"state": state}, function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(1);
                    expect(data[0].region).to.be("Itä-Aasia");
                    done();
                });
            });
        });

        describe('Method searchByOrg', function () {

            it('should find projects by organisation name', function (done) {

                this.timeout(10000);

                var name = "activists";
                var param = new RegExp(name, "i");

                return Organisation.find({"name": param}, function (err, data) {

                    expect(err).to.be(null);
                    expect(data.length).to.be(0);

                    data = data.map(function(org) {
                      return org._id;
                    });

                    Project.find({organisation: data}, function(err, projects) {
                        expect(projects.length).to.be(undefined);
                    //expect(data.name).to.be("Rights Activists");

                    });
                    done();
                });
            });
        });

        describe('Method searchByTheme', function () {

            it('should find projects by theme', function (done) {

                this.timeout(10000);

                var theme = "Ihmisoikeuspuolustajat";

                return Approved.find({"themes": theme}, function (err, data) {

                    expect(err).to.be(null);
                    expect(data.length).to.be(1);

                    data = data.map(function(theme) {
                      return theme._id;
                    });

                    Project.find({approved: data}, function(err, projects) {
                        expect(err).to.be(null);
                        expect(projects.length).to.be(1);
                        expect(projects[0].duration_months).to.be(12);
                    });
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
            approved.remove();
            done();
        });
    });
});*/
