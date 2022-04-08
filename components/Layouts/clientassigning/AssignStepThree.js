import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Table, Form, Spinner, Modal, ProgressBar } from 'react-bootstrap';
import axios from 'axios'
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faRectangleList, faCalendarPlus} from '@fortawesome/free-solid-svg-icons'
import 
    { 
        InfoCircleOutlined, ContainerOutlined, PlusOutlined, CloseCircleTwoTone, CloseSquareOutlined,
        CheckCircleOutlined, BarsOutlined, UnorderedListOutlined, CheckSquareOutlined ,CheckCircleTwoTone,
        SyncOutlined, LeftCircleOutlined, RightCircleOutlined
    }
  from '@ant-design/icons';

const AssignStepThree = ({assignedClients, sessionData}) => {

  const router = useRouter();
  const campaignId = router.query.id;

  const [clientList, setClientList] = useState([])
  const [taskDate, setTaskDate] = useState([
    {taskId:'1', task_date:''},
    {taskId:'2', task_date:''},
    {taskId:'3', task_date:''},
    {taskId:'4', task_date:''},
    {taskId:'5', task_date:''},
    {taskId:'6', task_date:''},
    {taskId:'7', task_date:''},
    {taskId:'8', task_date:''},
    {taskId:'9', task_date:''},
    {taskId:'10',task_date:''},
    {taskId:'12',task_date:''},
    {taskId:'12',task_date:''},
    {taskId:'13',task_date:''},
    {taskId:'14',task_date:''}
  ]);

  useEffect(() => {
    console.log(assignedClients)
    if(assignedClients){
      setTaskDates();
      createClientList();  
    }
  }, [])

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
        Router.push('/signin')
    }
    return () => { }
}, [sessionData])
  
  const setTaskDates = () => {

    let tempState = [...taskDate];
    for(let i = 1; i <= 14; i++){
      let val = ''
      val = assignedClients.Campaign_Assign_StepThree_Dates.find((x)=>{ return x.CampaignAssignStepThreeTaskId==`${i}`?x.task_date:''})
      tempState[i-1]=val
    }
    console.log(tempState)
    setTaskDate(tempState)
  }
  const createClientList = () => {
    let val = [];
    val = assignedClients.Client_Campaign_Assigns;
    val.forEach((x, index)=>{
      x.check = {
        docCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='1')?true:false,
        affidavCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='2')?true:false,
        floorStandCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='3')?true:false,
        passVisaCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='4')?true:false,
        ExhCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='5')?true:false,
        catCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='6')?true:false,
        nBoardCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='7')?true:false,
        fDetailCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='8')?true:false,
        travelCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='9')?true:false,
        visaInvCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='10')?true:false,
        brndGuideCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='11')?true:false,
        impCntCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='12')?true:false,
        feedCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='13')?true:false,
        otherCheck :x.Campaign_Assign_StepThree_Details.find(y=>y.CampaignAssignStepThreeTaskId=='14')?true:false
      }
    });
    console.log(val)
    setClientList(val)
  }
  const changeTaskStatus = async(campAssignId, indexA, taskCheckId, value) =>{
    if(value===false){
      await axios.post(process.env.NEXT_PUBLIC_EVE_ADD_TASK_CHECK_STEP_THREE,
        {
          campId:campaignId, campAssignId:campAssignId,taskCheckId:taskCheckId, agentId:Cookies.get('loginId') 
        }
      ).then(()=>{
        let val = [];
        val=[...clientList];
        taskCheckId=='1'?val[indexA].check.docCheck = true:taskCheckId=='2'?val[indexA].check.affidavCheck = true:taskCheckId=='3'?val[indexA].check.floorStandCheck = true:
        taskCheckId=='4'?val[indexA].check.passVisaCheck = true:taskCheckId=='5'?val[indexA].check.ExhCheck = true:taskCheckId=='6'?val[indexA].check.catCheck = true:
        taskCheckId=='7'?val[indexA].check.nBoardCheck = true:taskCheckId=='8'?val[indexA].check.fDetailCheck = true:taskCheckId=='9'?val[indexA].check.travelCheck = true:
        taskCheckId=='10'?val[indexA].check.visaInvCheck = true:taskCheckId=='11'?val[indexA].check.brndGuideCheck = true:taskCheckId=='12'?val[indexA].check.impCntCheck = true:
        taskCheckId=='13'?val[indexA].check.feedCheck = true:taskCheckId=='14'?val[indexA].check.otherCheck = true:null
        setClientList(val);
      })
    }else if(value===true){
      await axios.delete(process.env.NEXT_PUBLIC_EVE_REMOVE_TASK_CHECK_STEP_THREE,
        {
          data:{campAssignId:campAssignId, taskCheckId:taskCheckId} 
        }
      ).then(()=>{
        let val = [];
        val=[...clientList];
        taskCheckId=='1'?val[indexA].check.docCheck = false:taskCheckId=='2'?val[indexA].check.affidavCheck = false:taskCheckId=='3'?val[indexA].check.floorStandCheck = false:
        taskCheckId=='4'?val[indexA].check.passVisaCheck = false:taskCheckId=='5'?val[indexA].check.ExhCheck = false:taskCheckId=='6'?val[indexA].check.catCheck = false:
        taskCheckId=='7'?val[indexA].check.nBoardCheck = false:taskCheckId=='8'?val[indexA].check.fDetailCheck = false:taskCheckId=='9'?val[indexA].check.travelCheck = false:
        taskCheckId=='10'?val[indexA].check.visaInvCheck = false:taskCheckId=='11'?val[indexA].check.brndGuideCheck = false:taskCheckId=='12'?val[indexA].check.impCntCheck = false:
        taskCheckId=='13'?val[indexA].check.feedCheck = false:taskCheckId=='14'?val[indexA].check.otherCheck = false:null
        setClientList(val);
      })
    }
  }
  const addTaskDate = async(date, taskId) => {
    date=date?date:'null';
    console.log(date);
    await axios.post(process.env.NEXT_PUBLIC_EVE_ADD_TASK_DATE_STEP_THREE,{date:date, taskId:taskId, campaignId:campaignId, agentId:Cookies.get('loginId')}).then(()=>{
      let tempState = [...taskDate];
      tempState[taskId-1]= {task_date:date}
      setTaskDate(tempState)
    })
  }

  return (
    <div className='clients-assign mx-4'>
        <Container fluid>
        <Row>
              <Col className='my-3 mx-4'>
                <span className="back-btn" onClick={()=>Router.push(`/assignclientsteptwo?id=${campaignId}`)}>
                    <LeftCircleOutlined className="link-icons" />
                    Assigning Step 2
                </span>
              </Col>
          </Row>
          <Row>
            <Col>
            <div className='border shadow p-5 bg-white' style={{borderRadius:"12px", minHeight:"640px"}}>
            <hr/>
            <Row className='table-lg mt-4 px-1' style={{overflowX:"hidden"}}>
            <Table className='largeTable' >
            <thead style={{position:"relative",zIndex:"1", bottom:"10px"}}>
            <tr>
                <th className='py-4 px-3 text-center'>Company Name</th>
                <th className='py-4 px-2 text-center'>Document Submission</th>
                <th className='py-4 px-2 text-center'>Affidavit Payorder</th>
                <th className='py-4 px-1 text-center'>Floor / Stand<span className='mx-1'>Plan</span></th>
                <th className='py-4 px-0 text-center'>Passport / Visa<span className='mx-1'>Details</span></th>
                <th className='py-4 px-3 text-center'>Exhibitor Manual</th>
                <th className='py-4 px-3 text-center'>Catalogue Entry</th>
                <th className='py-4 px-4 text-center'>Name Board</th>
                <th className='py-4 px-4 text-center'>Freight Details</th>
                <th className='py-4 px-4 text-center'>Travel Guide</th>
                <th className='py-4 px-4 text-center'>Visa / Invite</th>
                <th className='py-4 px-2 text-center'>Branding Guidelines</th>
                <th className='py-4 px-3 text-center'>Important Contacts</th>
                <th className='pb-custom px-4 text-center'>Feedback</th>
                <th className='pb-custom px-4 text-center'>Other</th>
                <th className='pb-custom px-5 text-center'>Status </th>
            </tr>
            </thead>
            <tbody>
              <tr className='custom-date'>
                <td>Date</td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{ width:"90%", border:"none" }} 
                        value={(typeof taskDate[0]!=='undefined')?taskDate[0].task_date:'' }
                        onChange={(e)=>addTaskDate(e.target.value, '1')} 
                  />
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"110%", border:"none"}} value={(typeof taskDate[1] !== 'undefined')?taskDate[1].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '2')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"105%", border:"none"}} value={(typeof taskDate[2] !== 'undefined')?taskDate[2].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '3')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"100%", border:"none"}} value={(typeof taskDate[3] !== 'undefined')?taskDate[3].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '4')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"95%", border:"none"}} value={(typeof taskDate[4] !== 'undefined')?taskDate[4].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '5')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"95%", border:"none"}} value={(typeof taskDate[5] !== 'undefined')?taskDate[5].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '6')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"100%", border:"none"}} value={(typeof taskDate[6] !== 'undefined')?taskDate[6].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '7')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"95%", border:"none"}} value={(typeof taskDate[7] !== 'undefined')?taskDate[7].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '8')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"100%", border:"none"}} value={(typeof taskDate[8] !== 'undefined')?taskDate[8].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '9')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"100%", border:"none"}} value={(typeof taskDate[9] !== 'undefined')?taskDate[9].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '10')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"95%", border:"none"}} value={(typeof taskDate[10] !== 'undefined')?taskDate[10].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '11')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"95%", border:"none"}} value={(typeof taskDate[11] !== 'undefined')?taskDate[11].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '12')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"95%", border:"none"}} value={(typeof taskDate[12] !== 'undefined')?taskDate[12].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '13')}/>
                </td>
                <td className='text-center' style={{maxWidth:"10px"}}>
                  <input type="date" style={{width:"130%", border:"none"}} value={(typeof taskDate[13] !== 'undefined')?taskDate[13].task_date:'' } onChange={(e)=>addTaskDate(e.target.value, '14')}/>
                </td>
                <td>
                </td>
              </tr>
              {
              clientList.map((clients, index)=>{
                return(
                  <tr key={index}>
                    <td className='app-cli-name'>{clients.Client.companyName}</td>
                    <td className='py-3 text-center'>
                      <Form.Check type="checkbox" checked={clients.check.docCheck}
                        onChange={()=>changeTaskStatus(clients.id, index, '1', clients.check.docCheck)}
                      />
                    </td>
                    <td className='py-3 text-center'>
                      <Form.Check type="checkbox" checked={clients.check.affidavCheck}
                        onChange={()=>changeTaskStatus(clients.id, index, '2', clients.check.affidavCheck)}
                      />
                    </td>
                    <td className='py-3 text-center'>
                      <Form.Check type="checkbox" checked={clients.check.floorStandCheck}
                        onChange={()=>changeTaskStatus(clients.id, index, '3', clients.check.floorStandCheck)}
                      />
                    </td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.passVisaCheck} onChange={()=>changeTaskStatus(clients.id, index, '4', clients.check.passVisaCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.ExhCheck} onChange={()=>changeTaskStatus(clients.id, index, '5', clients.check.ExhCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.catCheck} onChange={()=>changeTaskStatus(clients.id, index, '6', clients.check.catCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.nBoardCheck} onChange={()=>changeTaskStatus(clients.id, index, '7', clients.check.nBoardCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.fDetailCheck} onChange={()=>changeTaskStatus(clients.id, index, '8', clients.check.fDetailCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.travelCheck} onChange={()=>changeTaskStatus(clients.id, index, '9', clients.check.travelCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.visaInvCheck} onChange={()=>changeTaskStatus(clients.id, index, '10', clients.check.visaInvCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.brndGuideCheck} onChange={()=>changeTaskStatus(clients.id, index, '11', clients.check.brndGuideCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.impCntCheck} onChange={()=>changeTaskStatus(clients.id, index, '12', clients.check.impCntCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.feedCheck} onChange={()=>changeTaskStatus(clients.id, index, '13', clients.check.feedCheck)} /></td>
                    <td className='py-3 text-center'><Form.Check type="checkbox" checked={clients.check.otherCheck} onChange={()=>changeTaskStatus(clients.id, index, '14', clients.check.otherCheck)} /></td>
                    <td className='py-3 text-center'>
                    <div className="progress position-relative">
                        <div className="progress-bar" role="progressbar" 
                          style={{width:`${
                            (clients.check.docCheck?7:0)+(clients.check.affidavCheck?7:0)+(clients.check.floorStandCheck?7:0)+(clients.check.passVisaCheck?7:0)+
                            (clients.check.ExhCheck?7:0)+(clients.check.catCheck?7:0)+(clients.check.nBoardCheck?7:0)+(clients.check.fDetailCheck?7:0)+
                            (clients.check.travelCheck?7:0)+(clients.check.visaInvCheck?7:0)+(clients.check.brndGuideCheck?7:0)+(clients.check.impCntCheck?7:0)+
                            (clients.check.feedCheck?7:0)+(clients.check.otherCheck?9:0)
                          }%`}}
                        >
                        </div>
                        <small className="justify-content-center d-flex position-absolute w-100">{`${

                            (clients.check.docCheck?7:0)+(clients.check.affidavCheck?7:0)+(clients.check.floorStandCheck?7:0)+(clients.check.passVisaCheck?7:0)+
                            (clients.check.ExhCheck?7:0)+(clients.check.catCheck?7:0)+(clients.check.nBoardCheck?7:0)+(clients.check.fDetailCheck?7:0)+
                            (clients.check.travelCheck?7:0)+(clients.check.visaInvCheck?7:0)+(clients.check.brndGuideCheck?7:0)+(clients.check.impCntCheck?7:0)+
                            (clients.check.feedCheck?7:0)+(clients.check.otherCheck?9:0)

                        }%`}</small>
                    </div>
                    </td>
                  </tr>
                  )
                })
              }
            </tbody>
            </Table>
            </Row>
            </div>
            </Col>
          </Row>
        </Container>
    </div>
  )
}

export default AssignStepThree