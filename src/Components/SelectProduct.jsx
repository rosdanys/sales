import 'antd/dist/antd.css'
import moment from 'moment'
import { Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  GetCategories,
  GetProducts,
  GetMarks,
  GetSales,
} from '../graghql/queries'
import { client } from '../config/config'
const { Option } = Select
import { Layout } from 'antd'
const { Header, Content } = Layout

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Sales by month for:',
    },
  },
}

export const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
]

export const initialState = {
  labels,
  datasets: [
    {
      label: 'Ventas',
      data: [],
      backgroundColor: '#0176ff',
    },
  ],
}

const SelectProduct = () => {
  const { error, loading, data } = useQuery(GetCategories)

  const [idCategories, setidCategories] = useState(0)
  const [idProducts, setidProducts] = useState(0)
  const [idMarks, setidMarks] = useState(0)
  const [dataSelectCat, setdataSelectCat] = useState([])
  const [dataProduct, setdataProduct] = useState([])
  const [dataMarks, setdataMarks] = useState([])
  const [dataSales, setdataSales] = useState([])
  const [barSales, setbarSales] = useState(initialState)
  const refBar = useRef()
  const refProduct = useRef()
  const refMarks = useRef()

  //load data 1er select
  useEffect(() => {
    if (data !== undefined) {
      setdataSelectCat(data.categories)
    }
  }, [data])

  //update del chart
  useEffect(() => {
    var labels = []
    var tempSales = []

    if (dataSales.length > 0) {
      dataSales.map((item) => {
        labels.push(moment(new Date(item.created_at)).format('MMMM'))
        tempSales.push(item.total)
      })
     
      const initialState = {
        labels,
        datasets: [
          {
            label: 'Ventas',
            data: tempSales,
            backgroundColor: '#0176ff',
          },
        ],
      }
      setbarSales(initialState)
     
    }
  }, [dataSales])

  // Change for categories
  const handleChangeCategories = (id) => {
    var idint = parseInt(id)
    setidCategories(idint)
    setidProducts(0)
    setidMarks(0)

    if (idint !== 0) {
      client
        .query({
          query: GetProducts,
          variables: { id: idint },
        })
        .then((result) => {
          setdataProduct(result.data.products)
          setdataMarks([])
          setbarSales(initialState)
        })
    } else {
      setdataMarks([])
      setdataProduct([])
      setbarSales(initialState)
    }
  }
  // Change for products
  const handleChangeProducts = (id) => {
    var idint = parseInt(id)

    setidProducts(idint)
    setidMarks(0)

    if (idint !== 0) {
      client
        .query({
          query: GetMarks,
          variables: { id: idint },
        })
        .then((result) => {
          setdataMarks(result.data.marks)
          setbarSales(initialState)
        })
    } else {
      setdataMarks([])
      setbarSales(initialState)
    }
  }
// Change for marks
  const handleChangeMarks = (id) => {
    var idint = parseInt(id)
    setidMarks(idint)
    if (idint !== 0) {
      client
        .query({
          query: GetSales,
          variables: { idcat: idCategories, idpro: idProducts, idm: idint },
        })
        .then((result) => {
          setdataSales(result.data.sales)
        })
    } else {
      setdataSales([])
      setbarSales(initialState)
    }
  }

  return (
    <>
      <Layout style={{ display: 'flex', textAlign: 'center' }}>
        <Header>
          <Select
            defaultValue="0"
            style={{ width: 250 }}
            value={idCategories}
            onChange={handleChangeCategories}
          >
            <Option value={0}>Seleccione Categoria</Option>
            {Object.keys(dataSelectCat).length > 0
              ? dataSelectCat.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })
              : null}
          </Select>

          <Select
            ref={refProduct}
            defaultValue="0"
            style={{ width: 250 }}
            value={idProducts}
            onChange={handleChangeProducts}
          >
            <Option key="0" value={0}>Seleccione Producto</Option>
            {Object.keys(dataProduct).length > 0
              ? dataProduct.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })
              : null}
          </Select>

          <Select
            defaultValue="0"
            style={{ width: 250 }}
            value={idMarks}
            onChange={handleChangeMarks}
          >
            <Option key="0"  value={0}>Seleccione Marcas</Option>
            {Object.keys(dataMarks).length > 0
              ? dataMarks.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })
              : null}
          </Select>
        </Header>
        <Content>
          {Object.keys(barSales).length > 0 && (
            <Bar ref={refBar} options={options} data={barSales} />
          )}
        </Content>
      </Layout>
    </>
  )
}

export default SelectProduct
