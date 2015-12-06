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
                        "reg_date": new Date(2015,11-1,30+1),
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
                        "reg_date": new Date(2015,11-1,30+1),
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
                        "approved":
                          {
                          "user": "Maria",
                          "approved_date": "4.12.2015",
                          "approved_by": "Toiminnanjohtaja",
                          "board_notified": "5.12.2015",
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
                          "granted_sum_eur": 12000}});
            project2.save();
            project3 = new Project(
                    {"title": "Earth Life",
                        "coordinator": "Maija Maa",
                        "organisation": organisation,
                        "reg_date": new Date(2015,11-1,30+1),
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
                        "approved":
                          {
                          "user": "Maria",
                          "approved_date": "4.12.2015",
                          "approved_by": "Toiminnanjohtaja",
                          "board_notified": "5.12.2015",
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
                          "granted_sum_eur": 12000}});
            project3.save();
            done();
        });

        describe('Method searchProjects', function () {

            it('should find projects with two params', function (done) {

                this.timeout(10000);
                var params = [{"state": new RegExp('hyväksytty', 'i')}, {"region": new RegExp('aasia', 'i')}]
                var query = Project.find({$and: params});

                return query.exec(function (err, data) {
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

                return query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(1);
                    expect(data[0].region).to.be("Itä-Aasia");
                    done();
                });
            });

            it('should find projects by date', function (done) {

                this.timeout(10000);
                var params = [{"reg_date": {$gte: new Date(2015,11-1,30+1).toISOString()}}]
                console.log(params);
                var query = Project.find({$and: params});

                return query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(3);
                    expect(data[0].dac).to.be("abcd123");
                    done();
                });
            });
        });

        afterEach(function (done) {
            this.timeout(10000);
            project1.remove();
            project2.remove();
            project3.remove();
            organisation.remove();
            bank_account.remove();
            done();
        });
    });
});
