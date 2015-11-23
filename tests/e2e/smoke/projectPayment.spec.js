var helpers = require('../helpers.e2e');

describe('Adding payment in project view', function () {
//    it('should not show change-page when not logged in', function (done) {
//
//    });

    it('should add payment if valid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Project A")).click();

        element(by.model('payment_day')).sendKeys(12);
        element(by.model('payment_month')).sendKeys(12);
        element(by.model('payment_year')).sendKeys(2015);
        element(by.model('project.payment.sum_eur')).sendKeys(2000);
        element(by.model('project.payment.sum_local')).sendKeys(4000);

        element(by.buttonText('Tallenna')).click();

        element(by.buttonText('Maksatus')).click();

        var par = element(by.id('paid'));
        expect(par.getText()).toContain('1. Erä');

        helpers.logout();
    });

    it('should not add payment if invalid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankelistaus")).click();
        element(by.linkText("Project A")).click();

        element(by.model('payment_day')).sendKeys('12');
        element(by.model('payment_month')).sendKeys('12');
        element(by.model('payment_year')).sendKeys('2015');

        var btn = element(by.buttonText('Tallenna'));
        expect(btn.isEnabled()).toBe(false);

        helpers.logout();
    });

});
