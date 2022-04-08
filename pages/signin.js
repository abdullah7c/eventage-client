import React from 'react'
import SignIn from '../components/Layouts/SignIn'
import axios from 'axios'
import Cookies from 'cookies'
export default function signin({sessionData}) {
  return (
    <>
        <SignIn sessionData={sessionData} />
    </>
  )
}

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  
  const dataone = await requestOne
  return{
      props: { sessionData: dataone }
  }
}