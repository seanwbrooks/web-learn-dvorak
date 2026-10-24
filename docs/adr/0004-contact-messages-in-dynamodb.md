# Store Contact form messages in DynamoDB

The Contact page posts each message to `/api/contact` on the site's own domain. CloudFront sends `/api/*` to an HTTP API, which invokes the `api/contact` Lambda; it validates the name, email and message and writes them to a DynamoDB table with an id and timestamp. Messages are read in the DynamoDB console rather than emailed, which needs no SES setup or verified address. Routing through CloudFront keeps the form same-origin, so the browser needs no CORS.

## Consequences

- The site now has a backend, but only for messages a visitor chooses to send; learner data still stays in the browser ([0001](0001-learner-data-stays-in-the-browser.md)).
- New messages don't notify anyone: check the table (DynamoDB console › Tables › `learn-dvorak-app-ContactTable-…` › Explore items).
- The table is retained if the stack is deleted or the table would be replaced, so messages survive infrastructure changes.
- Spam is limited, not prevented: the API is throttled to 1 request a second (bursts of 5), the form has a hidden field that bots fill and the Lambda ignores, and fields are length-capped. A busier site would want a CAPTCHA or AWS WAF.
- The Lambda's role is capped by the `learn-dvorak-lambda-boundary` permissions boundary from `github-deploy-role.yaml`, so the deploy role can create function roles without being able to create a more powerful role ([0003](0003-deploy-from-github-actions.md)).
