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

var organisation;
var organisation2;
var bank_account;

describe('<Unit Test>', function () {
    describe('Model Organisation:', function () {
        beforeEach(function (done) {
            this.timeout(10000);

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
                    "street": "Street 123",
                    "postal_code": "011325",
                    "city": "London",
                    "country": "England"
                },
                "tel": "123445",
                "email": "email@org.com",
                "website": "www.org.com",
                "legal_status": "legal status",
                "history_status": "history status",
                "int_links": "international links",
                "bank_account": bank_account});
            organisation.save();
            organisation2 = new Organisation({
                "name": "Children's Rights Org",
                "representative": "Representative2",
                "exec_manager": "Manager2",
                "address": {
                    "street": "Street 123567",
                    "postal_code": "020333",
                    "city": "Tampere",
                    "country": "Finland"
                },
                "tel": "1234456",
                "email": "email@cro2.com",
                "website": "www.cro2.com",
                "legal_status": "legal statuses",
                "history_status": "history statuses",
                "int_links": "international link",
                "bank_account": bank_account});
            organisation2.save();
            done();
        });

        describe('Method All', function () {

            it('should list all organisations', function (done) {

                this.timeout(10000);
                var query = Organisation.find();
                
                return query.sort({'name': 'asc'}).exec(function (err, orgs) {

                    expect(err).to.be(null);
                    expect(orgs.length).to.equal(2);
                    done();
                });
            });
        });

        describe('Method Show', function () {

            it('should find given organisation', function (done) {
                this.timeout(10000);
                var query = Organisation
                return query.findOne({name: "Children's Rights Org"}).exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.name).to.be("Children's Rights Org");
                    done();
                });
            });
        });

        afterEach(function (done) {
            this.timeout(10000);
            organisation.remove();
            organisation2.remove();
            bank_account.remove();
            done();
        });
    });
});