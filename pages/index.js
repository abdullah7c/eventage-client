import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Main from '../components/Layouts/Main'

export default function Home({sessionData}) {


  return (<Main sessionData={sessionData} />)
}

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)

  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
      headers:{
          "x-access-token": `${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  
  const sessionData = sessionRequest
  return{
      props: { sessionData: sessionData }
  }
}