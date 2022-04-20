import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
    from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const URL_GRAPHQL = 'http://localhost:8080/v1/graphql'

const errorLink = onError(({ graphqlErrors, networkError }) => {
    if (graphqlErrors) {
        graphqlErrors.map(({ message, location, path }) => {
            alert(`Graphql error ${message}`)
        })
    }
})

const link = from([errorLink, new HttpLink({ uri: URL_GRAPHQL })])

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
})

