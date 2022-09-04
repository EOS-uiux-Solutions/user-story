## Using Okta as Single Sign-On (SSO) Provider
Our users can add Okta as single sign-on provider. In order to this they can follow the given steps.

### Frontend

 1. In config.json file make sure that SSO is `true`.
 
 
   ![carbon (1)](https://user-images.githubusercontent.com/54779517/188336102-5c92a9eb-f69b-4dc5-b389-8280d2fab8ef.png)



### Backend

 1. **Set up Okta**
 
 -   [Sign in to your Okta organization (opens new window)](https://developer.okta.com/login)with your administrator account.
 - Click the **Admin** button on the top right of the page
 - Open the Applications configuration pane by selecting  **Applications**  >  **Applications**.
 - Click  **Create App Integration**.
 - Select a  **Sign-in method**  of  **OIDC - OpenID Connect**, then click  **Next**.
 - Select an **Application type** of **Web Application**, then click **Next**.
 
   ![image](https://user-images.githubusercontent.com/5013096/188324416-713bc5b7-9b29-45bf-ac0a-5a2f7efca17a.png)
 - Enter an  **App integration name**.
 - Enter the **Sign-in redirect URIs** for local development, such as `http://localhost:1337/connect/okta/callback`
 - Enter the  **Sign-out redirect URIs**  for both local development, such as  `http://localhost:3000/signout/callback`. For more information on callback URIs, see  [Define callback route](https://developer.okta.com/docs/guides/sign-into-web-app-redirect/node-express/main/#define-a-callback-route).
 - In the  **Assignments**  section, define the type of  **Controlled access**  for your app. Select the  **Everyone**  group for now. For more information, see the  [Assign app integrations (opens new window)](https://help.okta.com/okta_help.htm?type=oie&id=ext-lcm-user-app-assign)topic in the Okta product documentation.
 - Click  **Save**  to create the app integration. The configuration pane for the integration opens after it's saved. Keep this page open so that you can copy the values that you will need next to finish configuring your app
2.  Start the Strapi server using `npm run develop`.
3. Visit this page http://localhost:1337/admin/plugins/users-permissions/providers
4. Press the Okta provider and enable it.
5. Enter all the details. Client ID,Client Secret,[Subdomain](https://developer.okta.com/docs/guides/find-your-domain/main/) you will get on the Okta dashboard.
6.  Set State to `true` and redirect URL to the frontend app to the http://localhost:3000/connect/okta/redirect.

That's all . You can now use Okta SSO provider.
