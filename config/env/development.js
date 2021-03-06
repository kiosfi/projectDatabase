'use strict';

module.exports = {
  db: 'mongodb://projectDatabase:zu5oom8I@ds035333.mongolab.com:35333/mean-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  hostname: 'http://localhost:3000',
  app: {
    name: 'KIOS - Hanketietojärjestelmä'
  },
  strategies: {
    local: {
      enabled: true
    },
    landingPage: '/',
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER',
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  },
  secret: 'SOME_TOKEN_SECRET'
};
