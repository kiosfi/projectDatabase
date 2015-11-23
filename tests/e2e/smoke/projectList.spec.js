describe('Project list page', function() {

    it('should list registered projects', function() {
        // change below line to browser.get('/projects') once logging in implemented
        // in e2e testing
        browser.get('/');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(3);

        expect(element(by.id('proj-70001')).isPresent()).toBe(true);
        expect(element(by.id('proj-70002')).isPresent()).toBe(true);
        expect(element(by.id('proj-70003')).isPresent()).toBe(true);
    });

    it('should list registered projects in correct order', function() {
        expect(element(by.tagName('table')).isPresent()).toBe(true);
        var rep = element.all(by.repeater('project in projects'));
//        expect(rep.get(0)).toEqual(jasmine.anything);
        console.log(rep.get(0));
    });
});
