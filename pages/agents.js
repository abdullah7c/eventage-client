import React from 'react';
import Agents from '../components/Layouts/agents/Agents';
import axios from 'axios';
import Cookies from 'cookies';

const agents = ({agents, sessionData}) => {
    return (
        <div>
            <Agents agents={agents} sessionData={sessionData} />
        </div>
    )
}

export default agents

export async function getServerSideProps({req,res}){

    const cookies = new Cookies(req, res)
    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
    }).then((x)=>x.data);
    const sessionData = await sessionRequest

    const request = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_AGENTS)
    const agentData = await request.data

    return{
        props: { agents: agentData, sessionData:sessionData }
    }
}