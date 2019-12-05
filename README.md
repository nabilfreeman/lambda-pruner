# lambda-pruner
NodeJS Script to prune old Lambda versions

# Background

This is not an original idea. It's a rewrite of https://github.com/epsagon/clear-lambda-storage, a Python script that does exactly what this script does.

Just for some context, Lambda has a 75GB limit which at my work we are hitting every 5 or 6 days due to huge deploys. We need to schedule a task to delete all the old versions daily.

# Why I made this

Python 2 and Python 3 are a real headache. Sorry Python fans. I had to heavily edit the above script just to get it running on my laptop, stuff like Queue not being found etc. Then I couldn't run it on Lambda or even an EC2 Ubuntu box. I was getting obscure errors from Boto3.

So I figured it would probably be faster just to rewrite it in Node.js. Then I can actually put this on Lambda and it will be able to prune itself.

## What this deletes

The script will not delete:

- Anything on `$LATEST`
- Anything with a linked alias
- Lambda@Edge functions

Any other version across all your regions will get deleted.

Don't worry, this won't delete itself due to the `$LATEST` rule.

You'll see `deleted: 3` and `skipped: 1` in the logs. If you want to see the full reasons why certain versions are being skipped, just add `DEBUG=1` (or anything else truthy) to your environment.

# Setup

```
# Set up your credentials
pip install awscli
aws configure

npm install
```

# Run locally

```
npm test
```

# Deploying to Lambda

NB: Your Lambda needs to be configured properly. See the next section.

## Automatic

```
LAMBDA_NAME=my-script REGION=eu-west-1 bash deploy.sh
```

Make sure you have authenticated using `aws configure`.

## Manual

Zip it up with the node_modules included and point to `index.handler`.

# Lambda configuration

`index.handler` should be the entry point on your Lambda. I've tested with Node 12.

You need the following permissions on your execution role:

- `AWSLambdaFullAccess` - for managing Lambdas
- `AmazonEC2ReadOnlyAccess` - for listing out EC2 regions
- `CloudWatchLogsFullAccess` - for logging

I recommend a 5 minute timeout on the Lambda function.

# Contribute

PRs appreciated ❤️