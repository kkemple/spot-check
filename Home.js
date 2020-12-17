import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { withAuthenticator, AmplifyTheme } from "aws-amplify-react-native";
import { StyleSheet, Text, Button, TextInput, View } from "react-native";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { createSpot } from "./graphql/mutations";
import { listSpots } from "./graphql/queries";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 32,
  },
});

function CreateSpot() {
  const [state, setState] = useState({
    name: "",
    description: "",
    lat: 0,
    lon: 0,
    tags: [],
  });

  const updateState = (key) => (value) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Mutation
      // TODO: figure out why imported mutation isn't working
      // TODO: summon nader
      mutation={gql`
        mutation CreateSpot(
          $input: CreateSpotInput!
          $condition: ModelSpotConditionInput
        ) {
          createSpot(input: $input, condition: $condition) {
            id
            name
            description
            location {
              lat
              lon
            }
            tags
            createdAt
            updatedAt
            owner
          }
        }
      `}
    >
      {(createSpot, { loading, error }) => (
        <View>
          {error && <Text>{error.message}</Text>}
          <TextInput
            onChangeText={updateState("name")}
            value={state.name}
            placeholder="Spot name"
          />
          <TextInput
            onChangeText={updateState("description")}
            value={state.description}
            placeholder="Describe the spot"
          />
          <Text>Latitude</Text>
          <TextInput
            onChangeText={updateState("lat")}
            value={state.lat}
            keyboardType="numeric"
          />
          <Text>Longitude</Text>
          <TextInput
            onChangeText={updateState("lon")}
            value={state.lon}
            keyboardType="numeric"
          />
          <Button
            disabled={loading}
            onPress={() =>
              createSpot({
                variables: {
                  input: {
                    name: state.name,
                    description: state.description,
                    location: {
                      lat: state.lat,
                      lon: state.lon,
                    },
                    tags: state.tags,
                  },
                },
              })
            }
            title="Create spot"
          />
        </View>
      )}
    </Mutation>
  );
}

function Home() {
  return (
    <View style={styles.container}>
      <Query
        query={gql`
          ${listSpots}
        `}
      >
        {({ data, error, loading }) => {
          if (loading) {
            return <Text>One moment</Text>;
          }

          if (error) {
            return <Text>{error.message}</Text>;
          }

          return (
            <>
              <CreateSpot />
              <Text style={styles.text}>
                There are {data.listSpots.items.length} spots
              </Text>
              <StatusBar style="auto" />
            </>
          );
        }}
      </Query>
    </View>
  );
}

const theme = {
  ...AmplifyTheme,
  ...StyleSheet.create({
    button: {
      ...AmplifyTheme.button,
      backgroundColor: "#3F20BA",
    },
    buttonDisabled: {
      ...AmplifyTheme.buttonDisabled,
      backgroundColor: "#3F20BA",
    },
    sectionFooterLink: {
      ...AmplifyTheme.sectionFooterLink,
      color: "#3F20BA",
    },
  }),
};

export default withAuthenticator(
  Home,
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
