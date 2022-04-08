import React from 'react';
import Graphs from '/components/Layouts/Graphs'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router';

const graphs = ({graphs, sessionData}) => {

    return (
        <>
            <Graphs graphs={graphs} sessionData={sessionData} />
        </>
    )
}

export default graphs

export async function getServerSideProps({req,res}){

    const cookies = new Cookies(req, res)

    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
      }).then((x)=>x.data);
      const sessionData = await sessionRequest

    const config = {
        method: 'get', headers: { 'Content-Type': 'application/json' }, url: `${process.env.NEXT_PUBLIC_EVE_CAMPAIGN_GRAPH}`,
        data : { agentId: `${cookies.get('loginId')}`, userType: `${cookies.get('type')}` }
    };
    const requestOne = await axios(config);

    const graphData = await requestOne.data;

    return{
        props: { graphs:graphData, sessionData:sessionData }
    }
}