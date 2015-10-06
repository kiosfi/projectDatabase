describe('Project view page', function () {

//    beforeEach(function() {
//
//    })

    it('should show name and details of project', function () {
        browser.get('/auth/login');
        var email = element(by.model('login.user.email'));
        var password = element(by.model('login.user.password'));
        email.sendKeys('test@test.com');
        password.sendKeys('loltest15');
        var submit = element(by.buttonText("Login"));
        submit.click().then(function () {
            
            element.all(by.repeater('project in projects'), function (elem) {
                return elem[0].$('a').click();
                browser.pause();
            });
        });


        expect(browser.getCurrentUrl()).toContain('560d27ab7b46bfe2c9bb36c7')
    })
})
