var helpers = require('../helpers.e2e');

describe('Adding payment in project view', function () {

    beforeAll(function() {
        helpers.login();
    });

    beforeEach(function() {
        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Project A")).click();
    });


    afterAll(function() {
        helpers.logout();
    });


    it('should add payment if valid data filled in form', function () {
        element(by.model('payment_day')).sendKeys(12);
        element(by.model('payment_month')).sendKeys(12);
        element(by.model('payment_year')).sendKeys(2015);
        element(by.model('project.payment.sum_eur')).sendKeys(2000);

        browser.executeScript('window.scrollTo(0,100000)').then(function () {
          element(by.buttonText('Tallenna')).click();
        });

        element(by.buttonText('Maksatus')).click();

        var par = element(by.id('paid'));
        expect(par.getText()).toContain(2000);
    });

    it('should not add payment if invalid data filled in form', function () {

        element(by.model('payment_day')).sendKeys('12');
        element(by.model('payment_month')).sendKeys('12');
        element(by.model('payment_year')).sendKeys('2015');

        var btn = element(by.buttonText('Tallenna'));
        expect(btn.isEnabled()).toBe(false);
    });

});
