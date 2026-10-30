#!/bin/bash
# Print the ID of the Route 53 hosted zone for a domain, e.g.
#   scripts/hosted-zone-id.sh learndvorak.com
# The ID is looked up at deploy time rather than committed, since the repo
# is public (see .gitignore).
set -euo pipefail

DOMAIN=$1
ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name "$DOMAIN." \
  --query "HostedZones[?Name=='$DOMAIN.'] | [0].Id" \
  --output text)

if [[ -z "$ZONE_ID" || "$ZONE_ID" == "None" ]]; then
  echo "No Route 53 hosted zone found for $DOMAIN" >&2
  exit 1
fi
echo "${ZONE_ID#/hostedzone/}"
