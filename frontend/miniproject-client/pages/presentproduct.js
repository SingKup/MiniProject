import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'

const URL = `${config.URL}/amwayproducts`
const presentproduct = ({ token }) => {

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

	const getAmwayproducts = async () => {
        let amwayproduct = await axios.get(URL)
        setAmwayproducts(amwayproduct.data)
	}
	const printAmwayproducts = () => {
	    console.log('Amwayproducts:', amwayproducts)
			if (amwayproducts.list && amwayproducts.list.length)
				return (amwayproducts.list.map((amwayproduct, index) =>
				(<li key={index} className={styles.listItem}>
				Name : {(amwayproduct) ? amwayproduct.name : '-'} <br></br>
				Brand : {(amwayproduct) ? amwayproduct.brand : '-'}  <br></br>
				Price : {(amwayproduct) ? amwayproduct.price : '-'}  <br></br> 
				</li>)
				))
			else {
				return (<h2>No Amway Products To Display</h2>)
			}
    }
	return (
	    <Layout>
            <Head>
                <title>Amway Products</title>
            </Head>
            <div>
                <Navbar/>
                {JSON.stringify(amwayproducts.amwayproducts)}
                <ul>
                    {printAmwayproducts()}
                </ul>
                
            </div>
        </Layout>
	)
}

export default withAuth(presentproduct)
export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
