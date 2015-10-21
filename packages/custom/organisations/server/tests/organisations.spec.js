/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
/*var expect = require('expect.js'),
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
            organisation2 = new Organisation({
                "name": "Children's Rights Org",
                "representative": "Representative",
                "address": "Adress 123",
                "tel": "123445",
                "email": "email@cro.com",
                "website": "www.cro.com",
                "legal_status": "legal status",
                "history_status": "history status",
                "int_links": "international links",
                "bank_account": bank_account});
            bank_account = new BankAccount({
                "bank_contact_details": "Branch, address",
                "iban": "abcdefg1234",
                "swift": "OKOYFI",
                "holder_name": "John Smith"});
            organisation.save();
            organisation2.save();
            bank_account.save();
            //console.log(organisation);
            done();
        });

        describe('Method All', function () {

            it('should list all organisations', function (done) {

                this.timeout(10000);
                var query = Organisation.find()

                return query.exec(function (err, orgs) {
                    expect(err).to.be(null);
                    expect(orgs.length).to.be(2);
//                    expect(data[0].title).to.equal("Human rights");
//                    expect(data[1].status).to.be("approved");
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
});*/
