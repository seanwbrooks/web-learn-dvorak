# Learn Dvorak - React Version

A React-based typing tutor for learning the Dvorak keyboard layout.

## Features

- Interactive Dvorak keyboard visualization
- Color-coded keys for finger positioning
- Real-time typing practice with random words, numbers, and punctuation
- WPM (Words Per Minute) calculation
- Incorrect key highlighting
- 10,000+ word database

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Checks that run before every deploy
npm run lint
npm run type
npm run prettier:check   # npm run prettier to fix
```

## Usage

1. Open the application in your browser
2. Start typing the displayed words
3. Keys will highlight if you press the wrong key
4. Complete all 50 words to see your WPM score
5. Color coding indicates:
   - Green: 60+ WPM
   - Orange: 40-59 WPM
   - Red: Below 40 WPM

## Design system

The shared design values (colours, font sizes, spacing, radii and shadows) are CSS custom properties in `src/tokens.css`, and component styles use them for anything the design repeats. A few one-off values stay local to their component, such as black drop shadows and white highlights, the Weak Key dot's size and the chart tooltip's padding. Keys take their colour from their finger zone (`--finger-pinky` through `--finger-index-right`), and glows are derived from a token with `color-mix()`. The [Learn Dvorak design system](https://claude.ai/artifact/DePUGvPge9wRPzhCdsvSUG) documents the tokens, usage rules and components; add a new value to both.

## Hosting

Live at [learndvorak.com](https://learndvorak.com), served by CloudFront from a private S3 bucket with an ACM certificate. The domain is registered at GoDaddy and its DNS is hosted in Route 53. `template.yaml` defines the stack; see [ADR 0002](docs/adr/0002-cloudfront-private-s3-route53.md).

## Deployment

Every push to `master` runs `.github/workflows/deploy.yml`: lint, type-check, Prettier, then `./deploy.sh`, which builds the app, deploys the stack with SAM, uploads `dist/` and invalidates the cached `index.html`. The workflow signs in to AWS through GitHub OIDC with the role in `github-deploy-role.yaml`, a separate stack deployed by hand; see [ADR 0003](docs/adr/0003-deploy-from-github-actions.md).

To deploy from your machine instead:

```bash
aws sso login --sso-session admin
./deploy.sh
```

## Original Version

The first version was vanilla JavaScript, hosted on Google Cloud Storage at learn-dvorak.food. It was replaced by this React app in `5e7cc3b` and is still in the git history.
