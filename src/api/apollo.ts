import fetch from 'node-fetch'
import ApolloClient from 'apollo-boost'

export default new ApolloClient({ uri: '/api/graphql', fetch: fetch })