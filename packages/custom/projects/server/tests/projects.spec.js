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
var date = new Date().toISOString();

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
                "holder_name": "John Smith"
            });
            bank_account.save();
            organisation = new Organisation({
                "schema_version": 3,
                "name": "Humanrights org",
                "representative": {
                    "name": "Representative",
                    "email": "email@email.com",
                    "phone": "12345"
                },
                "exec_manager": "Manager",
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
                "description": "description for organisation .....",
                "int_links": "international links",
                "nat_local_links": "local human rights org",
                "other_funding_budget": "other funders",
                "accounting_audit": "audit",
                "background": "context",
                "bank_account": bank_account,
                "special_notes": "special notes",
                "updated": []
            });
            organisation.save();
            project1 = new Project({
                "schema_version": 12,
                "security_level": "Julkinen",
                "project_ref": "15001",
                "title": "Human rights",
                "date": date,
                "coordinator": "Teppo Tenhunen",
                "organisation": organisation,
                "state": "rekisteröity",
                "incomplete": true,
                "reg_date": date,
                "funding": {
                    "applied_curr_local": 50000,
                    "curr_local_unit": "INR",
                    "applied_curr_eur": 10000,
                    "paid_eur": 0,
                    "left_eur": 0
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
                "human_resources": "Human resources",
                "gender_aspect": "Gender aspects include...",
                "vulnerable_groups": "Vulnerable groups",
                "project_goal": "Project goal is...",
                "planned_results": "Planned results",
                "risk_control": "Risk control",
                "indicators": "Some data here",
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
                "updated": []
            });
            project1.save();
            project2 = new Project({
                "schema_version": 12,
                "security_level": "Julkinen",
                "project_ref": "15002",
                "title": "Humans",
                "date": date,
                "coordinator": "Teppo Tenhunen",
                "organisation": organisation,
                "state": "rekisteröity",
                "incomplete": true,
                "reg_date": date,
                "funding": {
                    "applied_curr_local": 50000,
                    "curr_local_unit": "INR",
                    "applied_curr_eur": 11000,
                    "paid_eur": 0,
                    "left_eur": 11000
                },
                "duration_months": 12,
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
                "context": "Project background 2",
                "target_group": "The project benefits such and such",
                "human_resources": "Human resources",
                "gender_aspect": "Gender aspects include this and that",
                "vulnerable_groups": "Vulnerable groups",
                "project_goal": "Project goal is...",
                "planned_results": "Planned results",
                "risk_control": "Risk control",
                "indicators": "Some data here",
                "reporting_evaluation": "More data",
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
                "updated": []
            });
            project2.save();
            done();
        });

        describe('Method All', function () {

            it('should list all projects', function (done) {

                this.timeout(10000);
                var query = Project.find();

                query.exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    expect(data[0].title).to.equal("Human rights");
                    expect(data[1].state).to.be("rekisteröity");
                    done();
                });
            });
        });

        describe('Method Show', function () {

            it('should find given project', function (done) {
                this.timeout(10000);
                var query = Project;
                query.findOne({title: 'Humans'}).exec(function (err, data) {
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
                query.remove({title: "Humans"}).exec(function (err) {
                    expect(err).to.be(null);
                    done();
                });
            });

        });

        describe('Method Save', function () {

            beforeEach(function (done) {
                this.timeout(10000);

                organisation3 = new Organisation({
                    "schema_version": 3,
                    "name": "Children rights org",
                    "representative": {
                        "name": "Mr Jackson",
                        "email": "email@email.com",
                        "phone": "12345"
                    },
                    "exec_manager": "Manager3",
                    "communications_rep": "rep3",
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
                    "description": "description for organisation .....",
                    "int_links": "international links",
                    "nat__local_links": "local human rights org 2",
                    "other_funding_budget": "other funders",
                    "accounting_audit": "audit",
                    "background": "Organisation's background description",
                    "bank_account": bank_account,
                    "special_notes": "Nothing special.",
                    "updated": []
                });
                bank_account3 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "EU11111113333334",
                    "swift": "NDEAFIHH",
                    "holder_name": "Jack Jackson"
                });
                project3 = new Project({
                    "schema_version": 12,
                    "security_level": "Julkinen",
                    "project_ref": "15003",
                    "title": "Children rights",
                    "date": date,
                    "coordinator": "Maija Maa",
                    "organisation": organisation3,
                    "state": "rekisteröity",
                    "incomplete": true,
                    "reg_date": date,
                    "funding": {
                        "applied_curr_local": 50000,
                        "curr_local_unit": "INR",
                        "applied_curr_eur": 11000,
                        "paid_eur": 0,
                        "left_eur": 11000
                    },
                    "duration_months": 19,
                    "description": "A short description of project",
                    "description_en": "Description in english",
                    "context": "Project background 3",
                    "target_group": "The project benefits such and such",
                    "human_resources": "Human resources",
                    "gender_aspect": "Gender aspects include this and that",
                    "vulnerable_groups": "Vulnerable groups",
                    "project_goal": "Project goal is...",
                    "planned_results": "Planned results",
                    "risk_control": "Risk control",
                    "indicators": "Some data here",
                    "reporting_evaluation": "More data",
                    "other_donors_proposed": "Donated amount",
                    "dac": "19191123",
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
                    "updated": []
                });
                done();
            });

            it('should be able to save project and new organisation without problems', function (done) {

                this.timeout(10000);

                project3.save(function (err, data) {
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
                project3.save(function (err) {
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
                project3.save(function (err, data) {
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
                    "schema_version": 3,
                    "name": "Humanrights org",
                    "representative": {
                        "name": "Representative",
                        "email": "email@email.com",
                        "phone": "12345"
                    },
                    "exec_manager": "Manager4",
                    "communications_rep": "reps",
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
                    "description": "description for organisation .....",
                    "int_links": "international links",
                    "nat_local_links": "local human rights org 4",
                    "other_funding_budget": "other funders",
                    "accounting_audit": "account",
                    "background": "Organisation's background",
                    "bank_account": bank_account4,
                    "special_notes": "Special notes",
                    "updated": []
                });

                bank_account4 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "abcdefg1234",
                    "swift": "HELSFIHH",
                    "holder_name": "Jane Smith"
                });

                organisation4.save();

                project4 = new Project({
                    "schema_version": 12,
                    "security_level": "Luottamuksellinen",
                    "project_ref": "15005",
                    "title": "Women rights",
                    "date": date,
                    "coordinator": "Maija Maa",
                    "organisation": organisation4,
                    "state": "rekisteröity",
                    "incomplete": false,
                    "reg_date": date,
                    "funding": {
                        "applied_curr_local": 150000,
                        "applied_curr_eur": 111000},
                    "duration_months": 29,
                    "description": "A short description of project",
                    "description_en": "Description in english",
                    "methods": [{
                            "name": "kapasiteetin vahvistaminen",
                            "level": "Kansainvälinen",
                            "comment": "Näin..."
                        }],
                    "context": "Project background 3",
                    "target_group": "The project benefits such and such",
                    "human_resources": "Human resources",
                    "gender_aspect": "Gender aspects include this and that",
                    "vulnerable_groups": "Vulnerable groups",
                    "project_goal": "Project goal is...",
                    "planned_results": "Planned results",
                    "risk_control": "Risk control",
                    "indicators": "Some data here",
                    "reporting_evaluation": "More data",
                    "other_donors_proposed": "Donated amount",
                    "dac": "1234",
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
                    "updated": []
                });
                project4.save(function (err, data) {
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
                project3.save(function (err, data) {
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
                Project.find({organisation: organisation}).exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    done();
                });
            });
        });

        describe('Method Update', function () {

            it('should update given project', function (done) {
                this.timeout(10000);

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {

                    proj.title = 'Children rights';
                    proj.update();
                    expect(err).to.be(null);
                    expect(proj.title).to.be("Children rights");
                    proj.title = 'Humans';
                    proj.update();
                    expect(proj.title).to.be("Humans");
                    done();
                });
            });

            it('should create a new "in review" state and update given project with its id', function (done) {
                this.timeout(10000);
                var in_review = {
                    "date": date,
                    "user": user.name,
                    "comments": "this is a comment"};

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {

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
                    "date": date,
                    "user": user.name,
                    "board_meeting": "1/2018",
                    "decision": "Hyväksytään sellaisenaan.",
                    "approved_date": date,
                    "approved_by": "Toiminnanjohtaja",
                    "board_notified": date,
                    "granted_sum_eur": 600000,
                    "themes": ["Oikeusvaltio ja demokratia"],
                    "themes_disambiguation": " "
                };

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
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
                    "date": date,
                    "user": user.name,
                    "rejection_categories": [{rejection: "7 Strategia"}, {rejection: "8 Muu, mikä?"}],
                    "rejection_comments": "this is a comment"};

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
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
                    "date": date,
                    "user": user.name,
                    "signed_by": "Jaana Jantunen",
                    "signed_date": date,
                    "planned_payments": [{"date": date, "sum_eur": 50000}],
                    "intreport_deadlines": [{"report": "1. väliraportti", "date": date}]};

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
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
                    "date": date,
                    "sum_eur": 20000};

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
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
                    "reportNumber": 1,
                    "date": date,
                    "user": user.name,
                    "budget": "Budjettia noudatettiin suunnitellusti.",
                    "communication": "Tiedonvaihto sujui tyydyttävästi.",
                    "evaluation": "Joku kommentti...",
                    "methods": ["Onnistui", "Onnistui kohtalaisesti"],
                    "objectives": ["Tavoitteet saavutettiin"],
                    "overall_rating_kios": "Arvio",
                    "comments": "Muita kommentteja hankkeen raportilta"};

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    proj.state = "väliraportti";
                    proj.intermediary_report = int_report;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("väliraportti");
                    expect(proj.intermediary_report.methods[0]).to.be("Onnistui");
                    user.remove();
                    done();
                });
            });

            it('should create a new "end report" state and update given project with its id', function (done) {
                this.timeout(10000);
                var date = new Date();
                var end_report = {
                    "date": date,
                    "user": user.name,
                    "budget": "Budjettia noudatettiin suunnitellusti.",
                    "audit": {"date": date, "review": "ihan ok"},
                    "approved_by": "Jaana Jantunen",
                    "approved_date": date,
                    "general review": "Meni hyvin.",
                    "methods": [{"name": "tavoite", "level": "paikallinen"}],
                    "objective": "hankkeen tavoite",
                    "board_meeting": "1/2018",
                    "proposition": "Projekti esitetään päätettäväksi suunnitellusti.",
                    "conclusion": "Projekti päätetään ehdotuksen mukaisesti",
                    "direct_beneficiaries": 121,
                    "indirect_beneficiaries": 1536,
                    "grade": 3,
                    "planned_results": "Ei kommentoitavaa.",
                    "indicators": "Pälä pälä.",
                    "processed": true
                };

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
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
                    "date": date,
                    "user": user.name,
                    "end_date": date,
                    "board_notified": date,
                    "approved_by": "toimitusjohtaja",
                    "other_comments": "kommentti"};

                Project.findOne({title: 'Humans'}).exec(function (err, proj) {
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
