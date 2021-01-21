import "react-native-gesture-handler";
import React from "react";
import Amplify, { Auth } from "aws-amplify";
import AWSAppSyncClient from "aws-appsync";
import { ApolloProvider } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { withAuthenticator, AmplifyTheme } from "aws-amplify-react-native";

import CreateSpot from "./CreateSpot";
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

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  homeText: {
    fontSize: 24,
  },
});

const Tab = createBottomTabNavigator();
const Home = () => (
  <View style={styles.home}>
    <Text style={styles.homeText}>Welcome to SpotCheck</Text>
  </View>
);

const PRIMARY_COLOR = "#3F20BA";

const App = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={route.name === "Home" ? "ios-home" : "ios-create"}
                size={size}
                color={color}
              />
            ),
          })}
          tabBarOptions={{
            activeTintColor: PRIMARY_COLOR,
            inactiveTintColor: "gray",
          }}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="CreateSpot" component={CreateSpot} />
        </Tab.Navigator>
      </NavigationContainer>
    </Rehydrated>
  </ApolloProvider>
);

const theme = {
  ...AmplifyTheme,
  ...StyleSheet.create({
    button: {
      ...AmplifyTheme.button,
      backgroundColor: PRIMARY_COLOR,
    },
    buttonDisabled: {
      ...AmplifyTheme.buttonDisabled,
      backgroundColor: PRIMARY_COLOR,
    },
    sectionFooterLink: {
      ...AmplifyTheme.sectionFooterLink,
      color: PRIMARY_COLOR,
    },
  }),
};

export default withAuthenticator(
  App,
  {
    usernameAttributes: "email",
    signUpConfig: {
      hiddenDefaults: ["phone_number"],
    },
  },
  null,
  null,
  theme
);
