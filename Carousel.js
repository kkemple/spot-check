import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { listSpots } from "./graphql/queries";

const deleteSpot = gql`
  mutation DeleteSpot(
    $input: DeleteSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    deleteSpot(input: $input, condition: $condition) {
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
`;

const styles = StyleSheet.create({
  carousel: {
    height: 200,
  },
  carouselItem: {
    flex: 1,
    backgroundColor: "#fff",
  },
  spotInfo: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  description: {
    color: "#666",
  },
  deleteButton: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#f00",
  },
  deleteButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default function SpotsCarousel({ spots, onIndexChange, layoutStyles }) {
  const deviceWidth = Dimensions.get("window").width;
  const itemWidth = deviceWidth * 0.8;

  function renderItem({ item, index }) {
    return (
      <View style={styles.carouselItem}>
        <View style={styles.spotInfo}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Mutation
          mutation={deleteSpot}
          variables={{ input: { id: item.id } }}
          update={(cache, { data }) => {
            const lastIndex = spots.length - 1;
            if (index === lastIndex) {
              onIndexChange(lastIndex - 1);
            }

            const queryOptions = {
              query: gql`
                ${listSpots}
              `,
            };

            const response = cache.readQuery(queryOptions);
            cache.writeQuery({
              ...queryOptions,
              data: {
                listSpots: {
                  ...response.listSpots,
                  items: response.listSpots.items.filter(
                    (item) => item.id !== data.deleteSpot.id
                  ),
                },
              },
            });
          }}
        >
          {(deleteSpot, { loading }) => (
            <TouchableOpacity
              disabled={loading}
              onPress={deleteSpot}
              style={styles.deleteButton}
            >
              <Ionicons name="ios-trash" size={24} color={"#fff"} />
              <Text style={styles.deleteButtonText}>Delete Spot</Text>
            </TouchableOpacity>
          )}
        </Mutation>
      </View>
    );
  }

  return (
    <View style={[styles.carousel, layoutStyles]}>
      <Carousel
        data={spots}
        renderItem={renderItem}
        sliderWidth={deviceWidth}
        itemWidth={itemWidth}
        onSnapToItem={onIndexChange}
      />
    </View>
  );
}
