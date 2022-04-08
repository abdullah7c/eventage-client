import React,{ useState, useEffect } from 'react'
import { Table, Row, Col, Form, Button } from 'react-bootstrap'

const ClientAlertView = ({clientList}) => {

    const [rejected, setRejected] = useState(0);
    const [pending, setPending] = useState(0);
    const [cold, setCold] = useState(0);
    const [warm, setWarm] = useState(0);
    const [hot, setHot] = useState(0);
    const [accepted, setAccepted] = useState(0);
    const [tempOne, setTempOne] = useState("to: %name%\r\n50% off all leather laptop bags at www.abcbags.com for the next 48 hours only. Use coupon code HALFOFFTEXT at checkout.\r\n%campaign%");

    useEffect(() => {
        console.log(clientList);
        setStatus()
    }, [])

    const setStatus = () => {
        let status_inverse = 0
        let status_zero = 0
        let status_one = 0
        let status_two = 0
        let status_three = 0
        let status_four = 0
        clientList.forEach((x)=>{
            return x.status_order=='4'?status_four++:x.status_order=='3'?status_three++:x.status_order=='2'?status_two++:x.status_order=='1'?status_one++:x.status_order=='0'?status_zero++:x.status_order=='-1'?status_inverse++:null
        })
        setRejected(status_inverse)
        setPending(status_zero)
        setCold(status_one)
        setWarm(status_two)
        setHot(status_three)
        setAccepted(status_four)
    }
    
  return (
    <div className='clients-assign'>
        <Row className='px-4'>
            <h4>Send Alert </h4>
            <hr style={{width:"97%"}}/>
            <Col md={6} className='table-md  px-0' style={{overflowX:"hidden"}}>
            <Table  className='largeTable'>
                <thead style={{position:"relative",zIndex:"1", bottom:"10px"}}>
                    <tr>
                    <th>#</th>
                    <th>Company Name</th>
                    <th>Contact Persons</th>
                    </tr>
                </thead>
                <tbody style={{fontSize:"12px"}}>
                    {clientList.map((clients, indexA)=>{
                    return(
                    <tr key={indexA}>
                        <td>{indexA+1}</td>
                        <td>{clients.Client.companyName}</td>
                        <td>{clients.Client.Client_Contact_Persons.map((person, indexB)=>{
                            return(<span key={indexB}> {person.fName} {person.lName} { ((clients.Client.Client_Contact_Persons.length)==(indexB+1))?'':'/' }</span>)
                        })}</td>
                    </tr>
                    )
                    })
                    }
                </tbody>
            </Table>
            </Col>
            <Col md={6} className=' px-3'>
            <Form.Group className="mb-3">
            <Form.Label>Select Sender</Form.Label>
            <Form.Select aria-label="Default select example">
                <option>--select--</option>
                <option value="1">Eventage</option>
                <option value="2">Mormac</option>
                <option value="3">Evangeline</option>
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Select Status</Form.Label>
            <Form.Select aria-label="Default select example">
                <option>--select--</option>
                <option value="1">Rejected({rejected})</option>
                <option value="2">Pending({pending})</option>
                <option value="3">Cold({cold})</option>
                <option value="4">Warm({warm})</option>
                <option value="5">Hot({hot})</option>
                <option value="6">Accepted({accepted})</option>
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Select Templete</Form.Label>
            <Form.Select aria-label="Default select example">
                <option>--select--</option>
                <option value="1">Template 1</option>
                <option value="2">Template 2</option>
                <option value="3">Template 3</option>
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Template Body</Form.Label>
                <Form.Control as="textarea" rows={5} value={tempOne} onChange={(e)=>setTempOne(e.target.value)} />
            </Form.Group>
            
            <Button style={{float:"right"}} className="px-4" variant='success'>Send</Button>
            </Col>
            <div className='my-2'></div>
        </Row>
    </div>
  )
}

export default ClientAlertView