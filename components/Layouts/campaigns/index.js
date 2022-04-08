import React, {useState,useEffect} from 'react';
import { Row, Col, Modal, Container, Button, Table, Form, FormControl } from 'react-bootstrap';
import Aos from 'aos';
import axios from 'axios';
import CampaignModal from './CampaignModal';
import Router from 'next/router';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { addCampaignName, addCampaignId } from '/redux/Actions_Reducers/campaignDetails';

const Campaigns = ({campaigns, agents, categories, sessionData}) => {

    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editCampaign, setEditCampaign] = useState({});
    const [deleteShow, setDeleteShow] = useState(false);
    const [id, setId] = useState('');
    useEffect(() => {
        Aos.init();
    }, []);

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        return () => { }
    }, [sessionData])

    const handleClose = () => {setShow(false); setEdit(false); setEditCampaign({})};
    const handleShow = () => setShow(true);

    const getCategoryName = (ids) => {
        ids = ids.split(',').slice(0,-1)
        let values = ''
        for(let i = 0; i<ids.length;i++){
            for(let j = 0; j<categories.childCat.length;j++){
                if(categories.childCat[j].id==ids[i]){
                    values = values + categories.childCat[j].title + ", "
                }
            }
        }
        return values.slice(0,-2);
    }
    const confirmDelete = async() => {
        await axios.post(process.env.NEXT_PUBLIC_EVE_DELETE_CAMPAIGN,{id:id}).then(()=>Router.push('/campaigns'));
    }

    return (
        <>
        <Container data-aos="fade-right" className='campaigns'>
            <div className='my-5 border shadow p-5' style={{backgroundColor: 'white' , borderRadius: '8px'}}>
            <Row >
                <Col><h4>All Campaigns</h4></Col>
                <Col><Button className='px-5' style={{ float:"right" }} onClick={handleShow}>Create New</Button></Col>
                
            </Row>
           <hr/>
           <Row>
               <Col>
               <span style={{marginLeft:"0px"}}>
                    <Form.Select size="sm" style={{width:"70px"}}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </Form.Select>
                </span>
               </Col>
               <Col>
                <FormControl style={{width:"50%", float:'right'}} placeholder='Search' />
               </Col>
           </Row>
            <div style={{ marginTop: "30px" }}>
            <Table responsive >
                    <thead className="">
                    <tr>
                        <th>Sr.</th>
                        <th>Event Name</th>
                        <th>Industry</th>
                        <th>Organizer</th>
                        <th>Date</th>
                        <th>Venue</th>
                        <th>Assigning Steps</th>
                        <th>Status</th>
                        <th>Modify</th>
                    </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign,index)=>{
                            return(
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{campaign.name}</td>
                                    <td>{getCategoryName(campaign.categories)}</td>
                                    <td>{campaign.organizer}</td>
                                    <td>{campaign.start_date}</td>
                                    <td>{campaign.venue}</td>
                                    <td>
                                        <span className='steps'
                                            onClick={()=>{
                                                // dispatch(addCampaignName(campaign.name));
                                                // dispatch(addCampaignId(campaign.id));
                                                Router.push({pathname:'/assignclientstepone', query:{id:campaign.id}}); 
                                            }}
                                        > 1st 
                                        </span> |
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
                                    <td>{campaign.status=='1'?'Active':'Disabled'}</td>
                                    <td>
                                        <EditOutlined className='modify-green' onClick={()=>{setEdit(true);setShow(true); setEditCampaign(campaign)}} />
                                        <CloseCircleOutlined className='modify-red' onClick={()=>{setDeleteShow(true); setId(campaign.id)}} />
                                    </td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                <Modal.Title className='p-2'>{!edit?'Add Campaign':'Edit Campaign'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CampaignModal edit={edit} editCampaign={editCampaign} agents={agents} categories={categories} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                onHide={() => { setDeleteShow(false); setId(''); }}
                keyboard={false}
                show={deleteShow}
                backdrop="static"
            >
            <Modal.Header closeButton>
            <Modal.Title id="Agent">
                Confirmation
            </Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-4'>
            <h4>Are you sure you want to delete?</h4>
            </Modal.Body>
            <Modal.Footer><Button variant="danger" onClick={confirmDelete}>Confirm</Button></Modal.Footer>
        </Modal>
            </div>
        </Container>
    </>
    )
}

export default Campaigns