import React from 'react'
import CalendarLayout from '../components/Layouts/CalendarLayout'
import axios from 'axios'
import Cookies from 'cookies'

const calendar = ({sessionData, personalTasks, campaignTasks}) => {
    return (
        <>
          <CalendarLayout sessionData={sessionData} personalTasks={personalTasks} campaignTasks={campaignTasks} />  
        </>
    )
}

export default calendar

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)

    const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
    }).then((x)=>x.data);

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
  const sessionData = await sessionRequest

  return{
      props: { sessionData: sessionData, personalTasks:PersonalTaskData, campaignTasks:CampaignTaskData }
  }
}