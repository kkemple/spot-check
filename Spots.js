import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  Button,
  View,
  KeyboardAvoidingView,
} from "react-native";

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { listSpots } from "./graphql/queries";
import MapView, { Marker } from "react-native-maps";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 32,
  },
  map: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

function Spots() {
  return (
    <View style={styles.container}>
      <Query
        query={gql`
          ${listSpots}
        `}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return <Text>Loading...</Text>;
          }

          if (error) {
            return <Text>{error.message}</Text>;
          }

          const { items } = data.listSpots;
          const { lat, lon } = items[0].location;
          return (
            <>
              <MapView
                style={styles.map}
                region={{
                  latitude: lat,
                  longitude: lon,
                  latitudeDelta: 2.0922,
                  longitudeDelta: 2.0421,
                }}
              >
                {items.map((item) => {
                  const { lat, lon } = item.location;
                  return (
                    <Marker
                      key={item.id}
                      coordinate={{
                        latitude: lat,
                        longitude: lon,
                      }}
                    />
                  );
                })}
              </MapView>
            </>
          );
        }}
      </Query>
      <StatusBar style="auto" />
    </View>
  );
}

export default Spots;
