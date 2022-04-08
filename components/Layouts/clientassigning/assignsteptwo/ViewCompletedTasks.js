import React, { useEffect, useState } from "react"
import { Col, Row, Button } from 'react-bootstrap';

const ViewCompletedTasks = ({taskList, contactList, campName, campaignDetail}) => {

    const [taskDisplayList, setTaskDisplayList] = useState([]);
    const [cntList, setCntList] = useState([]);

    useEffect(() => {
        setCntList(contactList)
        setTaskDisplayList(taskList)
    }, [])
    

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
        <Row className="px-2">
            <Col md={1}> Capmaign: </Col>
            <Col className="mx-3"> <strong>{campName}</strong> </Col>
            <Col md={1}> Client: </Col>
            <Col className=''><strong>{campaignDetail.Client.companyName}</strong></Col>
        </Row>
        {taskDisplayList.filter((x)=>{return x.status=="completed"}).map((task)=>{
            return(

                <Row key={task.id} className='task-box p-4'>
                    <Col className='task-title my-2'>{task.title}</Col>
                    <Row>
                        <Col className='task-heading'>Completed on: <span > {task.updatedAt.slice(0,10)} </span></Col>
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
                </Row>
            )
        })}
        {
            taskDisplayList.filter((x)=>{return x.status=="completed"}).length<1 && 
                <h3 className='py-4 m-1 text-center' style={{fontWeight:"900", color:"silver" , borderRadius:"5px", border:"1px solid silver"}}> No Task </h3>
        }
    </div>
  )
}

export default ViewCompletedTasks