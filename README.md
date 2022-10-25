[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://choosealicense.com/licenses/mit/)

Online demo: [Userstory.site](https://userstory.site)

# User Story

![](./static/user_story.png)

# Introduction

The goal of **User Story** is to design and present a scalable backend infrastructure that delivers a web interface allowing users to request new features and give feedback in an easy and intuitive way. Users can attach files with their story to explain what they want. The admins can then resolve, close and update the status of these stories. Users can interact with other stories via comments and votes. This can also serve as an efficient feedback and response mechanism which is critical for any organization to improve and make progress. Put in simple words, User Story is an open **product management tool**.

# How it works

![](./static/user_story_workflow.png)

# Guidelines for development

### Setting up the project

After cloning this repository you will need to install all the dependencies: `npm i -f`

User Story uses [this repository](https://github.com/EOS-uiux-Solutions/strapi) as its `backend`. There are two ways to set up the `backend`:

- You can use Docker to setup backend by following [these instructions](https://github.com/EOS-uiux-Solutions/strapi#using-docker) If you are planning to work only on the `frontend` of User Story, then follow along.

- You can setup `backend` locally by following [these instructions](https://github.com/EOS-uiux-Solutions/strapi#locally).

#### Backend configurations

After setting up the project, make sure the following configurations exist in the backend.

- A permission named as `Delete Story` should be defined in the **User Story Permission** collection.
- Only those instances of **User Story Roles**, that have the `Delete Story` permission, will be allowed to delete a story.
- Only those instances of **User Story Roles**, that have the `Edit Story` or `Update Story Status` permission, will be allowed to update the status of a story using drag and drop in the roadmap view.

If you want to work only on the `frontend` then copy the `src/config.temp.json` and remove the `.temp` part from the file name. It is already assigned with the default value of `apiURL` to `https://strapi.userstory.site`. You can change it for your own Strapi endpoint if you are running already. The `APP_ENV` key will accept any string value. If you set it as "prod" it will not print console.logs so this is the recommended setting for production environment.

Then run: `npm start` to run the app in development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### JS and SCSS quality assurance

Before submitting a PR/MR make sure your code is compliant with our JS rules by running: `npm run test:js`
You can format it automatically by running: `npm run format`.

We use the `sass-lint` because it is also compatible with SCSS syntax. To make sure your SCSS is compliant run: `npm run test:scss`.

### Build it to ensure it will work on production

`npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# How to contribute

### Code contributions

1. Open a new issue or pick an open issue from the issue list and claim it in the comments. Make sure that the issue is confirmed so you don't work on something that will not be approved to be merged.
2. Make sure you follow our best practices: [refer to our Wiki](https://github.com/EOS-uiux-Solutions/wiki/blob/main/README.md). You'll find information on writing code, how to name a branch, how we release, etc.
3. Join Slack [optional] to get in touch with the maintainers if you have any doubt: [join slack](http://slack.eosdesignsystem.com)
4. Make sure you fork the project, cloning it will not give you the right access to open a PR/MR. [How to open a PR in open source](https://github.com/EOS-uiux-Solutions/wiki/blob/main/Basic-git-instructions-for-beginners.md)

### Design contributions

If you'd like to contribute with design changes, you'll have to do as follows:

1. [Open an issue](https://github.com/EOS-uiux-Solutions/user-story/issues/new)
2. Add all relevant information to the issue. Please be as descriptive as possible. Add links to references, images, videos, etc.
3. While working on your design, please make sure you follow our [design guidelines](https://github.com/EOS-uiux-Solutions/wiki/blob/main/Design-process-and-feedback-gathering.md).
4. Once the issue is approved by us, it'll be ready to be implemented.

## Learn more about the EOS UX/UI Solutions

- [EOS Icons](https://eos-icons.com)

- [EOS User Story](https://userstory.site)

- [Follow us on Twitter](https://twitter.com/eos_uxui)

- [Join us on Slack](https://slack.userstory.site)
