/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
/var expect = require('expect.js'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project');

/**
 * Globals
 */
// project;
/**
 * Test Suites
 */
/describe('<Unit Test>', function() {
  describe('Model Project:', function() {
    beforeEach(function(done) {
      this.timeout(10000);
      project = new Project({"title": "Human rights",
        "coordinator": "Keijo Koordinaattori",
        "organisation": {
          "name": "Humanrights org",
          "representative": "Representative",
          "address": "Adress 123",
          "tel": "123445",
          "email": "email@org.com",
          "website": "www.org.com" },
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
            "organisation": {
              "name": "Humans org",
              "representative": "Repr",
              "address": "Adress 12334",
              "tel": "1234456",
              "email": "emails@org.com",
              "website": "www.orgs.com" },
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
        return query.find(function(err, data) {
          expect(err).to.be(null);
          expect(data[0].title).to.be("Human rights");
          expect(data[1].project_info.status).to.be("approved");
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
