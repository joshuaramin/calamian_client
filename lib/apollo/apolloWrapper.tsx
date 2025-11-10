import React from 'react'
import { ApolloClient, gql, HttpLink, InMemoryCache, makeVar, } from '@apollo/client'
import { ApolloProvider } from "@apollo/client/react";
export const carrItemsVar = makeVar([])

export const GET_CARTITEMS = gql`
query CartDetails {
    cartItems @client  {
        itemsID 
        items
        price
        quantity
        total
}
}`

export const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string

    }),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    cartItems: {
                        read() {
                            return carrItemsVar()
                        }
                    }
                }
            },
        }
    })
})



export default function ApolloWrapper({ children }: { children: React.ReactNode }) {



    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}
