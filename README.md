# lambda-pruner
NodeJS Script to prune old Lambda versions

# Background

This is not an original idea. It's a rewrite of https://github.com/epsagon/clear-lambda-storage, a Python script that does exactly what this script does.

# Why I made this

Python 2 and Python 3 are a real headache. I had to heavily edit the above script just to get it running, stuff like Queue not being found etc. Then I couldn't run it on Lambda or even an EC2 Ubuntu box. I was getting obscure errors from Boto3.

So I figured it would probably be faster just to rewrite it in Node.js. Then I can actually put this on Lambda and it will be able to prune itself.

# How to run via CLI

```
# Set up your credentials
aws configure

npm install

# This runs a small middleware that fakes a Lambda instance
npm start
```

# Deploying to Lambda

Zip it up with the node_modules included and point to `exports.handler`.
