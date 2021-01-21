/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSpot = /* GraphQL */ `
  query GetSpot($id: ID!) {
    getSpot(id: $id) {
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
export const listSpots = /* GraphQL */ `
  query ListSpots(
    $filter: ModelSpotFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpots(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
