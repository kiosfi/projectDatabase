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
        // TODO: "by.css('section')" should probably be replaced with something
        // more unambiguous.
        var header = element(by.css('section')).element(by.tagName('h2'));
        expect(header.getText()).toContain('Human rights');
    });

    it('should redirect to empty home page if not logged in ', function () {
        helpers.logout();
        browser.get('/56091cbc00fccd6d66bc5cc3');

        var text = element(by.id('sys-idx'));
        expect(text.getText()).toContain('KIOS Ry:n hanketietokanta');
        helpers.login();
    })
});
