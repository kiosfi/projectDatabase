///* jshint -W079 */
///* Related to https://github.com/linnovate/mean/issues/898 */
//'use strict';
//
///**
// * Module dependencies.
// */
//var expect = require('expect.js'),
//        mongoose = require('mongoose'),
//        Project = mongoose.model('Project'),
//        Organisation = mongoose.model('Organisation'),
//        BankAccount = mongoose.model('BankAccount');
//
//var project1;
//var project2;
//var project3;
//var bank_acct;
//var org;
//var approved;
//
//describe('<Unit Test>', function () {
//    describe('Model Project:', function () {
//        beforeEach(function (done) {
//            this.timeout(10000);
//
//            bank_acct = new BankAccount({
//                "bank_contact_details": "Branch, address",
//                "iban": "abcdefg1234",
//                "swift": "OKOYFI",
//                "holder_name": "John Smith"});
//            bank_acct.save();
//            org = new Organisation({
//                "name": "Rights Activists",
//                "representative": {
//                    "name": "Representative",
//                    "email": "email@email.com",
//                    "phone": "12345"
//                },
//                "exec_manager": "Manager A",
//                "communications_rep": "rep",
//                "address": {
//                    "street": "Street 123911",
//                    "postal_code": "22039",
//                    "city": "Oslo",
//                    "country": "Norway"
//                },
//                "tel": "123445",
//                "email": "email@org.com",
//                "website": "www.org.com",
//                "legal_status": "legal status",
//                "int_links": "international links",
//                "nat_links": "local human rights org",
//                "other_funding_budget": "funding",
//                "accounting_audit": "audit",
//                "bank_account": bank_acct});
//            org.save();
//
//            project1 = new Project(
//                    {"title": "Human rights",
//                        "coordinator": "Teppo Tenhunen",
//                        "organisation": org,
//                        "reg_date": new Date(2015,11-1,30+1),
//                        "state": "allekirjoitettu",
//                        "funding": {
//                            "applied_curr_local": 50000,
//                            "applied_curr_eur": 10000},
//                        "duration_months": 30,
//                        "description": "A short description of project",
//                        "description_en": "Description in english",
//                        "categories": [
//                            "naiset",
//                            "yleiset ihmisoikeudet"
//                        ],
//                        "background": "Project background",
//                        "beneficiaries": "The project benefits...",
//                        "gender_aspect": "Gender aspects include...",
//                        "project_goal": "Project goal is...",
//                        "sustainability_risks": "Some data here",
//                        "reporting_evaluation": "Data",
//                        "other_donors_proposed": "Donated amount",
//                        "dac": "abcd123",
//                        "region": "Itä-Aasia",
//                        "payments": [
//                          {"payment_number": 1, "payment_date": new Date(2016,11-1,30+1),
//                          "sum_eur": 200000}]});
//            project1.save();
//            project2 = new Project(
//                    {"title": "Humans",
//                        "coordinator": "Teppo Tenhunen",
//                        "organisation": org,
//                        "reg_date": new Date(2015,11-1,30+1),
//                        "state": "hyväksytty",
//                        "funding": {
//                            "applied_curr_local": 50000,
//                            "applied_curr_eur": 11000},
//                        "duration_months": 12,
//                        "description": "A short description of project",
//                        "description_en": "Description in english",
//                        "categories": [
//                            "lapset"
//                        ],
//                        "background": "Project background 2",
//                        "beneficiaries": "The project benefits such and such",
//                        "gender_aspect": "Gender aspects include this and that",
//                        "project_goal": "Project goal is...",
//                        "sustainability_risks": "Some data here",
//                        "reporting_evaluation": "More data",
//                        "other_donors_proposed": "Donated amount",
//                        "dac": "abcd123",
//                        "region": "Itä-Aasia",
//                        "approved":
//                          {
//                          "user": "Maria",
//                          "approved_date": new Date(2015, 12-1, 4+1),
//                          "approved_by": "Toiminnanjohtaja",
//                          "board_notified": new Date(2015, 12-1, 4+1),
//                          "methods":
//                            [{
//                              "level": "Paikallinen",
//                              "name": "Alueellinen yhteistyö"
//                              },
//                              {
//                              "level": "Kansallinen",
//                              "name": "Vaikuttamistyö"
//                              }],
//                          "themes":
//                              ["Oikeus koskemattomuuteen ja inhimilliseen kohteluun",
//                              "Ihmisoikeuspuolustajat"],
//                          "granted_sum_eur": 12000}});
//            project2.save();
//            project3 = new Project(
//                    {"title": "Earth Life",
//                        "coordinator": "Maija Maa",
//                        "organisation": org,
//                        "reg_date": new Date(2015,11-1,30+1),
//                        "state": "hyväksytty",
//                        "funding": {
//                            "applied_curr_local": 50000,
//                            "applied_curr_eur": 11000},
//                        "duration_months": 12,
//                        "description": "A short description of project",
//                        "description_en": "Description in english",
//                        "categories": [
//                            "lapset"
//                        ],
//                        "background": "Project background 2",
//                        "beneficiaries": "The project benefits such and such",
//                        "gender_aspect": "Gender aspects include this and that",
//                        "project_goal": "Project goal is...",
//                        "sustainability_risks": "Some data here",
//                        "reporting_evaluation": "More data",
//                        "other_donors_proposed": "Donated amount",
//                        "dac": "abcd123",
//                        "region": "Itä-Aasia",
//                        "approved":
//                          {
//                          "user": "Maria",
//                          "approved_date": new Date(2015, 12-1, 4+1),
//                          "approved_by": "Toiminnanjohtaja",
//                          "board_notified": new Date(2015, 12-1, 4+1),
//                          "methods":
//                            [{
//                              "level": "Paikallinen",
//                              "name": "Alueellinen yhteistyö"
//                              },
//                              {
//                              "level": "Kansallinen",
//                              "name": "Vaikuttamistyö"
//                              }],
//                          "themes":
//                              ["Oikeus koskemattomuuteen ja inhimilliseen kohteluun",
//                              "Ihmisoikeuspuolustajat"],
//                          "granted_sum_eur": 12000}});
//            project3.save();
//            done();
//        });
//
//        describe('Method searchPayments', function () {
//
//            it('should find payments by searched field', function (done) {
//
//              this.timeout(10000);
//
//              var queries = [{"title": new RegExp('human rights', 'i')},
//                           {"payments": {$exists: true, $gt: {$size: 0}}}]
//              Project.find({$and: queries}, function(err, projs) {
//                    expect(err).to.be(null);
//                    expect(projs.length).to.be(1);
//                    expect(projs[0].title).to.be("Human rights");
//                    done();
//              });
//            });
//
//        });
//
//        describe('Method searchOrgs', function () {
//
//            it('should find organisations by searched field', function (done) {
//
//              this.timeout(10000);
//
//              var queries = [{"name": new RegExp('activists', 'i')}]
//              Organisation.find({$and: queries}, function(err, orgs) {
//                    expect(err).to.be(null);
//                    expect(orgs.length).to.be(1);
//                    expect(orgs[0].exec_manager).to.be("Manager A");
//                    done();
//              });
//            });
//
//        });
//
//        describe('Method searchProjects', function () {
//
//            it('should find projects with two params', function (done) {
//
//                this.timeout(10000);
//                var params = [{"state": new RegExp('hyväksytty', 'i')}, {"region": new RegExp('aasia', 'i')}]
//                var query = Project.find({$and: params});
//
//                return query.exec(function (err, data) {
//                    expect(err).to.be(null);
//                    expect(data.length).to.be(2);
//                    expect(data[0].dac).to.be("abcd123");
//                    done();
//                });
//            });
//
//            it('should find projects with three params', function (done) {
//
//                this.timeout(10000);
//                var params = [{"state": new RegExp('hyväksytty', 'i')}, {"region": new RegExp('aasia', 'i')},
//                              {"coordinator": new RegExp('maija m', 'i')}]
//                var query = Project.find({$and: params});
//
//                return query.exec(function (err, data) {
//                    expect(err).to.be(null);
//                    expect(data.length).to.be(1);
//                    expect(data[0].region).to.be("Itä-Aasia");
//                    done();
//                });
//            });
//
//            it('should find projects by date', function (done) {
//
//                this.timeout(10000);
//                var params = [{"reg_date": {$gte: new Date(2015,11-1,30+1).toISOString()}}]
//                console.log(params);
//                var query = Project.find({$and: params});
//
//                return query.exec(function (err, data) {
//                    expect(err).to.be(null);
//                    expect(data.length).to.be(3);
//                    expect(data[0].dac).to.be("abcd123");
//                    done();
//                });
//            });
//
//            it('should find projects by organisation fields', function (done) {
//
//                this.timeout(10000);
//
//                Project.find({organisation: org._id}, function(err, projs) {
//                      expect(err).to.be(null);
//                      expect(projs.length).to.be(3);
//                      expect(projs[0].dac).to.be("abcd123");
//                      done();
//                });
//            });
//
//
//        });
//
//        afterEach(function (done) {
//            this.timeout(10000);
//            project1.remove();
//            project2.remove();
//            project3.remove();
//            org.remove();
//            bank_acct.remove();
//            done();
//        });
//    });
//});
