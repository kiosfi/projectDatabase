describe('Project view page', function () {

//    beforeEach(function() {
//
//    })

    it('should show name and details of project', function () {
        browser.get('/auth/login');
        var email = element(by.model('login.user.email'));
        var password = element(by.model('login.user.password'));
        email.sendKeys('mr.wisty@gmail.com');
        password.sendKeys('pe1971tE');
        var submit = element(by.buttonText("Login"));
        submit.click().then(function () {

            browser.get('/');

            var elems = element.all(by.repeater('project in projects')).first();
            var url = elems.all(by.css('a'));
            url.click();
            browser.pause();
            expect(url).toContain('560d27b97b46bfe2c9bb36c8');

//            element.getAttribute('value')
//            browser.debugger();
        })


    })
})
