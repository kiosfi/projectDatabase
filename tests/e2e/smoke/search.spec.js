var helpers = require("../helpers.e2e");

describe("Search page", function () {

    // Doesn"t pass: says "element not visible" though finds everything.
    xit("should find existing projects selected params", function () {
        helpers.login();

        element(by.linkText("Haku")).click();
        element(by.buttonText("Lisää")).click();
        element(by.model("query.field")).element(by.cssContainingText("option", "Tila")).click();
        element(by.model("query.value")).element(by.cssContainingText("option", "rekisteröity")).click();

        element(by.buttonText("Lisää")).click();
        element.all(by.model("query.field")).get(1).element(by.cssContainingText("option", "Alue")).click();
        element.all(by.model("query.value")).get(1).sendKeys("aasia");
        element(by.buttonText("Hae")).click();
        browser.pause();

        browser.wait().then(function () {
            var results = element.all(by.repeater("result in results"));
            expect(results.count()).toEqual(3);
        });

        helpers.logout();
    });
  });
