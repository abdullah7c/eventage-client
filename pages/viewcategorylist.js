import React from 'react'
import Viewcategorylist from "../components/Layouts/viewcategorylist/"
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const viewcategorylist = ({categories, sessionData}) => {

    return (
        <div>
            <Viewcategorylist categories={categories} sessionData={sessionData} />
        </div>
    )
}
export default viewcategorylist

export async function getServerSideProps({req, res}){

    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
      headers:{
          "x-access-token": `${cookies.get('token')}`
      }
    }).then((x)=>x.data);
    const sessionData = await sessionRequest
    
    const request = await axios.get(process.env.NEXT_PUBLIC_EVE_ADD_GET_CATEGORIES)
    const data = await request.data
    
    return{
        props: { categories: data, sessionData:sessionData }
    }
}