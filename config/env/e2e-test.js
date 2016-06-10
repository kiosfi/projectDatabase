'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/testDB',
  http: {
    port: 3002
  },
  aggregate: false,
  assets: {
    hash: false
  },
  logging: {
    format: 'common'
  },
  app: {
    name: 'KIOS Sr - Hanketietojärjestelmä'
  },
  strategies: {
    local: {
      enabled: true
    },
    landingPage: '/'
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
