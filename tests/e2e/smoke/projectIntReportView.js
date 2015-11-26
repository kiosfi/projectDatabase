var helpers = require('../helpers.e2e');

describe('Project intermediary report view page', function () {

    it('should stay int report view page if logged in ', function () {
        helpers.login();
        
        element(by.linkText('Hankelistaus')).click();
        element(by.linkText('Project B')).click();
        element(by.linkText('Näytä raportti')).click();
        expect(browser.getCurrentUrl()).toContain('a2c8c9adb020176611996768/intreport/1');
        helpers.logout();
    });

    it('should show details of report if logged in', function () {
        helpers.login();
        
        element(by.linkText('Hankelistaus')).click();
        element(by.linkText('Project B')).click();
        element(by.linkText('Näytä raportti')).click();
        
        var header = element(by.css('section')).element(by.tagName('article'))
                .element(by.tagName('div')).element(by.tagName('h2'));
        expect(header.getText()).toContain('1. väliraportti');

        helpers.logout();
    });

    it('should redirect to empty home page if not logged in ', function () {
        browser.get('/a2c8c9adb020176611996768/intreport/1');
        
        var text = element(by.id('sys-idx'));
        expect(text.getText()).toContain('KIOS Ry:n hanketietokanta');
    })
});
