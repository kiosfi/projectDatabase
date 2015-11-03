db = connect("localhost:27017/testDB");

db.organisations.drop();
db.projects.drop();

db.createCollection("organisations");
db.createCollection("projects");

db.organisations.insert(
        {"_id": ObjectId("56091a0525f75ebc0c486338"),
            "name": "Human rights org",
            "representative": "Representative",
            "address": "Adress 123",
            "tel": "123445",
            "email": "email@org.com",
            "website": "www.org.com"}
);

db.organisations.insert(
        {"_id": ObjectId("6f25e7cf1526771eee2a0043"),
            "name": "Womens' rights",
            "representative": "Matti Meikäläinen",
            "address": "Ankkalinnankatu 123 A 45",
            "tel": "555 1234 567",
            "email": "email@wr.org",
            "website": "www.wr.org"}
);

db.organisations.insert(
        {"_id": ObjectId("8344235a153b2cf192bf74b2"),
            "name": "Organization nr 3",
            "representative": "John Doe",
            "address": "Ankkalinnankatu 123 A 46",
            "tel": "555 9876 543",
            "email": "test@test.com",
            "website": "www.test.com"}
);

db.projects.insert({"_id": ObjectId("56091cbc00fccd6d66bc5cc3"),
    "project_ref": "70001",
    "title": "Human rights",
    "coordinator": "Keijo Koordinaattori",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "status": "approved",
    "reg_date": "12.10.2014",
    "funding":
            {"applied_curr_local": "50 000",
                "applied_curr_eur": "10 000",
                "granted_curr_local": "50 000",
                "granted_curr_eur": "10 000"},
    "duration_months": 30,
    "description": "A short description of project"}
);

db.projects.insert({"_id": ObjectId("5c9ed9f94250406da7a7a41b"),
    "project_ref": "70002",
    "title": "Minority rights",
    "coordinator": "Maija Meikäläinen",
    "organisation": ObjectId("56091a0525f75ebc0c486338"),
    "status": "in_review",
    "reg_date": "2.11.2015",
    "funding":
            {"applied_curr_local": "18 000",
                "applied_curr_eur": "8 000",
                "granted_curr_local": "0",
                "granted_curr_eur": "0"},
    "duration_months": 36,
    "description": "This is a test project."}
);

db.projects.insert({"_id": ObjectId("f2e7c9aeb017189911996768"),
    "project_ref": "70003",
    "title": "projects nr 3",
    "coordinator": "John Doe",
    "organisation": ObjectId("8344235a153b2cf192bf74b2"),
    "status": "intermediary_report",
    "reg_date": "7.10.2015",
    "funding":
            {"applied_curr_local": "100 000",
                "applied_curr_eur": "12 000",
                "granted_curr_local": "0",
                "granted_curr_eur": "0"},
    "duration_months": 18,
    "description": "This is just another test project."}
);