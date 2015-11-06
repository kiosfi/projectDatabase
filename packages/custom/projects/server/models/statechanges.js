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
    type: Schema.ObjectId,
    ref: 'User'
  },
  comments: {
    type: String
  }
});

InReviewSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};

var ApprovedSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
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

ApprovedSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};

var RejectedSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  rejection_categories: {
    type: Array,
    default: [1, 2, 3, 4, 5],
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
    type: Schema.ObjectId,
    ref: 'User'
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
    type: Schema.ObjectId,
    ref: 'User'
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
    type: Schema.ObjectId,
    ref: 'User'
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
    type: Schema.ObjectId,
    ref: 'User'
  },
  end_date: {
    type: String,
    required: true
  },
  board_notified: {
    type: String
  },
  approved_by: {
    type: Array,
    default: ['ceo', 'board']
  }
});

module.exports = mongoose.model('States', StatesSchema);
module.exports = mongoose.model('InReview', InReviewSchema);
mongoose.model('Approved', ApprovedSchema);
mongoose.model('Rejected', RejectedSchema);
mongoose.model('Signed', SignedSchema);
mongoose.model('IntReport', IntReportSchema);
mongoose.model('EndReport', EndReportSchema);
mongoose.model('Ended', EndedSchema);
