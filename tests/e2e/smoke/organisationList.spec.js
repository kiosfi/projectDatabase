var helpers = require('../helpers.e2e');
describe('Organisation list page', function() {

    it('should list organisations when user is logged in', function() {
        helpers.login();
        
        element(by.linkText('Järjestölistaus')).click();
        expect(element.all(by.repeater('organisation in organisations')).count()).toEqual(3);
        
        helpers.logout();
    })
})
