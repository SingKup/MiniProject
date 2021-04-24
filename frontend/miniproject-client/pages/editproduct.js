import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useState } from 'react'
import axios from 'axios'
import proAuth from '../components/proAuth'
import config from '../config/config'
import logincss from '../styles/logincss.module.css'
import useSWR, { mutate } from 'swr'
const fetcher = url => axios.get(url).then(res => res.data)
const URL = `${config.URL}/amwayproducts`

const editproduct = ({ token }) => {

  const [name,setName] = useState('')
  const [brand,setBrand] = useState('')
  const [price,setPrice] = useState(0)
  const {data,error} = useSWR(URL,fetcher)
  if(!data)
  {
      return <div>Loading ...</div>
  }
 
  const addAmwayproduct = async (name, brand, price) =>{
    let amwayproducts = await axios.post(URL , {name, brand, price})
    mutate(URL)
  }

  const printAmwayproducts = (amwayproducts ) =>{
    if (amwayproducts  && amwayproducts .length)
				return (amwayproducts .map((amwayproduct, index) =>
          <li key = {index}>
            {index + 1 }:
            {(amwayproduct) ? amwayproduct.name : "-"}:
            {(amwayproduct) ? amwayproduct.brand : "-"}:
            {(amwayproduct) ? amwayproduct.price : 0}
            
            <button className={logincss.button1} onClick={() => updateAmwayproduct(amwayproduct.id)}>Update Product</button>
            <button className={logincss.button1} onClick={() => deleteAmwayproduct(amwayproduct.id)}>Delete Product</button>
          </li>))
    else
      return (<li>No Amwayproduct</li>)
  }

  const deleteAmwayproduct = async (id) => {
    let amwayproducts = await axios.delete(`${URL}/${id}`)
    mutate(URL)
  }

  const updateAmwayproduct = async (id) => {
    let amwayproduct = await axios.put(`${URL}/${id}`,{name, brand, price})
    mutate(URL)
  }

  return (
    <Layout>
            <Head>
                <title>Amway Products</title>
            </Head>
            <div className={logincss.wrapper}>
                <Navbar />
                {/* {JSON.stringify(amwayproducts.amwayproducts)} */}
                <ul >
                    {printAmwayproducts(data.list)}
                </ul>
                <h1>Add Amway Product</h1>
                <div>
                    Name : <input type="text" onChange={(e) => setName(e.target.value)}  />
                    Brand : <input type="text" onChange={(e) => setBrand(e.target.value)} /> 
                    Price : <input type="number" onChange={(e) => setPrice(e.target.value)} /> 
                    <button className={logincss.button} onClick={() => addAmwayproduct(name, brand, price)} >Add New Amway Product</button>
                </div>
            </div>
        </Layout>
  )
}

export default proAuth(editproduct)
export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
