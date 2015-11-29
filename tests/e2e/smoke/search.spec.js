var helpers = require('../helpers.e2e');

describe('Search page', function () {

    it('should find projects by existing organisation name', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedTag')).element(by.cssContainingText('option', 'Järjestö')).click();
        element(by.model('selectedName')).sendKeys("human");
        element.all(by.buttonText('Hae')).get(0).click();
        expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        helpers.logout();
    });

    it('should not find projects by not-existing organisation name ', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedTag')).element(by.cssContainingText('option', 'Järjestö')).click();
        element(by.model('selectedName')).sendKeys("workers");
        element.all(by.buttonText('Hae')).get(0).click();
        expect(element.all(by.repeater('result in searchresults')).count()).toEqual(0);
        helpers.logout();
    });

    it('should find projects by state ', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedTag')).element(by.cssContainingText('option', 'Tila')).click();
        element(by.model('selectedState')).element(by.cssContainingText('option', 'hyväksytty')).click();
        element.all(by.buttonText('Hae')).get(1).click();
        expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        helpers.logout();
    });

    it('should find projects by existing region name', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedTag')).element(by.cssContainingText('option', 'Maanosa tai maa')).click();
        element(by.model('selectedRegion')).sendKeys("aasia");
        element.all(by.buttonText('Hae')).get(2).click();
        expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        helpers.logout();
    });

    it('should not find projects by non-existing region name', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedTag')).element(by.cssContainingText('option', 'Maanosa tai maa')).click();
        element(by.model('selectedRegion')).sendKeys("eurooppa");
        element.all(by.buttonText('Hae')).get(2).click();
        expect(element.all(by.repeater('result in searchresults')).count()).toEqual(0);
        helpers.logout();
    });

    it('should find projects by theme ', function () {
        helpers.login();

        element(by.linkText('Haku')).click();
        element(by.model('selectedTag')).element(by.cssContainingText('option', 'Teema')).click();
        element(by.model('selectedTheme')).element(by.cssContainingText('option', 'Oikeusvaltio ja demokratia')).click();
        element.all(by.buttonText('Hae')).get(3).click();
        expect(element.all(by.repeater('result in searchresults')).count()).not.toEqual(0);
        helpers.logout();
    });
  });
