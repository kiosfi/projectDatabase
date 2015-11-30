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
            "name": "Human rights org",
            "representative": "Representative",
            "exec_manager": "Mrs Manager",
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
            "history_status": "järjestön historiaa...",
            "int_links": "link 1, link 2",
            "nat_local_links": "link a, link b",
            "other_funding": "some funders...",
            "bank_account": ObjectId("56150897b560c1fc0b9b3015")}
);

db.organisations.insert(
        {"_id": ObjectId("6f25e7cf1526771eee2a0043"),
            "name": "Womens' rights",
            "representative": "Matti Meikäläinen",
            "exec_manager": "Matti Manageri",
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
            "history_status": "järjestön historiaa...",
            "int_links": "link 1, link 2",
            "nat_local_links": "link a, link b",
            "other_funding": "some funders...",
            "bank_account": ObjectId("56150897b560c1fc0b9b3015")}
);

db.organisations.insert(
        {"_id": ObjectId("8344235a153b2cf192bf74b2"),
            "name": "Organization nr 3",
            "representative": "John Doe",
            "exec_manager": "Piia Pomo",
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
            "history_status": "järjestön historiaa...",
            "int_links": "link 1, link 2",
            "nat_local_links": "link a, link b",
            "other_funding": "some funders...",
            "bank_account": ObjectId("56150897b560c1fc0b9b3015")}
);

db.projects.insert({"_id": ObjectId("56091cbc00fccd6d66bc5cc3"),
    "project_ref": "70001",
    "title": "Human rights",
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "rekisteröity",
    "reg_date": "12.10.2014",
    "funding":
            {"applied_curr_local": 50000,
                "applied_curr_eur": 10000},
    "duration_months": 30,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12345",
    "region": "Aasia"}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7a41b"),
    "project_ref": "70002",
    "title": "Minority rights",
    "coordinator": "Maija Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "käsittelyssä",
    "reg_date": "2.11.2015",
    "funding":
            {"applied_curr_local": 18000,
                "applied_curr_eur": 8000},
    "duration_months": 36,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "naisnäkökulma",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC1C345",
    "region": "Afrikka",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("f2e7c9aeb017189911996768"),
    "project_ref": "70003",
    "title": "Project nr 3",
    "coordinator": "John Doe",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "hyväksytty",
    "reg_date": "7.10.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 18,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12355",
    "region": "Aasia",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {"user": "Maria",
                "approved_date": "12.15.2015",
                "approved_by": "Toiminnanjohtaja",
                "board_notified": "13.15.2015",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen"
                    }
                ],
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "granted_sum_eur": 60000}}
);

db.projects.insert({"_id": ObjectId("f2e7c9adb017176611996768"),
    "project_ref": "70004",
    "title": "Project nr 5",
    "coordinator": "John Smith",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "hylätty",
    "reg_date": "7.12.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 18,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC12355",
    "region": "Afrikka",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94260406da7a7a41b"),
    "project_ref": "70006",
    "title": "Project A",
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "allekirjoitettu",
    "reg_date": "7.12.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 20,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC12355",
    "region": "Afrikka",
    "planned_payments": [{"date": "27.12.2015", "sum_eur": 5000, "sum_local": 10000}],
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {"user": "Maria",
                "approved_date": "12.15.2015",
                "approved_by": "Toiminnanjohtaja",
                "board_notified": "13.15.2015",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen"
                    }
                ],
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "granted_sum_eur": 60000},
    "signed": {"user": "Maria",
                "signed_by": "Maija Meri",
                "signed_date": "3.1.2016",
                "planned_payments": [
                    {
                        "sum_local": 10000,
                        "sum_eur": 5000,
                        "date": "15.1.2016"
                    },
                    {
                        "sum_local": 10000,
                        "sum_eur": 5000,
                        "date": "15.3.2016"
                    }
                ],
                "intreport_deadlines": [
                    {
                        "date": "1.10.2016",
                        "report": "1. väliraportti"
                    }
                ]
            }}
);

