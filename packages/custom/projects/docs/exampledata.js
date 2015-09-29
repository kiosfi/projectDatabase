db.projects.insert({ "_id" : ObjectId("56091cbc00fccd6d66bc5cc3"),
"title" : "Human rights",
"coordinator" : "Keijo Koordinaattori",
"organisation" : ObjectId("56091a0525f75ebc0c486338"),
"status" : "approved",
"reg_date" : "12.10.2014",
"funding" :
  { "applied_curr_local" : "50 000",
    "applied_curr_eur" : "10 000",
    "granted_curr_local" : "50 000",
    "granted_curr_eur" : "10 000" },
"duration_months" : 30,
"description" : "A short description of project" })

db.organisations.insert(
  { "_id" : ObjectId("56091a0525f75ebc0c486338"),
  "name" : "Human rights org",
  "representative" : "Representative",
  "address" : "Adress 123",
  "tel" : "123445",
  "email" : "email@org.com",
  "website" : "www.org.com" })
