//Lambda Pruner
//@author nabilfreeman (http://github.com/nabilfreeman)
//@author Freeman Industries (http://freemans.website)

const AWS = require('aws-sdk');

const { Lambda, EC2 } = AWS;

const MaxItems = 10000;

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
		MaxItems
	}).promise();

	return Functions.map(result => result.FunctionName);
}

const listVersions = async (region, function_name) => {
	const client = new Lambda({
		region
	});

	const { Versions } = await client.listVersionsByFunction({
		FunctionName: function_name,
		MaxItems
	}).promise();

	return Versions.map(result => result.Version);
}

const deleteVersion = async (region, function_name, version) => {
	const client = new Lambda({
		region
	});

	await client.deleteFunction({
		FunctionName: function_name,
		Qualifier: version
	}).promise();
}

exports.handler = function(event, context, callback) {
	return Promise.resolve().then(async () => {

		const regions = await listRegions();

		for(const region of regions){
			const functions = await listFunctions(region);

			console.log(`🌏 ${region} : Found ${functions.length} functions.`);

			for(const function_name of functions){
				const versions = await listVersions(region, function_name);

				console.log(`🌏 ${region} : 🤖 ${function_name} : Found ${versions.length} versions.`)

				let deleted = 0;
				let skipped = 0;

				for(const version of versions){
					// up to this point we don't expect any errors that will not cease execution.
					// but here, when we try and delete a version we might run into a restriction if it's referenced by $LATEST or another alias.
					try{
						await deleteVersion(region, function_name, version);

						// console.log(`Deleted ${function_name}:${version}.`)
						deleted += 1;
					} catch(error) {
						// console.log(`Can't delete ${function_name}:${version} because: ${error.message}`);
						skipped += 1;
					}
				}

				console.log(`🌏 ${region} : 🤖 ${function_name} : Deleted ${deleted} versions.`)
				console.log(`🌏 ${region} : 🤖 ${function_name} : Skipped ${skipped} versions.`)
			}
		}

		console.log(`✅ Finished`)

		//error, result
		callback(null, true);

	}).catch(error => callback(error.message));
};
