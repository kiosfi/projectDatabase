var helpers = require('../helpers.e2e');

describe('Changing project state to "signed"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    beforeAll(function() {
        helpers.login();
    })

    afterAll(function() {
        helpers.logout();
    });

    it('should change state if valid data filled in form', function () {
        element(by.linkText("Hankkeet")).click();
        element(by.linkText("Project nr 3")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'allekirjoitettu')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('project.signed.signed_by')).sendKeys('Teija Testi');
        element(by.model('signed_day')).sendKeys('12');
        element(by.model('signed_month')).sendKeys('12');
        element(by.model('signed_year')).sendKeys('2015');

        element(by.id('add-btn')).click();

        element(by.model('plannedPayment.day')).sendKeys('12');
        element(by.model('plannedPayment.month')).sendKeys('12');
        element(by.model('plannedPayment.year')).sendKeys('2015');

        element(by.model('plannedPayment.sum_eur')).sendKeys('30000');

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
    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        element(by.linkText("Hankkeet")).click();
        element(by.id("page-2")).click();
        element(by.linkText("Project for children")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'allekirjoitettu')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        browser.navigate().back();

        expect(browser.getCurrentUrl()).toContain('/f2c7d9aeb017189911996768');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('hyväksytty');
    });

    it('should show login page if trying to load "/projectID/change -view', function() {
        helpers.logout();
        browser.get('/projects/f2c7d9aeb017189911996768/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
        helpers.login();
    });
});
