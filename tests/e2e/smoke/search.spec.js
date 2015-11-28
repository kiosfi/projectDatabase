var helpers = require('../helpers.e2e');

describe('Search page', function () {

    it('should find projects by existing organisation name', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selected')).sendKeys("human");
        element.all(by.buttonText('Hae')).get(0).click();
        expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        helpers.logout();
    });

    it('should not find projects by not-existing organisation name ', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selected')).sendKeys("workers");
        element.all(by.buttonText('Hae')).get(0).click();
        expect(element.all(by.repeater('result in searchresults')).count()).toEqual(0);
        helpers.logout();
    });

    it('should find projects by state ', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedState')).element(by.cssContainingText('option', 'hyväksytty')).click();
        element.all(by.buttonText('Hae')).get(1).click();
        expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        helpers.logout();
    });

});
