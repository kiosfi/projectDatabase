var helpers = require('../helpers.e2e');

describe('Changing project state to "end report"', function () {
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
        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Project B")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'loppuraportti')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('project.end_report.approved_by')).sendKeys('Teija Testi');
        element(by.model('er_approved_day')).sendKeys(12);
        element(by.model('er_approved_month')).sendKeys(12);
        element(by.model('er_approved_year')).sendKeys(2015);
        element(by.model('audit_day')).sendKeys(1);
        element(by.model('audit_month')).sendKeys(6);
        element(by.model('audit_year')).sendKeys(2016);
        element(by.model('project.end_report.audit.review')).sendKeys('Arvio tilintarkastuksesta');
        browser.executeScript('window.scrollTo(0,100000)').then(function () {
          element(by.id('er_methods')).sendKeys('Ihan ok');
          element(by.model('project.end_report.objective')).sendKeys('Hyvä');
          element(by.model('project.end_report.general_review')).sendKeys('Hyvin meni');
        });

        browser.executeScript('window.scrollTo(0,100000)').then(function () {
          element(by.model('project.end_report.comments')).sendKeys('Ei muuta');
          element(by.id('er-btn')).click();
        });

        expect(browser.getCurrentUrl()).toContain('/a2c8c9adb020176611996768');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('loppuraportti');
    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Project A")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'loppuraportti')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.linkText('Peruuta')).click();

        expect(browser.getCurrentUrl()).toContain('/5c9ed9f94260406da7a7a41b');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('allekirjoitettu');
    });

    it('should show login page if trying to load "/projectId/change -view', function() {
        helpers.logout();
        browser.get('/projects/5c9ed9f94260406da7a7a41b/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
        helpers.login();
    });
});
