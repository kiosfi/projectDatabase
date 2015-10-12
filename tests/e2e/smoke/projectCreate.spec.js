var helpers = require('../helpers.e2e');

describe('Project create page', function() {

    it('should not show create page if not logged in', function() {
        browser.get('/projects/create');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
    });

//    it('should create project with valid data filled in form', function () {
//        helpers.login();
//
//        element(by.linkText("Hankkeiden lisäys")).click();
//
//
//        expect(true.toBe(true));
//        helpers.logout();
//    });

    it('should not create project with empty form', function() {
       helpers.login();

       element(by.linkText("Hankkeiden lisäys")).click();
       element(by.buttonText("Lähetä")).click();

       expect(browser.getCurrentUrl()).toContain('/projects/create');

       helpers.logout();
    });

});
