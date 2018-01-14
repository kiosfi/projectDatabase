db = connect("localhost:27017/testDB");

db.organisations.drop();
db.projects.drop();
db.states.drop();
db.bankaccounts.drop();
db.users.drop();

db.createCollection("organisations");
db.createCollection("projects");
db.createCollection("states");
db.createCollection("bankaccounts");
db.createCollection("users");

var date = new Date();

db.users.insert(
        {"_id": ObjectId("5614d428013b9a2f1ca236ce"),
            "email": "test@test.com",
            "hashed_password": "O2cdPpHlLOkwnQBnExKqwmRF3lpQRW8NDit/UCk+WQz06+CyUJjQOrrBf5mWrhGgE5YKn5y+DY4DZ6Q4zwT/3A==",
            "salt": "e5y3JfOstfMYQSZzpQ+acw==",
            "username": "testia",
            "name": "teppo testi",
            "provider": "local",
            "roles": ["authenticated"], "__v": 0}
);

db.bankaccounts.insert(
        {"_id": ObjectId("56150897b560c1fc0b9b3015"),
            "bank_contact_details": "Nordea Helsinki",
            "iban": "FI1234456789000",
            "swift": "NDEAFIHH",
            "holder_name": "Järjestö1"}
);

db.organisations.insert(
        {"_id": ObjectId("56091a0525f75ebc0c486338"),
            "schema_version": 3,
            "name": "Human rights org",
            "representative": {
                "name": "Representative",
                "email": "email@email.com",
                "phone": "12345"
            },
            "exec_manager": "Mrs Manager",
            "communications_rep": "John Doe",
            "address": {
                "street": "Samppalinnantie 20 C 22",
                "postal_code": "00780",
                "city": "Samppalinna",
                "country": "Suomi"
            },
            "tel": "123445",
            "email": "email@org.com",
            "website": "www.org.com",
            "legal_status": "hyväntekeväisyysjärjestö",
            "description": "järjestön historiaa...",
            "int_links": "link 1, link 2",
            "nat_local_links": "link a, link b",
            "other_funding_budget": "some funders...",
            "accounting_audit": "All audits are OK.",
            "context": "Liirum laarum...",
            "bank_account": ObjectId("56150897b560c1fc0b9b3015"),
            "special_notes": ""}
);

db.organisations.insert(
        {"_id": ObjectId("6f25e7cf1526771eee2a0043"),
            "schema_version": 3,
            "name": "Womens' rights",
            "representative": {
                "name": "Matti Meikäläinen",
                "email": "email@email.com",
                "phone": "12345"
            },
            "exec_manager": "Matti Manageri",
            "communications_rep": "Matti Meikäläinen",
            "address": {
                "street": "Ankkalinnankatu 123 A 45",
                "postal_code": "01780",
                "city": "Vantaa",
                "country": "Suomi"
            },
            "tel": "555 1234 567",
            "email": "email@wr.org",
            "website": "www.wr.org",
            "legal_status": "hyväntekeväisyysjärjestö",
            "description": "järjestön historiaa...",
            "int_links": "link 1, link 2",
            "nat_local_links": "link a, link b",
            "other_funding_budget": "some funders...",
            "accounting_audit": "All audits are OK.",
            "context": "Liirum laarum...",
            "bank_account": ObjectId("56150897b560c1fc0b9b3015"),
            "special_notes": ""}
);

db.organisations.insert(
        {"_id": ObjectId("8344235a153b2cf192bf74b2"),
            "schema_version": 3,
            "name": "Organization nr 3",
            "representative": {
                "name": "John Doe",
                "email": "email@email.com",
                "phone": "12345"
            },
            "exec_manager": "Piia Pomo",
            "communications_rep": "John Doe",
            "address": {
                "street": "Ankkalinnankatu 123 A 46",
                "postal_code": "01280",
                "city": "Ankkalinna",
                "country": "Suomi"
            },
            "tel": "555 9876 543",
            "email": "test@test.com",
            "website": "www.test.com",
            "legal_status": "hyväntekeväisyysjärjestö",
            "description": "järjestön historiaa...",
            "int_links": "link 1, link 2",
            "nat_local_links": "link a, link b",
            "other_funding_budget": "some funders...",
            "accounting_audit": "All audits are OK.",
            "context": "Liirum laarum...",
            "bank_account": ObjectId("56150897b560c1fc0b9b3015"),
            "special_notes": ""}
);