db.projects.insert({"_id": ObjectId("a2c8c9adb020176611996768"),
    "project_ref": "70007",
    "title": "Project B",
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "väliraportti",
    "reg_date": "7.12.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 20,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen taustoja",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donorA, donorB",
    "dac": "ABC12355",
    "region": "Afrikka",
    "planned_payments": [{"date": "27.12.2015", "sum_eur": 5000, "sum_local": 10000}],
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {"user": "Maria",
                "approved_date": "12.15.2015",
                "approved_by": "Toiminnanjohtaja",
                "board_notified": "13.15.2015",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen"
                    }
                ],
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "granted_sum_eur": 60000},
      "signed": {"user": "Maria",
                "signed_by": "Maija Meri",
                "signed_date": "3.1.2016",
                "planned_payments": [
                    {
                        "sum_local": 10000,
                        "sum_eur": 5000,
                        "date": "15.1.2016"
                    },
                    {
                        "sum_local": 10000,
                        "sum_eur": 5000,
                        "date": "15.3.2016"
                    }
                ],
                "intreport_deadlines": [
                    {
                        "date": "1.10.2016",
                        "report": "1. väliraportti"
                    }
                ]
            },
    "intermediary_reports": [{
                "user": "Sonja",
                reportNumber: 1,
                methods: ["Onnistui adglnbeanaeöajröjah", "Kohtalaisesti onnistui adkvökabknbslnbknadnan"],
                objectives: ["Tavoitteiden arviointia ......."],
                overall_rating_kios: "arvio kaf wrpwrpwrpwr",
                approved_by: "Halko",
                date_approved: "12.3.2015",
                comments: "Muut kommentit hankkeen onnistumisesta"
            }]}
);

db.projects.insert({"_id": ObjectId("a2c8c9adb020176622996766"),
    "project_ref": "70008",
    "title": "Project C",
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "loppuraportti",
    "reg_date": "7.12.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 11,
    "description": "Lyhyt kuvaus hankkeesta",
    "description_en": "A short description",
    "background": "Hankkeen taustoja",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donorA, donorB",
    "dac": "ABC12355",
    "region": "Afrikka",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {"user": "Maria",
                "approved_date": "12.15.2015",
                "approved_by": "Toiminnanjohtaja",
                "board_notified": "13.15.2015",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen"
                    }
                ],
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "granted_sum_eur": 60000},
    "signed": {"user": "Maria",
                "signed_by": "Maija Meri",
                "signed_date": "3.1.2016",
                "planned_payments": [
                    {
                        "sum_local": 10000,
                        "sum_eur": 5000,
                        "date": "15.1.2016"
                    },
                    {
                        "sum_local": 10000,
                        "sum_eur": 5000,
                        "date": "15.3.2016"
                    }
                ],
                "intreport_deadlines": [
                    {
                        "date": "1.10.2016",
                        "report": "1. väliraportti"
                    }
                ]
            }}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7a111"),
    "project_ref": "70009",
    "title": "Elder rights",
    "coordinator": "Matti Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "käsittelyssä",
    "reg_date": "12.11.2015",
    "funding":
            {"applied_curr_local": 118000,
                "applied_curr_eur": 18000},
    "duration_months": 16,
    "description": "Lyhyt kuvaus ....",
    "description_en": "A short description ....",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "näkökulma",
    "project_goal": "Hankkeen päätavoite on ...",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1",
    "dac": "ABC1C345",
    "region": "Aasia",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("779ed9f94250406da7a7a111"),
    "project_ref": "70010",
    "title": "Some rights",
    "coordinator": "Matti Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "käsittelyssä",
    "reg_date": "12.1.2012",
    "funding":
            {"applied_curr_local": 218000,
                "applied_curr_eur": 128000},
    "duration_months": 26,
    "description": "Lyhyt kuvaus ....",
    "description_en": "A short description ....",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "näkökulma",
    "project_goal": "Hankkeen päätavoite on ...",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1",
    "dac": "ABC1C345",
    "region": "Aasia",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7aabc"),
    "project_ref": "70011",
    "title": "Human rights 123",
    "coordinator": "Matti Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "käsittelyssä",
    "reg_date": "16.08.2015",
    "funding":
            {"applied_curr_local": 8000,
                "applied_curr_eur": 108000},
    "duration_months": 40,
    "description": "Lyhyt kuvaus ....",
    "description_en": "A short description ....",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2",
    "gender_aspect": "oikeusnäkökulma",
    "project_goal": "Hankkeen päätavoite on ...",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor567",
    "dac": "ABC1C345",
    "region": "Aasia",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"}}
);

