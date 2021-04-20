import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import StdAuth from '../components/StdAuth'
import config from '../config/config'

const URL = `${config.URL}/amwayproducts`
const ChangeAmwayproduct = ({ token }) => {

  const [name,setName] = useState('')
  const [brand,setBrand] = useState('')
  const [price,setPrice] = useState(0)
  const [amwayproducts, setAmwayproducts] = useState({
    list:
    [
        {
            id: 001,
            name: "protein",
            brand: "NUTRILITE",
            price: "1100",
        },

        {
            id: 002,
            name: "collagen",
            brand: "TRUVIVITY",
            price: "1000"
        }
    ]
  })
 
  useEffect(() => {
    getAmwayproducts()
  }, [])

  const addAmwayproduct = async (name, brand, price) =>{
    let amwayproducts = await axios.post(URL , {name, brand, price})
    setAmwayproducts(amwayproducts.data)
  }

  const getAmwayproducts = async () => {
    let amwayproduct = await axios.get(URL)
    setAmwayproducts(amwayproduct.data)
    
  }

  const printAmwayproducts = () =>{
    if (amwayproducts.list && amwayproducts.list.length)
				return (amwayproducts.list.map((amwayproduct, index) =>
          <li key = {index}>
            {index + 1 }:
            {(amwayproduct) ? amwayproduct.name : "-"}:
            {(amwayproduct) ? amwayproduct.brand : "-"}:
            {(amwayproduct) ? amwayproduct.price : 0}
            
            <button onClick={() => updateAmwayproduct(amwayproduct.id)}>Update</button>
            <button onClick={() => deleteAmwayproduct(amwayproduct.id)}>Delete</button>
          </li>))
    else
      return (<li>No Amwayproduct</li>)
  }

  const deleteAmwayproduct = async (id) => {
    let amwayproducts = await axios.delete(`${URL}/${id}`)
    setAmwayproducts(amwayproducts.data)
  }

  const updateAmwayproduct = async (id) => {
    let amwayproducts = await axios.put(`${URL}/${id}`,{name, brand, price})
    setAmwayproducts(amwayproducts.data)
  }

  return (
    <Layout>
            <Head>
                <title>Amway Products</title>
            </Head>
            <div >
                <Navbar />
                {JSON.stringify(amwayproducts.amwayproducts)}
                <ul >
                    {printAmwayproducts()}
                </ul>
                <h1>Add Amway Product</h1>
                <div>
                    Name : <input type="text" onChange={(e) => setName(e.target.value)}  />
                    Brand : <input type="text" onChange={(e) => setBrand(e.target.value)} /> 
                    Price : <input type="number" onChange={(e) => setPrice(e.target.value)} /> 
                    <button onClick={() => addAmwayproduct(name, surname, major, GPA)} >Add New Amway Product</button>
                </div>
            </div>
        </Layout>
  )
}

export default StdAuth(ChangeStudent)
export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
