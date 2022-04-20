import './App.css'
import SelectProduct from './Components/SelectProduct'
import {
  ApolloProvider,
} from '@apollo/client'
import { client } from './config/config'

function App() {
  return (
    <ApolloProvider client={client}>
      <SelectProduct />
    </ApolloProvider>
  )
}

export default App
