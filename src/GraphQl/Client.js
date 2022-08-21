import {ApolloClient, InMemoryCache} from '@apollo/client';

export const Client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000/graphql'
});