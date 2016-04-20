var helpers = require('../helpers.e2e');

describe('Changing project state to "intermediary report"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.id("page-2")).click();
        element(by.linkText("Project Signed")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'väliraportti')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        browser.navigate().back();

        expect(browser.getCurrentUrl()).toContain('/123459f94260406da7a7a41b');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('allekirjoitettu');

        helpers.logout();
    });

    it('should change state if valid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.id("page-2")).click();
        element(by.linkText("Project Signed")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'väliraportti')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.id('intRMethods')).sendKeys('Onnistui ...');
        element(by.id('objComments')).sendKeys('Kohtalaisesti onnistui');
        element(by.model('project.intermediary_report.overall_rating_kios')).sendKeys('Arvio hankkeen onnistuimisesta');
        element(by.model('project.intermediary_report.comments')).sendKeys('Muita kommentteja hankkeesta');
        element(by.model('project.intermediary_report.approved_by')).sendKeys('Halko');
        element(by.model('intRDateAppr_day')).sendKeys('31');
        element(by.model('intRDateAppr_month')).sendKeys('10');
        element(by.model('intRDateAppr_year')).sendKeys('2015');

        element(by.id('intrep-btn')).click();

        expect(browser.getCurrentUrl()).toContain('/123459f94260406da7a7a41b');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('väliraportti');

        helpers.logout();
    });

    it('should show login page if trying to load "/projectId/change -view', function() {
        helpers.logout();
        browser.get('/projects/123459f94260406da7a7a41b/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
    });
});
