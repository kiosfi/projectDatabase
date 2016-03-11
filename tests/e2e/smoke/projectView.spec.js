var helpers = require('../helpers.e2e');

describe('Project view page', function () {

    beforeAll(function() {
        helpers.login();
    })

    afterAll(function() {
        helpers.logout();
    });

    it('should stay project view page if logged in ', function () {
        element(by.linkText('Hankelistaus')).click();
        element(by.linkText('Human rights')).click();
        expect(browser.getCurrentUrl()).toContain('56091cbc00fccd6d66bc5cc3');
    });

    it('should show details of project if logged in', function () {
        element(by.linkText('Hankelistaus')).click();
        element(by.linkText('Human rights')).click();
        expect(element(by.id('header')).$('h2').getText())
                .toEqual('70001: Human rights');
    });

    it('should redirect to login page if not logged in ', function () {
        helpers.logout();
        browser.get('/projects/56091cbc00fccd6d66bc5cc3');
        expect(browser.getCurrentUrl()).toContain('/auth/login');
        helpers.login();
    });
});
