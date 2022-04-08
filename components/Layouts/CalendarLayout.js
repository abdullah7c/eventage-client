import React,{ useState, useEffect } from 'react'
import {Container, FormControl, Modal, InputGroup, Row, Col, Button} from 'react-bootstrap'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Aos from 'aos'
import Router from 'next/router';

const CalendarLayout = ({sessionData, personalTasks, campaignTasks}) => {

    const handleClose = () => setState({...state, show:false });
    const handleShow = () => setState({...state, show:true });
    const [event, setEvent] = useState([])

    useEffect(() => {
        Aos.init({duration:500});
        if(sessionData.isLoggedIn==false){ Router.push('/signin'); }
        createTaskList();
        
        return () => { }
    }, [sessionData])

    const createTaskList = () => {
        let tempState = [];
        campaignTasks.forEach((task,index)=>{
            tempState[index] = {
                id:task.id,
                title:task.title+` (${task['Campaign.name']})`,
                start:new Date(moment(task.start_date,"YYYY/MM/DD")),
                end:new Date(moment(task.end_date,"YYYY/MM/DD")),
                complete:true
            }
        })
        personalTasks.forEach((task)=>{
            tempState.push({
                id:task.id,
                title:task.title+` (${task.campaign})`,
                start:new Date(moment(task.start_date,"YYYY/MM/DD")),
                end:new Date(moment(task.end_date,"YYYY/MM/DD")),
                complete:true
            })
        })
        setEvent(tempState)
    }

    let date = moment().format('YYYY/MM/DD');
    const localizer = momentLocalizer(moment);

    const [state, setState] = useState({
          show:false,
    })
    
    return (
        <div data-aos="fade-right">
        <Container className="border shadow mt-5 p-5" style={{backgroundColor: 'white' , borderRadius: '8px', height:"80vh"}}>
        <Row>
            <Col><h4>Calendar Tasks</h4></Col>
            {/* <Col><Button className='px-5' style={{ float:"right" }} onClick={handleShow}>Create New</Button></Col> */}
        </Row><hr/>
        <Calendar
            className="small"
            localizer={localizer}
            events={event}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '85%'}}
            />
        </Container>
        <Modal show={state.show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                <Row>
                    <Col md={3}><b>Task Title:</b></Col>
                    <Col MD={9}>
                        <InputGroup className="mb-3">
                            <FormControl
                            placeholder="Enter Title"
                            aria-label="Enter Title"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}><b>Description:</b></Col>
                    <Col MD={9}>
                        <InputGroup className="mb-3">
                            <FormControl
                            as="textarea"
                            placeholder="Enter Description"
                            aria-label="Enter Description"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}><b>Start Date :</b></Col>
                    <Col MD={9}>
                        <InputGroup className="mb-3">
                            <FormControl
                            type="date"
                            aria-label="date"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}><b>End Date :</b></Col>
                    <Col MD={9}>
                        <InputGroup className="mb-3">
                            <FormControl
                            type="date"
                            aria-label="date"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}><b>Exhibition / Reference :</b></Col>
                    <Col MD={9}>
                        <InputGroup className="mb-3">
                            <FormControl
                            placeholder="Enter Exhibition/Reference"
                            aria-label="Enter Exhibition/Reference"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>

            <Button type="submit" variant="primary" onClick={handleClose}>
                Submit
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}

export default CalendarLayout
