describe('Organisation list page', function() {

    it('should list organisations', function() {
        browser.get('/organisations');
        expect(element.all(by.repeater('organisation in organisations')).count()).toEqual(3);
    })
})
