var helpers = require('../helpers.e2e');

describe('Changing project state to "ended"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    beforeAll(function() {
        helpers.login();
    })

    afterAll(function() {
        helpers.logout();
    });

    xit('should change state if valid data filled in form', function () {
        element(by.linkText("Hankkeet")).click();
        element(by.linkText("Project C")).click();

        element(by.model('project.changeTo'))
          .element(by.cssContainingText('option', 'päättynyt')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('end_day')).sendKeys(12);
        element(by.model('end_month')).sendKeys(12);
        element(by.model('end_year')).sendKeys(2015);
        element(by.model('project.ended.approved_by'))
          .element(by.cssContainingText('option', 'Toiminnanjohtaja')).click();
        element(by.model('notified_day')).sendKeys(12);
        element(by.model('notified_month')).sendKeys(12);
        element(by.model('notified_year')).sendKeys(2015);
        browser.pause()

        element(by.model('project.ended.other_comments')).sendKeys('Comment');

        element(by.id('end-button')).click();

        expect(browser.getCurrentUrl()).toContain('/a2c8c9adb020176622996766');
        var state = element(by.id('state_field')).getText();
        expect(state).toContain('päättynyt');
    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        element(by.linkText("Hankkeet")).click();
        element(by.linkText("Project nr 3")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'päättynyt')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        browser.navigate().back();

        expect(browser.getCurrentUrl()).toContain('/f2e7c9aeb017189911996768');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('hyväksytty');
    });

    it('should show login page if trying to load "/projectID/change -view', function() {
        helpers.logout();
        browser.get('/projects/a2c8c9adb020176622996766/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
        helpers.login();
    });
});
