var helpers = require("../helpers.e2e");
describe("Organisation view page", function() {

    beforeAll(function() {
        helpers.login();
    });
    afterAll(function() {
        helpers.logout();
    });

    it("should display all the fields of an organisation correctly", function() {
        element(by.linkText("Järjestöt")).click();
        element(by.linkText("Human rights org")).click();
        expect(element(by.binding("organisation.name")).getText()).
                toEqual("Human rights org");

        // TODO: Find out what"s wrong here:
//        expect(element(by.binding("organisation.representative.name")).
//                getText()).toEqual("Representative");
//        expect(element(by.binding("organisation.representative.email")).
//                getText()).toEqual("email@email.com");
//        expect(element(by.binding("organisation.representative.phone")).
//                getText()).toEqual("12345");

        expect(element(by.binding("organisation.exec_manager")).
                getText()).toEqual("Mrs Manager");
        expect(element(by.binding("organisation.communications_rep")).
                getText()).toEqual("John Doe");

        // TODO: Find out what"s wrong here:
//        expect(element(by.binding("organisation.address.street")).
//                getText()).toEqual("Samppalinnantie 20 C 22");
//        expect(element(by.binding("organisation.address.postal_code")).
//                getText()).toEqual("00780");
//        expect(element(by.binding("organisation.address.city")).
//                getText()).toEqual("Samppalinna");
//        expect(element(by.binding("organisation.address.country")).
//                getText()).toEqual("Suomi");

        expect(element(by.binding("organisation.tel")).
                getText()).toEqual("123445");
        expect(element(by.binding("organisation.email")).
                getText()).toEqual("email@org.com");
        expect(element(by.binding("organisation.website")).
                getText()).toEqual("www.org.com");
        expect(element(by.binding("organisation.bank_account.holder_name")).
                getText()).toEqual("Järjestö1");
        expect(element(by.binding("organisation.bank_account.iban")).
                getText()).toEqual("FI1234456789000");
        expect(element(by.binding("organisation.bank_account.swift")).
                getText()).toEqual("NDEAFIHH");
        expect(element(by.binding("organisation.bank_account.bank_contact_details")).
                getText()).toEqual("Nordea Helsinki");
        var repeater = element.all(by.repeater("project in orgProjects"));
        expect(repeater.count()).toEqual(7);
        expect(repeater.get(0).all(by.tagName("td")).get(0).getText()).
                toEqual("Elder rights");
        expect(repeater.get(1).all(by.tagName("td")).get(0).getText()).
                toEqual("Human rights");
        expect(repeater.get(2).all(by.tagName("td")).get(0).getText()).
                toEqual("Human rights 123");
        expect(repeater.get(3).all(by.tagName("td")).get(0).getText()).
                toEqual("Human rights now");
        expect(repeater.get(4).all(by.tagName("td")).get(0).getText()).
                toEqual("Minority rights");
        expect(repeater.get(5).all(by.tagName("td")).get(0).getText()).
                toEqual("Some rights");
        expect(repeater.get(6).all(by.tagName("td")).get(0).getText()).
                toEqual("Worklife rights");
        expect(element(by.binding("organisation.legal_status")).
                getText()).toEqual("hyväntekeväisyysjärjestö");
        expect(element(by.binding("organisation.description")).
                getText()).toEqual("järjestön historiaa...");
        expect(element(by.binding("organisation.int_links")).
                getText()).toEqual("link 1, link 2");
        expect(element(by.binding("organisation.other_funding_budget")).
                getText()).toEqual("some funders...");
        expect(element(by.binding("organisation.accounting_audit")).
                getText()).toEqual("All audits are OK.");
        expect(element(by.binding("organisation.background")).
                getText()).toEqual("");
        expect(element.all(by.repeater("update in organisation.updated")).count()).toEqual(0);
    });

    // Currently, the system doesn"t handle non-existent organisations properly.
    xit("should not attempt to display non-existing organisations", function() {
        browser.get("/organisations/56091a0525f75ebc0c486333");
        expect(element(by.id("error")).$("div").getText()).toEqual("Virhe - 404");
    });

    it("should redirect to login page if not logged in ", function () {
        helpers.logout();
        browser.get("/organisations/56091a0525f75ebc0c486338");
        expect(browser.getCurrentUrl()).toContain("/auth/login");
        helpers.login();
    });
});