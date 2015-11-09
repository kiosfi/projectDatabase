'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StatesSchema = new Schema({
  current_state: {
    type: String,
    required: true
  },
  next_states: {
    type: Array
  }
});

StatesSchema.statics.load = function (current_state, cb) {
    this.findOne({
        current_state: current_state
    }).exec(cb);
};

var InReviewSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  comments: {
    type: String
  }
});

var ApprovedSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  approved_date: {
    type: String
  },
  approved_by: {
    type: Array,
    default: ['ceo', 'board', 'foreign_ministry']
  },
  board_notified: {
    type: String
  },
  granted_sum: {
    granted_curr_local: {
        type: String,
        required: true,
        trim: true
    },
    granted_curr_eur: {
        type: String,
        required: true,
        trim: true
    }
  },
  themes: {
    type: Array
  },
  methods: {
    type: Array
  }
});

var RejectedSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  rejection_categories: {
    type: Array,
    required: true
  },
  rejection_comments: {
    type: String,
    required: true
  }
});

var SignedSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  signed_by: {
    type: String,
    required: true
  },
  signed_date: {
    type: String,
    required: true
  }
});

var IntReportSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  objectives: {
    type: Array
  },
  activities: {
    type: Array
  },
  processed: {
    type: Boolean,
    default: false
  }
});

var EndReportSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  audit: {
    date: {
      type: String,
      required: true
    },
    audit_review: {
      type: String,
      required: true
    }
  },
  objectives: {
    type: Array
  },
  activities: {
    type: Array
  },
  processed: {
    type: Boolean,
    default: false
  }
});

var EndedSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
  end_date: {
    type: String,
    required: true
  },
  board_notified: {
    type: String
  },
  approved_by: {
    type: String,
    required: true
  },
  other_comments: {
    type: String
  }
});

module.exports = mongoose.model('States', StatesSchema);
module.exports = mongoose.model('InReview', InReviewSchema);
module.exports = mongoose.model('Approved', ApprovedSchema);
module.exports = mongoose.model('Rejected', RejectedSchema);
module.exports = mongoose.model('Signed', SignedSchema);
module.exports = mongoose.model('IntReport', IntReportSchema);
module.exports = mongoose.model('EndReport', EndReportSchema);
module.exports = mongoose.model('Ended', EndedSchema);
