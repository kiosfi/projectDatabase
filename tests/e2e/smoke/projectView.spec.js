var helpers = require('../helpers.e2e');

describe('Project view page', function () {

    it('should show name and details of project when logged in ', function () {        
        helpers.login();
        
        element.all(by.repeater('project in projects')).
                get(0).$('a').click();

        expect(browser.getCurrentUrl()).toContain('56091cbc00fccd6d66bc5cc3');
        
        helpers.logout();
    })
    
    it('should redirect to login page when not logged in ', function () {
        browser.get('/');
        
        element.all(by.repeater('project in projects')).
                get(0).$('a').click();

        expect(browser.getCurrentUrl()).toContain('/auth/login');
    })
})
