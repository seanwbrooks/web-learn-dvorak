#!/bin/bash
# Build the app, deploy the stack (see docs/adr/0002), upload dist/ and
# clear CloudFront's cached index.html. Needs an `aws login` session.
set -euo pipefail

STACK_NAME=learn-dvorak-app
REGION=us-east-1

stack_output() {
  aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey==\`$1\`].OutputValue" \
    --output text
}

echo "Building React application..."
npm run build

echo "Deploying SAM template..."
sam deploy --no-fail-on-empty-changeset

BUCKET_NAME=$(stack_output BucketName)
DISTRIBUTION_ID=$(stack_output DistributionId)
WEBSITE_URL=$(stack_output WebsiteURL)

# Hashed assets never change, so browsers and CloudFront can keep them for a
# year; index.html must be re-checked so new deploys are picked up
echo "Uploading dist/ to s3://$BUCKET_NAME..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete \
  --exclude index.html \
  --cache-control "public, max-age=31536000, immutable"
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache"

echo "Invalidating cached index.html..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/" "/index.html" \
  --query 'Invalidation.Id' --output text

echo "Deployment complete!"
echo "Website URL: $WEBSITE_URL"
