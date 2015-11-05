describe('Project list page', function() {

    it('should list registered projects', function() {
        // change below line to browser.get('/projects') once logging in implemented
        // in e2e testing
        browser.get('/');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(3);

        // TODO: Fix existence testing.
//        expect(element(by.id('proj-70001'))).toEqual(jasmine.anything());
//        expect(element(by.id('proj-70002'))).toEqual(jasmine.anything());
//        expect(element(by.id('proj-70003'))).toEqual(jasmine.anything());
//        expect(element(by.id('proj-70004'))).not.toEqual(jasmine.anything());
    })

    // TODO: Implement tests for sorting functionality.
})
