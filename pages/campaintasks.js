import React from 'react';
import CampaignTasks from "/components/Layouts/CampaignTasks"
import axios from 'axios'
import Cookies from 'cookies'
import Router from "next/router"

const campaintasks = ({tasks, sessionData}) => {

    return (
        <>
        <CampaignTasks tasks={tasks} sessionData={sessionData} />
        </>
    )
}

export default campaintasks

export async function getServerSideProps({req,res}){

    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
      headers:{
          "x-access-token": `${cookies.get('token')}`
      }
    }).then((x)=>x.data);
    const sessionData = await sessionRequest

    const request = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_CAMPAIGN_TASKS,
        {
            headers:{
                id: `${cookies.get('loginId')}`
            }
        })
    const TaskData = await request.data

    return{
        props: { tasks: TaskData, sessionData:sessionData }
    }
}