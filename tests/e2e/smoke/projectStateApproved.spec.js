var helpers = require('../helpers.e2e');

describe('Changing project state to "approved"', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    it('should change state if valid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Minority rights")).click();

        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'hyväksytty')).click();
        element(by.id('st')).click();

        expect(browser.getCurrentUrl()).toContain('/change');

        element(by.model('project.approved.approved_date')).sendKeys('13.11.2015');
        element(by.model('project.approved.approved_by')).element(by.cssContainingText('option', 'Halko')).click();
        element(by.model('project.approved.board_notified')).sendKeys('15.11.2015');
        element(by.model('project.approved.granted_sum.granted_curr_eur')).sendKeys('12 000');
        element(by.model('project.approved.granted_sum.granted_curr_local')).sendKeys('111 000');
       
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
        var state = element(by.css('h3')).element(by.id('state')).getText();
        expect(state).toContain('hyväksytty');

        helpers.logout();
    });
    
    it('should not change state if user clicks "cancel"-button in change-view', function() {
        helpers.login();
        
        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Elder rights")).click();
        
        element(by.model('project.changeTo')).element(by.cssContainingText('option', 'hyväksytty')).click();
        element(by.id('st')).click();
        
        expect(browser.getCurrentUrl()).toContain('/change');
        
        element(by.linkText('Peruuta')).click();
        
        expect(browser.getCurrentUrl()).toContain('/5c9ed9f94250406da7a7a111');
        var state = element(by.css('h3')).element(by.id('state')).getText();
        expect(state).toContain('käsittelyssä');
        
        helpers.logout();
    });
});