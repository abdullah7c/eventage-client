import { useEffect, useState } from 'react'
import Aos from 'aos'
import 'aos/dist/aos.css'
import axios from 'axios'
import { Row, Col, Container, Button, Form, InputGroup, FormControl, Spinner } from 'react-bootstrap'
import Router from 'next/router'
import Cookies from 'js-cookie';
import Select from 'react-select';

const CampaignModal = (props) => {

    const [ campaignName, setCampaignName ] = useState('');
    const [ organizer, setOrganizer ] = useState('');
    const [ start_date, setStart_date ] = useState('');
    const [ end_date, setEnd_date ] = useState('');
    const [ category, setCategory ] = useState([]);
    const [ venue, setVenue ] = useState('');
    const [ country, setCountry ] = useState('');
    const [ agent, setAgent ] = useState('');
    const [ city, setCity ] = useState('');

    const [id, setId] = useState('');

    const [selectedValue, setSelectedValue] = useState('');

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        Aos.init({duration:500});

        let mainCat = [];
        props.categories.parentCat.forEach((x,one)=>{
            mainCat[one]={label:x.title, options:[]};
            props.categories.childCat.forEach((y)=>{
                if(x.id==y.parentId){
                    mainCat[one].options.push({label:y.title, value:y.id})
                }
            })
        });
        setCategory(mainCat);

        if(props.edit==true){
            setId(props.editCampaign.id);
            setCampaignName(props.editCampaign.name);
            setOrganizer(props.editCampaign.organizer);
            setStart_date(props.editCampaign.start_date);
            setEnd_date(props.editCampaign.end_date);
            setVenue(props.editCampaign.venue);
            setCountry(props.editCampaign.country);
            setAgent(props.editCampaign.assignedAgentId);
            setCity(props.editCampaign.city);
        }
        
      },[])

    const getCategories = () =>{
        let cat = [];
            cat = props.editCampaign.categories.split(',');
            let catValues = [];
            for(let index = 0; index<cat.length-1;index++){
                catValues[index] = {
                    value:cat[index],
                    label:''
                }
                for(let indexTwo = 0; indexTwo<props.categories.childCat.length; indexTwo++){
                    if(catValues[index].value==props.categories.childCat[indexTwo].id){
                        catValues[index]={
                            value:props.categories.childCat[indexTwo].id,
                            label:props.categories.childCat[indexTwo].title
                        }
                    }
                }
            }
            setSelectedValue(catValues)
            return catValues
    }

    const clearFields = () =>{
        setCampaignName('');
        setOrganizer('');
        setStart_date('');
        setEnd_date('');
        setVenue('');
        setCountry('');
        setAgent('');
    }

    const addCampaign = async e =>{
        e.preventDefault()
        setLoading(true)
        await axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CAMPAIGN,{
          name:campaignName,
          organizer:organizer,
          start_date:start_date,
          end_date:end_date,
          category:selectedValue,
          venue:venue,
          city:city,
          country:country,
          addedBy:Cookies.get('loginId'),
          agentId:Cookies.get('type')==='Admin'?agent:Cookies.get('loginId')
        }).then(() => {
            clearFields();
            Router.push('/campaigns');
        })
    }

    const editCampaign = async e =>{
        e.preventDefault();
        setLoading(true);
        await axios.put(process.env.NEXT_PUBLIC_EVE_EDIT_CAMPAIGN,{
          id:id,
          name:campaignName,
          organizer:organizer,
          start_date:start_date,
          end_date:end_date,
          category:selectedValue,
          venue:venue,
          city:city,
          country:country,
          agentId:Cookies.get('type')==='Admin'?agent:Cookies.get('loginId')
        }).then(() => {
            clearFields();
            Router.push('/campaigns');
        })
    }

      return (
        <>
            <Container>
              <form onSubmit={(e)=>{props.edit==true?editCampaign(e):addCampaign(e)}}>
                <Row>
                    <Col md={6}>
                        <Form.Label>Name</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Campaign Name"
                                required
                                value={campaignName}
                                onChange={(e)=>setCampaignName(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Organizer</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Organizer Name"
                                required
                                value={organizer}
                                onChange={(e)=>setOrganizer(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Start Date</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                type="date"
                                aria-label="date"
                                aria-describedby="basic-addon1"
                                required
                                value={start_date}
                                onChange={(e)=>setStart_date(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <Form.Label style={{width: "40%"}}>End Date</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl 
                                type="date"
                                aria-label="date"
                                aria-describedby="basic-addon1"
                                required
                                value={end_date}
                                onChange={(e)=>setEnd_date(e.target.value)}
                            />
                        </InputGroup>
                    </Col>   
                    <Col md={6}>
                    <Form.Label > Category / Industry</Form.Label>
                    
                    <Select
                        defaultValue={props.edit==true?getCategories:null}
                        isMulti
                        name="category"
                        options={category}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={category.find(obj => obj.value == selectedValue)}
                        onChange={(e)=>setSelectedValue(e)}
                    />
                    </Col>
                    <Col md={6}>
                        <Form.Label>Venue</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Venue Details"
                                as="textarea"
                                required
                                value={venue}
                                onChange={(e)=>setVenue(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <Form.Label>City</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="City"
                                required
                                value={city}
                                onChange={(e)=>setCity(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Country</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Country"
                                required
                                value={country}
                                onChange={(e)=>setCountry(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    {Cookies.get('type')=='Admin' &&
                        <Col className='' md={6}>
                            <Form.Label>Assign Agent</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Select required style={{height:"38px"}} defaultValue={'DEFAULT'} 
                                    onChange={(e)=>{ setAgent(e.target.value); }} value={agent}>
                                    <option value="DEFAULT">Select</option>
                                    {
                                        props.agents.map((agent)=>{
                                            return(<option key={agent.id} value={agent.id}>{agent.name}</option>)
                                        })
                                    }
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    }
                </Row>
                {!loading && <Button type='submit' style={{ width: "15%" }}>Submit</Button>}
                {loading && <Button type='submit' disabled style={{ width: "15%" }}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button>}
                </form>
            </Container>
        </>
    )
}

export default CampaignModal