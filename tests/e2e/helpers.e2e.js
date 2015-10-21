var helpers = function helpers() {

    this.login = function () {
        browser.get('/');
        element(by.linkText("Kirjaudu")).click();

        var email = element(by.model('login.user.email'));
        var password = element(by.model('login.user.password'));
        email.sendKeys('test@test.com');
        password.sendKeys('loltest15');
        var submit = element(by.buttonText("Kirjaudu"));
        submit.click();
    };

    this.logout = function () {
        browser.get(browser.baseUrl + '/');
        browser.executeScript('window.localStorage.clear();');
    };

}

module.exports = new helpers();
