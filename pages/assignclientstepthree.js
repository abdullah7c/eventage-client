import React from 'react'
import AssignStepThree from '/components/Layouts/clientassigning/AssignStepThree'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const assignclientstepthree = ({assignedClients, sessionData}) => {

    return (
        <div>
            <AssignStepThree assignedClients={assignedClients} sessionData={sessionData} />
        </div>
    )
}
export default assignclientstepthree


export async function getServerSideProps({req, res, query}){

    const cookies = new Cookies(req, res)
      const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
      }).then((x)=>x.data);
      const sessionData = await sessionRequest

    const config = {
        method: 'get', headers: { 'Content-Type': 'application/json' }, url: `${process.env.NEXT_PUBLIC_EVE_GET_CLIENT_STEP_THREE}`,
        data : { id: query.id }
    };
    const requestOne = await axios(config);

    const catrgoryList = await requestOne.data;

    return{
        props: { assignedClients:catrgoryList, sessionData:sessionData },
    }
}