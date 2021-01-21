import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  Button,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { createSpot } from "./graphql/mutations";
import { listSpots } from "./graphql/queries";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import debounce from "lodash.debounce";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 32,
  },
  createSpot: {
    backgroundColor: "#fff",
    marginTop: "auto",
    padding: 8,
  },
  map: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

function SpotForm({ location }) {
  const [state, setState] = useState({
    name: "",
    description: "",
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
        <KeyboardAvoidingView style={styles.createSpot}>
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
          <Button
            disabled={loading}
            onPress={() =>
              createSpot({
                variables: {
                  input: {
                    name: state.name,
                    description: state.description,
                    location,
                    tags: state.tags,
                  },
                },
              })
            }
            title="Create spot"
          />
        </KeyboardAvoidingView>
      )}
    </Mutation>
  );
}

function CreateSpot() {
  const [region, setRegion] = useState({
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    latitude: 0,
    longitude: 0,
  });

  function handleRegionChange(region) {
    setRegion(region);
  }

  const debouncedRegionChange = useMemo(
    () => debounce(handleRegionChange, 100),
    []
  );

  useEffect(() => {
    Location.requestPermissionsAsync().then(async ({ status }) => {
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={debouncedRegionChange}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
      <SpotForm
        location={{
          lat: region.latitude,
          lon: region.longitude,
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default CreateSpot;
