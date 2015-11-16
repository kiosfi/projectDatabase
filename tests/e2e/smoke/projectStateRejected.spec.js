var helpers = require('../helpers.e2e');

describe('Changing project state to "rejected"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    it('should change state if valid data is filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Some rights")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'hylätty')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.id('addRej')).click();

        element(by.model('rej.rejection')).element(by.cssContainingText('option', '1 Hanke ei ole ihmisoikeushanke')).click();

        element(by.id('addRej')).click();

        element.all(by.model('rej.rejection')).get(1).element(by.cssContainingText('option', '7 Strategia')).click();

        element(by.model('project.rejected.rejection_comments')).sendKeys('Hanke ei vastaa vaatimuksia');

        browser.executeScript('window.scrollTo(0,100000)').then(function () {
            element(by.id('rej-btn')).click();
        });


        expect(browser.getCurrentUrl()).toContain('/779ed9f94250406da7a7a111');
        var state = element(by.css('h3')).element(by.id('state')).getText();
        expect(state).toContain('hylätty');

        helpers.logout();
    });

    it('should not change state if user clicks "cancel"-button in change-view', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Human rights 123")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'hylätty')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.linkText('Peruuta')).click();

        expect(browser.getCurrentUrl()).toContain('/5c9ed9f94250406da7a7aabc');
        var state = element(by.css('h3')).element(by.id('state')).getText();
        expect(state).toContain('käsittelyssä');

        helpers.logout();
    });
});