'use strict';

const express = require('express');
const router = express.Router();
const gatewayRoutingTable = require('../config/gateway');
const Gateway = require('../service/');
const gateway = new Gateway(gatewayRoutingTable);

/**
 * HTTP POST
 * Process credit card payment
 *
 * Input:
 * - price <number>                : total amount
 * - currency <string>             : currency unit
 * - fullname <string>             : full customer's name
 * - card_type <string>            : type of credit card
 * - card_number <string>          : credit card number
 * - card_expire_month <number>    : credit card expiration month
 * - card_expire_year <number>     : credit card expiration year
 * - card_holder_firstname <string>: credit card holder's first name
 * - card_holder_lastname <string> : credit card holder's last name
 * 
 * Output: JSON response indicate whether payment is success or not. If success, reponse with http status code 200. 400 otherwise
 */
router.post('/pay', function(req, res, next) {
	var field = req.body;
	var paymentService = gateway.transact(field.card_type, field.currency);
	if(paymentService instanceof Error)
		return res.status(400).json({message: paymentService.message});

	paymentService.charge(field, field.price, field.currency, function(error, isSuccess, result) {
		if(error)
			return next(error);

		if(!isSuccess)
			return res.status(400).json({message: 'payment failed', errorResponse: result});

		return res.status(200).json({message: 'payment success', result});
	})
})

module.exports = exports = router;