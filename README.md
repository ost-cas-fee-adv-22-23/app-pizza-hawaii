[![.github/workflows/deploy.yml](https://github.com/smartive-education/app-pizza-hawaii/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/smartive-education/app-pizza-hawaii/actions/workflows/deploy.yml)


# CAS FEE ADV Application - Pizza Hawaii 🍕

## Introduction

Welcome to our project - a fictional Twitter clone named "Mumble".

In this project, we have utilized the [component library](https://smartive-education.github.io/design-system-component-library-pizza-hawaii/) we developed in the first part of the Frontend Engineering Advanced (CAS) course at [OST](https://www.ost.ch/de/weiterbildung/weiterbildungsangebot/informatik/software-engineering-testing/cas-frontend-engineering-advanced) in Rapperswil. This project uses Tailwind, React, Next 13, and Typescript technologies. 

We used a REST data endpoint provided by [qwacker API](https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/rest/#/) and the [zitadel](https://zitadel.cloud/) Login provider.
Our focus was to create a responsive and user-friendly interface that would consume the components from our library.

Developed by Team "Pizza-Hawaii" - [Felix Adam](https://github.com/flxtagi) and [Jürgen Rudigier](https://github.com/rudigier).

## Live Demopage

The latest version of our Pizza Hawaii App is available [here](https://app-pizza-hawaii.vercel.app/).

## Getting Started

Make sure you work with Node v.16 or later. 
## 1. Clone the repo. 
```
git clone https://github.com/smartive-education/app-pizza-hawaii.git
```


### Get a personal Github Token

We need a github Token and a `.npmrc` to get access to the mumble npm package at smartive education on github. 

## 2. Create a <i>classic</i> github token.

### 2.1 create  a`.npmrc` file manually in the root directory of app-pizza-hawaii. 

### 2.2 create a <i>classic</i> github token.
Create a Token with `read and write ` packages token and append the generated token to your local `.npmrc`file 

For instruction see [Github Token Instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic) on the Github page.

To authenticate by adding your personal access token (classic) to your `~/.npmrc` file, edit the `~/.npmrc` file for your project to include the following line, replacing TOKEN with your personal access token.

    @smartive-education:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=[insert TOKEN here]

>Tip: You can then set the token as an environment variable with the name `NPM_TOKEN` or add it to your `.npmrc` file.
**Please make sure to keep your token secure and not to share it with anyone.**

## 3. Create a local security environment file for variables.   

Create a `.env` file and copy these keys and insert confidential values.
> make sure there are no whitespaces between keys and values.
> beware: <em>Quacker backend has a trailing /</em>.


    # Qwacker backend
    NEXT_PUBLIC_QWACKER_API_URL=[insert prod QWACKER_API_URL]

    # Authentication
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=[insert NEXTAUTH_SECRET]

    ZITADEL_ISSUER=[insert ZITADEL ISSUER URL]
    ZITADEL_CLIENT_ID=[insert ZITADEL CLIENT ID]

    # Frontend
    NEXT_PUBLIC_URL=http://localhost:3000
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

Open  with your browser on http://localhost:3000.

You are good to go!  🎉

# App Features

## Design Features

- Mobile & Desktop optimized
- Dark Mode (toggle in the footer)
- Image Preview before posting.
- Supports all image aspect-ratios
- List of all User following you
- Skeletons during loading process
- Random PosterImages when not set

## Functional Features

- User Recommender
- Follow favorite User 
- Share a Post by share function
- Public Post Detail page
- Richtext editor
- Markdown support for posts (links)
- Parses #Hashtag to links in posts
- Answer to a user @username
- Scroll to selected Post
- View all Post sorted by Hashtag
- Link to a User in a post

## Behind the Scenes Features

- Change User settings (Zitadel account!)
- NextJS API Routes
- Polling posts on active tab
- Auto polling with increasing interval over time
- Notifier when a new Posts are avaliable / deleted / changed
- UserCache
- Custom Error Pages for 400- and 500- http states.
- PWA is ready to use on server. (Desktop / Mobile)
- W3C validity
- Accessibility


## Rendering Strategies

- Login & Register: Static no Data
- Timeline: ServerSide
- Recommendations (User-Page): ClientSide
- PostDetail: Static (public version) & ServerSide (user version)


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
3.  pretier rules
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
````

start the testrunner with

    npx playwright test


or with ui:

    npx playwright test --ui


reports are available

    npx playwright show-report



### Pretier

    npm run prettier --check

    npm run prettier:fix

### Build the application locally

    npm run build

and start locally built with

    npm run start

### API routes

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on . This endpoint can be edited in `pages/api/auth`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

<br/>

# Image Deployment 

building image and deploy it to Google Cloud Installation

Preparations:

1. install docker and docker-cli on your system
2. enroll to google-cloud
3. 


## Docker Container

1. Build a docker image with the following command.

Note: The switch `--platform linux/amd64` is necessary if you work on a Mac silicon M1/M2 processor architecture!
We will deploy on a amd linux architecture, this ensures compability. 

`
docker build -t europe-west6-docker.pkg.dev/project-pizza-388116/pizza-repo/app-pizza-hawaii --build-arg NPM_TOKEN=<NPM_TOKEN> --platform linux/amd64 .
`


2. Upload your docker-container manually to Google Cloud

`
docker push europe-west6-docker.pkg.dev/project-pizza-388116/pizza-repo/app-pizza-hawaii
`

3. deploy manually in the Cloud Run console


## TerraForm

### preparation
install terraForm on your system and on command line

A docker-build should be there.

Create a Bucket for Terraform State
1. navigate in Google Console to `Cloud Storage`
2. create a 'Bucket' for the tf-state. `default.tfstate`


init the project with

`terraform init`


### secret manager 
for confidential environment variables considered we use the `Google Cloud Secret Manager`.
We can add there secret variables and then we can use it without having them in the deploy script.


we have to enable the import theses secrets by using this command:

`
terraform import google_secret_manager_secret.default ZITADEL_CLIENT_ID
`


Then we add the following code to terraForm configuration

```
resource "google_secret_manager_secret" "default" {
  secret_id = "NEXTAUTH_SECRET"

  replication {
    user_managed {
      replicas {
        location = local.gpc_region
      }
    }
  }
}
```


# Create Terraform configuration

in 'main.tf' we describe our Project, define local variables, Data source and Terraform State location (Bucket at cloud). This file will be executed first. 


The file 'cloud-run.tf' defines the deploy process for in Google Cloud run.
Here we define:
- the role-management of cloud runner process
- resources to be applied for the virtual server 
- non-confident env-variables
- secret handling vor confident variables
- Ports and Protocols
- deployment settings

All important Sections are documented within the file. 


### Test Terraform configuration

`
terraform plan
`

### Run Terraform Workflow

`
terraform apply -auto-approve
`

## LiveDemo

if the the deploy process is successfull we have a newly built app 

at: https://app-pizza-hawaii-rcosriwdxq-oa.a.run.app/





# Deployment checks

## Code Quality

To ensure Qulity of deployed Code when deploying, there are github actions running

`ESLint` and `Dependency Cruiser` 

on every git commit push and on merge-requests. 


## Check Web Vitals metrics


To ensure our Web metrics are meeting some standards and will not been ruined by implementing some new features, we check for the following metrics and Web Vital scores:

- First Contentful Paint
- Performance
- Accessibility
- Best Practices
- SEO
- DOM size
- installable Manifest (PWA check)
- service Worker (PWA check)


have a look at the github action logs to see the exact location of the final reports. 


to run these Tests locally:

```
npx lhci autorun
```




## PWA

The application uses the default settings of [next-pwa](https://github.com/shadowwalker/next-pwa) lib, which provides the following main features:

-   caching static assets 
-   install on native device (add-to-Homescreen)
-   offline fallback Page

note: PWA functionality is not running in developement environment, if you want to test this locally
you have to build the next js app. and then run with `npm start`.

## License

The Pizza Hawaii App is open source software licensed under the MIT license. Non Commercial use. 

## Maintainer

[Jürgen Rudigier](https://github.com/rudigier), 
[Felix Adam](https://github.com/flxtagi) 
