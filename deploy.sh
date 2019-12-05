# AWS Lambda Node.js deploy script
# @author Nabil Freeman <nabil@instafork.com> (https://github.com/nabilfreeman)

# ***************************************
# Environment variables required:

# AWS_ACCESS_KEY_ID=XXXXXXX
# AWS_SECRET_ACCESS_KEY=XXXXXXXX
# REGION=eu-west-1
# LAMBDA_NAME=my-script
# ***************************************

echo "Refreshing NPM modules..."

# delete node_modules folder and re-install all modules
rm -rf node_modules
npm install

echo "Zipping payload..."

# create zip file, ignore .git directory
zip -r exports.zip . -x "*.git*" -q && echo "Zip complete." || echo "Zip failed."

echo "Updating $LAMBDA_NAME..."

# update function code by uploading a zip file to AWS
UPLOAD_JSON=$(aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://exports.zip)

# publish new version to Lambda - we capture the result which contains the new version number
VERSION_JSON=$(aws lambda publish-version --function-name $LAMBDA_NAME)

# use NodeJS to easily parse the json object and extract the latest version number
VERSION=$(node -e "console.log($VERSION_JSON.Version)")

echo "$LAMBDA_NAME was successfully updated to version $VERSION"

echo "Cleaning up..."

# clean up
rm -f exports.zip

echo "Done."