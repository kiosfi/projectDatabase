var helpers = require('../helpers.e2e');

describe('Changing project state to "approved"', function () {
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
        element(by.linkText("Minority rights")).click();

//        browser.pause();
        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'hyväksytty')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('project.approved.approved_date')).sendKeys('13.11.2015');
        element(by.model('project.approved.approved_by')).element(by.cssContainingText('option', 'Halko')).click();
        element(by.model('project.approved.board_notified')).sendKeys('15.11.2015');
        element(by.model('project.approved.granted_sum.granted_curr_eur'))
                .sendKeys('12000');
        element(by.model('project.approved.granted_sum.granted_curr_local'))
                .sendKeys('111000');

        var checkBoxes = element.all(by.css('input[type=checkbox]'));
        checkBoxes.get(2).click();
        checkBoxes.get(0).click();
        checkBoxes.get(6).click();

        element(by.buttonText('Lisää uusi')).click();
        element(by.model('method.name')).element(by.cssContainingText('option', 'Vaikuttamistyö')).click();
        element(by.model('method.level')).element(by.cssContainingText('option', 'Kansainvälinen')).click();

        browser.executeScript('window.scrollTo(0,100000)').then(function () {
            element(by.id('appr-btn')).click();
        });

        expect(browser.getCurrentUrl()).toContain('/5c9ed9f94250406da7a7a41b');
        var state = element(by.css('h3')).element(by.className('tila')).getText();
        expect(state).toContain('hyväksytty');
    });

    it('should not change state if user clicks "cancel"-button in change-view', function() {
        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Elder rights")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'hyväksytty')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.linkText('Peruuta')).click();

        expect(browser.getCurrentUrl()).toContain('/5c9ed9f94250406da7a7a111');
        var state = element(by.css('h3')).element(by.className('tila')).getText();
        expect(state).toContain('käsittelyssä');
    });

    it('should show login page if trying to load "/projectId/change -view', function() {
        helpers.logout();
        browser.get('/projects/5c9ed9f94250406da7a7a111/change');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
        helpers.login();
    });
});
