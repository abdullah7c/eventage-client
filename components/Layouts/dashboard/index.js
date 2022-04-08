import React,{ useEffect, useState } from 'react'
import { Table, Row, Col, Container } from 'react-bootstrap'
import Router from 'next/router'
import Link from 'next/link'
import Aos from 'aos'
import CampaignTasks from './CampaignTasks'
import PersonalTasks from './PersonalTasks'
import Camaigns from './Campaigns'
import Cookies from 'js-cookie'

const Dashboard = ({sessionData, campaign, personalTasks, campaignTasks}) => {

    const [selectedCampaign, setSelectedCampaign] = useState([])
    const [campaigns, setCampaigns] = useState([])
    useEffect(() => {
        Aos.init()
        if(sessionData.isLoggedIn==false){
                Router.push('/signin')
        }
        createCampaignList()
        console.log(campaign);
        
        return () => {}
    }, [sessionData])

    const createCampaignList = () => {
        let list = [];
        campaign.map((camp, index)=>{
            list[index]={
                id:camp.id,
                start_date:camp.start_date,
                name:camp.name,
                selected:false
            }
        })
        setCampaigns(list)
    }

    const campaignSelect = (id, index) => {
        console.log(id)
        let camp = [];
        camp = campaign.find((camp)=>{
            return camp.id==id
        });
        let clientList = [];
        
        camp.Client_Campaign_Assigns.map((client, index)=>{
            if(client.status=="accept"){
                clientList.push(client.Client)
            }
        });
        console.log(clientList);
        setSelectedCampaign(clientList);
        let tempState = [...campaigns];
        tempState.map((camp,i)=>{
            if(camp.id==id){
                camp.selected=true
            }else{
                camp.selected=false
            }
        });
        console.log(tempState)
        setCampaigns(tempState)
    }

    return (
    <div style={{maxHeight:"82vh", overflow:"auto"}}>
    <Container  className="my-4 pb-4" data-aos="fade-right">
        {Cookies.get('type')=='Agent' &&
            <Row>
            <Col className="p-3 ml-auto mr-auto" xs="11" md="6" >
                <Camaigns campaign={campaign} />
            </Col>
            <Col className="p-3 ml-auto mr-auto" xs="11" md="6"  >
                <CampaignTasks campaignTasks={campaignTasks} />
            </Col>

            <Col className="p-3 ml-auto mr-auto" xs="11" md="6"  >
                <PersonalTasks personalTasks={personalTasks} />
            </Col>
            </Row>
        }

        {Cookies.get('type')=='Admin' &&
            <Row className='campaigns'>
            <Col className="p-3 ml-auto mr-auto" xs="11" md="6" >
                <div className='border shadow mt-3 p-4 bg-white' style={{borderRadius:"12px"}}>
                <h6><b style={{color: 'rgb(60,141,188)'}}><Link href='/campaigns'><a style={{color: 'rgb(60,141,188)'}}>Campaigns</a></Link></b></h6>
                <hr/>
                <div style={{ minHeight: '48vh', maxHeight: '48vh', overflowY:'auto'}}>  
                <Table className="" style={{width: '100%', backgroundColor: 'white' , borderRadius: '8px'}}>
                <thead className="bg-light">
                    <tr>
                        <th scope="col" className="border-0"> Sr. </th>
                        <th scope="col" className="border-0"> Exhibition Name </th>
                        <th scope="col" className="border-0"> Start Date </th>
                        <th scope="col" className="border-0"> Steps </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        campaigns.map((campaign, index)=>{
                            return(
                            <tr key={index} className={campaign.selected==false?"hover-link":"selected-link"} onClick={()=>campaignSelect(campaign.id, index)}>
                                <td>{index+1}</td>
                                <td>{campaign.name}</td>
                                <td>{campaign.start_date}</td>
                                <td>
                                <span className='steps'
                                    onClick={()=>{
                                        Router.push(`assignclientsteptwo?id=${campaign.id}`); 
                                    }}
                                > 2nd </span> |
                                <span className='steps'
                                    onClick={()=>{
                                        Router.push(`assignclientstepthree?id=${campaign.id}`); 
                                    }}
                                > 3rd </span>
                                </td>
                            </tr>
                            )
                        })
                    }
                </tbody>
                </Table>
                </div>
                </div>
            </Col>
            <Col className="p-3 ml-auto mr-auto" xs="11" md="6" >
                <div className='border shadow mt-3 p-4 bg-white' style={{borderRadius:"12px"}}>
                <h6><b style={{color: 'rgb(60,141,188)'}}>Accepted Clients</b></h6>
                <hr/>
                <div style={{ minHeight: '48vh', maxHeight: '48vh', overflowY:'auto'}}>    
                <Table className="" style={{width: '100%', backgroundColor: 'white' , borderRadius: '8px'}}>
                <thead className="bg-light">
                    <tr>
                        <th scope="col" className="border-0"> Sr. </th>
                        <th scope="col" className="border-0"> Client </th>
                        <th scope="col" className="border-0"> Status </th>
                    </tr>
                </thead>
            {selectedCampaign.length>0 && 
                <tbody>
                {
                    selectedCampaign.map((client, index)=>{
                        return(
                        <tr key={index} className="accepted">
                            <td>{index+1}</td>
                            <td>{client.companyName}</td>
                            <td>Accepted</td>
                        </tr>
                        )
                    })
                }
                </tbody>
                }
                </Table>
                </div>
            </div>
            </Col>
        </Row>
        }
    </Container>  
    </div>
    )
}

export default Dashboard