db.projects.insert({"_id": ObjectId("56091cbc00fccd6d66bc5cc3"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70001",
    "title": "Human rights",
    "date": date,
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "rekisteröity",
    "incomplete": false,
    "reg_date": date,
    "funding": {
        "applied_curr_local": 50000,
        "curr_local_unit": "RUB",
        "applied_curr_eur": 10000,
        "paid_eur": 0,
        "left_eur": 10000,
    },
    "duration_months": 30,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12345",
    "country": "Intia",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita"
}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7a41b"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70002",
    "title": "Minority rights",
    "date": date,
    "coordinator": "Maija Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "incomplete": true,
    "state": "käsittelyssä",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 18000,
        "curr_local_unit": "USD",
        "applied_curr_eur": 8000,
        "paid_eur": 0,
        "left_eur": 8000
    },
    "duration_months": 36,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "naisnäkökulma",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC1C345",
    "country": "Sierra Leone",
    "region": "Afrikka",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("f2e7c9aeb017189911996768"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70003",
    "title": "Project nr 3",
    "date": date,
    "coordinator": "John Doe",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": true,
    "state": "hyväksytty",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 0,
        "left_eur": 60000
    },
    "duration_months": 18,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12355",
    "country": "Intia",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {
        "date": date,
        "user": "Maria",
        "board_meeting": "1/2018",
        "decision": "Hyväksytään.",
        "approved_date": date,
        "approved_by": "Toiminnanjohtaja",
        "board_notified": date,
        "granted_sum_eur": 60000,
        "themes": [
            "Oikeusvaltio ja demokratia"
        ],
        "themes_disambiguation": " "}}
);

db.projects.insert({"_id": ObjectId("f2e7c9adb017176611996768"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70004",
    "title": "Project nr 5",
    "date": date,
    "coordinator": "John Smith",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": false,
    "state": "hylätty",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 0,
        "left_eur": 60000
    },
    "duration_months": 18,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC12355",
    "country": "Norsunluurannikko",
    "region": "Afrikka",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94260406da7a7a41b"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70006",
    "title": "Project A",
    "date": date,
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": true,
    "state": "allekirjoitettu",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 0,
        "left_eur": 60000
    },
    "duration_months": 20,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC12355",
    "country": "Benin",
    "region": "Afrikka",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "planned_payments": [{"date": date, "sum_eur": 5000, "sum_local": 10000}],
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {
        "date": date,
        "user": "Maria",
        "board_meeting": "1/2018",
        "decision": "Hyväksytään.",
        "approved_date": date,
        "approved_by": "Toiminnanjohtaja",
        "board_notified": date,
        "granted_sum_eur": 60000,
        "themes": [
            "Oikeusvaltio ja demokratia"
        ],
        "themes_disambiguation": " "},
    "signed": {"date": date,
        "user": "Maria",
        "signed_by": "Maija Meri",
        "signed_date": date,
        "planned_payments": [
            {
                "sum_eur": 5000,
                "date": date
            },
            {
                "sum_eur": 5000,
                "date": date
            }
        ],
        "intreport_deadlines": [
            {
                "date": date,
                "report": "1. väliraportti"
            }
        ]
    },
    "payments": [
        {
            "date": date,
            "sum_eur": 5000
        }
    ]}
);

db.projects.insert({"_id": ObjectId("a2c8c9adb020176611996768"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70007",
    "title": "Project B",
    "date": date,
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": true,
    "state": "väliraportti",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 0,
        "left_eur": 60000
    },
    "duration_months": 20,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen taustoja",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donorA, donorB",
    "dac": "ABC12355",
    "country": "Uganda",
    "region": "Afrikka",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "planned_payments": [{"date": date, "sum_eur": 5000, "sum_local": 10000}],
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {
        "date": date,
        "user": "Maria",
        "board_meeting": "1/2018",
        "decision": "Hyväksytään.",
        "approved_date": date,
        "approved_by": "Toiminnanjohtaja",
        "board_notified": date,
        "granted_sum_eur": 60000,
        "themes": [
            "Oikeusvaltio ja demokratia"
        ],
        "themes_disambiguation": " "},
    "signed": {"date": date,
        "user": "Maria",
        "signed_by": "Maija Meri",
        "signed_date": date,
        "planned_payments": [
            {
                "sum_eur": 5000,
                "date": date
            },
            {
                "sum_eur": 5000,
                "date": date
            }
        ],
        "intreport_deadlines": [
            {
                "date": date,
                "report": "1. väliraportti"
            }
        ]
    },
    "payments": [
        {
            "date": date,
            "sum_eur": 5000
        }
    ],
    "intermediary_reports": [{
            "reportNumber": 1,
            "date": date,
            "user": "Sonja",
            "budget": "Hankkeen suunniteltua budjetti ei ylitetty.",
            "communication": "Raportointi ja yhteydenpito hoitui asiallisesti.",
            "evaluation": "Joku kommentti...",
            "methods": ["Onnistui adglnbeanaeöajröjah", "Kohtalaisesti onnistui adkvökabknbslnbknadnan"],
            "objectives": ["Tavoitteiden arviointia ......."],
            "overall_rating_kios": "arvio kaf wrpwrpwrpwr",
            "comments": "Muut kommentit hankkeen onnistumisesta"
        }]}
);

