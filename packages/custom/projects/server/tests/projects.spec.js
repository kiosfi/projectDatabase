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

var project;
var organisation;

describe('<Unit Test>', function() {
  describe('Model Project:', function() {
    beforeEach(function(done) {
      this.timeout(10000);
      organisation = new Organisation({
        "name" : "Humanrights org",
        "representative" : "Representative",
        "address" : "Adress 123",
        "tel" : "123445",
        "email" : "email@org.com",
        "website" : "www.org.com" });
      project = new Project({"title": "Human rights",
        "coordinator": "Keijo Koordinaattori",
        "organisation": organisation,
        "project_info": {
          "status": "approved",
          "reg_date": "12.10.2014",
          "funding": {
            "applied_curr_local": "50 000",
            "applied_curr_eur": "10 000",
            "granted_curr_local": "50 000",
            "granted_curr_eur": "10 000"},
          "duration_months": 30,
          "description": "A short description of project"}},
          {"title": "Humans",
            "coordinator": "Keijo Koordi",
            "organisation": organisation,
            "project_info": {
              "status": "approved",
              "reg_date": "12.9.2014",
              "funding": {
                "applied_curr_local": "50 000",
                "applied_curr_eur": "11 000",
                "granted_curr_local": "50 000",
                "granted_curr_eur": "11 000"},
              "duration_months": 12,
              "description": "A short description of project"}});
      project.save();
      done();
    });

    describe('Method All', function() {

      it('should list all projects', function(done) {
        this.timeout(10000);
        var query = Project
        return query.find(function(err) {
          expect(err).to.be(null);
          done();
        });

      });
    });

    afterEach(function(done) {
      this.timeout(10000);
      project = null;
      done();
    });
  });
});
