var helpers = require("../helpers.e2e");

describe("Changing project state to rejected", function () {
//    it("should not show change-page when not logged in", function (done) {
//
//    });

    beforeAll(function() {
        helpers.login();
    })

    beforeEach(function() {
        element(by.linkText("Hankkeet")).click();
    })

    afterAll(function() {
        helpers.logout();
    });

    xit("should change state if valid data is filled in form", function () {
        element(by.linkText("Some rights")).click();

        element(by.model("project.changeTo")).element(by.cssContainingText("option", "hylätty")).click();
        element(by.id("st")).click();

        expect(browser.getCurrentUrl()).toContain("/change");

        element(by.id("addRej")).click();

        element(by.model("rej.rejection")).element(by.cssContainingText("option", "1 Hanke ei ole ihmisoikeushanke")).click();

        element(by.id("addRej")).click();

        element.all(by.model("rej.rejection")).get(1).element(by.cssContainingText("option", "7 Strategia")).click();

        element(by.model("project.rejected.rejection_comments")).sendKeys("Hanke ei vastaa vaatimuksia");

        browser.executeScript("window.scrollTo(0,100000)").then(function () {
            element(by.id("rejected-button")).click();
        });


        expect(browser.getCurrentUrl()).toContain("/779ed9f94250406da7a7a111");
        var state = element(by.id("state_field")).getText();
        expect(state).toContain("hylätty");
    });

    xit("should stay on change-page when trying to submit invalid form", function () {
        element(by.linkText("Human rights 123")).click();
        element(by.model("project.changeTo")).element(by.cssContainingText("option", "hylätty")).click();
        element(by.id("st")).click();

        expect(browser.getCurrentUrl()).toContain("/change");

        // test for saving empty form
        element(by.id("rejected-button")).click();
        expect(browser.getCurrentUrl()).toContain("/change");

        // test for saving form when comments are added but rejection reasons not
        element(by.model("project.rejected.rejection_comments")).sendKeys("Hanke ei vastaa vaatimuksia");
        element(by.id("rejected-button")).click();
        expect(browser.getCurrentUrl()).toContain("/change");

        // test for saving form when comments are added and "Lisää uusi"-button clicked,
        // but rejection reasons not selected
        element(by.id("addRej")).click();
        element(by.model("project.rejected.rejection_comments")).sendKeys("Hanke ei vastaa vaatimuksia");
        element(by.id("rejected-button")).click();
        expect(browser.getCurrentUrl()).toContain("/change");

        // test for saving form when rejection reasons are added but comments are not
        element(by.id("addRej")).click();
        element.all(by.model("rej.rejection")).get(1).element(by.cssContainingText("option", "7 Strategia")).click();
        element(by.id("rejected-button")).click();
        expect(browser.getCurrentUrl()).toContain("/change");
    });

    it("should not change state if user clicks cancel-button in change-view", function () {
        element(by.linkText("Human rights 123")).click();

        element(by.model("project.changeTo")).element(by.cssContainingText("option", "hylätty")).click();
        element(by.id("st")).click();

        expect(browser.getCurrentUrl()).toContain("/change");

        browser.navigate().back();

        expect(browser.getCurrentUrl()).toContain("/5c9ed9f94250406da7a7aabc");
        var state = element(by.id("state_field")).getText();
        expect(state).toContain("käsittelyssä (keskeneräinen)");
    });
});
