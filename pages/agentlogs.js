import React from 'react'
import AgentLogs from '/components/Layouts/agents/AgentLogs'
import axios from 'axios'
import Cookies from 'cookies'

const agentlogs = ({sessionData,logData}) => {
    return (
        <div>
            <AgentLogs sessionData={sessionData} logData={logData} />
        </div>
    )
}
export default agentlogs

export async function getServerSideProps({req,res}) {

    const cookies = new Cookies(req, res)
    
    const agentLogRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AGENTS_LOGS)
    const logsData = await agentLogRequest.data;

    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
    }).then((x)=>x.data)
    const session = sessionRequest;

    return{
        props: { sessionData: session, logData:logsData }
    }
}