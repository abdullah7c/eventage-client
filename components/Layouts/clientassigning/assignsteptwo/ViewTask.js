import React,{ useEffect, useState } from 'react'
import { Col, Row, Button } from 'react-bootstrap';
import axios from 'axios'
import Router, {useRouter} from 'next/router'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const ViewTask = ({taskList, contactList, campName, campaignDetail}) => {

    const router = useRouter();
    const campaignId = router.query.id;

    const [taskDisplayList, setTaskDisplayList] = useState([]);
    const [cntList, setCntList] = useState([]);
    const [reload, setReload] = useState(false);

    const [deleteId, setDeleteId] = useState('');

    useEffect(() => {
        // console.log(taskList)
        // console.log(contactList)
        // console.log(campName)
        setCntList(contactList)
        //console.log(campaignDetail.Client.companyName)
        setTaskDisplayList(taskList)
        //console.log(taskDisplayList.filter((x)=>{return x.status==='pending'}).length)
        return () =>{ reload==true?Router.push(`/assignclientsteptwo?id=${campaignId}`):null }

    }, [reload]);
    const updateTask = async(id) =>{
        setDeleteId(id);
        setReload(true);
        await axios.put(process.env.NEXT_PUBLIC_EVE_UPDATE_CAMPAIGN_TASK, { id:id } ).then((x)=>{
            if(x.data=="Updated"){
                console.log('deleted Area')
                let tempState = [...taskDisplayList];
                console.log(tempState)

                let removeIndex = tempState.map(function(item) { return item.id; }).indexOf(id);
                tempState.splice(removeIndex, 1);

                console.log(tempState)
                setTaskDisplayList(tempState);
            }
            
        })
    }
    const deleteTask = async(id) =>{
        setDeleteId(id);
        setReload(true);
        await axios.delete(process.env.NEXT_PUBLIC_EVE_DELETE_CAMPAIGN_TASK, { data:{ id:id } }).then((x)=>{
            if(x.data=="Deleted"){
                console.log('deleted Area')
                let tempState = [...taskDisplayList];
                console.log(tempState)

                let removeIndex = tempState.map(function(item) { return item.id; }).indexOf(id);
                tempState.splice(removeIndex, 1);

                console.log(tempState)
                setTaskDisplayList(tempState);
            }
            
        })
    }
    const getName = (id) => {
        let name;
        for(let i = 0; i<contactList.length; i++){
            if(contactList[i].id == id){
                name = contactList[i].fName + " " + contactList[i].lName
            }
        }
        return name
    }
    const getEmail = (id) => {
        let email;
        for(let i = 0; i<contactList.length; i++){
            if(contactList[i].id == id){
                email = contactList[i].email 
            }
        }
        return email
    }
    const getNumber = (id) => {
        let number;
        for(let i = 0; i<contactList.length; i++){
            if(contactList[i].id == id){
                number = contactList[i].mobile 
            }
        }
        return number
    }
    const getLandline = (id) => {
        let number;
        for(let i = 0; i<contactList.length; i++){
            if(contactList[i].id == id){
                number = contactList[i].landLine 
            }
        }
        return number
    }

  return (
    <div className='clients-assign p-3'>
        <Row className='px-2'>
            <Col md={1}> Capmaign: </Col>
            <Col className="mx-3"> <strong>{campName}</strong> </Col>
            <Col md={1}> Client: </Col>
            <Col className=''><strong>{campaignDetail.Client.companyName}</strong></Col>
        </Row>
        <TransitionGroup className="todo-list">
        {taskDisplayList.filter((x)=>{return x.status=="pending"}).map((task)=>{
            return(
                <CSSTransition
                    key={task.id}
                    timeout={500}
                    classNames="item"
                    >
                <Row className='task-box p-4'>
                    <Col className='task-title my-2'>{task.title}</Col>
                    <Row>
                        <Col className='task-heading'>Created on: <span > {task.createdAt.slice(0,10)} </span></Col>
                    </Row>
                    <hr style={{width:"97%"}} />
                    <Row>
                        <Col > <span className='task-heading'>Start Date:</span> {task.start_date} </Col>
                        <Col style={{float:"right"}}> <span className='task-heading'>End Date:</span> {task.end_date} </Col>
                    </Row>
                    <hr style={{width:"97%"}} />
                    <Row>
                        <Col > <span className='task-heading'>Contact Person:</span> {getName(task.ClientContactPersonId)} </Col>
                        <Col style={{float:"right"}}> <span className='task-heading'>Email:</span> {getEmail(task.ClientContactPersonId)} </Col>
                    </Row>
                    <hr style={{width:"97%"}} />
                    <Row>
                        <Col > <span className='task-heading'>Mobile:</span> {getNumber(task.ClientContactPersonId).slice(0,-2)} </Col>
                        <Col style={{float:"right"}}> <span className='task-heading'>Landline:</span> {getLandline(task.ClientContactPersonId).slice(0,-2)} </Col>
                    </Row>
                    <hr style={{width:"97%"}} />
                    <div>
                        <span style={{float:"right"}}> <Button className='px-4' size="sm" onClick={()=>updateTask(task.id)}>Completed</Button></span>
                        <span style={{float:"right"}} className='mx-3'> <Button className='px-4' size="sm" onClick={()=>deleteTask(task.id)}>Delete</Button></span>
                    </div>
                </Row>
                </CSSTransition>
            )
        })}
        </TransitionGroup>
        {taskDisplayList.filter((x)=>{return x.status==='pending'}).length<1 && 
                <h3 className='py-4 m-2 text-center' style={{fontWeight:"900", color:"silver" , borderRadius:"5px", border:"1px solid silver"}}> No Task </h3>
            }
    </div>
  )
}
