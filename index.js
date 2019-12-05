//Lambda Pruner
//@author nabilfreeman (http://github.com/nabilfreeman)
//@author Freeman Industries (http://freemans.website)

const AWS = require('aws-sdk');

const { Lambda, EC2 } = AWS;

const listRegions = async () => {
	const client = new EC2({
		// this doesn't matter, we just need to provide a default region before listing them all out.
		region: 'eu-west-1'
	});

	const { Regions } = await client.describeRegions().promise();

	return Regions.map(result => result.RegionName);
}

const listFunctions = async region => {
	const client = new Lambda({
		region
	});

	const { Functions } = await client.listFunctions({
		FunctionVersion: 'ALL',
		MaxItems: 10000
	}).promise();

	return Functions;
}

exports.handler = function(event, context, callback) {
	return Promise.resolve().then(async () => {

		const regions = await listRegions();

		for(const region of regions){
			const functions = await listFunctions(region);

			console.log(`Found ${functions.length} functions in ${region}.`);
		}

		//error, result
		callback(null, true);

	}).catch(error => callback(error.message));
};
