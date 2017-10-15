const User = require('../models/User');

/**
 * GET /register
 * Register page.
 */
exports.getRegistration = (req, res) => {
  // requires signed in
  if (!req.user) {
    return res.redirect('/');
  }

  res.render('register', {
    title: 'register'
  });
};

/**
 * POST /register
 * Register & Payment
 */
exports.postRegistration = (req, res) => {
  res.render('register', {
    title: 'register'
  });
};

/**
 * GET /ticket
 * Ticket info page
 */
exports.getTicket = (req, res) => {
  // requires signed in
  if (!req.user) {
    return res.redirect('/');
  }

  res.render('ticket', {
    title: 'ticket'
  });
};

/**
 * POST /register
 * Register & Payment
 */
exports.postTicket = (req, res) => {
  res.render('ticket', {
    title: 'ticket'
  });
};
