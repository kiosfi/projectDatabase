/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
        mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation');


var project1;
var project2;
var project;
var organisation;

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
                "website": "www.org.com"});
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
                        "description": "A short description of project"});
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
                        "description": "A short description of project"});
            project2.save();
            done();
        });

        describe('Method All', function () {

            it('should list all projects', function (done) {

                this.timeout(10000);
                var query = Project
                return query.find(function (err, data) {
                    console.log(data);
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
//                    expect(data[0].title).to.equal("Human rights");
//                    expect(data[1].project_info.status).to.be("approved");
                    done();
                });

            });
        });

        describe('Method Show', function () {

            it('should find given project', function (done) {
                this.timeout(10000);
                var query = Project;
                return query.findOne(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.be('Human rights');
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
