import React from 'react'
import {Row,Col} from 'react-bootstrap'

const ShowClientInfo = ({clientData, categories}) => {

    const getCategoryName = (ids) => {
        ids = ids.split(',').slice(0,-1)
        let values = ''
        for(let i = 0; i<ids.length;i++){
            for(let j = 0; j<categories.childCat.length;j++){
                if(categories.childCat[j].id==ids[i]){
                    values = values + categories.childCat[j].title+ ", "
                }
            }
        }
        //console.log(values.slice(0,-2))
        return values.slice(0,-2)
    }

    //console.log(clientData)
    return (
        <div style={{maxHeight:'500px',overflowY:"auto", overflowX:"hidden", padding:"10px"}}>
            <Row style={{paddingRight:'35px',paddingLeft:"20px"}}>
                <Col md={5}><span>Company: <strong className='mx-2'> {clientData.companyName}</strong></span></Col>
                <Col md={5}><span>Owner&apos;s Name: <strong className='mx-2'> {clientData.ownerName}</strong></span></Col>
                <hr/>
                <Col md={5}><span>Catrgories: <strong className='mx-2'> {getCategoryName(clientData.category)}</strong></span></Col>
                <Col md={5}><span>Website: <strong className='mx-2'> {clientData.website}</strong></span></Col>
                <hr/>
                <Col md={5}><span>Products: <strong className='mx-2'> {clientData.products}</strong></span></Col>
                <Col md={5}><span>Address: <strong className='mx-2'> {clientData.address}</strong></span></Col>
                <hr/>
                <Col md={5}><span>City: <strong className='mx-2'> {clientData.city}</strong></span></Col>
                <Col md={5}><span>Country: <strong className='mx-2'> {clientData.country}</strong></span></Col>
                <hr/>
                <Col md={12}><span>Lead Source: <strong className='mx-2'> {clientData.leadSource}</strong></span></Col><hr/>
            </Row>
            {
                    clientData.Client_Contact_Persons.map((x,index)=>{
                        return(
                            <Row key={index} style={{paddingRight:'10px',paddingLeft:"20px"}}>
                                <Col md={12} className="my-3" style={{backgroundColor:"silver"}}><strong>Contact Person {index+1}</strong></Col>
                                <Row style={{paddingRight:'35px',paddingLeft:"20px"}}>
                                    <Col md={5}> <span>Name: <strong className='mx-2'> {x.fName} {x.lName}</strong></span> </Col>
                                    <Col md={5}><span>Designation: <strong className='mx-2'> {x.designation}</strong></span></Col>
                                    <hr/>
                                    <Col md={12}> <span>Email: <strong className='mx-2'> {x.email}</strong></span> </Col>
                                    <hr/>
                                    <Col md={5}><span>Mobile: <strong className='mx-2'> {x.mobile.slice(0,-2)}</strong></span></Col>
                                    <Col md={5}><span>LandLine: <strong className='mx-2'> {x.landLine.slice(0,-2)}</strong></span></Col>
                                    <hr/>
                                    <Col md={12}><span>Ext: <strong className='mx-2'> {x.ext.slice(0,-2)}</strong></span></Col>
                                    <hr/>
                                </Row>
                                
                            </Row>
                        )
                    })
                }
        </div>
    )
}

export default ShowClientInfo
