var helpers = require('../helpers.e2e');

describe('Changing project state to "in review"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    it('should change state if valid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Human rights")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'käsittelyssä')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('project.in_review.comments')).sendKeys('voidaan siirtää');

        element(by.id('review-btn')).click();
        expect(browser.getCurrentUrl()).toContain('/56091cbc00fccd6d66bc5cc3');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('käsittelyssä');

        helpers.logout();
    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.id("page-2")).click();
        element(by.linkText("Worklife rights")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'käsittelyssä')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.linkText('Peruuta')).click();
        expect(browser.getCurrentUrl()).toContain('/56091ded00fdde6d66bc5cc3');
        var state = element(by.className('tila')).getText();
        expect(state).toContain('rekisteröity');

        helpers.logout();
    });

    it('should show login page if trying to load "/projectId/change -view', function() {
        browser.get('/projects/56091ded00fccd6d66bc5cc3/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
    });
});
