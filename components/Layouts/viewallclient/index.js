import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Button, Form, Modal, Table, FloatingLabel } from 'react-bootstrap'
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrashAlt, faPen, faEdit, faPlusSquare, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { CloseCircleOutlined, EditOutlined, InfoCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import { useSetState } from 'react-use';
import axios from 'axios'
import Router from 'next/router'
import ShowClientInfo from './ShowClientInfo';
import Cookies from 'js-cookie';
import aos from 'aos'
import CsvView from './CsvView';
import { CSVLink, CSVDownload } from "react-csv";

const Viewallclient = ({ categories, countryCity, clients, exportList, sessionData }) => {

    const [state, setState] = useSetState({
        contactPersonList: [{ fName: '', lName: '', designation: '', email: '', contact: [{ mobile: '', landLine: '', ext: '' }] }],
        clientList: [], // shows the list of clients
        companyName: '',
        ownerName: '',
        website: '',
        products: '',
        address: '',
        leadSource: '',
        memberOf: '',
        country: '',
        city: ''
    })
    const [editId, setEditId] = useState('')
    const [lgShow, setLgShow] = useState(false);
    const [Category, setCategory] = useState([])
    const [selectedValue, setSelectedValue] = useState('');
    const [countries, setCountries] = useState('');
    const [cities, setCities] = useState('');

    const [infoShow, setInfoShow] = useState(false)
    const [clientData, setClientData] = useState([])

    const [editCat, setEditCat] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([])

    const [deleteList, setDeleteList] = useState([])
    const [csvView, setCsvView] = useState(false);

    const [csvData, setCsvData] = useState([]);
    // const csvData = [
    //     ["firstname", "lastname", "email"],
    //     ["Ahmed", "Tomi", "ah@smthing.co.com"],
    //     ["Raed", "Labes", "rl@smthing.co.com"],
    //     ["Yezzi", "Min l3b", "ymin@cocococo.com"]
    //   ];

    useEffect(() => {
        aos.init();
        setState({ clientList: clients });
        let mainCat = [], mainCities = [], mainCountries = [];

        categories.parentCat.forEach((x, one) => {
            mainCat[one] = { label: x.title, options: [] };
            categories.childCat.forEach((y) => {
                if (x.id == y.parentId) {
                    mainCat[one].options.push({ label: y.title, value: y.id })
                }
            })
        });
        countryCity.cities.forEach((x, one) => {
            mainCities[one] = { label: x.city, value: x.id };
        });
        countryCity.countries.forEach((x, one) => {
            mainCountries[one] = { label: x.abbr, value: x.id };
        });
        //createExportList()
        setCities(mainCities)
        setCountries(mainCountries)
        setCategory(mainCat)

        return () => {
            setCities([]);
            setCountries([]);
            setCategory([]);
            setState({ clientList: [] });
        }
    }, [categories, countryCity, clients])

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        return () => { }
    }, [sessionData])
    const createExportList = (event, done) => {

    let val = [
        ['CompanyName','OwnerName','Website','Products','Address','City','Country','LeadSource','MemberOf','Category','firstName','lastName','designation','email','mobile','landline','ext']
    ];
    exportList.map((x,index)=>{
        val[index+1]=[
            `${x.companyName}`,`${x.ownerName}`,`${x.website}`,`${x.products}`,`${x.address}`,`${x.city}`,`${x.country}`,`${x.leadSource}`,
            `${x.memberOf}`,`${getCategoryName(x.category)}`,`${x['Client_Contact_Persons.fName']}`,`${x['Client_Contact_Persons.lName']}`,`${x['Client_Contact_Persons.designation']}`,
            `${x['Client_Contact_Persons.email']}`,`${x['Client_Contact_Persons.mobile']}`,`${x['Client_Contact_Persons.landLine']}`,`${x['Client_Contact_Persons.ext']}`
        ]
    });
    setCsvData(val)
    done(true);
    }

    const addClient = (e) => {
        e.preventDefault();
        if (state.country === '' || state.city === '' || selectedValue === '') {
            alert("Select Location")
        } else {
            axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CLIENT, {
                category: selectedValue,
                companyName: state.companyName,
                ownerName: state.ownerName,
                website: state.website,
                products: state.products,
                leadSource: state.leadSource,
                memberOf: state.memberOf,
                address: state.address,
                city: state.city,
                country: state.country,
                contactPersonList: state.contactPersonList,
                addedBy: Cookies.get('loginId'),
                assignedAgentId: Cookies.get('loginId')
            }
            ).then(() => {
                setLgShow(false);
                Router.push('/viewallclient');
            })
        }
    }
    const updateClient = (e) => {
        e.preventDefault();
        if (state.country === '' || state.city === '' || selectedValue === '') {
            alert("Select Location")
        } else {
            //console.log(deleteList)
            let values = [];
            values = state.contactPersonList;
            for (let i = 0; i < state.contactPersonList.length; i++) {
                if (typeof values[i].id === 'undefined') {
                    values[i].id = '0'
                }
            }
            //console.log(values)
            axios.put(process.env.NEXT_PUBLIC_EVE_EDIT_CLIENT, {
                editId: editId,
                category: selectedValue,
                companyName: state.companyName,
                ownerName: state.ownerName,
                website: state.website,
                products: state.products,
                leadSource: state.leadSource,
                memberOf: state.memberOf,
                address: state.address,
                city: state.city,
                country: state.country,
                contactPersonList: state.contactPersonList,
                deleteList: deleteList
            }
            ).then(() => {
                setLgShow(false);
                setDeleteList([])
                Router.push('/viewallclient');
            })
        }
        //console.log(selectedValue)
    }
    const deleteClient = (id, name) => {
        //console.log(id)
        var x = window.confirm(`Are you sure to Delete ${name} ?`);
        if (x) {
            axios.post(process.env.NEXT_PUBLIC_EVE_DELETE_CLIENT, { id: id })
            alert("Client Deleted")
            Router.push('/viewallclient')
        }
        else
            return false;

    }
    const incrementPersonList = () => {
        // setContactPersonList((x)=>[...x, {fName:'', lName:'', designation:'', email:'', contact:[{mobile:'', landLine:'', ext:''}]}])
        // console.log(contactPersonList)
        let val = state.contactPersonList
        val.push({ fName: '', lName: '', designation: '', email: '', contact: [{ mobile: '', landLine: '', ext: '' }] })
        setState({ contactPersonList: val })
    }
    const incContact = (index) => {
        let val = state.contactPersonList
        if (val[index].contact.length < 3) {
            val[index].contact.push({ mobile: '', landLine: '', ext: '' })
        }
        setState({ contactPersonList: val })
    }
    const decContact = (index) => {
        let val = state.contactPersonList
        if (val[index].contact.length > 1) {
            val[index].contact.pop()
        }
        setState({ contactPersonList: val })
    }
    const removeItem = (index) => {
        let value = [];
        value = state.contactPersonList;
        //console.log(value[index].id)
        value.splice(index, 1)
        setState({ contactPersonList: value })
    }
    const info = (client_data) => {
        setClientData(client_data)
    }
    const edit = (clients_data) => {
        setEditId(clients_data.id)
        let clientList = [];
        let contact_list = [];
        let landLineList = [];
        let extList = [];
        let cat = [];
        setEditCat(true)

        cat = clients_data.category.split(',')
        let catValues = [];

        for (let index = 0; index < cat.length - 1; index++) {
            catValues[index] = {
                value: cat[index],
                label: ''
            }
            for (let indexTwo = 0; indexTwo < categories.childCat.length; indexTwo++) {
                if (catValues[index].value == categories.childCat[indexTwo].id) {
                    catValues[index] = {
                        value: categories.childCat[indexTwo].id,
                        label: categories.childCat[indexTwo].title
                    }
                }
            }
        }

        setSelectedCategories(catValues)
        setSelectedValue(catValues)

        setState({
            companyName: clients_data.companyName, ownerName: clients_data.ownerName,
            website: clients_data.website, products: clients_data.products,
            address: clients_data.address, leadSource: clients_data.leadSource,
            memberOf: clients_data.memberOf, country: { label: clients_data.country, value: 0 },
            city: { label: clients_data.city, value: 0 }
        })
        for (let index = 0; index < clients_data.Client_Contact_Persons.length; index++) {
            contact_list = clients_data.Client_Contact_Persons[index].mobile.split(', ')
            landLineList = clients_data.Client_Contact_Persons[index].landLine.split(', ')
            extList = clients_data.Client_Contact_Persons[index].ext.split(', ')
            clientList[index] = {
                id: clients_data.Client_Contact_Persons[index].id,
                fName: clients_data.Client_Contact_Persons[index].fName,
                lName: clients_data.Client_Contact_Persons[index].lName,
                designation: clients_data.Client_Contact_Persons[index].designation,
                email: clients_data.Client_Contact_Persons[index].email,
                contact: []
            }
            for (let indexTwo = 0; indexTwo < contact_list.length - 1; indexTwo++) {
                clientList[index].contact[indexTwo] = { mobile: contact_list[indexTwo], landLine: landLineList[indexTwo], ext: extList[indexTwo] }
            }
        }
        setState({ contactPersonList: clientList })
    }
    const getCategoryName = (ids) => {
        ids = ids.split(',').slice(0, -1)
        let values = ''
        for (let i = 0; i < ids.length; i++) {
            for (let j = 0; j < categories.childCat.length; j++) {
                if (categories.childCat[j].id == ids[i]) {
                    values = values + categories.childCat[j].title + ", "
                }
            }
        }
        //console.log(values.slice(0,-2))
        return values.slice(0, -2)
    }
    const deletingIds = (record) => {
        //console.log(record.id)
        setDeleteList((oldItems) => [...oldItems, record.id])
    }

    const setFirstName = (e, i) => { let val = state.contactPersonList; val[i].fName = e.target.value; setState({ contactPersonList: val }); }
    const setLastName = (e, i) => { let val = state.contactPersonList; val[i].lName = e.target.value; setState({ contactPersonList: val }); }
    const setDesignation = (e, i) => { let val = state.contactPersonList; val[i].designation = e.target.value; setState({ contactPersonList: val }); }
    const setEmail = (e, i) => { let val = state.contactPersonList; val[i].email = e.target.value; setState({ contactPersonList: val }); }
    const setMobile = (e, i, j) => { let val = state.contactPersonList; val[i].contact[j].mobile = e.target.value; setState({ contactPersonList: val }); }
    const setLandLine = (e, i, j) => { let val = state.contactPersonList; val[i].contact[j].landLine = e.target.value; setState({ contactPersonList: val }); }
    const setExt = (e, i, j) => { let val = state.contactPersonList; val[i].contact[j].ext = e.target.value; setState({ contactPersonList: val }); }

    return (
        <>
            <Container className='client_styles' data-aos='fade-right' >
                <div className="mt-5 border shadow p-5" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                    <Row>
                        <Col md={6}>
                            <h4>Clients</h4>
                        </Col>
                        <Col md={6}>
                            <Button className='px-4' style={{ float: "right" }} onClick={() => setLgShow(true)}> Add Client </Button>
                            <Button className='mx-2 px-4' variant="dark" style={{ float: "right" }} onClick={() => {setLgShow(true); setCsvView(true);}}> Import </Button>
                            <Button className='px-4' variant="dark" style={{ float: "right" }}>
                                <CSVLink data={csvData} asyncOnClick={true} onClick={createExportList} style={{color:'white'}}>Export</CSVLink>
                            </Button>
                            
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <span style={{ marginLeft: "0px" }}>
                                <Form.Select size="sm" style={{ width: "70px" }}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </Form.Select>
                            </span>
                        </Col>
                        <Col>
                            <Form.Control style={{ width: "50%", float: 'right' }} placeholder='Search' />
                        </Col>
                    </Row>
                    <br />
                    <div className='table-sm-1 mt-3'>
                        <Table className='tableFixHead'>
                            <thead>
                                <tr>
                                    <th>Sr.</th>
                                    <th>Company Name</th>
                                    <th>Categories</th>
                                    <th>City</th>
                                    <th>Rating</th>
                                    <th>Modify</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                state.clientList.map((x, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.companyName}</td>
                                        <td>{getCategoryName(x.category)}</td>
                                        <td>{x.city}</td>
                                        <td>*****</td>
                                        <td>
                                            <span >
                                                <SolutionOutlined className='modify-asign-camp' />
                                            </span> |
                                            <span>
                                                <InfoCircleOutlined className='modify-info' onClick={() => { setInfoShow(true), info(x) }} />
                                            </span> |
                                            <span>
                                                <EditOutlined className='modify-edit' onClick={() => { setLgShow(true), edit(x) }} />
                                            </span> |
                                            <span>
                                                <CloseCircleOutlined className='modify-red' onClick={() => { deleteClient(x.id, x.companyName) }} />
                                            </span>
                                        </td>
                                    </tr>
                                )
                                })
                                }
                            </tbody>
                        </Table>
                    </div >
                </div>
            </Container>
            <Modal
                fullscreen={csvView?false:true}
                show={lgShow}
                onHide={() => {
                    setLgShow(false); setEditCat(false); setCsvView(false);
                    setState({
                        contactPersonList: [{ fName: '', lName: '', designation: '', email: '', contact: [{ mobile: '', landLine: '', ext: '' }] }],
                        companyName: '',
                        ownerName: '',
                        website: '',
                        products: '',
                        address: '',
                        leadSource: '',
                        memberOf: '',
                        country: '',
                        city: ''
                    })
                }}
                aria-labelledby="example-modal-sizes-title-lg"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <span className=''>{csvView?'Import Clients':'Add Client'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {!csvView &&
                    <div style={{ overFlowY: "auto", height: "auto", padding: "20px" }}>
                        <Form onSubmit={editCat==true ? updateClient : addClient}>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Enter Company Name</Form.Label>
                                        <Form.Control type="text" placeholder="*" required
                                            value={state.companyName} onChange={(e) => setState({ companyName: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Enter Owner&apos;s Name</Form.Label>
                                        <Form.Control type="text" placeholder="*" required
                                            value={state.ownerName} onChange={(e) => setState({ ownerName: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Select Category</Form.Label>
                                        <Select
                                            defaultValue={editCat == true ? selectedCategories : null}
                                            isMulti
                                            name="category"
                                            options={Category}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={Category.find(obj => obj.value == selectedValue)}
                                            onChange={(e) => setSelectedValue(e)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Website</Form.Label>
                                        <Form.Control type="text" placeholder="*" required
                                            value={state.website} onChange={(e) => setState({ website: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Products</Form.Label>
                                        <FloatingLabel controlId="floatingTextarea" label="Description*" className="mb-3">
                                            <Form.Control as="textarea" placeholder="Products" required style={{ height: '120px' }}
                                                value={state.products} onChange={(e) => setState({ products: e.target.value })}
                                            />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Office Address</Form.Label>
                                        <FloatingLabel controlId="floatingTextarea" label="Address*" className="mb-3">
                                            <Form.Control as="textarea" placeholder="Products" required style={{ height: '120px' }}
                                                value={state.address} onChange={(e) => setState({ address: e.target.value })}
                                            />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>City</Form.Label>
                                        <Select
                                            name="colors"
                                            options={cities}
                                            value={state.city}
                                            onChange={(e) => setState({ city: e })}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Country</Form.Label>
                                        <Select
                                            defaultValue={'Country'}
                                            name="colors"
                                            options={countries}
                                            value={state.country}
                                            onChange={(e) => setState({ country: e })}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Lead Source</Form.Label>
                                        <Form.Control type="text" placeholder="*" required
                                            value={state.leadSource} onChange={(e) => setState({ leadSource: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Member of</Form.Label>
                                        <Form.Control type="text" placeholder="*" required
                                            value={state.memberOf} onChange={(e) => setState({ memberOf: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h6 className='mt-3'>Contact Persons {state.contactPersonList.length > 9 ? state.contactPersonList.length : '0' + state.contactPersonList.length}
                                <span><FontAwesomeIcon className="mx-3" style={{ cursor: "pointer" }} icon={faPlus} onClick={incrementPersonList} /></span>
                            </h6>
                                <hr/>
                            <div style={{ maxHeight: "330px", overflowX: "hidden", overflowY: "auto" }}>
                                {state.contactPersonList.map((x, index) => {
                                    return (
                                        <Row key={index + 1} className="my-4">
                                            <Col md={1}>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Text className="text-muted">First Name</Form.Text>
                                                    <Form.Control type="text" placeholder="*" required
                                                        value={state.contactPersonList[index].fName} onChange={(e) => setFirstName(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={1}>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Text className="text-muted">Last Name</Form.Text>
                                                    <Form.Control type="text" placeholder="*" required
                                                        value={state.contactPersonList[index].lName} onChange={(e) => setLastName(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Text className="text-muted">Designation</Form.Text>
                                                    <Form.Control type="text" placeholder="*" required
                                                        value={state.contactPersonList[index].designation} onChange={(e) => setDesignation(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Text className="text-muted">Email</Form.Text>
                                                    <Form.Control type="email" placeholder="*" required
                                                        value={state.contactPersonList[index].email} onChange={(e) => setEmail(e, index)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                {x.contact.map((y, indexTwo) => {
                                                    return (
                                                        <Row key={`${index}${indexTwo}`}>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                                    <Form.Text className="text-muted">Mobile #</Form.Text>
                                                                    <Form.Control type="text" placeholder="*" required
                                                                        value={state.contactPersonList[index].contact[indexTwo].mobile} onChange={(e) => setMobile(e, index, indexTwo)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                                    <Form.Text className="text-muted">Land Line #</Form.Text>
                                                                    <Form.Control type="text" placeholder="*" required
                                                                        value={state.contactPersonList[index].contact[indexTwo].landLine} onChange={(e) => setLandLine(e, index, indexTwo)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                                    <Form.Text className="text-muted">Ext #</Form.Text>
                                                                    <Form.Control type="text" placeholder="*" required
                                                                        value={state.contactPersonList[index].contact[indexTwo].ext} onChange={(e) => setExt(e, index, indexTwo)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    )
                                                })}
                                            </Col>
                                            <Col md={2} className="my-4" >
                                                <span><FontAwesomeIcon className="mx-3" style={{ cursor: "pointer" }} icon={faPlus} onClick={() => incContact(index)} /></span>
                                                <span><FontAwesomeIcon style={{ color: "crimson", cursor: "pointer" }} icon={faMinus} onClick={() => decContact(index)} /></span>
                                            </Col>
                                            <Col md={1} className="" >
                                                {
                                                    state.contactPersonList.length > 1 &&
                                                    <span style={{ color: "crimson", cursor: "pointer" }} icon={faMinus} onClick={() => {
                                                        removeItem(index);
                                                        editCat == true ? deletingIds(x) : null
                                                    }} >
                                                        Remove
                                                    </span>
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })
                                }
                            </div>
                            <Button variant="primary" type="submit">
                                {editCat==true ? `Update` : `Submit`}
                            </Button>
                        </Form>
                    </div>
                }
                {csvView &&
                    <>
                        <h5>CSV Upload</h5>
                        <CsvView categories={categories.childCat} />
                    </>
                }
                </Modal.Body>
            </Modal>
            <Modal show={infoShow} onHide={()=> setInfoShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title><span className='mx-4'>Client Details</span></Modal.Title>
                </Modal.Header>
                <Modal.Body> <ShowClientInfo clientData={clientData} categories={categories} /> </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=> setInfoShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Viewallclient