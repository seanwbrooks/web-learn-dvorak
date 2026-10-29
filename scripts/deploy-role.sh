#!/bin/bash
# Update the role GitHub Actions deploys with (infra/github-deploy-role.yaml).
# Run by hand, never by CI, so the workflow can't widen its own permissions
# (see docs/adr/0003). Needed before merging a change that adds an AWS
# resource type to infra/template.yaml.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! aws sts get-caller-identity >/dev/null 2>&1; then
  echo "Not signed in to AWS. Run: aws sso login --sso-session admin" >&2
  exit 1
fi

aws cloudformation deploy \
  --template-file infra/github-deploy-role.yaml \
  --stack-name learn-dvorak-github-deploy \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset
