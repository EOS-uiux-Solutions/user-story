## Using Okta as Single Sign-On (SSO) Provider
Our users can add Okta as single sign-on provider. In order to this they can follow the given steps.

### Frontend

 1. In config.json file make sure that SSO is `true`.

### Backend

 1. **Set up Okta**
 
 -   [Sign in to your Okta organization (opens new window)](https://developer.okta.com/login)with your administrator account.
 - Click the **Admin** button on the top right of the page
 - Open the Applications configuration pane by selecting  **Applications**  >  **Applications**.
 - Click  **Create App Integration**.
 - Select a  **Sign-in method**  of  **OIDC - OpenID Connect**, then click  **Next**.
 - Select an **Application type** of **Web Application**, then click **Next**.
 - Enter an  **App integration name**.
 - Enter the **Sign-in redirect URIs** for local development, such as `http://localhost:1337/connect/okta/callback`
 - Enter the  **Sign-out redirect URIs**  for both local development, such as  `http://localhost:xxxx/signout/callback`. For more information on callback URIs, see  [Define callback route](https://developer.okta.com/docs/guides/sign-into-web-app-redirect/node-express/main/#define-a-callback-route).
 - In the  **Assignments**  section, define the type of  **Controlled access**  for your app. Select the  **Everyone**  group for now. For more information, see the  [Assign app integrations (opens new window)](https://help.okta.com/okta_help.htm?type=oie&id=ext-lcm-user-app-assign)topic in the Okta product documentation.
 - Click  **Save**  to create the app integration. The configuration pane for the integration opens after it's saved. Keep this pane open as you copy some values when configuring your app.
2.  Start the Strapi server using `npm run develop`.
3. Visit this page http://localhost:1337/admin/plugins/users-permissions/providers
4. Press the Okta provider and enable it.
5. Enter all the details. Client ID,Client Secret,Subdomain you will get on the Okta dashboard.
6.  Set State to `true` and redirect URL to the frontend app to the http://localhost:3000/connect/okta/redirect.

That's all . You can now use Okta SSO provider.