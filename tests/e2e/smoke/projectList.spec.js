describe('Project list page', function() {
//    ptor = protractor.getInstance();
//     it('should contain "Lisätyt hankkeet"', function() {
//         browser.get('/projects');
//         var header = ptor.findElement(protractor.By.tagName('h1'));
//         expect(header.getText()).toEqual('Lisätyt hankkeet');
//     })   

    it('should list registered projects', function() {
        // change below line to browser.get('/projects') once logging in implemented 
        // in e2e testing
        browser.get('/');
        expect(element.all(by.repeater('project in projects')).count()).toEqual(3);
    })
})