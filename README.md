# About

This is a project documentation and administration application made for University of Helsinki, Department of Computer Science, Software Engineering Project course.

# Architecture overview

The technology stack for the Project Database application consists of MongoDB, Express.js, AngularJS and Node.js. A specific framework used is [MEAN.io](https://mean.io) 0.12.14.

# Development process

## Local development environment setup

By default a shared mLab (mlab.com) MongoDB instance is used. Consider installing a MongoDB client to access database directly.

Install Node.js 4.2.6.

Clone repository https://github.com/kiosfi/projectDatabase.

Install dependencies and run application:

```
$ cd projectDatabase
$ npm install
$ npm start
```

The application should be available at http://localhost:3000. The following account can be used for testing: tt@testi.com / abcd1234


### Optional: install and configure local MongoDB instance

Install and run MongoDB 3.2.18. For example:

```
# docker pull mongo:3.2.18
# docker run -d -p 27017:27017 mongo:3.2.18
```

Modify ```config/env/development``` and restart the application:

```
module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',

```

## Run unit tests

Unit tests are run on local MongoDB database `mean-test`.

```
$ ./node_modules/gulp/bin/gulp.js test
```

## Run end-to-end tests 

End-to-end tests are run on local MongoDB database `testDB`.

TODO: describe

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

