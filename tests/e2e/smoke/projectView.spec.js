var helpers = require("../helpers.e2e");

describe("Project view page", function () {

    beforeAll(function() {
        helpers.login();
    })

    afterAll(function() {
        helpers.logout();
    });

    it("should stay project view page if logged in ", function () {
        element(by.linkText("Hankkeet")).click();
        element(by.linkText("Human rights")).click();
        expect(browser.getCurrentUrl()).toContain("56091cbc00fccd6d66bc5cc3");
    });

    it("should show details of project if logged in", function () {
        element(by.linkText("Hankkeet")).click();
        element(by.linkText("Human rights")).click();
        expect(element(by.id("header")).$("h1").getText())
                .toEqual("70001: Human rights");
    });

    // This needs to be fixed:
    xit("should not attempt to display non-existent projects ", function () {
        browser.get("/projects/56091cbc00fccd6d66bc5cc3");
        // Some sort of 404 page is needed here.
    });

    it("should redirect to login page if not logged in ", function () {
        helpers.logout();
        browser.get("/projects/56091cbc00fccd6d66bc5cc3");
        expect(browser.getCurrentUrl()).toContain("/auth/login");
        helpers.login();
    });
});