db.projects.insert({"_id": ObjectId("a2c8c9adb020176622996766"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70008",
    "title": "Project C",
    "date": date,
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": true,
    "state": "loppuraportti",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 0,
        "left_eur": 60000
    },
    "duration_months": 11,
    "description": "Lyhyt kuvaus hankkeesta",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen taustoja",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donorA, donorB",
    "dac": "ABC12355",
    "country": "Etiopia",
    "region": "Afrikka",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {
        "date": date,
        "user": "Maria",
        "board_meeting": "1/2018",
        "decision": "Hyväksytään.",
        "approved_date": date,
        "approved_by": "Toiminnanjohtaja",
        "board_notified": date,
        "granted_sum_eur": 60000,
        "themes": [
            "Oikeusvaltio ja demokratia"
        ],
        "themes_disambiguation": " "},
    "signed": {"date": date,
        "user": "Maria",
        "signed_by": "Maija Meri",
        "signed_date": date,
        "planned_payments": [
            {
                "sum_eur": 5000,
                "date": date
            },
            {
                "sum_eur": 5000,
                "date": date
            }
        ],
        "intreport_deadlines": [
            {
                "date": date,
                "report": "1. väliraportti"
            }
        ]
    },
    "payments": [
        {
            "date": date,
            "sum_eur": 5000
        }
    ]
}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7a111"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70009",
    "title": "Elder rights",
    "date": date,
    "coordinator": "Matti Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "incomplete": true,
    "state": "käsittelyssä",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 118000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 18000,
        "paid_eur": 0,
        "left_eur": 10000
    },
    "duration_months": 16,
    "description": "Lyhyt kuvaus ....",
    "description_en": "A short description ....",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "näkökulma",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite on ...",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1",
    "dac": "ABC1C345",
    "country": "Sri Lanka",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("779ed9f94250406da7a7a111"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70010",
    "title": "Some rights",
    "date": date,
    "coordinator": "Matti Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "incomplete": false,
    "state": "käsittelyssä",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 218000,
        "curr_local_unit": "USD",
        "applied_curr_eur": 128000,
        "paid_eur": 28000,
        "left_eur": 100000
    },
    "duration_months": 26,
    "description": "Lyhyt kuvaus ....",
    "description_en": "A short description ....",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "näkökulma",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite on ...",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1",
    "dac": "ABC1C345",
    "country": "Nepal",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7aabc"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70011",
    "title": "Human rights 123",
    "date": date,
    "coordinator": "Matti Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "incomplete": true,
    "state": "käsittelyssä",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 8000,
        "curr_local_unit": "GBP",
        "applied_curr_eur": 108000,
        "paid_eur": 18000,
        "left_eur": 90000,
    },
    "duration_months": 40,
    "description": "Lyhyt kuvaus ....",
    "description_en": "A short description ....",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "oikeusnäkökulma",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite on ...",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor567",
    "dac": "ABC1C345",
    "country": "Malesia",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("56091ded00fccd6d66bc5cc3"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70012",
    "title": "Human rights now",
    "date": date,
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "incomplete": false,
    "state": "rekisteröity",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 50000,
        "curr_local_unit": "RUB",
        "applied_curr_eur": 10000,
        "paid_eur": 2000,
        "left_eur": 8000,
    },
    "duration_months": 30,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12345",
    "country": "Burma",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita"
}
);

db.projects.insert({"_id": ObjectId("56091ded00fdde6d66bc5cc3"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70013",
    "title": "Worklife rights",
    "date": date,
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "incomplete": false,
    "state": "rekisteröity",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 50000,
        "curr_local_unit": "RUB",
        "applied_curr_eur": 10000,
        "paid_eur": 2000,
        "left_eur": 8000,
    },
    "duration_months": 30,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12345",
    "country": "Kambodza",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita"
}
);

