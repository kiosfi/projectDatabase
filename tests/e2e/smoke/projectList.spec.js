var helpers = require('../helpers.e2e');
describe('Project list page', function () {

    beforeEach(function() {
        helpers.login();
        element(by.linkText('Hankelistaus')).click();
    });

    afterEach(function() {
        helpers.logout();
    });

    it('should list registered projects when user is logged in', function () {
        expect(element.all(by.repeater('project in projects')).count()).toEqual(10);

        expect(element(by.id('proj-70001')).isPresent()).toBe(true);
        expect(element(by.id('proj-70002')).isPresent()).toBe(true);
        expect(element(by.id('proj-70003')).isPresent()).toBe(true);
        expect(element(by.id('proj-79999')).isPresent()).toBe(false);
    });

    it('should list registered projects in correct order', function() {
        expect(element(by.tagName('table')).isPresent()).toBe(true);
        element(by.id('byTitle')).click();
        var rep = element.all(by.repeater('project in projects'));
        expect(rep.count()).toEqual(10);
        expect(rep.get(0).element(by.tagName('td')).getText()).toEqual("70009");
        expect(rep.get(1).element(by.tagName('td')).getText()).toEqual("70001");
        expect(rep.get(2).element(by.tagName('td')).getText()).toEqual("70011");
        expect(rep.get(3).element(by.tagName('td')).getText()).toEqual("70012");
        expect(rep.get(4).element(by.tagName('td')).getText()).toEqual("70002");
        expect(rep.get(5).element(by.tagName('td')).getText()).toEqual("70006");
        expect(rep.get(6).element(by.tagName('td')).getText()).toEqual("70007");
        expect(rep.get(7).element(by.tagName('td')).getText()).toEqual("70008");
        expect(rep.get(8).element(by.tagName('td')).getText()).toEqual("70014");
        expect(rep.get(9).element(by.tagName('td')).getText()).toEqual("70003");
    });
});
