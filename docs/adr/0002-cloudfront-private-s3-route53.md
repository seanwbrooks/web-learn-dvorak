# Host on CloudFront with a private S3 bucket and a Route 53 domain

The app is served by CloudFront from a private S3 bucket (Origin Access Control), with an ACM certificate for HTTPS, on a new domain registered and hosted in Route 53. It replaces the HTTP-only Google Cloud Storage site on `learn-dvorak.food` (registered at GoDaddy). An S3 website endpoint alone can't serve HTTPS on a custom domain, and keeping the domain and DNS in the same AWS account lets `template.yaml` own the certificate validation and DNS records.

## Consequences

- The stack must live in `us-east-1`, because CloudFront only accepts ACM certificates from that region.
- Route 53 creates the hosted zone when the domain is registered, so the template references that zone instead of creating one.
- Learner data is per origin (see [0001](0001-learner-data-stays-in-the-browser.md)), so Attempts and Personal Best on the old site don't carry over to the new domain.
