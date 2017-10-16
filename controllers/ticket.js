const User = require('../models/User');
const Ticket = require('../models/Ticket');

require('dotenv').config()

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
 * Register
 */
exports.postRegistration = (req, res, next) => {
  const errors = req.getValidationResult();

	const isInKorea = req.body.inKorea ? true : false;
	const isPoster = req.body.poster ? true : false;

	// proceed for korean
	const isPaid = true;

	const ticket = new Ticket({
		email: req.user.email,
		name: req.body.name,
		mobile: req.body.mobile,
  	nationality: req.body.nationality,
  	affiliation: req.body.affiliation,
  	position: req.body.position,
  	advisor: req.body.advisor,
  	isInKorea: isInKorea,
  	isPoster: isPoster,
  	isPaid: isPaid
	});

  Ticket.findOne({ email: req.user.email }, (err, existingTicket) => {
		if (err) { return next(err); }
		if (existingTicket) {
		  req.flash('errors', { msg: 'You already have a ticket' });
      return res.redirect('/ticket');
		}

	  ticket.save((err) => {
			console.log("test");
      if (err) { 
				console.log(err);
				return next(err); }

      req.flash('success', { msg: 'Ticket added' });
      return res.redirect('/ticket');
	  });

  });

  return true;
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

  // if not registered, register first
  Ticket.findOne({ email: req.user.email }, (err, existingTicket) => {
    if (err) { 
      req.flash('err', err);
      return res.redirect('/register');
    }
		if (!existingTicket) {
      req.flash('Create Ticket First!');
      return res.redirect('/register');
		}

    res.render('ticket', {
      title: 'ticket',
      ticket: existingTicket
    });
  })
};

/**
 * post /ticket/modify
 * Modify ticket
 */
exports.postUpdateTicket = (req, res, next) => {
  const errors = req.validationErrors();
	var isPoster = req.body.poster == true;

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  Ticket.findOne({ email: req.user.email }, (err, ticket) => {
    if (err) { return next(err); }

		ticket.name = req.body.name || '';
		ticket.mobile = req.body.mobile || '';
  	ticket.affiliation = req.body.affiliation || '';
  	ticket.position = req.body.position || '';
  	ticket.advisor = req.body.advisor || '';
  	ticket.isPoster = isPoster;

    ticket.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Ticket information has been updated.' });
      res.redirect('/ticket');
    });
  });
};

/**
 * post /ticket/delete
 * Delete ticket
 */
exports.postDeleteTicket = (req, res, next) => {
  Ticket.findOne({ email: req.user.email }, (err, ticket) => {
    if (err) { return next(err); }

    ticket.remove();
    req.flash('info', { msg: 'Your ticket has been deleted. please contact us to refund if you paid' });
    res.redirect('/');
  });

};
