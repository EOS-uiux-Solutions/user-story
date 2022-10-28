## Using Okta as Single Sign-On (SSO) Provider

Our users can add Okta as single sign-on provider. In order to this they can follow the given steps.

### Backend

1. **Set up Okta**

- [Sign in to your Okta organization (opens new window)](https://developer.okta.com/login) with your administrator account.

- Click the **Admin** button on the top right of the page

- Open the Applications configuration pane by selecting **Applications** > **Applications**.

- Click **Create App Integration**.

- Select a **Sign-in method** of **OIDC - OpenID Connect**, then click **Next**.

- Select an **Application type** of **Web Application**, then click **Next**.

![image](https://user-images.githubusercontent.com/5013096/188324416-713bc5b7-9b29-45bf-ac0a-5a2f7efca17a.png)

- Enter an **App integration name** and other details.

![image](https://user-images.githubusercontent.com/54779517/190271202-b21f2341-f97e-417c-9b6a-03617946acba.png)

- Enter the **Sign-in redirect URIs** for local development, such as `http://localhost:1337/connect/okta/callback`

- Enter the **Sign-out redirect URIs** for both local development, such as `http://localhost:1337`. For more information on callback URIs, see [Define callback route](https://developer.okta.com/docs/guides/sign-into-web-app-redirect/node-express/main/#define-a-callback-route).

- In the **Assignments** section, define the type of **Controlled access** for your app. Select the **Everyone** group for now. For more information, see the [Assign app integrations (opens new window)](https://help.okta.com/okta_help.htm?type=oie&id=ext-lcm-user-app-assign) topic in the Okta product documentation.

![screencapture-dev-34603232-admin-okta-com-admin-apps-oauth2-wizard-create-1663192758622](https://user-images.githubusercontent.com/54779517/190271574-3c416cf0-7cd8-40c0-be1b-90dc3fc8bbbf.png)

  

- Click **Save** to create the app integration. The configuration pane for the integration opens after it's saved. Keep this page open so that you can copy the values that you will need next to finish configuring your app

- Update the scopes of your application. Grant access to the scopes mentioned in the image below.

![screencapture-dev-34603232-admin-okta-com-admin-app-oidc_client-instance-0oa6eka8coG9fXiS25d7-1662465158554 (1)](https://user-images.githubusercontent.com/54779517/190271985-4ace9c93-0529-4102-b01c-c7b63b8168eb.png)

  

2. Start the Strapi server using `npm run develop`.

3. Visit this page http://localhost:1337/admin/plugins/users-permissions/providers

4. Press the Okta provider and enable it.

5. Enter all the details. Client ID,Client Secret you will get on the Okta dashboard.

6. Enter the [Subdomain](https://developer.okta.com/docs/guides/find-your-domain/main/). Don't add the whole domain only add the initial name for eg `example.okta.com` for such domain only add `example` the initial part of the URL.

7. Set State to `true` and redirect URL to the frontend app to the http://localhost:3000/connect/okta/redirect.

  

![image (1)](https://user-images.githubusercontent.com/54779517/190273205-0dbf460a-c378-44bc-8030-128a85604ce4.png)

  8. After this you need to visit the plugin Roles and Permissions and give access to `getProviders` under the Public Role. 
  9. After clicking the Public Role and scroll down and click on the Users-Permissions tab and there you will find the `getProviders`
  
![enter image description here](https://user-images.githubusercontent.com/54779517/197399267-c34c7a09-d029-4cb4-91c9-bb698e168411.png)
  

That's all . You can now use Okta SSO provider.