const User = require('../models/User');
const Ticket = require('../models/Ticket');

require('dotenv').config()
const { Iamporter, IamporterError } = require('iamporter');

/**
 * GET /register
 * Register page.
 */
exports.getRegistration = (req, res) => {
  // requires signed in
  if (!req.user) {
    return res.redirect('/');
  }

  Ticket.findOne({ email: req.user.email }, (err, existingTicket) => {
		if (err) { return next(err); }
		if (existingTicket) {
		  req.flash('errors', { msg: 'You already have a ticket' });
      return res.redirect('/ticket');
		}

    res.render('register', {
      title: 'Register'
    });
  });
};

/**
 * POST /register
 * Register
 */
exports.postRegistration = (req, res, next) => {
  const errors = req.validationErrors();

	const isInKorea = req.body.inKorea ? true : false;
	const isPoster = req.body.poster ? true : false;

	// proceed for korean
	const isPaid = req.body.isPaid ? true : false;

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
  	isPaid: isPaid,
  	paymentImpUId: req.body.paymentImpUId,
  	paymentMctUId: req.body.paymentMCTUId
	});

  Ticket.findOne({ email: req.user.email }, (err, existingTicket) => {
		if (err) { return next(err); }
		if (existingTicket) {
		  req.flash('errors', { msg: 'You already have a ticket' });
      return res.redirect('/ticket');
		}

	  ticket.save((err) => {
      if (err) { 
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
      title: 'Ticket',
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

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  Ticket.findOne({ email: req.user.email }, (err, ticket) => {
    if (err) { return next(err); }

		ticket.name = req.body.name || '';
		ticket.mobile = req.body.mobile || '';
  	ticket.nationality = req.body.nationality || '';
  	ticket.affiliation = req.body.affiliation || '';
  	ticket.position = req.body.position || '';
  	ticket.advisor = req.body.advisor || '';

    ticket.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Ticket information has been updated.' });
      res.redirect('/ticket');
    });
  });
};

/**
 * post /payment/complete
 * POST from ajax request when request payment
 * Check the payment was right
 */
exports.postCompletePayment = (req, res) => {
  const iamporter = new Iamporter({
    apiKey: process.env.IMP_KEY,
    secret: process.env.IMP_SECRET 
  });
  
  iamporter.findByImpUid(req.body.imp_uid)
  .then((response) => {
    if (response.data.status == 'paid' && response.data.amount == process.env.IMP_AMOUNT) {
			res.contentType('json');
      res.send({
				result: "success",
      });
    } else {
			console.log(response.data.amount);
			console.log(process.env.IMP_AMOUNT);
      iamporter.cancelByImpUid(req.body.imp_uid);
			res.contentType('json');
      res.send({
				result: "fail",
      });
    }
  })
  .catch((err) => {
    // error on cancel
    if (err instanceof IamporterError) {
      if (err.status === 404) {
				console.log("no record");
        req.flash('Payment doesn\'t exist');
        // not paid, so nothing to refund
        return resolve("Can't find payment");
      } else if (err.status === 401) {
        // token invalid
				console.log("Token error");
        req.flash('Token Error. Try again.');
				return false;
      } else {
				// empty response
        req.flash('Not possible');
				return false;
			}
    } else {
			req.flash('Not possible');
			return false;
		}
  });
};

/** 
  * get /m/complete/payment 
  */
exports.getCompleteMobilePayment = (req, res) => { 
  const iamporter = new Iamporter({
    apiKey: process.env.IMP_KEY,
    secret: process.env.IMP_SECRET 
  });
  
  const imp_uid = req.query.imp_uid;
  iamporter.findByImpUid(imp_uid)
  .then((response) => {
    if (response.data.status == 'paid' && response.data.amount == process.env.IMP_AMOUNT) {
			res.contentType('json');
      res.send({
				result: "success",
      });
    } else {
			console.log(response.data.amount);
			console.log(process.env.IMP_AMOUNT);
      iamporter.cancelByImpUid(req.body.imp_uid);
			res.contentType('json');
      res.send({
				result: "fail",
      });
    }
  })
  .catch((err) => {
    // error on cancel
    if (err instanceof IamporterError) {
      if (err.status === 404) {
				console.log("no record");
        req.flash('Payment doesn\'t exist');
        // not paid, so nothing to refund
        return resolve("Can't find payment");
      } else if (err.status === 401) {
        // token invalid
				console.log("Token error");
        req.flash('Token Error. Try again.');
				return false;
      } else {
				// empty response
        req.flash('Not possible');
				return false;
			}
    } else {
			req.flash('Not possible');
			return false;
		}
  });

}

/**
 * post /ticket/delete
 * Delete ticket
 */
/* 
  DIABLED
*/
exports.postDeleteTicket = (req, res, next) => {
  Ticket.findOne({ email: req.user.email }, (err, ticket) => {
    if (err) { return next(err); }

    const iamporter = new Iamporter({
      apiKey: process.env.IMP_KEY,
      secret: process.env.IMP_SECRET 
    });

    iamporter.findByImpUid(ticket.paymentId)
    .then((response) => {
      if (res.status === 404) {
        // not paid, so nothing to refund
        return Promise.resolve("No money for refund");
      } else if (response.status === 401) {
        // token invalid
        req.flash('Refund failed. Try again.' , { msg: err.status });
        response.redirect('/ticket');
      } else {
        iamporter.cancelByImpUid(ticket.paymentId);
      }
    })
    .catch((err) => {
      if (err instanceof IamporterError) {
        if (err.status === 404) {
          // not paid, so nothing to refund
          return resolve("No money for refund");
        } else if (err.status === 401) {
          // token invalid
          req.flash('Refund failed. Try again.' , { msg: err.status });
          res.redirect('/ticket');
        };
      }
    })

    ticket.remove();
    req.flash('info', { msg: 'Your ticket has been deleted. please contact us if refund isn\'t completed' });
    res.redirect('/');
  });
};
