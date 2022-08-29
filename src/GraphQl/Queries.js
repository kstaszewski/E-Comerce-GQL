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
export const GET_TOPBAR_DATA = gql`
query{
  currencies{
    label,
    symbol
  },
  categories{
    name,
    products{id}
  }
}
`;

export const GET_PRODUCT_DATA = `
query{
product(id: $idToPass){
  brand,
  name,
  attributes{
    name,
    type,
    items{
      displayValue,
      value
    }
  },
  prices{
    currency{
      label,
      symbol
    },
    amount
  },
  gallery,
  description,
  inStock
}
}
`;