# About

This is a project documentation and administration application made for University of Helsinki, Department of Computer Science, Software Engineering Project course.

# Architecture overview

The technology stack for the Project Database application consists of MongoDB, Express.js, AngularJS and Node.js. A specific framework used is [MEAN.io](https://mean.io) 0.12.14.

# Development process

## Local development environment setup

By default a shared mLab (mlab.com) MongoDB instance is used. Consider installing a MongoDB client to access database directly.

Install LaTeX in order to be able to create PDF reports:

```
$ sudo apt-get install texlive-full
```

Install Node.js 4.2.6.

Clone repository https://github.com/kiosfi/projectDatabase.

Install dependencies, create directory for attachment files and run application:

```
$ cd projectDatabase
$ mkdir packages/custom/projects/data
$ npm install
$ npm start
```

The application should be available at http://localhost:3000. The following account can be used for testing: tt@testi.com / abcd1234


### Optional: install and configure local MongoDB instance

Install and run MongoDB 3.2.18. For example:

```
$ docker pull mongo:3.2.18
$ docker run -d -p 27017:27017 --name kios-mongo mongo:3.2.18
```

Modify ```config/env/development``` and restart the application:

```
module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',

```
Insert test user and project states using MongoDB shell:

```
$ docker run -it --link kios-mongo:mongo --rm mongo:3.2.18 sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'

> use mean-dev

> db.users.insert({ "email" : "tt@testi.com", "hashed_password" : "6OMmg66ekC4EROvg55Twt3fM/W/oj7ERJhUPjpgEeJcdu5U95PZP1t7cdmZ72kaYzaW6ILUz6PcTpTLkJNZegw==", "salt" : "+X1WNogMs0lMTEmZtzUjwA==", "username" : "testi", "name" : "Tommi Testaaja", "provider" : "local", "roles" : [ "authenticated" ], "__v" : 0 })

> db.states.insertMany([
{ "current_state" : "rekisteröity", "next_states" : [ "käsittelyssä", "päättynyt" ] },
{ "current_state" : "käsittelyssä", "next_states" : [ "hyväksytty", "hylätty", "päättynyt" ] },
{ "current_state" : "hyväksytty", "next_states" : [ "allekirjoitettu", "hylätty", "päättynyt" ] },
{ "current_state" : "hylätty", "next_states" : [ ] },
{ "current_state" : "allekirjoitettu", "next_states" : [ "väliraportti", "loppuraportti", "päättynyt" ] },
{ "current_state" : "väliraportti", "next_states" : [ "väliraportti", "loppuraportti", "päättynyt" ] },
{ "current_state" : "loppuraportti", "next_states" : [ "päättynyt" ] }
])
```

## Run unit tests

Unit tests are run on local MongoDB database `mean-test`.

```
$ ./node_modules/gulp/bin/gulp.js test
```

## Run end-to-end tests 

End-to-end tests are run on local MongoDB database `testDB`.

To run the End-to-end tests, open three terminal sessions. In the first 
terminal, run
```
export NODE_ENV=e2e-test
gulp testData
node server
```
After the server has started, go to the next terminal and run
```
./node_modules/.bin/webdriver_manager start
```
After that, the test can be started by running the following command in the 
third terminal:
```
./node_modules/.bin/protractor tests/config/e2e/protractor.config.js
```

*NB: When running the E2E tests on a fresh install, you may need to run the
following command before the three steps above:*
```
./node_modules/.bin/webdriver_manager update
```

# Operation and maintenance

## Production update

Make a tarball backup of the projectDatabase directory in order to avoid catastrophes:

```
$ tar -czf backups/projectDatabase-backup-31.12.2017.tar.gz projectDatabase/
```

Make sure that nobody's using the system before proceeding.

Find out and kill the screen process running Node.js: (or go to that session and hit Ctrl+C)

```
"ps aux | grep $(id -u kiosprojekti)
```

Back up database using mongodump (e.g. run mongodump and then move the obtained directory to ~/backups):

TODO: describe

Go to application directory and fetch the latest code:

```
$ cd ~/projectDatabase
$ git pull
```

If this doesn't work, try "git clean -d -f" and then "git pull" again.

Start (or resume) a screen session:

TODO: describe

Configure for production mode and run the application:

```
$ export NODE_ENV=production
$ node server
```

Try logging in to the application at https://192.168.0.7:3000 to ensure it actually works.

If you have any questions, please contact John Lång (john.lang@mykolab.com).

