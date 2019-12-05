//Lambda Pruner
//@author nabilfreeman (http://github.com/nabilfreeman)
//@author Freeman Industries (http://freemans.website)

exports.handler = function(event, context, callback) {
	return Promise.resolve().then(async () => {
		
		//error, result
		callback(null, true);

	}).catch(error => callback(error.message));
};
