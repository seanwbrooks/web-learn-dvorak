#!/bin/bash
# Build the app, deploy the stack (see docs/adr/0002), upload dist/ and
# clear CloudFront's cached pages. Runs in CI on every push to master
# (see docs/adr/0003), or locally with an SSO session.
set -euo pipefail

# Paths below (dist/, infra/) are relative to the repo root
cd "$(dirname "$0")/.."

STACK_NAME=learn-dvorak-app
# CloudFront certificates must live in us-east-1 (docs/adr/0002)
REGION=us-east-1
# Registered at GoDaddy and delegated to a Route 53 hosted zone
DOMAIN=learndvorak.com

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
HOSTED_ZONE_ID=$(scripts/hosted-zone-id.sh "$DOMAIN")
sam deploy \
  --template-file infra/template.yaml \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --resolve-s3 \
  --s3-prefix "$STACK_NAME" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides "DomainName=$DOMAIN" "HostedZoneId=$HOSTED_ZONE_ID" \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset

BUCKET_NAME=$(stack_output BucketName)
DISTRIBUTION_ID=$(stack_output DistributionId)
WEBSITE_URL=$(stack_output WebsiteURL)

# Hashed assets never change, so browsers and CloudFront can keep them for a
# year; the HTML pages must be re-checked so new deploys are picked up. No
# --delete: HTML still cached at the edge or in an open tab may reference the
# previous build's assets, which are small enough to leave in the bucket
echo "Uploading dist/ to s3://$BUCKET_NAME..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable"
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache"

echo "Invalidating cached pages..."
PAGES=("/")
for page in dist/*.html; do
  PAGES+=("/$(basename "$page")")
done
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "${PAGES[@]}" \
  --query 'Invalidation.Id' --output text

echo "Deployment complete!"
echo "Website URL: $WEBSITE_URL"
