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
        attributes{
          name,
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