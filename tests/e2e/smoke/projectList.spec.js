describe('Project list page', function() {

    it('should list registered projects', function() {
        // change below line to browser.get('/projects') once logging in implemented
        // in e2e testing
        browser.get('/');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(3);
    })
})
