import React from 'react'
import Viewallclient from '../components/Layouts/viewallclient/index'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const viewallclient = ({categories, countryCity, clients, sessionData, exportList}) => {

    return (
        <div>
            <Viewallclient categories={categories} countryCity={countryCity} clients={clients} exportList={exportList} sessionData={sessionData} />
        </div>
    )
}

export default viewallclient

export async function getServerSideProps({req,res}){

    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
      }).then((x)=>x.data)
    
    const sessionData = sessionRequest

    const requestOne = await axios.get(process.env.NEXT_PUBLIC_EVE_PARENT_CATEGORY)
    const dataone = await requestOne.data

    const requestTwo = await axios.get(process.env.NEXT_PUBLIC_EVE_CITY_COUNTRIES)
    const datatwo = await requestTwo.data

    const requestThree = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_ALL_CLIENT)
    const datathree = await requestThree.data

    const requestFour = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_CLIENT_IMPORT_LIST)
    const datafour = await requestFour.data

    return{
        props: { categories: dataone, countryCity: datatwo, clients: datathree, sessionData: sessionData, exportList:datafour }
    }
}