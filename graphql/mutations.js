/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSpot = /* GraphQL */ `
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
`;
export const updateSpot = /* GraphQL */ `
  mutation UpdateSpot(
    $input: UpdateSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    updateSpot(input: $input, condition: $condition) {
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
export const deleteSpot = /* GraphQL */ `
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
