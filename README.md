![Main Workflow)](https://github.com/smartive-education/app-pizza-hawaii/actions/workflows/main.yml/badge.svg)
![Staging Workflow](https://github.com/smartive-education/app-pizza-hawaii/actions/workflows/stage.yml/badge.svg)

# CAS FEE ADV Application - Pizza Hawaii 🍕

## Introduction

Introduces the project as a fictional Twitter clone named "Mumble" and mentions the technologies used.

In this project, we have utilized the [component library](https://smartive-education.github.io/design-system-component-library-pizza-hawaii/) we developed in the first part of the Frontend Engineering Advanced (CAS) course at [OST](https://www.ost.ch/de/weiterbildung/weiterbildungsangebot/informatik/software-engineering-testing/cas-frontend-engineering-advanced) in Rapperswil. This project uses Tailwind, React, Next 13, and Typescript technologies.

We used a REST API data endpoint provided by [qwacker API](https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/rest/#/) and the [zitadel](https://zitadel.cloud/) Login provider.
Our focus was to create a responsive and user-friendly interface that would consume the components from our library.

Developed by Team "Pizza-Hawaii" - [Felix Adam](https://github.com/flxtagi) and [Jürgen Rudigier](https://github.com/rudigier).

## Live Demopage (Staging)

The latest version of our Pizza Hawaii App is available on Vercel [here](https://app-pizza-hawaii.vercel.app/).

## Live Production Page (GCP)

The latest version of our Pizza Hawaii App is available on Google CloudRun [here](https://app-pizza-hawaii-rcosriwdxq-oa.a.run.app)

## Getting Started

Make sure you work with Node v.16 or later.

## 1. Clone the Repository

```
git clone https://github.com/smartive-education/app-pizza-hawaii.git
```

### Get a personal Github Token

We need a github Token and a `.npmrc` to get access to the mumble npm package at smartive education on github.

## 2. Create a <i>classic</i> github token.

### 2.1 create a`.npmrc` file manually in the root directory of app-pizza-hawaii.

### 2.2 create a <i>classic</i> github token.

Create a Token with `read and write ` packages token and append the generated token to your local `.npmrc`file

For instruction see [Github Token Instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic) on the Github page.

To authenticate by adding your personal access token (classic) to your `~/.npmrc` file, edit the `~/.npmrc` file for your project to include the following line, replacing TOKEN with your personal access token.

    @smartive-education:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=[insert TOKEN here]

> Tip: Add the token also as an environment secret with the name `NPM_TOKEN`.
> **Please make sure to keep your token secure and not to share it with anyone.**

## 3. Create a local security environment file for variables.

Create a `.env` file and copy these keys and insert confidential values.

> make sure there are no whitespaces between keys and values.
> beware: <em>Quacker backend has a trailing /</em>.
> Note: <em>The Quacker backend has a trailing slash /</em>.

    # Qwacker backend
    NEXT_PUBLIC_QWACKER_API_URL=[insert prod QWACKER_API_URL]

    # Authentication
    NEXTAUTH_SECRET=[insert NEXTAUTH_SECRET]

    ZITADEL_ISSUER=[insert ZITADEL ISSUER URL]
    ZITADEL_CLIENT_ID=[insert ZITADEL CLIENT ID]

    # Frontend
    NEXT_PUBLIC_VERCEL_URL=http://localhost:3000

## 4. Install

Install the dependencies with `npm install`.

## 5. Register a User

Register a User at [Zitadel](https://zitadel.cloud/).

## 6. run the Development Server on localhost:

```bash
npm run dev
# or
yarn dev
```

Open with your browser on http://localhost:3000.

You are good to go! 🎉

# App Features

## Design Features

-   Mobile and desktop optimized
-   Dark Mode (toggle in the footer)
-   Image Preview before posting.
-   Supports all image aspect-ratios
-   List of all users following you
-   Skeletons during loading process
-   Random PosterImages when not set

## Functional Features

-   User Recommender
-   Follow favorite User
-   Share a Post by share function
-   Public Post Detail page
-   Richtext editor
-   Markdown support for posts (links)
-   Parses #Hashtag to links in posts
-   Answer to a user @username
-   Scroll to selected Post
-   View all Post sorted by Hashtag
-   Link to a User in a post

## Behind the Scenes Features

-   Change User settings (Zitadel account!)
-   NextJS API Routes
-   Polling posts on active tab
-   Auto polling with increasing interval over time
-   Notifier when a new Posts are available / deleted / changed
-   UserCache
-   Custom Error Pages for 400- and 500- http states.
-   PWA is ready to use on server. (Desktop / Mobile)
-   W3C validity
-   Accessibility

## Rendering Strategies

-   Login & Register: Static no Data
-   Timeline: ServerSide
-   Recommendations (User-Page): ClientSide
-   PostDetail: Static (public version) & ServerSide (user version)

# Development

## git semantic commit message

We use these semantics while committing to maintain a meaningful commit history:

`feat:` new feature for the user, not a new feature for build script

`fix:` bug fix for the user, not a fix to a build script

`docs:` changes to the documentation

`style:` formatting, missing semi colons

`refactor:` refactoring production code, eg. renaming a variable

`test:` adding missing tests, refactoring tests

`chore:` updating scripts, libraries changes, configurations

## Scripts

### ES Lint for code quality

ES Linter configuration checks for following topics
We know: sometimes a console.log is needed on the server. Therefore it is on a `warning` level as a reminder.

1.  smartive eslint-config
2.  import rules sorting
3.  prettier rules
4.  no consoles
5.  react-hook rules

´´´

    npm run lint

    npm run lint --fix

´´´

### Dependency cruiser

    npm run dep-cruise:validate

### End to End tests using Playwright

prepare your local '.env-file' with your credentials (for the moment)

```
ZITADEL_USERNAME=
ZITADEL_PASSWORD=
```

start the test runner with

    npx playwright test

or with ui:

    npx playwright test --ui

reports are available

    npx playwright show-report

### Prettier

    npm run prettier --check

    npm run prettier:fix

### Build the application locally

    npm run build

and start locally built with

    npm run start

### API routes

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on. This endpoint can be edited in `pages/api/auth`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

<br/>

# Image Deployment

Building image and deploy it to Google Cloud Installation

## Preparations

> Install Docker and Docker CLI on your system

## Workload Identity Provider (WIF / WIP) for Google Cloud

### 1. Enroll to google-cloud with a service account and Workload Identity Provider

create gcloud with service account 'xxx-account' for deployment

```
gcloud iam service-accounts create "xxx-account"  \\n  --project "project-xxx"
```

### 2. Update gcloud

```
gcloud components update
```

### 3. Enable service account for the project

```
gcloud services enable iamcredentials.googleapis.com \\n  --project "${PROJECT_ID}"
```

### 4. Create gcloud pool

```
gcloud iam workload-identity-pools create "xxx-pool" \\n  --project="${PROJECT_ID}" \\n  --location="global" \\n  --display-name="xxx-pool"
```

### 5. Describe the pool

```
gcloud iam workload-identity-pools describe "xxx-pool" \\n  --project="${PROJECT_ID}" \\n  --location="global" \\n  --format="value(name)"
```

### 6. Export the workload pool

```
export WORKLOAD_IDENTITY_POOL_ID="projects/654053669202/locations/global/workloadIdentityPools/xxx-pool"
```

### 7. Create providers at Google Cloud

```
gcloud iam workload-identity-pools providers create-oidc "xxx-provider" \\n  --project="${PROJECT_ID}" \\n  --location="global" \\n  --workload-identity-pool="xxx-pool" \\n  --display-name="CAS_FEE_23_Provider" \\n  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \\n  --issuer-uri="https://token.actions.githubusercontent.com"
```

### 8. Define and export the repo

```
export REPO="smartive-education/app-pizza-hawaii"
```

### 9. Connect the repo with the project and set the role

```
gcloud iam service-accounts add-iam-policy-binding "xxx-account@${PROJECT_ID}.iam.gserviceaccount.com" \\n  --project="${PROJECT_ID}" \\n  --role="roles/iam.workloadIdentityUser" \\n  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}"
```

### 10. Configure the workload identity pool provider

```
gcloud iam workload-identity-pools providers describe "xxx-provider" \\n  --project="${PROJECT_ID}" \\n  --location="global" \\n  --workload-identity-pool="xxx-pool" \\n  --format="value(name)"
```

# Docker Container

1. Build a Docker image with the following command.

Note: if you want to build it locally first, the switch `--platform linux/amd64` is necessary if you work on a Mac silicon M1/M2 processor architecture.

We will deploy on a amd linux architecture, this ensures compatibility.

`docker build -t europe-west6-docker.pkg.dev/project-xxx/pizza-repo/app-pizza-hawaii --build-arg NPM_TOKEN=<NPM_TOKEN> --platform linux/amd64 .`

2. Manually upload your Docker container to Google Cloud

`docker push europe-west6-docker.pkg.dev/project-xxx/pizza-repo/app-pizza-hawaii`

3. Manually deploy in the Cloud Run console

<br />

# Terraform

### Preparation

> install terraForm on your system and on command line

A Docker-build should be in place.

Create a Bucket for Terraform State

1. navigate in Google Console to `Cloud Storage`
2. create a 'Bucket' for the tf-state. `default.tfstate`

init the project with

`terraform init`

### secret manager

for confidential environment variables considered we use the `Google Cloud Secret Manager`.
We can add there secret variables and then we can use it without having them in the deploy script.

we have to enable the import theses secrets by using this command:

`terraform import google_secret_manager_secret.default ZITADEL_CLIENT_ID`

Then we add the following code to terraForm configuration

```
data "google_secret_manager_secret_version" "nextauth_secret" {
  provider = google

  secret  = "nextauth_secret"
  version = "1"
}
```

## Create Terraform configuration

In `main.tf` we describe our Project, define local variables, Data source and Terraform State location (Bucket at cloud). This file will be executed first.

The file 'cloud-run.tf' defines the deploy process for in Google Cloud run.
Here we define:

-   the role-management of cloud runner process
-   resources to be applied for the virtual server
-   non-confident env-variables
-   secret handling vor confident variables
-   Ports and Protocols
-   deployment settings

All important Sections are documented within the Terraform files `main.tf` and `cloud-run.tf` in the `/terraform` folder.

### Test Terraform configuration

`terraform plan`

### Validate Terraform configuration

`terraform validate`

### Run Terraform Workflow

if the workflow succeeded until here then we can apply the the changes with the switch `-auto-approve`.

`terraform apply -auto-approve`

## LiveDemo at Google Cloud

if the the deploy process is successful we have a newly built App Pizza Hawaii Mumble serving with CloudRun Service at:

https://app-pizza-hawaii-rcosriwdxq-oa.a.run.app

# Pipeline

We have a CI/CD Pipeline in place. The pipeline is triggered by a push to the main branch or by a pull request.

## Main Workflow

The pipeline is defined in the file `.github/workflows/main.yml`
![Main workflow](./doc/main-workflow.png?raw=true)

We have the following steps in place:

1. Code Quality
2. Unit Tests
3. Build Docker Image on GitHub
4. Run E2E Tests and Web Vitals
5. Push Docker Image to Google Cloud
6. Deploy to Google Cloud Run
7. Run E2E Tests on live App

## Pull Request Workflow

The pipeline is defined in the file `.github/workflows/pull-request.yml`
![PullRequest Workflow](./doc/pull-request-workflow.png?raw=true)

We have the following steps in place:

1. Code Quality
2. Unit Tests
3. Build Docker Image on GitHub
4. Run E2E Tests and Web Vitals

# Deployment checks

## Stage 1: Code Quality

To ensure Quality of deployed Code when deploying, there are github actions running
We check Linting of our files, correct styling, TypeScript compiler, and dependencies.

1. `ESLint`
2. `Prettier`
3. `tsc`
4. `Dependency Cruiser`

on every git commit push and on merge-requests.

## Stage 2: Unit Tests

The Unit-Test using the Test Framework Jest / React Test Library are located in `tests/unit/tests/components`

We focus on following Requirements or Features to consider a Unit Test meaningful:

-   Datamanipulation in the Frontend
-   Core Function
-   Validation of Data
-   Loading behavior
-   Fallbacks
-   Special Solutions

We test the following Components to ensure the functionality to work:

-   `AccountForm`
-   `PostCollection`
-   `PostCollectionReducer`
-   `PostItem`
-   `Footer`
-   `RichTextEditor`
-   `UserRecommender`

to run Unit Tests locally:

`npm run test-unit`

or a specific Test

`npm run test-unit AccountFormTest.test.tsx`

## Stage 3: Build Docker Container

Docker Container will be built with Production Environment variables.
The `NEXT_PUBLIC_VERCEL_URL` differs depending on the Workflow if the Build is for test (Vercel) or Production (CloudRun).

## Stage 4: Check Web Vitals metrics

To ensure our Web metrics are meeting some standards and will not been ruined by implementing some new features, we check for the following metrics and Web Vital scores:

-   First Contentful Paint
-   Performance
-   Accessibility
-   Best Practices
-   SEO
-   DOM size
-   installable Manifest (PWA check)
-   service Worker (PWA check)

These Tests run on the current Docker Container to be deployed.
Have a look at the github action logs to see the exact location of the final reports.
They are stored for 30 Days at a [google storrage API](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1688494141179-71684.report.html) (Example from 4.07.2023)

to run these Tests locally:

```
npx lhci autorun
```

## Stage 5: End-to-End Tests

To ensure basic functionality we test with several Browsers Workflows and User-Interaction of our Pizza-Hawaii Application. We use `Playwright` Library for that. These Tests run on the current Docker Container to be deployed.

Following End-to-End tests are running:

-   Register Form: Necessary Fields, Error Messages, Password validation.
-   Standalone Post (no login required)
-   Standalone Post Login
-   Login Page: Login and Logout Procedure
-   Posting a Mumble Entry, Like that Post, Unlike it, Delete exactly that Post again.

> These tests will be be executed with the following Browsers: Firefox, Chromium & Mobile Chrome.

to run these Tests locally:

```
npm run test-end2end
```

with Graphical User Interface starting

```
npm run test-end2end:ui
```

## PWA

The application uses the default settings of [next-pwa](https://github.com/shadowwalker/next-pwa) lib, which provides the following main features:

-   caching static assets
-   install on native device (add-to-Homescreen)
-   offline fallback Page

note: PWA functionality is not running in development environment, if you want to test this locally
you have to build the next js app. and then run with `npm start`.

## License

The Pizza Hawaii App is open source software licensed under the Apache-2.0 license. Non Commercial use.

## Maintainer

[Jürgen Rudigier](https://github.com/rudigier),
[Felix Adam](https://github.com/flxtagi)
