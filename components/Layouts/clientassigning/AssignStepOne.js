import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Table, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import Cookies from 'js-cookie';
import Router, { useRouter } from 'next/router';

const AssignStepOne = ({clients, assignedClients}) => {

    const router = useRouter();
    const campaignId = router.query.id;

    const [clientList, setClientList] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [allchecked, setAllChecked] = useState(false);
    const [assignedAllchecked, setassignedAllChecked] = useState(false);

    const [load, setLoad] = useState(false);
    const [assignedLoad, setAssignedLoad] = useState(false)

    const [search, setSearch] = useState("");
    const [assignedSearch, setAssignedSearch] = useState("");

    useEffect(() => {
        //console.log()
        getAssignedClients();

      return () => {};
    }, []);

    const getAssignedClients = () => {
        let val = [];
        let valTwo = [];

        assignedClients.forEach((x, index) => { val[index] = {id:x.Client.id, name:x.Client.companyName, city:x.Client.city, check:false, assignId:x.id}; });

        clients.forEach((x, index) => { valTwo[index] = {id:x.id, name:x.companyName, city:x.city, check:false}; });

        function getDifference(array1, array2) {
            return array1.filter(object1 => {
              return !array2.some(object2 => {
                return object1.id === object2.id;
              });
            });
          }
        const difference = [ ...getDifference(val, valTwo), ...getDifference(valTwo, val) ];

        console.log(difference);

        setClientList(difference)
        setSelectedClients(val);
    }

    const addClients = () => {
        setLoad(true);
        let list = [];
        clientList.filter((x)=>{
            if(x.check==true){ list.push(x.id) }
        })
        console.log("Function Hit")
        axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CLIENT_STEP_ONE,
            {
                idList:list,
                agendId:Cookies.get("loginId"),
                campaignId:campaignId
            }).then((x)=> Router.push(`assignclientstepone?id=${campaignId}`));
    }

    const removeClients = () => {
        setAssignedLoad(true);
        let list = [];
        let assignList = [];
        selectedClients.filter((x)=>{
            if(x.check==true){ list.push(x.id); assignList.push(x.assignId) }
        })
        console.log("Function Hit");
        axios.post(process.env.NEXT_PUBLIC_EVE_REMOVE_CLIENT_STEP_ONE, { idList:list, campaignId:campaignId, assignList:assignList }).then(
                (x)=> Router.push(`assignclientstepone?id=${campaignId}`)
            );
    }
  return (
  <div className='clients-assign'>
      <Container>
          <Row>
              <Col className='my-4 mx-2'>
                <span className="back-btn" onClick={()=>Router.push('/campaigns')}> <LeftCircleOutlined className="link-icons" /> Campaigns</span>
                <div className='assigning-btn' style={{float:"right"}} onClick={()=>Router.push(`/assignclientsteptwo?id=${campaignId}`)}>Assigning Step 2 <RightCircleOutlined className="link-icons" /></div>
              </Col>
          </Row>
          <Row>
              <Col md={6}>
                  <div className='border shadow p-5 bg-white' style={{borderRadius:"15px", minHeight:"640px"}}>
                    <Row>
                        <Col><h4>Available Clients </h4></Col> {/* <Col><Button className='px-5' style={{ float:"right" }}>Create New</Button></Col> */}
                    <hr className='my-3' />
                    </Row>
                    <Row>
                        <Col md={6}>
                            <span style={{marginLeft:"0px"}}>
                                <Form.Select size="sm" style={{width:"70px"}}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </Form.Select>
                            </span>
                        </Col>
                        <Col md={6}>
                            <Form.Control style={{float:"right", width:"170px"}} size="sm" placeholder="Search"
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className='table-sm mt-4'>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>
                                <Form.Check type="checkbox" checked={allchecked?true:false} 
                                    onChange={()=>{
                                        let tempState = [...clientList];
                                        if(allchecked==true){
                                            tempState.forEach(x=>{x.check=false});
                                        }else{
                                            tempState.forEach(x=>{x.check=true});
                                        }
                                        setClientList(tempState);
                                        setAllChecked(!allchecked);
                                    }} 
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {clientList.filter((cat)=>{
                                if(search == ""){
                                    return cat
                                } else if(
                                    cat.name.toLowerCase().includes(search.toLowerCase()) || 
                                    cat.city.toLowerCase().includes(search.toLowerCase())
                                    ){
                                    return cat
                                }
                            }).map((client,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{client.name}</td>
                                        <td>{client.city}</td>
                                        <td>
                                            <Form.Check 
                                                type="checkbox" 
                                                checked={client.check?true:false} 
                                                onChange={()=>
                                                    {
                                                        let tempState = [...clientList];
                                                        tempState[index].check=!tempState[index].check
                                                        setClientList(tempState);
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    </Row>
                    <Row>
                        <Col>
                            { !load && <Button className='px-4 mt-4' onClick={()=>addClients()} style={{float:"right"}}>Add Clients</Button>}
                            { load && <Button className='px-5 mt-4' disabled style={{float:"right"}}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button>}
                        </Col>
                    </Row>
                  </div>
              </Col>
              <Col md={6}>
                  <div className=' border shadow p-5 bg-white' style={{borderRadius:"15px", minHeight:"640px"}} >
                    <Row>
                        <Col><h4>Selected Clients</h4></Col> {/* <Col><Button className='px-5' style={{ float:"right" }}>Create New</Button></Col> */}
                    <hr className='my-3' />
                    </Row>
                    <Row>
                        <Col md={6}>
                            <span style={{marginLeft:"0px"}}>
                                <Form.Select size="sm" style={{width:"70px"}}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </Form.Select>
                            </span>
                        </Col>
                        <Col md={6}>
                            <Form.Control style={{float:"right", width:"170px"}} size="sm" placeholder="Search"
                                value={assignedSearch} onChange={(e)=>setAssignedSearch(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row  className='table-sm mt-4'>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>
                            <Form.Check type="checkbox" checked={assignedAllchecked?true:false} 
                                    onChange={()=>{
                                        let tempState = [...selectedClients];
                                        if(assignedAllchecked==true){
                                            tempState.forEach(x=>{x.check=false});
                                        }else{
                                            tempState.forEach(x=>{x.check=true});
                                        }
                                        setSelectedClients(tempState);
                                        setassignedAllChecked(!assignedAllchecked);
                                    }} 
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {selectedClients.filter((cat)=>{
                                if(assignedSearch == ""){
                                    return cat
                                } else if(
                                    cat.name.toLowerCase().includes(assignedSearch.toLowerCase()) || 
                                    cat.city.toLowerCase().includes(assignedSearch.toLowerCase())
                                    ){
                                    return cat
                                }
                            }).map((client,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{client.name}</td>
                                        <td>{client.city}</td>
                                        <td>
                                        <Form.Check 
                                                type="checkbox" 
                                                checked={client.check?true:false} 
                                                onChange={()=>
                                                    {
                                                        let tempState = [...selectedClients];
                                                        tempState[index].check=!tempState[index].check
                                                        setSelectedClients(tempState);
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    </Row>
                    <Row>
                        <Col>
                            { !assignedLoad && <Button className='px-4 mt-4' onClick={()=>removeClients()} style={{float:"right"}}>Remove Clients</Button>}
                            { assignedLoad && <Button className='px-5 mt-4' disabled style={{float:"right"}}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button>}

                        </Col>
                    </Row>
                  </div>
              </Col>
          </Row>
      </Container>
  </div>
  );
};

export default AssignStepOne;