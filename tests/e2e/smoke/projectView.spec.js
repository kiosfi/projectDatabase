
/*describe('Project view page', function() {
    it('should show name and details of project', function() {
        browser.get('/projects');

        var elem = element.all(by.repeater('project in projects')).
          get(0).
          element(by.linkText('{{project.title}}')).
          click();
          console.log(elem);
    })
})*/
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

            browser.get('/projects');

            var elements = element.all(by.repeater('project in projects')).
                    get(0).
                    $('a').
                    click();
            console.log(elements);
            var status = element(by.css('proj-div').$('proj-body').element(by.binding('project.status')));
//            browser.pause();
//            element.getAttribute('value')
//            browser.debugger();
            console.log(status);
        })


    })
})
