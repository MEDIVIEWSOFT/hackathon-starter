const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: String,
  nationality: { type: String, required: true },
  affiliation: String,
  position: String,
  advisor: String,
  isInKorea: { type: Boolean, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  purchaseID: String,
}, { timestamps: true });

/**
 * 
 */
ticketSchema.pre('save', function save(next) {
  const ticket = this;
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
