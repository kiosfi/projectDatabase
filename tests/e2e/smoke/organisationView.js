var helpers = require('../helpers.e2e');
describe('Organisation view page', function() {

    beforeAll(function() {
        helpers.login();
    });
    afterAll(function() {
        helpers.logout();
    });

    it('should display all the fields of an organisation correctly', function() {
        element(by.linkText('Järjestöt')).click();
        element(by.linkText('Human rights org')).click();
        expect(element.by.id('header').$('h1').getText()).toEqual('Human rights org');
        pending('Not fully implemented yet.');
    });

    // Currently, the system doesn't handle non-existent organisations properly.
    xit('should not attempt to display non-existing organisations', function() {
        browser.get('/organisations/56091a0525f75ebc0c486333');
        expect(element(by.id('error')).$('div').getText()).toEqual('Virhe - 404');
    });

    it('should redirect to login page if not logged in ', function () {
        helpers.logout();
        browser.get('/organisations/56091a0525f75ebc0c486338');
        expect(browser.getCurrentUrl()).toContain('/auth/login');
        helpers.login();
    });
});