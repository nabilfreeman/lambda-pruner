const Lambda = require('../index.js');

const run = async () => {
	console.log(`Testing...`);

	//2nd argument is the context variable sent by Lambda.
	const result = await new Promise((resolve, reject) => {
		Lambda.handler(null, {}, function(error, result){
			if(error) return reject(error);

			resolve(result);
		});
	})
	
	console.log(result);
	console.log();
}

run().then(process.exit);

