# Deploy from GitHub Actions with an OIDC role

Every push to `master` runs `.github/workflows/deploy.yml`, which lints, type-checks and runs `scripts/deploy.sh`. The workflow gets short-lived AWS credentials by assuming `learn-dvorak-github-deploy` through GitHub's OIDC provider, so no AWS keys are stored in GitHub. The role and the provider live in `infra/github-deploy-role.yaml`, a separate stack deployed by hand with `scripts/deploy-role.sh`, so the workflow can't widen its own permissions by editing `infra/template.yaml`.

## Consequences

- Only runs on `master` of this repo can assume the role; pull requests and other branches get no AWS credentials.
- The role carries the permissions CloudFormation needs to manage everything in `infra/template.yaml` (S3, CloudFront, ACM, the one hosted zone, and the Contact form's DynamoDB table, Lambda and HTTP API). It can create IAM roles only for the app's own functions and only with the `learn-dvorak-lambda-boundary` permissions boundary, so it can't grant itself or anything else wider access. A new resource type in `infra/template.yaml` needs a matching change to `infra/github-deploy-role.yaml`, deployed by hand first.
- `scripts/deploy.sh` still works locally with an SSO session, for deploys outside CI.