db.projects.insert({"_id": ObjectId("56091ded00fccd6d66bc5cc3"),
    "project_ref": "70012",
    "title": "Human rights now",
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "rekisteröity",
    "reg_date": "12.10.2014",
    "funding":
            {"applied_curr_local": 50000,
                "applied_curr_eur": 10000},
    "duration_months": 30,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12345",
    "region": "Aasia"}
);

db.projects.insert({"_id": ObjectId("56091ded00fdde6d66bc5cc3"),
    "project_ref": "70013",
    "title": "Worklife rights",
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "state": "rekisteröity",
    "reg_date": "12.10.2014",
    "funding":
            {"applied_curr_local": 50000,
                "applied_curr_eur": 10000},
    "duration_months": 30,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12345",
    "region": "Aasia"}
);

db.projects.insert({"_id": ObjectId("f2c7d9aeb017189911996768"),
    "project_ref": "70014",
    "title": "Project for children",
    "coordinator": "John Doe",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "hyväksytty",
    "reg_date": "7.10.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 22,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donor2",
    "dac": "ABC12355",
    "region": "Aasia",
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {"user": "Maria",
                "approved_date": "12.15.2015",
                "approved_by": "Toiminnanjohtaja",
                "board_notified": "13.15.2015",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen"
                    }
                ],
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "granted_sum_eur": 60000}}
);

db.projects.insert({"_id": ObjectId("123459f94260406da7a7a41b"),
    "project_ref": "70015",
    "title": "Project Signed",
    "coordinator": "Tommi Testi",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "state": "allekirjoitettu",
    "reg_date": "12.12.2015",
    "funding":
            {"applied_curr_local": 100000,
                "applied_curr_eur": 12000},
    "duration_months": 20,
    "description": "Lyhyt kuvaus",
    "description_en": "A short description",
    "background": "Hankkeen tausta",
    "beneficiaries": "1, 2, 3",
    "gender_aspect": "ei ole",
    "project_goal": "Hankkeen päätavoite",
    "sustainability_risks": "riskit...",
    "reporting_evaluation": "raportointityökalut ym.",
    "other_donors_proposed": "donor1, donorB",
    "dac": "ABC12355",
    "region": "Afrikka",
    "planned_payments": [{"date": "27.12.2015", "sum_eur": 5000, "sum_local": 10000}],
    "in_review": { "user": "Pekka Puupää", "comments": "Jep jep"},
    "approved": {"user": "Maria",
                "approved_date": "12.15.2015",
                "approved_by": "Toiminnanjohtaja",
                "board_notified": "13.15.2015",
                "methods": [
                    {
                        "level": "Kansainvälinen",
                        "name": "Kapasiteetin vahvistaminen"
                    }
                ],
                "themes": [
                    "Oikeusvaltio ja demokratia"
                ],
                "granted_sum_eur": 60000},
    "signed": {"user": "Maria",
                    "signed_by": "Maija Meri",
                    "signed_date": "3.1.2016",
                    "planned_payments": [
                        {
                            "sum_local": 10000,
                            "sum_eur": 5000,
                            "date": "15.1.2016"
                        },
                        {
                            "sum_local": 10000,
                            "sum_eur": 5000,
                            "date": "15.3.2016"
                        }
                    ],
                    "intreport_deadlines": [
                        {
                            "date": "1.10.2016",
                            "report": "1. väliraportti"
                        }
                    ]
                }}
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
