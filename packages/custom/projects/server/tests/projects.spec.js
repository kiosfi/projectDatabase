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
var organisation;
var bank_account;

describe('<Unit Test>', function () {
    describe('Model Project:', function () {
        beforeEach(function (done) {
            this.timeout(10000);

            organisation = new Organisation({
                "name": "Humanrights org",
                "representative": "Representative",
                "address": "Adress 123",
                "tel": "123445",
                "email": "email@org.com",
                "website": "www.org.com",
                "legal_status": "legal status",
                "history_status": "history status",
                "int_links": "international links",
                "bank_account": bank_account});
            bank_account = new BankAccount({
                "bank_contact_details": "Branch, address",
                "iban": "abcdefg1234",
                "swift": "OKOYFI",
                "holder_name": "John Smith"});
            project1 = new Project(
                    {"title": "Human rights",
                        "coordinator": "Keijo Koordinaattori",
                        "organisation": organisation,
                        "status": "approved",
                        "reg_date": "12.10.2014",
                        "funding": {
                            "applied_curr_local": "50 000",
                            "applied_curr_eur": "10 000",
                            "granted_curr_local": "50 000",
                            "granted_curr_eur": "10 000"},
                        "duration_months": 30,
                        "description": "A short description of project",
                        "description_en": "Description in english",
                        "background": "Project background",
                        "beneficiaries": "The project benefits...",
                        "gender_aspect": "Gender aspects include...",
                        "project_goal": "Project goal is...",
                        "sustainability_risks": "Some data here",
                        "reporting_evaluation": "Data",
                        "other_donors_proposed": "Donated amount",
                        "dac": "abcd123"});
            project1.save();
            project2 = new Project(
                    {"title": "Humans",
                        "coordinator": "Keijo Koordi",
                        "organisation": organisation,
                        "status": "approved",
                        "reg_date": "12.9.2014",
                        "funding": {
                            "applied_curr_local": "50 000",
                            "applied_curr_eur": "11 000",
                            "granted_curr_local": "50 000",
                            "granted_curr_eur": "11 000"},
                        "duration_months": 12,
                        "description": "A short description of project",
                        "description_en": "Description in english",
                        "background": "Project background 2",
                        "beneficiaries": "The project benefits such and such",
                        "gender_aspect": "Gender aspects include this and that",
                        "project_goal": "Project goal is...",
                        "sustainability_risks": "Some data here",
                        "reporting_evaluation": "More data",
                        "other_donors_proposed": "Donated amount",
                        "dac": "abcd123"
                    });
            project2.save();
            done();
        });

        describe('Method All', function () {

            it('should list all projects', function (done) {

                this.timeout(10000);
                var query = Project
                return query.find(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
//                    expect(data[0].title).to.equal("Human rights");
//                    expect(data[1].status).to.be("approved");
                    done();
                });

            });
        });

        describe('Method Show', function () {

            it('should find given project', function (done) {
                this.timeout(10000);
                var query = Project;
                return query.findOne({title: 'Humans'}).exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.be("Humans");
                    done();
                });
            });
        });

        describe('Method Save', function () {

            beforeEach(function (done) {
                project3 = new Project(
                        {"title": "Children rights",
                            "coordinator": "Kaija Koordi",
                            "organisation": organisation,
                            "status": "registered",
                            "funding": {
                                "applied_curr_local": "50 000",
                                "applied_curr_eur": "11 000",
                                "granted_curr_local": "50 000",
                                "granted_curr_eur": "11 000"},
                            "duration_months": 19,
                            "description": "A short description of project",
                            "description_en": "Description in english",
                            "background": "Project background 3",
                            "beneficiaries": "The project benefits such and such",
                            "gender_aspect": "Gender aspects include this and that",
                            "project_goal": "Project goal is...",
                            "sustainability_risks": "Some data here",
                            "reporting_evaluation": "More data",
                            "other_donors_proposed": "Donated amount",
                            "dac": "19191123"
                        });
                done();
            });

            it('should be able to save project without problems', function (done) {
                this.timeout(10000);

                return project3.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.equal('Children rights');
                    expect(data.coordinator).to.equal('Kaija Koordi');
                    expect(data.organisation.length).to.not.equal(0);
                    expect(data.reg_date.length).to.not.equal(0);
                    project3.remove();
                    done();
                });
            });

            it('should show an error when try to save without a title', function (done) {
                this.timeout(10000);
                
                project3.title = '';
                return project3.save(function (err) {
                    expect(err).to.not.be(null);
                    project3.remove();
                    done();
                });
            });
        });

        afterEach(function (done) {
            this.timeout(10000);
            project1.remove();
            project2.remove();

            done();
        });
    });
});
