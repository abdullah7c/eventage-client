import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Table, Form, Spinner, Modal, Toast } from 'react-bootstrap';
import axios from 'axios'
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faRectangleList} from '@fortawesome/free-solid-svg-icons'
import { 
        InfoCircleOutlined, ContainerOutlined, PlusOutlined, CloseCircleTwoTone, CloseSquareOutlined,
        CheckCircleOutlined, BarsOutlined, UnorderedListOutlined, CheckSquareOutlined ,CheckCircleTwoTone,
        SyncOutlined,LeftCircleOutlined, RightCircleOutlined
    } from '@ant-design/icons';

import TaskModalView from './TaskModalView'
import CommentModal from './CommentModal';
import { ViewTask } from './ViewTask';
import ViewCompletedTasks from './ViewCompletedTasks'
import ViewComments from './ViewComments';
import ClientAlertView from './ClientAlertView';

const AssignStepTwo = ({assignedClients, categories, sessionData}) => {

    const router = useRouter();
    const campaignId = router.query.id;

    const [clientList, setClientList] = useState([]);
    const [contactPersonShow, setContactPersonShow] = useState(false);
    const [campaignDetail, setCampaignDetail] = useState([]);
    
    const [selectedAssign, setSelectedAssign] = useState('')
    const [clientApproval, setClientApproval] = useState(false);
    const [clientApprovalLoad, setClientApprovalLoad] = useState(false);
    const [clientDisapproval, setClientDisapproval] = useState(false);
    const [clientDisapprovalLoad, setClientDisapprovalLoad] = useState(false);
    const [clientDenyReason, setClientDenyReason] = useState('');
    const [sendAlertShow, setSendAlertShow] = useState(false)
    const [show, setShow] = useState(false);

    const [taskTag, setTaskTag] = useState(false);
    const [commentTag, setCommentTag] = useState(false);
    const [viewTaskTag, setViewTaskTag] = useState(false);
    const [viewCompTaskTag, setViewCompTaskTag] = useState(false);
    const [viewComment, setViewComment] = useState(false);

    const [taskList, setTaskList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [commentList, setCommentList] = useState([]);

    const [campName, setCampName] = useState('');

    const [allCallCheck, setAllCallCheck] = useState(false);
    const [allSmsCheck,  setAllSmsCheck ] = useState(false);
    const [allMailCheck, setAllMailCheck] = useState(false);

    const [updateLoad, setUpdateLoad] = useState(false);

    const [ changeIndex, setChangeIndex ] = useState('');

    const childToParent = (data) => {
        setShow(false);
        setTaskTag(false);
        data.status="pending"
        let tempState = [...clientList];
        tempState[changeIndex].Campaign_Tasks.push(data)
        setClientList(tempState)
      }

    useEffect(() => {
        setCampName(assignedClients.name)
        createClientsList();
        return () => { setClientList([]) }
    }, [assignedClients])
    
    useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        return () => { }
      }, [sessionData])

    const createClientsList = () =>{
        let val = [];
        assignedClients.Client_Campaign_Assigns.forEach((x, index) => {
            val[index] = x;
            val[index].Client.category = getCategoryName(x.Client.category);
            val[index] = {...x, check: {callCheck:false, smsCheck:false, mailCheck:false} };
        })
        // val.map((x)=>{
        //     x.Client.category = getCategoryName(x.Client.category);
        // })
        console.log(val);
        setClientList(val);
    }
    const getCategoryName = (ids) => {
        ids = ids.split(',').slice(0,-1)
        let values = ''
        for(let i = 0; i<ids.length;i++){
            for(let j = 0; j<categories.childCat.length;j++){
                if(categories.childCat[j].id==ids[i]){
                    values = values + categories.childCat[j].title+ ", "
                }
            }
        }
        return values.slice(0,-2)
    }
    const contactPersonDetails = (data) => {
        console.log(data)
    }
    const getTasksLength = (tasks) => {
        let num = 0;
        tasks.forEach((x)=>{
            if(x.status=="pending"){
                num++;
            }
        })
        return num;
    }
    const getCompletedTasksLength = (tasks) => {
        let num = 0;
        tasks.forEach((x)=>{
            if(x.status=="completed"){
                num++;
            }
        })
        return num;
    }
    const updateBatchCallAlert = () => {
        let tempState = [...clientList];
        if(allCallCheck==true){
            tempState.map((x, index)=>{
                tempState[index].check.callCheck=false;
            })
        }else{
            tempState.map((x, index)=>{
                tempState[index].check.callCheck=true;
            })
        }
        setClientList(tempState);
        setAllCallCheck(!allCallCheck);
    }
    const updateBatchSmsAlert = () => {
        let tempState = [...clientList];
        if(allSmsCheck==true){
            tempState.map((x, index)=>{
                tempState[index].check.smsCheck=false;
            })
        }else{
            tempState.map((x, index)=>{
                tempState[index].check.smsCheck=true;
            })
        }
        setClientList(tempState);
        setAllSmsCheck(!allSmsCheck);
    }
    const updateBatchMailAlert = () => {
        let tempState = [...clientList];
        if(allMailCheck==true){
            tempState.map((x, index)=>{
                tempState[index].check.mailCheck=false;
            })
        }else{
            tempState.map((x, index)=>{
                tempState[index].check.mailCheck=true;
            })
        }
        setClientList(tempState);
        setAllMailCheck(!allMailCheck);
    }
    const updateAlert = async() => {
        setUpdateLoad(true);
        let callList = [];
        let smsList = [];
        let mailList = [];
        clientList.forEach((x, index)=>{
            if(x.check.callCheck==true){
                callList.push(x.id)
            }
            if(x.check.smsCheck==true){
                smsList.push(x.id)
            }
            if(x.check.mailCheck==true){
                mailList.push(x.id)
            }
        })
        await axios.post(process.env.NEXT_PUBLIC_EVE_UPDATE_CAMPAIGN_ASSIGN_ALERT,{callList:callList, smsList:smsList, mailList:mailList}).then((res)=>{
            console.log(res.data.time)
            let tempState = [...clientList];
            if(res.data.call>0){
                tempState.forEach((x)=>{
                    if(x.check.callCheck==true){
                        x.check.callCheck=false
                        x.Client_CampaignAssign_Details[0].call=res.data.time
                    }
                })
            }
            if(res.data.sms>0){
                tempState.forEach((x)=>{
                    if(x.check.smsCheck==true){
                        x.check.smsCheck=false
                        x.Client_CampaignAssign_Details[0].message=res.data.time
                    }
                })
            }
            if(res.data.mail>0){
                tempState.forEach((x)=>{
                    if(x.check.mailCheck==true){
                        x.check.mailCheck=false
                        x.Client_CampaignAssign_Details[0].mail=res.data.time
                    }
                })
            }
            setClientList(tempState);
            setAllCallCheck(false);
            setAllSmsCheck(false);
            setAllMailCheck(false);
            setUpdateLoad(false);
        })
    }
    const changeStatus = async(value, id, index)=>{
        if(value!="Select"){
            await axios.post(process.env.NEXT_PUBLIC_EVE_UPDATE_CAMPAIGN_ASSIGN_STATUS, {status:value, id:id}).then((x)=>{
                if(x.data==1){
                let tempState = [...clientList];
                tempState[index].status_order=value;
                setClientList(tempState)
                }
    
            })
        }
    }
    const disapproveClient = () => {
        setClientDisapprovalLoad(true);
        console.log(clientDenyReason)
        console.log(selectedAssign)
        axios.post(process.env.NEXT_PUBLIC_EVE_DISSAPPROVE_CAMPAIGN_ASSIGN,{id:selectedAssign, reason:clientDenyReason}).then((x)=>{
            if(x.data==1){
                let tempState = [...clientList];
                let index  = tempState.findIndex(camp => camp.id==selectedAssign);
                tempState[index].status_order = '-1'
                setClientList(tempState)
            }
            setShow(false);
            setClientDisapproval(false);
            setClientDisapprovalLoad(false);
            setSelectedAssign('');
        })
    }
    const approveClient = () =>{
        setClientApprovalLoad(true);
        console.log(selectedAssign)
        axios.post(process.env.NEXT_PUBLIC_EVE_APPROVE_CAMPAIGN_ASSIGN,{id:selectedAssign}).then((x)=>{
            if(x.data==1){
                let tempState = [...clientList];
                let index  = tempState.findIndex(camp => camp.id==selectedAssign);
                tempState[index].status_order = '4'
                setClientList(tempState)
                setShow(false);
                setClientApproval(false);
                setClientApprovalLoad(false);
            }
        })
    }
  return (
    <div className='clients-assign mx-4'>
        <Container fluid>
            <Row>
              <Col className='my-3 mx-4'>
                <span className="back-btn" onClick={()=>Router.push(`/assignclientstepone?id=${campaignId}`)}>
                    <LeftCircleOutlined className="link-icons" />
                    Assigning Step 1
                </span>
                <div className='assigning-btn' style={{float:"right"}} onClick={()=>Router.push(`/assignclientstepthree?id=${campaignId}`)}>
                    Assigning Step 3
                    <RightCircleOutlined className="link-icons" />
                </div>
              </Col>
          </Row>
            <Row className=' mx-2'>
            <Col md={12}>
            <div className='border shadow p-5 bg-white' style={{borderRadius:"12px", minHeight:"640px"}}>
            <Row>
                <Col>
                <span className='campaign-heading'>{assignedClients.name}</span>
                <span>
                    <Button className='px-3 mx-3 mb-2' disabled={updateLoad?true:false} onClick={updateAlert} size="sm">{updateLoad?<Spinner className='mx-4 td-400' animation="border" size="sm" />:"Update Alerts"}</Button>
                </span>
                </Col>
                <Button className='px-3 mx-3 mt-2' style={{width:"120px", height:"35px"}} size="sm" onClick={()=>{setSendAlertShow(true); setShow(true)}} >Notify Clients</Button>
            </Row>
            <hr/>
            <Row className='table-lg mt-4 px-1' style={{overflowX:"hidden"}}>
            <Table className='largeTable' >
            <thead style={{position:"relative",zIndex:"1", bottom:"10px"}}>
            <tr>
                <th className='px-4'>Sr <div className='my-2'></div></th>
                <th>Company Name <div className='my-2'></div></th>
                <th>Contact Persons<br/> <div className='my-2'></div></th>
                <th><Row className='my-2'>
                        <Col md={1}>
                        <Form.Check type="checkbox" onChange={updateBatchCallAlert} checked={allCallCheck} />
                        </Col>
                        <Col md={2}>Call</Col>
                    </Row>
                </th>
                <th><Row className='my-2'>
                        <Col md={1}>
                        <Form.Check type="checkbox" onChange={updateBatchSmsAlert} checked={allSmsCheck} />
                        </Col>
                    <Col md={2}>SMS</Col></Row>
                </th>
                <th><Row className='my-2'>
                        <Col md={1}>
                        <Form.Check type="checkbox" onChange={updateBatchMailAlert} checked={allMailCheck} />
                        </Col>
                    <Col md={2}>Email</Col></Row>
                </th>
                <th>Tasks <div className='my-2'></div></th>
                <th>Comments <div className='my-2'></div></th>
                <th>Status <div className='my-2'></div></th>
            </tr>
            </thead>
            <tbody className='custom-check'>
                {clientList.sort((a,b)=>(b.status_order - a.status_order)).map((client, index)=>{
                return(
                    <tr key={index} 
                        className={
                            client.status_order=='4'?'accept-status':client.status_order=='3'?'hot-status':
                            client.status_order=='2'?'warm-status':client.status_order=='1'?'cold-status':
                            client.status_order=='-1'?'deny-status':'null-status'
                    }>
                    <td>
                        <div className='table-sr px-3'> {index+1} </div>
                    </td>
                    <td>
                        <div className='table-company-name'>{client.Client.companyName}</div>
                        <div className='category-name'>{client.Client.category}</div>
                    </td>
                    <td>
                    <Row>
                        <Col md={1}>
                        <div onClick={()=>{ setContactPersonShow(true); contactPersonDetails(client.Client.Client_Contact_Persons) }}>
                            <InfoCircleOutlined className='table-list-icon' />
                        </div>
                        </Col>
                        <Col md={5} className='my-1'>
                        {client.Client.Client_Contact_Persons.map((person, indexTwo)=>{
                            return( <div key={`${index}${indexTwo}`} className="table-person" > {person.fName}<span className='mx-1'>{person.lName}</span></div> )
                        })}
                        </Col>
                    </Row>
                    </td>
                    <td>
                        <span >
                                <InfoCircleOutlined className='table-list-icon-alert mx-1' />
                                <div className="table-person mx-1 mt-1" style={{display:"inline-block"}}>
                                    {client.Client_CampaignAssign_Details[0].call.length>1?client.Client_CampaignAssign_Details[0].call.split(",")[0]:'No Recent'}
                                </div>
                                <br/>
                                <label className="container">
                                    <span className="table-person">
                                        {client.Client_CampaignAssign_Details[0].call.length>1?client.Client_CampaignAssign_Details[0].call.split(",")[1]:'Alert'}
                                        </span> 
                                <input type="checkbox" className='mt-1 mx-1 the-check-box'
                                        checked={client.check.callCheck?true:false}
                                        onChange={()=>{
                                            let tempState = [...clientList];
                                            tempState[index].check.callCheck=!tempState[index].check.callCheck;
                                            setClientList(tempState)
                                        }}
                                />
                                <span className="checkmark"></span>
                                </label>
                        </span>
                    </td>
                    <td >
                    <span>
                        <InfoCircleOutlined className='table-list-icon-alert mx-1' />
                        <div className="table-person mx-1 mt-1" style={{display:"inline-block"}}>
                            {client.Client_CampaignAssign_Details[0].message.length>1?client.Client_CampaignAssign_Details[0].message.split(",")[0]:'No Recent'}
                        </div>
                        <br/>
                        <label className="container">
                            <span className="table-person">
                                {client.Client_CampaignAssign_Details[0].message.length>1?client.Client_CampaignAssign_Details[0].message.split(",")[1]:'Alert'}
                            </span> 
                        <input type="checkbox" className='mt-1 mx-1 the-check-box'
                                checked={client.check.smsCheck?true:false}
                                onChange={()=>{
                                    let tempState = [...clientList];
                                    tempState[index].check.smsCheck=!tempState[index].check.smsCheck;
                                    setClientList(tempState)
                                }}
                            />
                        <span className="checkmark"></span>
                        </label>
                    </span>
                    </td>
                    <td >
                    <span>
                        <InfoCircleOutlined className='table-list-icon-alert mx-1' />
                        <div className="table-person mx-1 mt-1" style={{display:"inline-block"}}>
                            {client.Client_CampaignAssign_Details[0].mail.length>1?client.Client_CampaignAssign_Details[0].mail.split(",")[0]:'No Recent'}
                        </div>
                        <br/>
                        <label className="container">
                            <span className="table-person">
                                {client.Client_CampaignAssign_Details[0].mail.length>1?client.Client_CampaignAssign_Details[0].mail.split(",")[1]:'Alert'}
                            </span> 
                        <input type="checkbox" className='mt-1 mx-1 the-check-box'
                                checked={client.check.mailCheck?true:false}
                                onChange={()=>{
                                    let tempState = [...clientList];
                                    tempState[index].check.mailCheck=!tempState[index].check.mailCheck;
                                    setClientList(tempState)
                                }}
                            />
                        <span className="checkmark"></span>
                        </label>
                    </span>
                    </td>
                    <td>
                    <div className='my-3'>
                        <span> <PlusOutlined className="table-tasks mx-1" onClick={()=>{setCampaignDetail(client); setShow(true); setTaskTag(true); setChangeIndex(index); }} /> </span> | 
                        <span 
                            onClick={() => {
                                setCampaignDetail(client);
                                setViewTaskTag(true); setShow(true);
                                setTaskList(client.Campaign_Tasks);
                                setContactList(client.Client.Client_Contact_Persons);
                                }}
                            > <UnorderedListOutlined className="table-tasks mx-1" />
                            <span className="table-taskLength">({getTasksLength(client.Campaign_Tasks)})</span> 
                        </span> | 
                        <span 
                            onClick={()=>{
                                setViewCompTaskTag(true);setShow(true);setCampaignDetail(client);
                                setTaskList(client.Campaign_Tasks);
                                setContactList(client.Client.Client_Contact_Persons);
                            }}
                        > <CheckCircleOutlined className="table-tasks mx-1" />
                            <span className="table-taskLength">({getCompletedTasksLength(client.Campaign_Tasks)})</span> 
                        </span>
                    </div>
                    </td>
                    <td>
                    <div className='my-3'>
                        <span> <PlusOutlined className="table-tasks mx-1" onClick={()=>{setShow(true); setCommentTag(true); setCampaignDetail(client);}} /> </span> | 
                        <span>
                            <UnorderedListOutlined className="table-tasks mx-1" 
                                onClick={()=>{ setCommentList(client.Comments); setViewComment(true); setShow(true); setCampaignDetail(client);}} 
                            /> 
                            <span className="table-taskLength">({client.Comments.length})</span> 
                        </span>
                    </div>
                    </td>
                    <td>
                    <span>
                        <span>
                            <CheckCircleTwoTone  className="table-approve" twoToneColor="#2EAB58"
                                onClick={()=>{ setSelectedAssign(client.id); setClientApproval(true); setShow(true);}}
                            />
                                <br/>
                            <CloseCircleTwoTone  className="table-disapprove" twoToneColor="#AB3535"
                                onClick={()=>{ setSelectedAssign(client.id); setClientDisapproval(true); setShow(true);}} 
                            />
                        </span>
                        <span>
                            <select className='form-select form-select-sm' 
                                style={{width:"90px",position:"relative",bottom:"39px", left:"30px"}} 
                                value={client.status_order} 
                                onChange={(e)=>changeStatus(e.target.value, client.id, index)}
                            >
                                <option >Select</option>
                                <option value={'1'}>Cold</option>
                                <option value={'2'}>Warm</option>
                                <option value={'3'}>Hot</option>
                            </select>
                        </span>
                    </span>
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
        <Modal
            show={show} backdrop="static" keyboard={false} size={sendAlertShow?"xl":"lg"}
            onHide={()=>{
                setShow(false); setTaskTag(false); setCommentTag(false); setClientApproval(false);setSelectedAssign(''); setSendAlertShow(false);
                setViewTaskTag(false); setViewCompTaskTag(false); setViewComment(false); setClientDisapproval(false);
            }}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                { taskTag && <TaskModalView campaignDetail={campaignDetail} name={assignedClients.name} childToParent={childToParent} /> }
                { commentTag && <CommentModal campaignDetail={campaignDetail} campName={campName} /> }
                { viewTaskTag && <ViewTask taskList={taskList} contactList={contactList} campaignDetail={campaignDetail} campName={campName}  /> }
                { viewCompTaskTag && <ViewCompletedTasks taskList={taskList} contactList={contactList} campaignDetail={campaignDetail} campName={campName}  /> }
                { viewComment && <ViewComments campaignDetail={campaignDetail} campName={campName} commentList={commentList} /> }
                { sendAlertShow && <ClientAlertView clientList={clientList} /> }
                { clientApproval && 
                <><h3>Approve This Client?</h3>
                    <hr/>
                    {!clientApprovalLoad && <Button className="px-4" variant='success' onClick={approveClient}>Confirm</Button>}
                    {clientApprovalLoad && <Button className="px-4" variant='success' disabled ><Spinner className='mx-4 td-400' animation="border" size="sm" /></Button>}
                    <Button className="px-4 mx-4" variant='danger' onClick={()=>{setShow(false); setClientApproval(false)}}>Reject</Button></> 
                }
                { clientDisapproval && 
                <><h3>Disapprove Client</h3>
                    <h6>Enter Denial Reason</h6>
                    <select className='form-select form-select-sm' onChange={(e)=>setClientDenyReason(e.target.value)}>
                        <option >Select</option>
                        <option value={'1'}>Participation rejected by TDAP</option>
                        <option value={'2'}>Yearly Subsidy Quota availed</option>
                        <option value={'3'}>Exhibiting elsewhere</option>
                        <option value={'4'}>Junk Lead</option>
                        <option value={'5'}>No Budget</option>
                        <option value={'6'}>No Govt Funding</option>
                        <option value={'7'}>Not Relevant</option>
                        <option value={'8'}>Out of Business</option>
                        <option value={'9'}>Personal Problem</option>
                        <option value={'10'}>Stand Location</option>
                        <option value={'11'}>Visa Problem</option>
                        <option value={'12'}>Distributors present in region</option>
                        <option value={'13'}>Visiting only</option>
                        <option value={'14'}>Political/Export problem in region</option>
                    </select>
                    <hr/>
                    {!clientDisapprovalLoad && <Button className="px-4" variant='success' onClick={disapproveClient} >Confirm</Button>}
                    {clientDisapprovalLoad && <Button className="px-3" variant='success' disabled ><Spinner className='mx-4 td-400' animation="border" size="sm" /></Button>}
                    <Button className="px-4 mx-4" variant='danger' onClick={()=>{setShow(false); setClientDisapproval(false)}}>Reject</Button></> 
                }
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default AssignStepTwo