import { gql } from "@apollo/client";

export const GET_ALL_DATA = gql`
query{
    categories{
      name,
      products{
        id,
        name,
        inStock,
        gallery,
        description,
        category,
        attributes{
          name,
          type,
          items{
            displayValue,
            value
          }
        },
        prices{
          amount,
          currency{
            label,
            symbol
          }
        },
        brand
      }
    }
}
`;