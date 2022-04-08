import React from 'react';
import MyTasksLayout from '/components/Layouts/MyTasksLayout'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const mytasks = ({tasks, sessionData}) => {

    return (
        <>
            <MyTasksLayout tasks={tasks} sessionData={sessionData} />
        </>
    )
}
export default mytasks

export async function getServerSideProps({req,res}){
    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
      }).then((x)=>x.data)
    
    const sessionData = sessionRequest

    const request = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_AGENT_PERSONAL_TASKS,
        {
            headers:{
                id: `${cookies.get('loginId')}`
            }
        })
    const TaskData = await request.data

    return{
        props: { tasks: TaskData, sessionData: sessionData }
    }
}