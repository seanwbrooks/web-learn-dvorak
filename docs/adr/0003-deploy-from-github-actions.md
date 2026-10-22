# Deploy from GitHub Actions with an OIDC role

Every push to `master` runs `.github/workflows/deploy.yml`, which lints, type-checks and runs `deploy.sh`. The workflow gets short-lived AWS credentials by assuming `learn-dvorak-github-deploy` through GitHub's OIDC provider, so no AWS keys are stored in GitHub. The role and the provider live in `github-deploy-role.yaml`, a separate stack deployed by hand, so the workflow can't widen its own permissions by editing `template.yaml`.

## Consequences

- Only runs on `master` of this repo can assume the role; pull requests and other branches get no AWS credentials.
- The role carries the permissions CloudFormation needs to manage everything in `template.yaml` (S3, CloudFront, ACM and the one hosted zone). A new resource type in `template.yaml` needs a matching change to `github-deploy-role.yaml`, deployed by hand first.
- `deploy.sh` still works locally with an SSO session, for deploys outside CI.
