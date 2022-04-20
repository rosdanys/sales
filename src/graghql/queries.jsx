import { gql } from '@apollo/client'

export const GetCategories = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`

export const GetProducts = gql`
  query getProducts($id: Int!) {
    products(where: { idcategories: { _eq: $id } }) {
      name
      id
    }
  }
`

export const GetMarks = gql`
  query getMarks($id: Int!) {
    marks(where: { idproducts: { _eq: $id } }) {
      id
      name
    }
  }
`

export const GetSales = gql`
  query getSales($idcat: Int!, $idpro: Int!, $idm: Int! ) {
    sales(where: {idcategories: {_eq: $idcat}, idmarks: {_eq: $idm}, idproducto: {_eq: $idpro}}, order_by: {created_at: asc}) {
        created_at
        total
        id
      }
  }
`

