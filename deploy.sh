#!/bin/bash

# Build the React app
echo "Building React application..."
npm run build

# Deploy SAM template
echo "Deploying SAM template..."
sam deploy --guided

# Get the bucket name from CloudFormation stack
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name learn-dvorak-app \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text)

# Sync dist folder to S3
echo "Uploading dist folder to S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# TODO: once I have a domain name set up, I can get the CloudFront URL from the stack outputs instead of hardcoding it
# Get website URL
# WEBSITE_URL=$(aws cloudformation describe-stacks \
#  --stack-name learn-dvorak-app \
#  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
#  --output text)

echo "Deployment complete!"
echo "Website URL: $WEBSITE_URL"
