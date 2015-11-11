describe('Project list page', function() {

    it('should list registered projects', function() {
        // change below line to browser.get('/projects') once logging in implemented
        // in e2e testing
        browser.get('/');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(7);

        expect(element(by.id('proj-70001')).isPresent()).toBe(true);
        expect(element(by.id('proj-70002')).isPresent()).toBe(true);
        expect(element(by.id('proj-70003')).isPresent()).toBe(true);
        expect(element(by.id('proj-79999')).isPresent()).toBe(false);
    })

//    it('should list registered projects in correct order', function() {
//
//    })
});
