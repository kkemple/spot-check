import React from "react";
import Amplify, { Auth } from "aws-amplify";
import AWSAppSyncClient from "aws-appsync";
import { ApolloProvider } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";

import Home from "./Home";
import AppSyncConfig from "./aws-exports";

Amplify.configure({
  ...AppSyncConfig,
  Analytics: {
    disabled: true,
  },
});

const client = new AWSAppSyncClient({
  disableOffline: true,
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_appsync_region,
  auth: {
    type: AppSyncConfig.aws_appsync_authenticationType,
    async jwtToken() {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    },
  },
});

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <Home />
    </Rehydrated>
  </ApolloProvider>
);
