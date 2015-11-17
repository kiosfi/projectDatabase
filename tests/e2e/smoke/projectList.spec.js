var helpers = require('../helpers.e2e');
describe('Project list page', function () {

    it('should list registered projects when user is logged in', function () {
        // change below line to browser.get('/projects') once logging in implemented
        // in e2e testing
        helpers.login();

        element(by.linkText('Hankelistaus')).click();

        expect(element.all(by.repeater('project in projects')).count()).toEqual(12);

        expect(element(by.id('proj-70001')).isPresent()).toBe(true);
        expect(element(by.id('proj-70002')).isPresent()).toBe(true);
        expect(element(by.id('proj-70003')).isPresent()).toBe(true);
        expect(element(by.id('proj-79999')).isPresent()).toBe(false);

        helpers.logout();
    })

//    it('should list registered projects in correct order', function() {
//
//    })
});
