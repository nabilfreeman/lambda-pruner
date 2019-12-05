# lambda-pruner
NodeJS Script to prune old Lambda versions

# Background

This is not an original idea. It's a rewrite of https://github.com/epsagon/clear-lambda-storage, a Python script that does exactly what this script does.

Just for some context, Lambda has a 75GB limit which at my work we are hitting every 5 or 6 days due to huge deploys. We need to schedule a task to delete all the old versions daily.

# Why I made this

Python 2 and Python 3 are a real headache. Sorry Python fans. I had to heavily edit the above script just to get it running on my laptop, stuff like Queue not being found etc. Then I couldn't run it on Lambda or even an EC2 Ubuntu box. I was getting obscure errors from Boto3.

So I figured it would probably be faster just to rewrite it in Node.js. Then I can actually put this on Lambda and it will be able to prune itself.

## What this deletes

The script won't delete anything on $LATEST, or any versions that are linked to an alias. So don't worry, this script won't prune itself.

Any other version across all your regions will get deleted.

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

On Lambda point to `index.handler` and make sure your execution role has `AWSLambdaFullAccess` permissions.

## Automatic

```
LAMBDA_NAME=my-script bash deploy.sh
```

Make sure you have authenticated using `aws configure`.

## Manual

Zip it up with the node_modules included and point to `index.handler`.