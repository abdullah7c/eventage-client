import React,{useState, useEffect} from 'react';
//import AddCategory from './AddCategory'
import { Row, Col, Container, Button, Form, Breadcrumb, Table, Modal, FloatingLabel } from 'react-bootstrap';
import axios from 'axios'
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPen,faEdit } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'
import {CloseCircleOutlined,EditOutlined} from '@ant-design/icons'
import aos from 'aos'

const Viewcategorylist = ({categories, sessionData}) => {

    const [category, setCategory] = useState([])
    const [parentCat, setParentCat] = useState([])
    const [parentList, setParentList] = useState([{
        cat_add_by: "User",
        createdAt: "2021-12-21T11:02:22.000Z",
        desc: "none",
        id: "0",
        parentId: "0",
        status: "1",
        title: "none",
        updatedAt: "2021-12-21T11:02:22.000Z",
    }])

    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setEditCat(false);
        setShow(false);
        setCatId('')
        setCatName('')
        setParentCatName('0')
        setDesc('')
        
    }
    
    const [showDelete, setShowDelete] = useState(false)

    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [editCat, setEditCat] = useState(false)

    const [catId, setCatId] = useState('')
    const [catName, setCatName] = useState('');
    const [parentCatName, setParentCatName] = useState("0")
    const [desc, setDesc] = useState('')

    const [deleteName, setDeleteName] = useState('')
    const [deleteId, setDeleteId] = useState('')
    const [deleteParentId, setDeleteParentId] = useState('')

    useEffect(() => {
        aos.init();
        setCategory(categories);
        setParentCat(categories);
        categories.forEach(x => {
            setParentList(olditems => [...olditems, {
                cat_add_by:x.cat_add_by,
                createdAt:x.createdAt,
                desc:x.desc,
                id:x.id,
                parentId:x.parentId,
                status:x.status,
                title:x.title,
                updatedAt:x.updatedAt
            }]) 
        })
        return () =>{
            setCategory([])
            setParentCat([])
        }
    }, [categories])
    useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        return () => { }
    }, [sessionData])
    //================================== Get Parent Category ====================================

    const getParentCat = (pid) => {
        let val = "-";
        categories.map((x)=>{
            if(x.id==pid){
                val = x.title
            }
        })
        return val
    }
    const addCategory = async(e) => {
        e.preventDefault();
        handleClose()
        //console.log(catName + " " + parentCatName + " " + desc)
        await axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CATEGORY,{
            title:catName,
            desc:desc,
            parentId:parentCatName,
            cat_add_by:'User',
        }).then(()=>{
            
            setCatId('')
            setCatName('')
            setParentCatName('0')
            setDesc('')
            Router.push('./viewcategorylist')
        })
    }
    const DeleteCategory = async() => {
        await axios.post(process.env.NEXT_PUBLIC_EVE_DELETE_CATEGORY,{
            id:deleteId
        }).then(()=>{
            setDeleteName('')
            setDeleteId('')
            setDeleteParentId('')
            handleCloseDelete()
            Router.push('/viewcategorylist')
        })
    }
    const EditCategory = async(e) => {
        e.preventDefault();
        await axios.put(process.env.NEXT_PUBLIC_EVE_EDIT_CATEGORY,{
            id:catId,
            title:catName,
            desc:desc,
            parentId:parentCatName,
            cat_add_by:'User',
        }).then(()=>{
            handleClose()
            setCatId('')
            setCatName('')
            setParentCatName('0')
            setDesc('')
            Router.push('/viewcategorylist')
        })
    }

    return (
        <Container data-aos='fade-right' >
            <div className="mt-1 border shadow p-5" style={{backgroundColor: 'white' , borderRadius: '8px'}}>
            <Row >
                <Col md={6}>
                <h4 className="t-six">Categories</h4>
                </Col>
                <Col md={6}>
                </Col>
            </Row>
            <hr/>
            <Row >
                <Col md={3}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control type="text" placeholder="Search" value={search} onChange={(e)=>setSearch(e.target.value)} />
                </Form.Group>
                </Col>
                <Col md={9}>
                <Button style={{float:"right"}} onClick={handleShow}> <span className='px-3'>Add Category</span></Button>
                </Col>
            </Row>
            <br/>


            <Row className='mt-3' >
                <Col md={12} className='table-md'>
                <Table responsive >
                    <thead>
                    <tr style={{backgroundColor:"silver"}}>
                        <th>Sr.</th>
                        <th >Category</th>
                        <th >Description</th>
                        <th >Main category</th>
                        {/* <th >Status</th> */}
                        <th >Modify</th>
                    </tr>
                    </thead>
                    
                    {
                        parentCat.filter((x)=>{
                            if(x.parentId==="0"){
                                return x
                            }
                        }).filter((task)=>{
                            if(
                              task.title.toLowerCase().includes(search.toLowerCase()) || 
                              task.desc.toLowerCase().includes(search.toLowerCase())
                            ){
                              return task
                            }
                            if(search==""){
                              return task
                            }
                            
                          }).map((x, indexone)=>{
                            return(
                                <tbody key={indexone}>
                                <tr style={{backgroundColor:""}}>
                                    <td ></td>
                                    <td ><strong>{x.title}</strong></td>
                                    <td ><strong>{x.desc}</strong></td>
                                    <td >{getParentCat(x.parentId)}</td>
                                    {/* <td >{x.status}</td> */}
                                    <td >
                                        <EditOutlined className='modify-icon-green'  onClick={()=>{
                                            handleShow()
                                            setEditCat(true)
                                            setCatId(x.id)
                                            setCatName(x.title)
                                            setParentCatName(x.parentId)
                                            setDesc(x.desc)

                                        }} /> 
                                        <CloseCircleOutlined className='modify-icon-red'  onClick={()=>{
                                            handleShowDelete();
                                            setDeleteName(x.title)
                                            setDeleteId(x.id)
                                            setDeleteParentId(getParentCat(x.parentId))
                                        }}/>
                                    </td>
                                </tr>
                                {
                                    category.filter((z)=>{
                                        if(z.parentId==x.id){
                                            return z
                                        }
                                    }).map((y,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td >{index+1}</td>
                                                <td >{y.title}</td>
                                                <td >{y.desc}</td>
                                                <td >{getParentCat(y.parentId)}</td>
                                                {/* <td >{y.status}</td> */}
                                                <td >
                                                    <EditOutlined className='modify-icon-green'  onClick={()=>{
                                                        handleShow()
                                                        setEditCat(true)
                                                        setCatId(y.id)
                                                        setCatName(y.title)
                                                        setParentCatName(y.parentId)
                                                        setDesc(y.desc)

                                                    }} /> 
                                                    <CloseCircleOutlined className='modify-icon-red'  onClick={()=>{
                                                        handleShowDelete();
                                                        setDeleteName(y.title)
                                                        setDeleteId(y.id)
                                                        setDeleteParentId(getParentCat(y.parentId))
                                                    }}/>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            )
                        })
                    }
                    
                </Table>
                </Col>
            </Row>

            <Modal
                show={show}
                size="lg"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editCat && <div>Edit Category</div> }{!editCat && <div>Add New Category</div> }</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-4'>

                <Form onSubmit={editCat==true?EditCategory:addCategory}>
                    <Row >
                        <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" placeholder="Enter Category Name" value={catName} onChange={(e)=>setCatName(e.target.value)} />
                        </Form.Group>
                        </Col>
                        <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Parent Category</Form.Label><br/>
                        <Form.Select aria-label="Default select example" value={parentCatName} onChange={(e)=>setParentCatName(e.target.value)}>
                            {
                                parentList.filter((x)=>{
                                    if(x.parentId==="0"){
                                        return x
                                    }
                                }).map((x,index)=>{
                                    return(
                                        <option key={index} value={x.id}>{x.title}</option>
                                    )
                                })
                            }
                        </Form.Select>
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3">
                            <Form.Control as="textarea" placeholder="Leave Description here" 
                                value={desc} onChange={(e)=>setDesc(e.target.value)} style={{ height: '120px' }} 
                            />
                        </FloatingLabel>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                </Modal.Body>
            </Modal>

            <Modal
                show={showDelete}
                
                onHide={handleCloseDelete}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                            {
                                deleteParentId!="-" && 
                                    <h5>Delete  <strong>{deleteName}</strong> from <strong>{deleteParentId}</strong>? </h5>
                            }
                            {
                                deleteParentId=="-" &&
                                    <h5>Delete  <strong>{deleteName}</strong> And it&apos;s Sub Categories? </h5>
                            }
                            
                </Modal.Body>
                <Modal.Footer><Button variant="danger" onClick={DeleteCategory}>Confirm</Button></Modal.Footer>
            </Modal>
            </div>
        </Container>
    )
}
export default Viewcategorylist