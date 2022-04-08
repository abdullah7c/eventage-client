import React, {useState } from 'react'
import AssignStepOne from '/components/Layouts/clientassigning/AssignStepOne'
import axios from 'axios'
import { wrapper } from '../redux/store'
import { pokemonApi } from '../redux/Actions_Reducers/pokemonApi'
import { assignClientListApi } from '../redux/Actions_Reducers/assignedClientList'
import { store } from '../redux/store'
import campaignDetails from '../redux/Actions_Reducers/campaignDetails'
import Cookies from 'cookies'

const assignclientOne = ({ clients, assignedClients, sessionData}) => {

    return (
        <div>
            <AssignStepOne clients={clients} assignedClients={assignedClients} sessionData={sessionData} />
        </div>
    )
}
export default assignclientOne


export async function getServerSideProps({req, res, query}){

      const cookies = new Cookies(req, res)
      const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_EVE_AUTHENTICATE_TOKEN,{
        headers:{
            "x-access-token": `${cookies.get('token')}`
        }
      }).then((x)=>x.data);
      const sessionData = await sessionRequest

      const requesetOne = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_ALL_CLIENT)
      const clientData = await requesetOne.data
      const requesetTwo = await axios.post(process.env.NEXT_PUBLIC_EVE_GET_CLIENT_STEP_ONE,{id:query.id})
      const assignedListData = await requesetTwo.data

  return{
    props: { clients:clientData, assignedClients:assignedListData, sessionData:sessionData },
  }
}

// export const getServerSideProps = wrapper.getServerSideProps(
//     (store) => async (context) => {
//       // const _id = store.getState()
//       // const id = _id.campaignDetails.name
//       //const result = await store.dispatch(assignClientListApi.endpoints.getassignClientList.initiate(id))
  
//       const requesetOne = await axios.get('http://localhost:5000/getClients')
//       const clientData = await requesetOne.data
  
//       return {
//         props: {clients:clientData},
//       };
//     }
//   );