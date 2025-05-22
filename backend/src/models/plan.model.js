const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  patient: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number
    },
    height: {
      type: Number
    },
    weight: {
      type: Number
    }
  },
  menstrual_history: {
    menarche_age: {
      type: Number
    },
    cycle_duration: {
      type: Number
    },
    menstruation_duration: {
      type: Number
    },
    is_menopausal: {
      type: Boolean,
      default: false
    },
    last_menstruation: {
      type: Date
    },
    contraceptives: {
      type: String,
      trim: true
    }
  },
  symptoms: [{
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: Number,
      default: 1
    }
  }],
  health_history: {
    medical_history: {
      type: String,
      trim: true
    },
    family_history: {
      type: String,
      trim: true
    },
    allergies: {
      type: String,
      trim: true
    },
    previous_treatments: {
      type: String,
      trim: true
    },
    current_medications: {
      type: String,
      trim: true
    },
    current_supplements: {
      type: String,
      trim: true
    }
  },
  lifestyle: {
    sleep_quality: {
      type: String,
      trim: true
    },
    sleep_hours: {
      type: Number
    },
    exercise: {
      type: String,
      trim: true
    },
    stress_level: {
      type: String,
      trim: true
    },
    diet_quality: {
      type: String,
      trim: true
    },
    relationships_quality: {
      type: String,
      trim: true
    },
    treatment_goals: {
      type: String,
      trim: true
    }
  },
  exams: [{
    name: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    results: {
      type: String,
      trim: true
    },
    file_key: {
      type: String,
      trim: true
    },
    analysis: {
      type: String,
      trim: true
    }
  }],
  tcm_observations: {
    face: {
      type: String,
      trim: true
    },
    tongue: {
      type: String,
      trim: true
    },
    pulse: {
      type: String,
      trim: true
    },
    energy_signs: {
      type: String,
      trim: true
    }
  },
  timeline: [{
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      trim: true
    }
  }],
  ifm_matrix: {
    assimilation: {
      type: String,
      trim: true
    },
    defense: {
      type: String,
      trim: true
    },
    energy: {
      type: String,
      trim: true
    },
    biotransformation: {
      type: String,
      trim: true
    },
    transport: {
      type: String,
      trim: true
    },
    communication: {
      type: String,
      trim: true
    },
    structure: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'error'],
    default: 'draft'
  },
  final_plan: {
    content: {
      type: String,
      trim: true
    },
    recommendations: [{
      type: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    }],
    token_usage: {
      type: Number,
      default: 0
    }
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  generation_started_at: {
    type: Date
  },
  generation_completed_at: {
    type: Date
  },
  generation_error: {
    type: String
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

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
