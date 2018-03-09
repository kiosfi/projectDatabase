var helpers = require("../helpers.e2e");
describe("Organisation list page", function() {

    beforeAll(function() {
        helpers.login();
    });

    beforeEach(function() {
        element(by.linkText("Järjestöt")).click();
    });

    afterAll(function() {
        helpers.logout();
    });

    it("should list organisations when user is logged in", function() {
//        browser.pause();
        expect(element.all(by.repeater("org in organisations")).count())
                .toEqual(3);
    });

    it("should list organisations in the correct order", function() {
        var rep;
        rep = element.all(by.repeater("org in organisations"));
        expect(rep.get(0).all(by.tagName("td")).get(0).getText())
                .toEqual("Human rights org");
        expect(rep.get(1).all(by.tagName("td")).get(0).getText())
                .toEqual("Organization nr 3");
        expect(rep.get(2).all(by.tagName("td")).get(0).getText())
                .toEqual("Womens' rights");

        element(by.id("byName")).click();
        rep = element.all(by.repeater("org in organisations"));
        expect(rep.get(2).all(by.tagName("td")).get(0).getText())
                .toEqual("Human rights org");
        expect(rep.get(1).all(by.tagName("td")).get(0).getText())
                .toEqual("Organization nr 3");
        expect(rep.get(0).all(by.tagName("td")).get(0).getText())
                .toEqual("Womens' rights");

        element(by.id("byRep")).click();
        rep = element.all(by.repeater("org in organisations"));
        expect(rep.get(0).all(by.tagName("td")).get(0).getText())
                .toEqual("Organization nr 3");
        expect(rep.get(1).all(by.tagName("td")).get(0).getText())
                .toEqual("Womens' rights");
        expect(rep.get(2).all(by.tagName("td")).get(0).getText())
                .toEqual("Human rights org");

        element(by.id("byRep")).click();
        rep = element.all(by.repeater("org in organisations"));
        expect(rep.get(2).all(by.tagName("td")).get(0).getText())
                .toEqual("Organization nr 3");
        expect(rep.get(1).all(by.tagName("td")).get(0).getText())
                .toEqual("Womens' rights");
        expect(rep.get(0).all(by.tagName("td")).get(0).getText())
                .toEqual("Human rights org");
    });

    it("should redirect to login page if not logged in ", function () {
        helpers.logout();
        browser.get("/organisations");
        expect(browser.getCurrentUrl()).toContain("/auth/login");
        helpers.login();
    });
});
