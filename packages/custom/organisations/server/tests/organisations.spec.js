///* jshint -W079 */
///* Related to https://github.com/linnovate/mean/issues/898 */
//'use strict';
//
///**
// * Module dependencies.
// */
//var expect = require('expect.js'),
//        mongoose = require('mongoose'),
//        Organisation = mongoose.model('Organisation'),
//        BankAccount = mongoose.model('BankAccount');
//var async = require('async');
//
//var organisation;
//var organisation2;
//var organisation3;
//var organisation4;
//var bank_account;
//var bank_account2;
//
//describe('<Unit Test>', function () {
//    describe('Model Organisation:', function () {
//
//        beforeEach(function (done) {
//            this.timeout(10000);
//
//            bank_account = new BankAccount({
//                "bank_contact_details": "Branch, address",
//                "iban": "abcdefg1234",
//                "swift": "OKOYFI",
//                "holder_name": "John Smith"});
//            bank_account.save();
//            organisation = new Organisation({
//                "name": "Human rights org",
//                "representative": {
//                    "name": "Representative",
//                    "email": "email@email.com",
//                    "phone": "12345"
//                },
//                "exec_manager": "Manager",
//                "communications_rep": "Rep",
//                "address": {
//                    "street": "Street 123",
//                    "postal_code": "011325",
//                    "city": "London",
//                    "country": "England"
//                },
//                "tel": "123445",
//                "email": "email@org.com",
//                "website": "www.org.com",
//                "legal_status": "legal status",
//                "history_status": "history status",
//                "int_links": "international links",
//                "nat_local_links": "local human rights org",
//                "description": "description for organisation .....",
//                "other_funding_budget": "other funders",
//                "accounting_audit": "accounting",
//                "bank_account": bank_account});
//            organisation.save();
//            organisation2 = new Organisation({
//                "name": "Children's Rights Org",
//                "representative": {
//                    "name": "Representative2",
//                    "email": "email@email.com",
//                    "phone": "12345"
//                },
//                "exec_manager": "Manager2",
//                "communications_rep": "Rep2",
//                "address": {
//                    "street": "Street 123567",
//                    "postal_code": "020333",
//                    "city": "Tampere",
//                    "country": "Finland"
//                },
//                "tel": "1234456",
//                "email": "email@cro2.com",
//                "website": "www.cro2.com",
//                "legal_status": "legal statuses",
//                "history_status": "history statuses",
//                "int_links": "international link",
//                "nat_local_links": "local human rights org 2",
//                "description": "description for organisation .....",
//                "other_funding_budget": "other funders",
//                "accounting_audit": "audit",
//                "bank_account": bank_account});
//            organisation2.save();
//            organisation3 = new Organisation({
//                "name": "Women's Rights Org",
//                "representative": {
//                    "name": "Representative3",
//                    "email": "email@email.com",
//                    "phone": "12345"
//                },
//                "exec_manager": "Manager3",
//                "communications_rep": "rep3",
//                "address": {
//                    "street": "Street 12",
//                    "postal_code": "02320",
//                    "city": "Espoo",
//                    "country": "Finland"
//                },
//                "tel": "5551234",
//                "email": "contact@wrng.org",
//                "website": "www.wrng.org",
//                "legal_status": "legal statuses",
//                "history_status": "history statuses",
//                "int_links": "international link",
//                "nat_local_links": "local human rights org 3",
//                "description": "description for organisation .....",
//                "other_funding_budget": "other funders",
//                "accounting_audit": "audit",
//                "bank_account": bank_account});
//            organisation3.save();
//            done();
//        });
//
//        describe('Method All', function () {
//
//            it('should list all organisations', function (done) {
//
//                this.timeout(10000);
//
//                var query = Organisation.find();
//
//                return query.exec(function (err, orgs) {
//                    expect(err).to.be(null);
//                    expect(orgs.length).to.equal(3);
//                    done();
//                });
//            });
//        });
//
//        describe('Method Save', function () {
//
//            beforeEach(function (done) {
//                this.timeout(10000);
//
//                bank_account2 = new BankAccount({
//                    "bank_contact_details": "Bank Branch, address",
//                    "iban": "EU11111113333334",
//                    "swift": "NDEAFIHH",
//                    "holder_name": "Jack Jackson"});
//
//                organisation4 = new Organisation({
//                    "name": "Children rights org",
//                    "representative": {
//                        "name": "Mr Jackson",
//                        "email": "email@email.com",
//                        "phone": "12345"
//                    },
//                    "exec_manager": "Manager3",
//                    "communications_rep": "New rep",
//                    "address": {
//                        "street": "Address Road 123",
//                        "postal_code": "011325",
//                        "city": "Cityham",
//                        "country": "Countryland"
//                    },
//                    "tel": "+111123445",
//                    "email": "email@childrenorg.com",
//                    "website": "www.childrenorg.com",
//                    "legal_status": "non-profit",
//                    "history_status": "history status",
//                    "int_links": "international links",
//                    "nat_local_links": "local human rights org 2",
//                    "description": "description for organisation .....",
//                    "other_funding_budget": "other funders",
//                    "accounting_audit": "Auditing",
//                    "bank_account": bank_account2});
//
//                done();
//            });
//
//            it('should be able to save organisation without problems', function (done) {
//
//                this.timeout(10000);
//
//                return organisation4.save(function (err, data) {
//                    expect(err).to.be(null);
//                    expect(data.name).to.equal('Children rights org');
//                    expect(data.bank_account.swift).to.equal('NDEAFIHH');
//                    organisation4.remove();
//                    bank_account2.remove();
//                    done();
//                });
//            });
//
//            it('should show an error when try to save without a name', function (done) {
//                this.timeout(10000);
//
//                organisation4.name = null;
//
//                return organisation4.save(function (err) {
//                    expect(err).to.not.be(null);
//                    organisation4.remove();
//                    bank_account2.remove();
//                    done();
//                });
//            });
//        });
//
//        describe('Method Show', function () {
//
//            it('should find given organisation', function (done) {
//                this.timeout(10000);
//                var query = Organisation
//                return query.findOne({name: "Children's Rights Org"}).exec(function (err, data) {
//                    expect(err).to.be(null);
//                    expect(data.name).to.be("Children's Rights Org");
//                    done();
//                });
//            });
//        });
//
//        describe('Method Destroy', function () {
//            it('should delete given organisation', function (done) {
//                this.timeout(10000);
//                var query = Organisation;
//                return query.remove({name: "Human rights org"}).exec(function (err) {
//                    expect(err).to.be(null);
//                    done();
//                });
//            });
//
//        });
//
//        describe('Method Update', function () {
//            it('should update given organisation', function (done) {
//                this.timeout(10000);
//                var query = Organisation;
//                return query.findOne({name: "Human rights org"}).exec(function (err, data) {
//                    data.name = 'Children rights';
//                    data.update();
//                    expect(err).to.be(null);
//                    expect(data.name).to.be("Children rights");
//                    done();
//
//                });
//            });
//
//        });
//
//        afterEach(function (done) {
//            this.timeout(10000);
//            organisation.remove();
//            organisation2.remove();
//            organisation3.remove();
//            bank_account.remove();
//            done();
//        });
//    });
//});
