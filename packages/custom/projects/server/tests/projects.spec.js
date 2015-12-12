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
        BankAccount = mongoose.model('BankAccount'),
        User = mongoose.model('User');


var project1;
var project2;
var project3;
var project4;
var organisation;
var organisation3;
var organisation4;
var bank_account;
var bank_account3;
var bank_account4;
var user;
var in_review;
var approved;
var rejected;
var signed;
var payment;
var int_report;
var end_report;
var ended;

describe('<Unit Test>', function () {
    describe('Model Project:', function () {
        beforeEach(function (done) {
            this.timeout(10000);

            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'});
            user.save();
            bank_account = new BankAccount({
                "bank_contact_details": "Branch, address",
                "iban": "abcdefg1234",
                "swift": "OKOYFI",
                "holder_name": "John Smith"});
            bank_account.save();
            organisation = new Organisation({
                "name": "Humanrights org",
                "representative": "Representative",
                "exec_manager": "Manager",
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
                "history_status": "history status",
                "int_links": "international links",
                "nat_local_links": "local human rights org",
                "description": "description for organisation .....",
                "other_funding": "other funders",
                "bank_account": bank_account});
            organisation.save();
            project1 = new Project(
                    {"title": "Human rights",
                        "coordinator": "Teppo Tenhunen",
                        "organisation": organisation,
                        "reg_date": "12.10.2014",
                        "funding": {
                            "applied_curr_local": 50000,
                            "applied_curr_eur": 10000},
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
                        "dac": "abcd123",
                        "region": "Itä-Aasia"});
            project1.save();
            project2 = new Project(
                    {"title": "Humans",
                        "coordinator": "Teppo Tenhunen",
                        "organisation": organisation,
                        "reg_date": "12.9.2014",
                        "funding": {
                            "applied_curr_local": 50000,
                            "applied_curr_eur": 11000},
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
                        "dac": "abcd123",
                        "region": "Itä-Aasia"
                    });
            project2.save();
            done();
        });

        describe('Method All', function () {

            it('should list all projects', function (done) {

                this.timeout(10000);
                var query = Project.find();

                return query.exec(function (err, data) {
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

        describe('Method Destroy', function () {
            it('should delete given project', function (done) {
                this.timeout(10000);
                var query = Project;
                return query.remove({title: "Humans"}).exec(function (err) {
                    expect(err).to.be(null);
                    done();
                });
            });

        });

        describe('Method Save', function () {

            beforeEach(function (done) {
                this.timeout(10000);

                organisation3 = new Organisation({
                    "name": "Children rights org",
                    "representative": "Mr Jackson",
                    "exec_manager": "Manager3",
                    "address": {
                        "street": "Address Road 123",
                        "postal_code": "011325",
                        "city": "Cityham",
                        "country": "Countryland"
                    },
                    "tel": "+111123445",
                    "email": "email@childrenorg.com",
                    "website": "www.childrenorg.com",
                    "legal_status": "non-profit",
                    "history_status": "history status",
                    "int_links": "international links",
                    "nat__local_links": "local human rights org 2",
                    "description": "description for organisation .....",
                    "other_funding": "other funders",
                    "bank_account": bank_account});
                bank_account3 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "EU11111113333334",
                    "swift": "NDEAFIHH",
                    "holder_name": "Jack Jackson"});
                project3 = new Project(
                        {"title": "Children rights",
                            "coordinator": "Maija Maa",
                            "organisation": organisation3,
                            "funding": {
                                "applied_curr_local": 50000,
                                "applied_curr_eur": 11000},
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
                            "dac": "19191123",
                            "region": "Itä-Aasia"
                        });
                done();
            });

            it('should be able to save project and new organisation without problems', function (done) {

                this.timeout(10000);

                return project3.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.equal('Children rights');
                    expect(data.coordinator).to.equal('Maija Maa');
                    expect(data.organisation.name).to.equal('Children rights org');
                    expect(data.organisation.bank_account).to.not.equal(0);
                    expect(data.reg_date.length).to.not.equal(0);

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

            it('should show an error when try to save without a title', function (done) {
                this.timeout(10000);

                project3.title = null;
                return project3.save(function (err) {
                    expect(err).to.not.be(null);

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

            it('should be able to save project with with empty not-required field', function (done) {
                this.timeout(10000);

                project3.other_donors_proposed = '';
                return project3.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.other_donors_proposed).to.equal('');

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

            it('should be able to save project if organisation already exists', function (done) {
                this.timeout(1000);
                organisation4 = new Organisation({
                    "name": "Humanrights org",
                    "representative": "Representative",
                    "exec_manager": "Manager4",
                    "address": {
                        "street": "Street road 123",
                        "postal_code": "211325",
                        "city": "Madrid",
                        "country": "Spain"
                    },
                    "tel": "123445",
                    "email": "email@hrorg.com",
                    "website": "www.hrorg.com",
                    "legal_status": "legal status",
                    "history_status": "history status",
                    "int_links": "international links",
                    "nat_local_links": "local human rights org 4",
                    "description": "description for organisation .....",
                    "other_funding": "other funders",
                    "bank_account": bank_account4});

                bank_account4 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "abcdefg1234",
                    "swift": "HELSFIHH",
                    "holder_name": "Jane Smith"});

                organisation4.save();

                project4 = new Project(
                        {"title": "Women rights",
                            "coordinator": "Maija Maa",
                            "organisation": organisation4,
                            "funding": {
                                "applied_curr_local": 150000,
                                "applied_curr_eur": 111000},
                            "duration_months": 29,
                            "description": "A short description of project",
                            "description_en": "Description in english",
                            "background": "Project background 3",
                            "beneficiaries": "The project benefits such and such",
                            "gender_aspect": "Gender aspects include this and that",
                            "project_goal": "Project goal is...",
                            "sustainability_risks": "Some data here",
                            "reporting_evaluation": "More data",
                            "other_donors_proposed": "Donated amount",
                            "dac": "1234",
                            "region": "Itä-Aasia"
                        });
                return project4.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.organisation.name).to.equal('Humanrights org');

                    project4.remove();
                    organisation4.remove();
                    bank_account4.remove();
                    done();
                });
            });

            it('should be able to save project where data has scandic letters', function (done) {

                this.timeout(10000);

                project3.title = 'Ääkkönen';
                project3.organisation.name = 'Åke Björn';
                return project3.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.equal('Ääkkönen');
                    expect(data.organisation.name).to.equal('Åke Björn');

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

        });

        describe('Method byOrg', function () {
            it('should get projects where given organisation is the organisation', function (done) {
                this.timeout(10000);
                return Project.find({organisation: organisation}).exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    done();
                });
            });
        });

        describe('Method Update', function () {
        
        it('should update given project', function (done) {
                this.timeout(10000);

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {

                    proj.title = 'Children rights';
                    proj.update();
                    expect(err).to.be(null);
                    expect(proj.title).to.be("Children rights");    
                    done();
                });
            });

            it('should create a new "in review" state and update given project with its id', function (done) {
                this.timeout(10000);
                var in_review = {
                    "user": user.name,
                    "comments": "this is a comment"};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {

                    proj.state = "käsittelyssä";
                    proj.in_review = in_review;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("käsittelyssä");
                    expect(proj.in_review.comments).to.be("this is a comment");
                    user.remove();
                    done();
                });
            });

            it('should create a new "approved" state and update given project with its id', function (done) {
                this.timeout(10000);
                var date = new Date();
                var approved = {
                    "user": user.name,
                    "approved_date": date,
                    "approved_by": "Toiminnanjohtaja",
                    "board_notified": date,
                    "methods": [{"name": "kapasiteetin vahvistaminen", "level": "Kansainvälinen"}],
                    "themes": ["Oikeusvaltio ja demokratia"],
                    "granted_sum_eur": 600000};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "hyväksytty";
                    proj.approved = approved;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("hyväksytty");
                    expect(proj.approved.granted_sum_eur).to.be(600000);
                    user.remove();
                    done();
                });
            });

            it('should create a new "rejected" state and update given project with its id', function (done) {
                this.timeout(10000);
                var rejected = {
                    "user": user.name,
                    "rejection_categories": [{rejection: "7 Strategia"}, {rejection: "8 Muu, mikä?"}],
                    "rejection_comments": "this is a comment"};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "hylätty";
                    proj.rejected = rejected;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("hylätty");
                    expect(proj.rejected.rejection_comments).to.be("this is a comment");
                    user.remove();
                    done();
                });
            });

            it('should create a new "signed" state and update given project with its id', function (done) {
                this.timeout(10000);
                var date = new Date();
                var signed = {
                    "user": user.name,
                    "signed_by": "Jaana Jantunen",
                    "signed_date": date,
                    "planned_payments": [{"date": date, "sum_eur": 50000}],
                    "intreport_deadlines": [{"report": "1. väliraportti", "date": date}]};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "allekirjoitettu";
                    proj.signed = signed;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("allekirjoitettu");
                    expect(proj.signed.signed_by).to.be("Jaana Jantunen");
                    user.remove();
                    done();
                });
            });

            it('should create a new payment and add its id to the payments array of project', function (done) {
                this.timeout(10000);
                var date = new Date()
                var payment = {
                    "payment_date": date,
                    "sum_eur": 20000};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.payments.push(payment);
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.payments.length).to.be(1);
                    done();
                });
            });

            it('should create a new "int report" state and update given project with its id', function (done) {
                this.timeout(10000);
                var date = new Date();
                var int_report = {
                    "user": user.name,
                    "reportNumber": 1,
                    "methods": ["Onnistui", "Onnistui kohtalaisesti"],
                    "objectives": ["TAvoitteet saavutettiin"],
                    "overall_rating_kios": "Arvio",
                    "approved_by": "Halko",
                    "date_approved": date,
                    "comments": "Muita kommentteja hankkeen raportilta"};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "väliraportti";
                    proj.intermediary_report = int_report;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("väliraportti");
                    expect(proj.intermediary_report.approved_by).to.be("Halko");
                    user.remove();
                    done();
                });
            });

            it('should create a new "end report" state and update given project with its id', function (done) {
                this.timeout(10000);
                var date = new Date();
                var end_report = {
                    "user": user.name,
                    "audit": {"date": date, "review": "ihan ok"},
                    "approved_by": "Jaana Jantunen",
                    "approved_date": date,
                    "general review": "Meni hyvin.",
                    "methods": [{"name": "tavoite", "level": "paikallinen"}],
                    "objectives": "hankkeen tavoite",
                    "comments": "Kommentti"};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "loppuraportti";
                    proj.end_report = end_report;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("loppuraportti");
                    expect(proj.end_report.approved_by).to.be("Jaana Jantunen");
                    user.remove();
                    done();
                });
            });


            it('should create a new "ended" state update given project with its id', function (done) {
                this.timeout(10000);
                var date = new Date();
                var ended = {
                    "user": user.name,
                    "end_date": date,
                    "board_notified": date,
                    "approved_by": "toimitusjohtaja",
                    "other_comments": "kommentti"};

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "päättynyt";
                    proj.ended = ended;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("päättynyt");
                    user.remove();
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
