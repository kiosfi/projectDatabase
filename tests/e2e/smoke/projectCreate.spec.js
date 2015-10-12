var helpers = require('../helpers.e2e');

<<<<<<< HEAD
describe('Project create page', function() {

    it('should not show create page if not logged in', function() {
=======
describe('Project create page', function () {

    it('should not show create page if not logged in', function () {
>>>>>>> 20aac7c6c6cf48734c5b052fe5696ff5b4782de8
        browser.get('/projects/create');

        expect(browser.getCurrentUrl()).toContain('/auth/login');
    });

    it('should create project with valid data filled in form', function () {
        helpers.login();

        element(by.linkText("Hankkeiden lisäys")).click();

        element(by.model('project.title')).sendKeys('Test title');
        element(by.model('project.coordinator')).sendKeys('Tets coordinator');
        element(by.model('project.organisation.name')).sendKeys('Test organisation');
        element(by.model('project.organisation.representative')).sendKeys('Test prep');
        element(by.model('project.organisation.address')).sendKeys('Test org address 123');
        element(by.model('project.organisation.tel')).sendKeys('+123456789');
        element(by.model('project.organisation.email')).sendKeys('org@test.com');
        element(by.model('project.organisation.website')).sendKeys('www.testorg.com');
        element(by.model('project.status')).element(by.cssContainingText('option', 'rekisteröity')).click();
        element(by.model('project.funding.applied_curr_local')).sendKeys('100000');
        element(by.model('project.funding.applied_curr_eur')).sendKeys('19000');
        element(by.model('project.duration_months')).sendKeys('20');
        element(by.model('project.description')).sendKeys('Short description of project');
        element(by.model('project.description_en')).sendKeys('Short summary in english');

        element(by.model('project.background')).sendKeys('Test projects background');
        element(by.model('project.beneficiaries')).sendKeys('Test beneficiaries');
        element(by.model('project.gender_aspect')).sendKeys('Test projects gender aspects are...');
        element(by.model('project.project_goal')).sendKeys('Goals in test project are...');
        element(by.model('project.sustainability_risks')).sendKeys('Test projects risks are...');
        element(by.model('project.reporting_evaluation')).sendKeys('Test project reports....');
        element(by.model('project.other_donors_proposed')).sendKeys('Other donors');
        element(by.model('project.dac')).sendKeys('12345677');
        element(by.model('project.organisation.legal_status')).sendKeys('Orgs legal status is...');
        element(by.model('project.organisation.history_status')).sendKeys('Orgs history...');
        element(by.model('project.organisation.int_links')).sendKeys('Test international links');
        element(by.model('project.organisation.bank_account.bank_contact_details')).sendKeys('Test bank details');
        element(by.model('project.organisation.bank_account.iban')).sendKeys('FI12345678');
        element(by.model('project.organisation.bank_account.swift')).sendKeys('iffifihh');
        element(by.model('project.organisation.bank_account.holder_name')).sendKeys('Test holder');

        element(by.buttonText("Lähetä")).click();

        var header = element(by.css('section')).element(by.tagName('h2'));
        expect(header.getText()).toContain('Test title');

        helpers.logout();
    });

    it('should not create project with empty form', function () {
        helpers.login();

        element(by.linkText("Hankkeiden lisäys")).click();
        element(by.buttonText("Lähetä")).click();

        expect(browser.getCurrentUrl()).toContain('/projects/create');


        helpers.logout();
<<<<<<< HEAD
    });

    it('should not create project with empty form', function() {
       helpers.login();

       element(by.linkText("Hankkeiden lisäys")).click();
       element(by.buttonText("Lähetä")).click();

       expect(browser.getCurrentUrl()).toContain('/projects/create');

       helpers.logout();
    });

});
=======
    });
});
>>>>>>> 20aac7c6c6cf48734c5b052fe5696ff5b4782de8
