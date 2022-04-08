import React, {useState} from 'react'
import axios from 'axios'
import { Col, Row, Button, Form, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';
import Router, {useRouter} from 'next/router'

const TaskModalView = (props) => {
    
    const router = useRouter();
    const id = router.query.id;

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [contactPersonId, setContactPersonId] = useState('');
    
    const [load, setLoad] = useState(false);
    const [showMsg, setShowMsg] = useState(false);

    const createTask = (e) => {
        setLoad(true)
        e.preventDefault();
        if(contactPersonId==''){
            setLoad(false);
            setShowMsg(true);
        }else{
            axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CAMPAIGN_TASK,{
                title:title, startDate:startDate, endDate:endDate, clientId:props.campaignDetail.ClientId, campaignId:props.campaignDetail.CampaignId,
                agentId:Cookies.get("loginId"), clientCampaignAssignId:props.campaignDetail.id, contactPersonId:contactPersonId
            }).then((x)=>{
                console.log()
                props.childToParent(x.data)
                //Router.push(`assignclientsteptwo?id=${id}`);
            })
        }
    }

    return (
    <div className='clients-assign px-3'>
        <Form onSubmit={createTask}>
            <Row>
                <h3 className=''>Task Creation</h3>
            </Row>
            {/* <Row>
                <button onClick={() => }>click</button>
            </Row> */}
            <br/>
            <Row>
                <Col md={4}><div className='task-fonts my-1'>Campaign :</div></Col>
                <Col>{props.name}</Col>
            </Row>
            <hr/>
            <Row>
            <Col md={4}><div className='task-fonts my-1'>Company :</div></Col>
                <Col>{props.campaignDetail.Client.companyName}</Col>
            </Row>
            <hr/>
            <Row>
                <Col md={4}><div className='task-fonts my-1'>Title :</div></Col>
                <Col>
                    <Form.Group className="" controlId="formBasicEmail">
                        <Form.Control type="text" value={title} onChange={(e)=>setTitle(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col md={4}><div className='task-fonts my-1'>Start Date :</div></Col>
                <Col>
                    <Form.Group className="" controlId="formBasicEmail">
                        <Form.Control type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col md={4}><div className='task-fonts my-1'>End Date :</div></Col>
                <Col>
                    <Form.Group className="" controlId="formBasicEmail">
                        <Form.Control type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} required />
                    </Form.Group>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col md={4}><div className='task-fonts my-1'>Contact Person :</div></Col>
                <Col>
                <Form.Group className="" controlId="formBasicEmail">
                    <Form.Select onChange={(e)=>setContactPersonId(e.target.value)} required>
                    <option>Select</option>
                        {
                            props.campaignDetail.Client.Client_Contact_Persons.map((persons)=>{
                                return(<option key={persons.id} value={persons.id} >{persons.fName} {persons.lName} ({persons.designation})</option>)
                            })
                        }
                    </Form.Select>
                </Form.Group>
                </Col>
            </Row>
            {showMsg && <div className='text-end mt-2' style={{color:"red", fontSize:"10px"}}>* Required</div>}
            <hr/>
            {!load && <Button className='my-3 px-4' variant="primary" type="submit">
                Submit
            </Button>}
            {load && <Button className='my-3 px-5' variant="primary" disabled> <Spinner animation="border" size="sm" /></Button>}
        </Form>
    </div>
  )
}

export default TaskModalView