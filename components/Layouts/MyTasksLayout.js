
import React, { useEffect, useState } from 'react'
import {Col, Row, Container, Modal, Form, Table, FormControl, Button, Spinner} from 'react-bootstrap';
import Aos from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios';
import Cookies from 'js-cookie';
import {CloseCircleOutlined} from '@ant-design/icons';

const CampaignTasks = ({tasks, sessionData}) =>{

  const [taskList, setTaskList] = useState([]);
  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState("");
  const [taskCount, setTaskCount] = useState("5")

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [taskState, setTaskState] = useState(
    {
      title:'',
      start_date:'',
      end_date:'',
      description:'',
      campaign:''
    }
  );

  useEffect(() => {
    Aos.init({duration:500})
    console.log(tasks)
    tasks?setTaskList(tasks):null 
  }, [])
  useEffect(() => {
    if(sessionData.isLoggedIn==false){
        Router.push('/signin')
    }
    return () => { }
}, [sessionData])

  const createTask = (e) => {
    e.preventDefault();
    setLoad(true);
    axios.post(process.env.NEXT_PUBLIC_EVE_ADD_AGENT_PERSONAL_TASKS,{
      title:taskState.title,
      start_date:taskState.start_date,
      end_date:taskState.end_date,
      description:taskState.description,
      campaign:taskState.campaign,
      AgentId:Cookies.get('loginId')
    }).then((x)=>{
      let tempState = [...taskList];
      tempState.push(x.data);
      setTaskList(tempState);
      setShow(false);
      setTaskState({title:'', start_date:'', end_date:'', description:'', campaign:''})
      setLoad(false)
    })
  }
  const updateTask = async(id, status, index) => {
      await axios.put(process.env.NEXT_PUBLIC_EVE_UPDATE_AGENT_PERSONAL_TASKS,{id:id, status:status}).then((x)=>{
        if(x.data==1){
          let tempState = [...taskList];
          tempState[index].status = status
          setTaskList(tempState)
        }
      })
  }
  const deleteTask = async(id) => {
      await axios.delete(process.env.NEXT_PUBLIC_EVE_DELETE_AGENT_PERSONAL_TASKS,{
        data:{
          id:id
        }
      }).then((x)=>{
        console.log(x.data)
        let tempState = [...taskList];
        tempState = tempState.filter((x)=>{
          if(x.id!=id){
            return x
          }
        })
        setTaskList(tempState)
      })
  }
  return(
      <div data-aos="fade-right">
      <Container className='border shadow mt-3 p-5 bg-white' style={{borderRadius:"12px", minHeight:"640px"}}>
        <Row>
          <Col>
          <h3>My Tasks</h3>
          </Col>
          <Col>
            <Button style={{float:"right"}} onClick={handleShow}>Add New</Button>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col md={1}>
              <Form.Select value={taskCount} onChange={(e)=>setTaskCount(e.target.value)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="all">All</option>
              </Form.Select>
              </Col>
              <Col>
              <span style={{float:"right"}}>
                <FormControl type="text" placeholder='Searchs' value={search} onChange={(e)=>setSearch(e.target.value)} style={{minWidth:"350px"}} />
              </span>
              
            </Col>
        </Row>
        <Row>
          <Col>
          <div className='table-lg mt-4 px-1' style={{overflowX:"hidden"}}>
            <Table className='largeTable'>
              <thead style={{position:"relative",zIndex:"1", bottom:"10px"}}>
                <tr>
                  <th scope="col" className="border-0">
                    Sr.
                  </th>
                  <th scope="col" className="border-0">
                    Task Title
                  </th>
                  <th scope="col" className="border-0">
                    Start Date
                  </th>
                  <th scope="col" className="border-0">
                    End Date
                  </th>
                  <th scope="col" className="border-0">
                    Campaign
                  </th>
                  <th scope="col" className="border-0">
                    Description
                  </th>
                  <th scope="col" className="border-0">
                    Status
                  </th>
                  <th scope="col" className="border-0">
                    Modify
                  </th>
                  <th scope="col" className="border-0">
                    
                  </th>
                </tr>
              </thead>
              <tbody style={{fontSize:"12px"}}>
                {
                  taskList.filter((task)=>{
                    if(
                      task.title.toLowerCase().includes(search.toLowerCase()) || 
                      task.description.toLowerCase().includes(search.toLowerCase()) || 
                      task.campaign.toLowerCase().includes(search.toLowerCase())
                    ){
                      return task
                    }
                    if(search==""){
                      return task
                    }
                    
                  }).slice(0,taskCount=='5'?5:taskCount=='10'?10:taskCount=='25'?25:taskList.length+1).map((task, index)=>{
                    return(
                      <tr className={task.status=="0"?'':task.status=="1"?'yellow-bg':'green-bg'} key={index}>
                        <td className='py-3 px-4'>{index+1}</td>
                        <td className='py-3' style={{maxWidth:"192px"}}>{task.title}</td>
                        <td className='py-3' style={{minWidth:"92px"}}>{task.start_date}</td>
                        <td className='py-3' style={{minWidth:"92px"}}>{task.end_date}</td>
                        <td className='py-3'>{task.campaign}</td>
                        <td className='py-3' style={{minWidth:"480px", maxWidth:'480px'}}>{task.description}</td>
                        <td className='py-3'>{task.status=='0'?'pending':task.status=='1'?'process':'complete'}</td>
                        <td className='py-3' style={{maxWidth:"119px"}}>
                        <Form.Select size="sm" value={task.status} style={{fontSize:"11px"}} onChange={(e)=>updateTask(task.id, e.target.value, index)}>
                          <option value={'0'}>pending</option>
                          <option value={'1'}>process</option>
                          <option value={'2'}>complete</option>
                        </Form.Select>
                        </td>
                        <td className='p-3'><CloseCircleOutlined className='close-btn' onClick={()=>deleteTask(task.id)} /></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
          </Col>
        </Row>
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={createTask}>
          <Form.Group className="mb-3" >                                                        
            <Form.Control type="text" placeholder="Title" value={taskState.title} onChange={(e)=>setTaskState({...taskState, title:e.target.value})} required />
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Control as="textarea" rows={3} placeholder="Description" value={taskState.description} onChange={(e)=>setTaskState({...taskState, description:e.target.value})} required />
          </Form.Group>
          <Row>
            <Col md={3} className='py-2'>Start Date</Col>
            <Col>
            <Form.Group className="mb-3" >
              <Form.Control type="date" value={taskState.start_date} onChange={(e)=>setTaskState({...taskState, start_date:e.target.value})} required />
            </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3} className='py-2'>End Date</Col>
            <Col>
            <Form.Group className="mb-3" >
              <Form.Control type="date"  value={taskState.end_date} onChange={(e)=>setTaskState({...taskState, end_date:e.target.value})} required />
            </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" >
            <Form.Control type="text" placeholder="Campaign/Reference"  value={taskState.campaign} onChange={(e)=>setTaskState({...taskState, campaign:e.target.value})} required />
          </Form.Group>
          <br/>
          <hr/>
          {!load && <Button className='px-4' style={{float:"right"}} variant="primary" type="submit">Submit</Button>}
          {load && <Button className='px-5' style={{float:"right"}} disabled={load} variant="primary" type="submit">{load?<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Submit"}</Button>}
        </Form>
        </Modal.Body>
      </Modal>
      </div>
        );
}

export default CampaignTasks;