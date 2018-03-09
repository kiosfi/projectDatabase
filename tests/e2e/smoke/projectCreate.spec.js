var helpers = require("../helpers.e2e");


describe("Project create page", function () {

    beforeAll(function() {
        helpers.login();
    })

    afterAll(function() {
        helpers.logout();
    });

    it("should not show create page if not logged in", function () {
        helpers.logout();

        browser.get("/projects/create");

        expect(browser.getCurrentUrl()).toContain("/auth/login");

        helpers.login();
    });

    xit("should create project and new organisation with valid data filled in form", function () {
        element(by.linkText("Hankkeen rekisteröinti")).click();
        element(by.linkText("Perustiedot")).click();
        browser.executeScript("window.scrollTo(0,100000)").then(function () {
          element(by.linkText("Lisätiedot")).click();
        });

        browser.executeScript("window.scrollTo(100000,0)").then(function () {
          element(by.model("project.title")).sendKeys("Test title");
        });

        element(by.model("project.coordinator")).sendKeys("Maija Maa");
        element(by.id("addOrg")).click();
        element(by.linkText("Järjestö")).click();

        element(by.model("project.organisation.name")).sendKeys("Test organisation");
        element(by.model("project.organisation.representative.name")).
                sendKeys("Test prep");
        element(by.model("project.organisation.representative.email")).
                sendKeys("xyz@test.com");
        element(by.model("project.organisation.representative.phone")).
                sendKeys("555-555 5555");
        // TODO: Figure out how to scroll down in order to reach the next fields:
        element(by.model("project.organisation.exec_manager")).sendKeys("Matti Manageri");
        element(by.model("project.organisation.address.street")).sendKeys("Test org address 123");
        element(by.model("project.organisation.address.postal_code")).sendKeys("90100");
        element(by.model("project.organisation.address.city")).sendKeys("Ankkalinna");
        element(by.model("project.organisation.address.country")).sendKeys("Suomi");
        element(by.model("project.organisation.tel")).sendKeys("+123456789");
        element(by.model("project.organisation.email")).sendKeys("org@test.com");
        element(by.model("project.organisation.website")).sendKeys("www.testorg.com");

        browser.executeScript("window.scrollTo(0,100000)").then(function () {
          element(by.model("project.funding.applied_curr_eur")).sendKeys("19000");
        });
        element(by.model("project.funding.applied_curr_local")).sendKeys("19000");
        element(by.model("project.duration_months")).sendKeys("20");
        element(by.model("project.description")).sendKeys("Short description of project");
        element(by.model("project.description_en")).sendKeys("Short summary in english");

        browser.executeScript("window.scrollTo(0,100000)").then(function () {
          element(by.model("project.background")).sendKeys("Test projects background");
        });

        element(by.model("project.beneficiaries")).sendKeys("Test beneficiaries");
        element(by.model("project.gender_aspect")).sendKeys("Test projects gender aspects are...");
        element(by.model("project.project_goal")).sendKeys("Goals in test project are...");
        element(by.model("project.sustainability_risks")).sendKeys("Test projects risks are...");
        element(by.model("project.reporting_evaluation")).sendKeys("Test project reports....");
        element(by.model("project.other_donors_proposed")).sendKeys("Other donors");
        element(by.model("project.region")).sendKeys("Asia");
        element(by.model("project.dac")).sendKeys("12345677");

        browser.executeScript("window.scrollTo(100000,0)").then(function () {
          element(by.linkText("Hakijajärjestön lisätiedot")).click();
        });

        element(by.model("project.organisation.legal_status")).sendKeys("Orgs legal status is...");
        element(by.model("project.organisation.history_status")).sendKeys("Orgs history...");
        element(by.model("project.organisation.int_links")).sendKeys("Orgs history...");
        element(by.model("project.organisation.description")).sendKeys("Description for test organisation");
        element(by.model("project.organisation.nat_local_links")).sendKeys("Test national & local links");
        element(by.model("project.organisation.other_funding")).sendKeys("Funding ......");

        element(by.linkText("Pankkitili")).click();
        element(by.model("project.organisation.bank_account.bank_contact_details")).sendKeys("Test bank details");
        element(by.model("project.organisation.bank_account.iban")).sendKeys("FI12345678");
        element(by.model("project.organisation.bank_account.swift")).sendKeys("iffifihh");
        element(by.model("project.organisation.bank_account.holder_name")).sendKeys("Test holder");

        browser.executeScript("window.scrollTo(100000,0)").then(function () {
          element(by.buttonText("Tallenna")).click();
        });

        var header = element(by.id("projtitle"));
        expect(header.getText()).toContain("Test title");

        var buttons = $$("i.glyphicon-trash");
        buttons.last().click();

        var alertDialog = browser.switchTo().alert();
        alertDialog.accept();

    });

    xit("should create project with valid data filled in form and organisation selected from list", function () {
        element(by.linkText("Hankkeen rekisteröinti")).click();
        element(by.linkText("Nimi, asiantuntija ja järjestö")).click();
        element(by.linkText("Perustiedot")).click();
        element(by.linkText("Lisätiedot")).click();

        // TODO: Figure out how to scroll to the right position:
        element(by.model("project.title")).sendKeys("Test title 2");
        element(by.model("project.coordinator")).sendKeys("Teppo Tenhunen");
        element(by.model("project.listOrganisation")).element(by.cssContainingText("option", "Human rights org")).click();

        element(by.model("project.funding.applied_curr_local")).sendKeys("300000");
        element(by.model("project.funding.applied_curr_eur")).sendKeys("10000");
        element(by.model("project.duration_months")).sendKeys("22");
        element(by.model("project.description")).sendKeys("Short description of project");
        element(by.model("project.description_en")).sendKeys("Short summary in english ...");
        element(by.model("project.background")).sendKeys("Test projects background ...");
        element(by.model("project.beneficiaries")).sendKeys("Test beneficiaries ...");
        element(by.model("project.gender_aspect")).sendKeys("Test projects gender aspects are...");
        element(by.model("project.project_goal")).sendKeys("Goals in are...");
        element(by.model("project.sustainability_risks")).sendKeys("risks are...");
        element(by.model("project.reporting_evaluation")).sendKeys("Test project reports....");
        element(by.model("project.other_donors_proposed")).sendKeys("Other donors");
        element(by.model("project.region")).sendKeys("Asia");
        element(by.model("project.dac")).sendKeys("12345677");

        element(by.buttonText("Tallenna")).click();
        var header = element(by.id("projtitle"));
        expect(header.getText()).toContain("Test title");

        var buttons = $$("i.glyphicon-trash");
        buttons.last().click();

        var alertDialog = browser.switchTo().alert();
        alertDialog.accept();

    });

    it("should not create project with empty form", function () {
        element(by.linkText("Hankkeen rekisteröinti")).click();
        element(by.linkText("Nimi, asiantuntija ja järjestö")).click();
        element(by.linkText("Perustiedot")).click();
        element(by.linkText("Lisätiedot")).click();
        element(by.buttonText("Tallenna")).click();

        expect(browser.getCurrentUrl()).toContain("/projects/create");
    });

});
