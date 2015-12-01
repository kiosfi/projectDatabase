var helpers = require('../helpers.e2e');

describe('Search page', function () {

    it('should find existing projects with two search params', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('paramNo')).element(by.cssContainingText('option', 'Kaksi parametria')).click();
        element(by.model('field1')).element(by.cssContainingText('option', 'Tila')).click();
        element(by.model('param1')).element(by.cssContainingText('option', 'rekisteröity')).click();
        element(by.model('field2')).element(by.cssContainingText('option', 'Alue')).click();
        element(by.model('param2')).sendKeys("Aasia");
        browser.pause();
        element(by.buttonText('Hae')).click();
        browser.executeScript('window.scrollTo(0,100000)').then(function () {
          expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        });

        helpers.logout();
    });
  });