db.projects.insert({"_id": ObjectId("f2c7d9aeb017189911996768"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70014",
    "title": "Project for children",
    "date": date,
    "coordinator": "John Doe",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": false,
    "state": "hyväksytty",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 6000,
        "left_eur": 54000,
    },
    "duration_months": 22,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12355",
    "country": "Laos",
    "region": "Aasia",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {
        "date": date,
        "user": "Maria",
        "board_meeting": "1/2018",
        "decision": "Hyväksytään.",
        "approved_date": date,
        "approved_by": "Toiminnanjohtaja",
        "board_notified": date,
        "granted_sum_eur": 60000,
        "themes": [
            "Oikeusvaltio ja demokratia"
        ],
        "themes_disambiguation": " "}}
);

db.projects.insert({"_id": ObjectId("123459f94260406da7a7a41b"),
    "schema_version": 12,
    "security_level": "Julkinen",
    "project_ref": "70015",
    "title": "Project Signed",
    "date": date,
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "incomplete": true,
    "state": "allekirjoitettu",
    "reg_date": date,
    "funding": {
        "applied_curr_local": 100000,
        "curr_local_unit": "INR",
        "applied_curr_eur": 12000,
        "paid_eur": 6000,
        "left_eur": 54000,
    },
    "duration_months": 20,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "methods": [
        {
            "level": "Kansainvälinen",
            "name": "Kapasiteetin vahvistaminen",
            "comment": "Diipa daa"
        },
        {
            "level": "Kansallinen",
            "name": "Tietoisuuden lisääminen",
            "comment": "Blaa blaa"
        },
        {
            "level": "Paikallinen",
            "name": "Kampanjointi ja/tai lobbaus",
            "comment": "Sepi sepi"
        },
        {
            "level": "Yhteisö",
            "name": "Vaikuttamistyö",
            "comment": "Hokkus pokkus"
        }
    ],
    "context": "Hankkeen tausta",
    "target_group": "1, 2, 3",
    "human_resources": "Lorem ipsum",
    "gender_aspect": "ei ole",
    "vulnerable_groups": "Lässyn lässyn",
    "project_goal": "Hankkeen päätavoite",
    "planned_results": "Tulostavoitteet",
    "risk_control": "Riskinhallinnan kuvaus",
    "indicators": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC12355",
    "country": "Somalia",
    "region": "Afrikka",
    "referees": "Suosittelijat",
    "background_check": "Taustaselvitys",
    "budget": "Budjetti ja omarahoitusosuus",
    "fitness": "Sopivuus KIOSin strategiaan",
    "capacity": "Järjestön kapasiteetti ja asiantuntijuus",
    "feasibility": "Toteutettavuus ja riskit",
    "effectiveness": "Tuloksellisuus, vaikutukset ja vaikuttavuus",
    "proposed_funding": "Esitys",
    "special_notes": "Erityishuomioita",
    "planned_payments": [{"date": date, "sum_eur": 5000, "sum_local": 10000}],
    "in_review": {"user": "Pekka Puupää", "comments": "Jep jep"},
            "approved": {
                "date": date,
                "user": "Maria",
                "board_meeting": "1/2018",
                "decision": "Hyväksytään.",
                "approved_date": date,
                "approved_by": "Toiminnanjohtaja",
                "board_notified": date,
                "granted_sum_eur": 60000,
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "themes_disambiguation": " "},
    "signed": {"date": date,
        "user": "Maria",
        "signed_by": "Maija Meri",
        "signed_date": date,
        "planned_payments": [
            {
                "sum_eur": 5000,
                "date": date
            },
            {
                "sum_eur": 5000,
                "date": date
            }
        ],
        "intreport_deadlines": [
            {
                "date": date,
                "report": "1. väliraportti"
            }
        ]
    },
    "payments": []
}
);

db.states.insert([
    {
        current_state: "rekisteröity",
        next_states: ["käsittelyssä", "päättynyt"]
    },
    {
        current_state: "käsittelyssä",
        next_states: ["hyväksytty", "hylätty", "päättynyt"]
    },
    {
        current_state: "hyväksytty",
        next_states: ["allekirjoitettu", "hylätty", "päättynyt"]
    },
    {
        current_state: "hylätty",
        next_states: []
    },
    {
        current_state: "allekirjoitettu",
        next_states: ["väliraportti", "loppuraportti", "päättynyt"]
    },
    {
        current_state: "väliraportti",
        next_states: ["väliraportti", "loppuraportti", "päättynyt"]
    },
    {
        current_state: "loppuraportti",
        next_states: ["päättynyt"]
    },
    {
        current_state: "päättynyt",
        next_states: []
    }
]);
