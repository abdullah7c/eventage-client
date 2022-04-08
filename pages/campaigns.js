import React from 'react'
import Campaigns from '../components/Layouts/campaigns/';
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router';

const campaigns = ({campaigns, agents, categories, sessionData}) => {

    return (
        <div>
            <Campaigns campaigns={campaigns} agents={agents} categories={categories} sessionData={sessionData} />
        </div>
    )
}
export default campaigns


export async function getServerSideProps({req,res}){

    const cookies = new Cookies(req, res)

    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
      headers:{
          "x-access-token": `${cookies.get('token')}`
      }
    }).then((x)=>x.data);
    const sessionData = await sessionRequest

    const request = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_CAMPAIGN,
        {
            headers:{
                agentid: `${cookies.get('loginId')}`,
                agenttype: `${cookies.get('type')}`
            }
        }
    );
    const campaignData = await request.data;

    const requestTwo = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_AGENTS);
    const agentsData = await requestTwo.data;
    
    const requestThree = await axios.get(process.env.NEXT_PUBLIC_EVE_PARENT_CATEGORY);
    const categoryData = await requestThree.data;

    return{
        props: { campaigns: campaignData, agents:agentsData, categories:categoryData, sessionData:sessionData }
    }
}