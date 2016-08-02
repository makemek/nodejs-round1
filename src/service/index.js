'use strict';

/**
 * Create a payment service router
 * A routing configuration have to map source to destination with the following properties
 * [{source: {cardType: <string>, currenncy: [<string>]}, target: <PaymentService>}]
 * 
 * @param  {object} routerConfig - an object that maps source card type and currency to destination
 */
function Gateway(routerConfig) {
	routerConfig = routerConfig || {};
	this.config = routerConfig;
}

Gateway.prototype.constructor = Gateway;

/**
 * Get a payment service based on credit card type and currency unit
 * If there are duplicate routes, same card type with same currency, it will return the top-most route
 * 
 * @param  {string} cardType - abbriviated type name (case-insensitive)
 * @param  {string} currency - abbriviated currency unit (case-insensitive)
 * @return {null|object} null if no route found, otherwise return interface to payment service
 */
Gateway.prototype.transact = function(cardType, currency) {

	var routes = this.config.filter(function(route) {
		var sameType = route.source.cardType.toLowerCase() === cardType.toLowerCase();
		var currencyExist = route.source.currency.filter(function(_currency){
			return _currency.toLowerCase() === currency.toLowerCase()})
		.length > 0;
		return sameType && currencyExist;
	})

	if(!routes.length)
		return null;
	return routes[0].target;
}

module.exports = exports = Gateway;