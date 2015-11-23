var helpers = require('../helpers.e2e');

describe('Changing project state to "signed"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    it('should change state if valid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Project nr 3")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'allekirjoitettu')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('project.signed.signed_by')).sendKeys('Teija Testi');
        element(by.model('signed_date.day')).sendKeys('12');
        element(by.model('signed_date.month')).sendKeys('12');
        element(by.model('signed_date.year')).sendKeys('2015');

        element(by.id('add-btn')).click();

        element(by.model('plannedPayment.day')).sendKeys('12');
        element(by.model('plannedPayment.month')).sendKeys('12');
        element(by.model('plannedPayment.year')).sendKeys('2015');

        element(by.model('plannedPayment.sum_eur')).sendKeys('30000');
        element(by.model('plannedPayment.sum_local')).sendKeys('50000');

        browser.executeScript('window.scrollTo(0,100000)').then(function () {
            element(by.id('add-btn2')).click();
        });

        element(by.model('deadline.report')).sendKeys('1. väliraportti');
        element(by.model('deadline.day')).sendKeys('1');
        element(by.model('deadline.month')).sendKeys('6');
        element(by.model('deadline.year')).sendKeys('2016');

        browser.executeScript('window.scrollTo(0,100000)').then(function () {
            element(by.id('sign-btn')).click();
        });

        expect(browser.getCurrentUrl()).toContain('/f2e7c9aeb017189911996768');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('allekirjoitettu');

        helpers.logout();
    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.id("page-2")).click();
        element(by.linkText("Project for children")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'allekirjoitettu')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.linkText('Peruuta')).click();

        expect(browser.getCurrentUrl()).toContain('/f2c7d9aeb017189911996768');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('hyväksytty');

        helpers.logout();
    });

    it('should show login page if trying to load "/projectId/change -view', function() {
        helpers.logout();
        browser.get('/projects/f2c7d9aeb017189911996768/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
    });
});
