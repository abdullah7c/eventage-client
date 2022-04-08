import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Dashboard from '../components/Layouts/dashboard'

const dashboard = ({sessionData, campaign, personalTasks, campaignTasks}) => {
    return (
        <div>
            <Dashboard sessionData={sessionData} campaign={campaign} personalTasks={personalTasks} campaignTasks={campaignTasks} />
        </div>
    )
}
export default dashboard

export async function getServerSideProps({req,res}) {

    const cookies = new Cookies(req, res)
  
    const requestOne = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_AGENTS,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
    }).then((x)=>x.data)
    
    const requestTwo = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_CAMPAIGN,
    {
        headers:{
            agentId: `${cookies.get('loginId')}`,
            agentType:`${cookies.get('type')}`
        }
    })

    const requestThree = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_AGENT_PERSONAL_TASKS,
        {
            headers:{
                id: `${cookies.get('loginId')}`
            }
        })
    const requestFour = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_CAMPAIGN_TASKS,
        {
            headers:{
                id: `${cookies.get('loginId')}`
            }
        })

    const CampaignTaskData = await requestFour.data.result
    const PersonalTaskData = await requestThree.data
    const campaignData = await requestTwo.data
    const sessionData = await requestOne

    return{
        props: { sessionData: sessionData, campaign:campaignData, personalTasks:PersonalTaskData, campaignTasks:CampaignTaskData }
    }
}