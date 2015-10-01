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
        submit.click();
        browser.get('/');
        element.all(by.repeater('project in projects'), function(elem) {
          return elem[0].$('a').click();
        });
        expect(browser.getCurrentUrl()).toContain('560d27ab7b46bfe2c9bb36c7')
    })
})
