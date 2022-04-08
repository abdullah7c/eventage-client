import React from 'react'
import AssignStepTwo from '../components/Layouts/clientassigning/assignsteptwo/index'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const assignclientsteptwo = ({assignedClients, categories, sessionData}) => {

  return (
    <div>
      <AssignStepTwo assignedClients={assignedClients} categories={categories} sessionData={sessionData} />
    </div>
  )
}
export default assignclientsteptwo


export async function getServerSideProps({req, res, query}){

    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
      headers:{ "x-access-token": `${cookies.get('token')}` }
    }).then((x)=>x.data);
    const sessionData = await sessionRequest

    const requestOne = await axios.get(process.env.NEXT_PUBLIC_EVE_PARENT_CATEGORY)
    const catrgoryList = await requestOne.data

    const requesetTwo = await axios.post(process.env.NEXT_PUBLIC_EVE_GET_CLIENT_STEP_TWO,{id:query.id})
    const assignedListData = await requesetTwo.data

    return{
        props: { assignedClients:assignedListData, categories:catrgoryList, sessionData:sessionData },
    }
}