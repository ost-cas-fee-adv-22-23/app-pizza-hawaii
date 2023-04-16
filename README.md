# CAS FEE ADV Application - Pizza Hawaii 🍕 

This Webapplication, developed by [Felix Adam](https://github.com/flxtagi) and [Jürgen Rudigier](https://github.com/rudigier), is a fictional Twitter clone named "Mumble".

It is created as a part of a Frontend Engineering Advanced (CAS) course, to implement our [component Library](https://smartive-education.github.io/design-system-component-library-pizza-hawaii/) and with data endpoint provided by [qwacker API](https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/rest/#/) and the [zitadel](https://zitadel.cloud/) login provider.


## Live Demopage

The latest version of our App is available [here](https://app-pizza-hawaii.vercel.app/).

## Getting Started

Clone the repo. 

`git clone https://github.com/smartive-education/app-pizza-hawaii.git`

Install the dependencies with `npm install` or `npm ci`

### Get a personal Github Token

We need a github Token and a `.npmrc` to get access to the mumble npm package at smartive education on github.

1. Create a <b>classic</b> github token and add to `.npmrc`. (create this file manually)

[Github Token Instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic) on the Github page

To authenticate by adding your personal access token (classic) to your `~/.npmrc` file, edit the `~/.npmrc` file for your project to include the following line, replacing TOKEN with your personal access token.


```
@smartive-education:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<NPM_TOKEN>
```
Tip: You can then set the token as an environment variable with the name `NPM_TOKEN` or add it to your `.npmrc` file.
**Please make sure to keep your token secure and not to share it with anyone.**


2. Create a `.env` file copy these keys and insert confidential values 

```
# Qwacker backend
NEXT_PUBLIC_QWACKER_API_URL= [insert prod QWACKER_API_URL]

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= [insert NEXTAUTH_SECRET]

ZITADEL_ISSUER= [insert ZITADEL ISSUER URL]
ZITADEL_CLIENT_ID= [insert ZITADEL CLIENT ID]

# Frontend
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
```

3. run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

4. Register a User at Zitadel. 

You are good to go!  🎉

## Scripts

### ES Lint

ES Linter configuration checks for following topics
1. smartive eslint-config
2. import rules sorting
3. pretier rules
4. no consoles
5. react-hook rules

```
npm run lint 

npm run lint --fix
```

### Dependency cruiser

```
npm run dep-cruise:validate
```

### Pretier

```
npm run prettier --check

npm run prettier:fix
```


## Development (tbd)

### API routes

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.



## PWA

The application uses the default settings of [next-pwa](https://github.com/shadowwalker/next-pwa) lib, which provides the following main features:

- caching static assets 
- install on native device (add-to-Homescreen)
- offline fallback page


## git semantic commit message 

We use these semantics while committing to maintain a meaningful commit history:

`feat:` new feature for the user, not a new feature for build script

`fix:` bug fix for the user, not a fix to a build script

`docs:` changes to the documentation

`style:` formatting, missing semi colons

`refactor:` refactoring production code, eg. renaming a variable

`test:` adding missing tests, refactoring tests

`chore:` updating scripts, libraries changes, configurations

## License
The Pizza Hawaii App is open source software licensed under the MIT license.





