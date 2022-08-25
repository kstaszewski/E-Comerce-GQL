import { gql } from "@apollo/client";

export const GET_BEGINING_DATA = gql`
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
export const GET_CURRENCIES_DATA = gql`
query{
  currencies{
    label,
    symbol
  }
}
`;