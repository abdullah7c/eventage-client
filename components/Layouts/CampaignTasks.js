
import React, { useEffect, useState } from 'react'
import {Col , Row , Container , Form, Table} from 'react-bootstrap';
import Aos from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios';

const CampaignTasks = ({tasks, sessionData}) =>{

  const [taskList, setTaskList] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState("all");
  
  useEffect(() => {
    Aos.init({duration:500})
    setTaskList(tasks.result)
    setCampaignList(tasks.campaign)
    console.log(tasks)
  }, [])

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
        Router.push('/signin')
    }
    return () => { }
}, [sessionData])

  const updateTask = async(id, status, index) => {
    console.log(id)
    if(status=="pending"){
      await axios.post(process.env.NEXT_PUBLIC_EVE_UPDATE_CAMPAIGN_TASKS,{id:id}).then((x)=>{
        let tempState = [...taskList];
        tempState[index].status = "completed"
        setTaskList(tempState)
      })
    }
  }

  return(
      <div data-aos="fade-right">
      <Container className='border shadow mt-3 p-5 bg-white' style={{borderRadius:"12px", minHeight:"640px"}}>
        <Row>
          <h3>Campaign Tasks</h3>
        </Row>
        <hr/>
        <Row>
          <Col md={1}>
              <Form.Select>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">All</option>
              </Form.Select>
              </Col>
              <Col>
              <span style={{float:"right"}}>
              <Form.Select style={{minWidth:"350px"}}  onChange={(e)=>setSelectedCamp(e.target.value)}>
                <option value="all">All</option>
                  {campaignList.map((camp, index)=>{
                    return(<option key={camp.id} value={camp.id}>{camp.name}</option>)
                  })}
              </Form.Select>
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
                    Status
                  </th>
                  <th scope="col" className="border-0">
                    Modify
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  taskList.filter((task)=>{
                    if(task.CampaignId==selectedCamp){
                      return task
                    }
                    if(selectedCamp=="all"){
                      return task
                    }
                  }).filter((task)=>{
                    if(task.status=="deleted"){
                      return null
                    }else{
                      return task
                    }
                  }).map((task, index)=>{
                    return(
                      <tr key={index} className={task.status=="pending"?'':task.status=="completed"?'green-bg':''}>
                        <td className='py-3 px-4'>{index+1}</td>
                        <td className='py-3'><div>{task.title}</div><div className='grey' style={{fontSize:"11px"}}>{task['Client.companyName']}</div></td>
                        <td className='py-3'>{task.start_date}</td>
                        <td className='py-3'>{task.end_date}</td>
                        <td className='py-3'>{task['Campaign.name']}</td>
                        <td className='py-3'>{task.status}</td>
                        <td className='px-3'>
                        <Form.Select size="sm" onChange={()=>updateTask(task.id, task.status, index)}>
                          <option value="" disabled selected>Action</option>
                          <option value="complete">Complete</option>
                        </Form.Select>
                        </td>
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
      </div>
        );
}

export default CampaignTasks;