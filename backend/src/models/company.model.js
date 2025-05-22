const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  token_limit: {
    type: Number,
    default: 100000
  },
  tokens_used: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
