import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useSWR, { mutate } from 'swr'


const URL = `http://localhost/api/amwayproduct`
const fetcher = url => axios.get(url).then(res => res.data) 
export default function Home() {

  const [amwayproduct, setAmwayproduct] = useState([])
  const [name,setName] = useState('')
  const [brand,setBrand] = useState('')
  const [price,setPrice] = useState(0)
  
  const {data,error} = useSWR(URL,fetcher)
  if(!data)
  {
      return <div>Loading ...</div>
  }

  const addAmwayproduct = async (name,brand,price) =>{
    let amwayproduct = await axios.post(URL , {name,brand,price})
    mutate(URL)
  }

  const getAmwayproduct = async () => {
    let amwayproduct = await axios.get(URL)
    mutate(URL)
    
  }

  const printamwayproduct = (amwayproduct) =>{
    if( amwayproduct && amwayproduct.length)
    return (amwayproduct.map((item, index) => 
          <li key = {index}>
            {index + 1 }:
            {(item) ? item.name : "-"}:
            {(item) ? item.brand : "-"}:
            {(item) ? item.price : 0}
            <button onClick={() => getAmwayproduct(item.id)}>Get Product</button>
            <button onClick={() => updateAmwayproduct(item.id)}>Update Product</button>
            <button onClick={() => deleteAmwayproduct(item.id)}>Delete Product</button>
          </li>))
    else
      return (<li>No Amwayproduct</li>)
  }

  const deleteAmwayproduct = async (id) => {
    let amwayproduct = await axios.delete(`${URL}/${id}`)
    mutate(URL)
  }

  const updateAmwayproduct = async (id) => {
    let amwayproduct = await axios.put(`${URL}/${id}`,{name,brand,price})
    mutate(URL)
  }

  const getAmwayproduct = async (id) => {
    const amwayproduct = await axios.get(`${URL}/${id}`)
    setAmwayproduct({ name: amwayproduct.data.name , brand: amwayproduct.data.brand, price: amwayproduct.data.price })
  }

  return (
    <div> amwayproduct
      <ul>{printamwayproduct(data.list)}</ul>
      selected amwayproduct: {amwayproduct.name} {amwayproduct.brand} {amwayproduct.price} 
      <h2>Add amwayproduct</h2>
          Name : <input type="text" onChange={(e)=>setName(e.target.value)} /> <br/>
          Brand : <input type="text" onChange={(e)=>setBrand(e.target.value)} /> <br/>
          Price : <input type="number" onChange={(e)=>setPrice(e.target.value)} /> <br/>

          <button onClick={ () => addAmwayproduct(name,brand,price,GPA)}>Add New AmwayProduct</button>

    </div>
  )
}
