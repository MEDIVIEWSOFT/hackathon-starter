const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  mobile: String,
  nationality: { type: String, required: true },  
  affiliation: String,
  position: String,
  advisor: String,
  isPoster: { type: Boolean, required: true }, 
  isPaid: { type: Boolean, required: true, default: false }
}, { timestamps: true });

/**
 * 
 */
ticketSchema.pre('save', function save(next) {
  const ticket = this;
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
