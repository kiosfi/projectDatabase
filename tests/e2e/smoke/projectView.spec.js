var helpers = require('../helpers.e2e');

describe('Project view page', function () {

    it('should stay project view page if logged in ', function () {
        helpers.login();
        element(by.id('proj-70001')).$('a').click();
        expect(browser.getCurrentUrl()).toContain('56091cbc00fccd6d66bc5cc3');
        helpers.logout();
    });

    it('should show details of project if logged in', function () {
        helpers.login();
        element(by.id('proj-70001')).$('a').click();
        // TODO: "by.css('section')" should probably be replaced with something
        // more unambiguous.
        var header = element(by.css('section')).element(by.tagName('h2'));
        expect(header.getText()).toContain('Human rights');

        helpers.logout();
    });

    it('should redirect to login page if not logged in ', function () {
        browser.get('/');
        element(by.id('proj-70001')).$('a').click();
        expect(browser.getCurrentUrl()).toContain('/auth/login');
    })
});
