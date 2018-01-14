/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
        mongoose = require('mongoose'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount');
var async = require('async');

describe('<Unit Test>', function () {
    var organisation1;
    var organisation2;
    var organisation3;
    var organisation4;
    var bank_account1;
    var bank_account2;

    describe('Model Organisation:', function () {
        beforeEach(function (done) {
            this.timeout(10000);
            // Make collections empty before adding test data
            BankAccount.remove({}, function() {
                Organisation.remove({}, function() {
                    bank_account1 = new BankAccount({
                        "bank_contact_details": "Branch, address",
                        "iban": "abcdefg1234",
                        "swift": "OKOYFI",
                        "holder_name": "John Smith"
                    });
                    organisation1 = new Organisation({
                        "schema_version": 3,
                        "name": "Human rights org",
                        "representative": {
                            "name": "Representative",
                            "email": "email@email.com",
                            "phone": "12345"
                        },
                        "exec_manager": "Manager",
                        "communications_rep": "Rep",
                        "address": {
                            "street": "Street 123",
                            "postal_code": "011325",
                            "city": "London",
                            "country": "England"
                        },
                        "tel": "123445",
                        "email": "email@org.com",
                        "website": "www.org.com",
                        "legal_status": "legal status1",
                        "description": "description for organisation .....",
                        "int_links": "international links1",
                        "nat_local_links": "local human rights org1",
                        "other_funding_budget": "other funders1",
                        "accounting_audit": "accounting",
                        "background": "Nulla pretium feugiat dolor, quis tempor enim dignissim at.",
                        "bank_account": bank_account1,
                        "updated": []
                    });
                    organisation2 = new Organisation({
                        "schema_version": 3,
                        "name": "Children's Rights Org",
                        "representative": {
                            "name": "Representative2",
                            "email": "email@email.com",
                            "phone": "12345"
                        },
                        "exec_manager": "Manager2",
                        "communications_rep": "Rep2",
                        "address": {
                            "street": "Street 123567",
                            "postal_code": "020333",
                            "city": "Tampere",
                            "country": "Finland"
                        },
                        "tel": "1234456",
                        "email": "email@cro2.com",
                        "website": "www.cro2.com",
                        "legal_status": "legal statuses2",
                        "description": "description for organisation .....",
                        "int_links": "international link2",
                        "nat_local_links": "local human rights org 2",
                        "other_funding_budget": "other funders2",
                        "accounting_audit": "audit",
                        "background": "Sed tempus lacus a libero finibus, id blandit odio maximus.",
                        "bank_account": bank_account1,
                        "updated": []
                    });
                    organisation3 = new Organisation({
                        "schema_version": 3,
                        "name": "Women's Rights Org",
                        "representative": {
                            "name": "Representative3",
                            "email": "email@email.com",
                            "phone": "12345"
                        },
                        "exec_manager": "Manager3",
                        "communications_rep": "rep3",
                        "address": {
                            "street": "Street 12",
                            "postal_code": "02320",
                            "city": "Espoo",
                            "country": "Finland"
                        },
                        "tel": "5551234",
                        "email": "contact@wrng.org",
                        "website": "www.wrng.org",
                        "legal_status": "legal statuses3",
                        "description": "description for organisation .....",
                        "int_links": "international link3",
                        "nat_local_links": "local human rights org 3",
                        "other_funding_budget": "other funders3",
                        "accounting_audit": "audit2",
                        "background": "Quisque eget nisi a ex porttitor ultricies quis eget sem.",
                        "bank_account": bank_account1,
                        "updated": []
                    });
                    bank_account1.save(function() {
                        organisation1.save(function() {
                            organisation2.save(function() {
                                organisation3.save(function() {
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('Method All', function () {
            it('should list all organisations', function (done) {
                this.timeout(10000);
                var query = Organisation.find();
                query.exec(function (err, orgs) {
                    expect(err).to.be(null);
                    expect(orgs.length).to.equal(3);
                    done();
                });
            });
        });

        describe('Method Save', function () {
            beforeEach(function (done) {
                this.timeout(10000);
                bank_account2 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "EU11111113333334",
                    "swift": "NDEAFIHH",
                    "holder_name": "Jack Jackson"
                });
                organisation4 = new Organisation({
                    "name": "Disabled people's rights org",
                    "representative": {
                        "name": "Mr Jackson",
                        "email": "email@email.com",
                        "phone": "12345"
                    },
                    "exec_manager": "Manager3",
                    "communications_rep": "New rep",
                    "address": {
                        "street": "Address Road 123",
                        "postal_code": "011325",
                        "city": "Cityham",
                        "country": "Countryland"
                    },
                    "tel": "+111123445",
                    "email": "email@disabledpeoplesorg.com",
                    "website": "www.disabledpeoplesorg.com",
                    "legal_status": "non-profit",
                    "description": "blah blah",
                    "int_links": "international links4",
                    "nat_local_links": "local human rights org 4",
                    "other_funding_budget": "other funders4",
                    "accounting_audit": "Auditing",
                    "background": "Background",
                    "bank_account": bank_account2,
                    "updated": []
                });
                bank_account2.save(function() {
                    done();
                });
            });

            it('should be able to save organisation without problems', function (done) {
                this.timeout(10000);
                organisation4.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.name).to.equal("Disabled people's rights org");
                    expect(data.bank_account.swift).to.equal('NDEAFIHH');
                    done();
                });
            });

            it('should show an error when try to save without a name', function (done) {
                this.timeout(10000);
                organisation4.name = undefined;
                organisation4.save(function (err) {
                    expect(err).to.not.be(null);
                    done();
                });
            });

            afterEach(function (done) {
                organisation4.remove();
                bank_account2.remove();
                done();
            });
        });

        describe('Method Show', function () {
            it('should find given organisation', function (done) {
                this.timeout(10000);
                Organisation.findOne({name: "Children's Rights Org"})
                        .exec(function (err, data) {
                            expect(err).to.be(null);
                            expect(data.name).to.be("Children's Rights Org");
                            done();
                        });
            });
        });

        describe('Method Destroy', function () {
            it('should delete given organisation', function (done) {
                this.timeout(10000);
                Organisation.remove({name: "Human rights org"})
                        .exec(function (err) {
                            expect(err).to.be(null);
                            Organisation.findOne({name: "Human rights org"})
                                    .exec(function (err2, data) {
                                expect(err2).to.be(null);
                                expect(data).to.be(null);
                                done();
                            })
                        });
            });
        });

        describe('Method Update', function () {
            it('should update given organisation', function (done) {
                this.timeout(10000);
                var query = Organisation;
                query.findOne({name: "Human rights org"}).exec(function (err, data) {
                    data.name = 'Children rights';
                    data.update();
                    expect(err).to.be(null);
                    expect(data.name).to.be("Children rights");
                    done();

                });
            });

        });

        afterEach(function (done) {
            this.timeout(10000);
            organisation1.remove();
            organisation2.remove();
            organisation3.remove();
            bank_account1.remove();
            done();
        });
    });
});
