import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Table, Modal, Form, Spinner } from 'react-bootstrap';
import {CloseCircleOutlined,EditOutlined} from '@ant-design/icons';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import aos from 'aos'
const Agents = ({agents, sessionData}) => {

    const { query } = useRouter();

    const [agentList, setAgentList] = useState([])
    const [selectedAgent, setSelectedAgent] = useState('')
    const [viewAgent, setViewAgent] = useState({
        address: "-",
        cnic: "-",
        contact: "-",
        createdAt: null,
        email: "-",
        father_name: "-",
        fax: "-",
        gender: "-",
        id: "0",
        join_date: "-",
        login_status: "-",
        mobile: "-",
        name: "Select User",
        package: "-",
        password: "-",
        photo: "https://res.cloudinary.com/abdullah7c/image/upload/v1643040095/images_djois2.png",
        status: " ",
        type: " ",
        updatedAt: "2022-01-20T15:44:02.000Z"
    })
    const [lgShow, setLgShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);

    const [image, setImage] = useState("");

    const [id,setId] = useState("")
    const [name,setName] = useState('');
    const [f_name,setF_name] = useState('');
    const [cnic,setCnic] = useState('');
    const [email,setEmail] = useState('');
    const [mobile,setMobile] = useState('');
    const [landline,setLandline] = useState('');
    const [address,setAddress] = useState('');
    const [gender,setGender] = useState('male');
    const [designation,setDesignation] = useState('Agent');
    const [salary_package,setSalary_Package] = useState('');
    const [accountPass,setAccountPass] = useState('');
    const [fax,setFax] = useState('');
    const [join_date,setJoin_date] = useState('');
    const [deleteImageUrl, setDeleteImageUrl] = useState('')

    const [checkEdit, setCheckEdit] = useState(false);
    const [change, setChange] = useState(false);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        setAgentList(agents)
        aos.init()
        
        agents.map((x)=>{
            if(x.id==query.agentId){
                setViewAgent(x)
            }
        })
    }, []);

    function uploadImage(){
        let value = ''
        console.log('Image Upload')
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "g4hjcqh7")
        data.append("cloud_name", "abdullah7c")
        value=fetch(`https://api.cloudinary.com/v1_1/abdullah7c/image/upload`, {
            method: "post",
            body: data
        })
            .then(resp => resp.json())
            .then(data => data.url)
            .catch(err => console.log(err));
    
        return value;
    }
    const clearFields=()=>{
        setName('');setF_name('');setEmail('');setMobile('');setLandline('');setAddress('');setGender('male');
        setDesignation('Agent');setSalary_Package('');setAccountPass('');setFax('');setJoin_date('');setCnic('');
    }
    const addAgent = async(e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(process.env.NEXT_PUBLIC_EVE_ADD_AGENTS,{
            name:name, f_name:f_name, cnic:cnic, email:email, mobile:mobile, landline:landline, address:address, join_date:join_date,
            gender:gender, designation:designation, salary_package:salary_package, accountPass:accountPass, image:await uploadImage(), fax:fax
        }).then(()=>{clearFields(); setLgShow(false); Router.push("/agents") });
    }
    const editAgent = async(e)=>{
        e.preventDefault();
        setLoading(true);
        axios.put(process.env.NEXT_PUBLIC_EVE_EDIT_AGENTS,{
            id:id, name:name, f_name:f_name, cnic:cnic, email:email, mobile:mobile, landline:landline, address:address, join_date:join_date,
            gender:gender, designation:designation, salary_package:salary_package, accountPass:accountPass, image:await uploadImage(), fax:fax
        }).then(()=>{setLgShow(false); Router.push(`/agents?agentId=${id}`);clearFields(); });
    }
    const editAgentData = (data) =>{
        console.log(data);
        setCheckEdit(true);

        setId(data.id);setName(data.name);setF_name(data.father_name);setAddress(data.address);setGender(data.gender);
        setCnic(data.cnic);setEmail(data.email);setMobile(data.mobile);setLandline(data.contact);setJoin_date(data.join_date);
        setDesignation(data.type);setSalary_Package(data.package);setAccountPass(data.password);setFax(data.fax);setDeleteImageUrl(data.photo)

        setLgShow(true);
    }
    const deleteAgentData = async(data) => {
        setId(data.id);
        setDeleteImageUrl(data.photo)
        setDeleteShow(true)
    }
    const confirmDelete = async() => {
        await axios.post(process.env.NEXT_PUBLIC_EVE_DELETE_AGENTS,{ id:id, imgUrl:deleteImageUrl }).then(()=>{
            Router.push("/agents");
            setId('');
            setDeleteImageUrl('')
            setDeleteShow(false)
        });
    }

  return (
    <div className='Agents-page' data-aos='fade-right' >
        <div className='agent-section mt-5'>
        <Row className="justify-content-md-center">
            <Col md={5} className='border shadow p-5 mx-3' style={{backgroundColor: 'white' , borderRadius: '8px', maxHeight:"70vh"}} >
            <Row className=''>
                <Col md={6}>
                    <h4>All Agents</h4>
                </Col>
                <Col md={6}>
                    <Button className='px-4' style={{float:"right"}} onClick={() => setLgShow(true)}> Add Agent </Button>
                </Col>
            </Row>
            <hr/>
            <Row className='agentList'>
            {
                agentList.map((agent)=>{
                    return(
                        <Col md={6} key={agent.id} className='mt-3' onClick={()=>{setViewAgent(agent); setSelectedAgent(agent.id)}}>
                            <Row  className={selectedAgent==agent.id?'agent-border-selected':'agent-border'} >
                                <Col md={4} className='my-2'><img src={agent.photo} className='agent-list-img' /></Col>
                                <Col md={5} className='agent-list-detail my-4'>
                                    <div className='agent-list-name'>{agent.name}</div>
                                    <div className='agent-list-email'>{agent.type}</div>
                                </Col>
                                <Col md={3} className='agent-edit'>
                                    <span><EditOutlined className='edit-icon' onClick={()=>editAgentData(agent)} /></span>
                                    <span className='mx-1'></span>
                                    <span><CloseCircleOutlined className='delete-icon' onClick={()=>deleteAgentData(agent)} /></span>
                                </Col>
                            </Row>
                        </Col>
                    )
                })
            }
            </Row>
            </Col>
            <Col md={4} className='border shadow p-5 mx-3' style={{backgroundColor: 'white' , borderRadius: '8px'}} >
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <img src={viewAgent.photo} className='view-agent-photo' />
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md="auto" className='view-name'>{viewAgent.name}</Col>
                </Row>
                <Row className="justify-content-md-center mb-3">
                    <Col md="auto" className='view-type'>{viewAgent.type}({viewAgent.status==1?'Active':'Disabled'})</Col>
                </Row>
                <hr/>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Father{`&apos`}s Name</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.father_name}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>CNIC</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.cnic}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Gender</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.gender}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Joining Date</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.join_date}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Current Package</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.package}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Phone</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.mobile}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Landline</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.contact}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Email</Col>
                    <Col md={7} className='view-left-detail'>{`${viewAgent.email}`}</Col>
                </Row>
                <Row className=''>
                    <Col md={5} className='view-right-detail'>Address</Col>
                    <Col md={7} className='view-left-detail'>{viewAgent.address}</Col>
                </Row>
            </Col>
        </Row>
        </div>
        <Modal
            size="lg"
            show={lgShow}
            onHide={() => {setLgShow(false); setCheckEdit(false)}}
            aria-labelledby="Add Agent"
        >
        <Modal.Header closeButton>
          <Modal.Title id="Agent">
            {checkEdit?'Update Agent':'Create Agent'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-4'>
            <Form onSubmit={checkEdit?editAgent:addAgent}>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Father{`&apos`}s Name</Form.Label>
                            <Form.Control type="text" placeholder="Father's Name" value={f_name} onChange={(e)=>setF_name(e.target.value)}  required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>CNIC</Form.Label>
                            <Form.Control type="text" placeholder="cnic" value={cnic} onChange={(e)=>setCnic(e.target.value)}  required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}  required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control type="text" placeholder="Mobile" value={mobile} onChange={(e)=>setMobile(e.target.value)} required   />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Landline</Form.Label>
                            <Form.Control type="text" placeholder="Landline" value={landline} onChange={(e)=>setLandline(e.target.value)} required   />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}  required  />
                    </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Gender</Form.Label>
                            <Form.Select aria-label="Default select example" value={gender} onChange={(e)=>setGender(e.target.value)} required  >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Designation</Form.Label>
                            <Form.Select aria-label="Default select example" value={designation} onChange={(e)=>setDesignation(e.target.value)} required  >
                            <option value="Agent">Agent</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Package</Form.Label>
                            <Form.Control type="text" placeholder="Agent salary package" value={salary_package} onChange={(e)=>setSalary_Package(e.target.value)}  required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Account Password</Form.Label>
                            <Form.Control type="text" placeholder="Agent password"  value={accountPass} onChange={(e)=>setAccountPass(e.target.value)} required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Fax</Form.Label>
                            <Form.Control type="text" placeholder="Fax" value={fax} onChange={(e)=>setFax(e.target.value)}  required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Joining Date</Form.Label>
                            <Form.Control type="date"  value={join_date} onChange={(e)=>setJoin_date(e.target.value)}  required  />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Photo</Form.Label><br/>
                            {checkEdit && <span><span><Form.Check type="checkbox" label="Change" onChange={()=>{setChange(!change)}} /></span>  <span><input disabled={change?false:true} type="file" onChange={(e) => setImage(e.target.files[0])} required ></input></span></span>}
                            {!checkEdit && <input type="file" onChange={(e) => setImage(e.target.files[0])} required ></input>}
                        </Form.Group>
                    </Col>
                </Row>
                <hr/>
                {loading && <Button className='px-5' type="submit" disabled><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button>}
                {!loading && <Button className='px-5' type="submit">{ checkEdit?'Update':'Submit'}</Button>}
            </Form>
        </Modal.Body>
      </Modal>
      <Modal
            onHide={() => { setDeleteShow(false); setId(''); setDeleteImageUrl(''); }}
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
  );
};

export default Agents;
