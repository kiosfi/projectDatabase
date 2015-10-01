describe('Project list page', function() {
//    ptor = protractor.getInstance();
//     it('should contain "Lisätyt hankkeet"', function() {
//         browser.get('/projects');
//         var header = ptor.findElement(protractor.By.tagName('h1'));
//         expect(header.getText()).toEqual('Lisätyt hankkeet');
//     })

    it('should list registered projects', function() {
        expect(element.all(by.repeater('project in projects')).count()).toEqual(3);
    })
})
