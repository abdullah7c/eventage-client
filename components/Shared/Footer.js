import React from 'react'
import { Form,Container } from 'react-bootstrap'

const Footer = () => {
    return (
        <Container fluid={true} className="border text-center" style={{bottom: '0' , position: 'fixed',backgroundColor:"rgba(0, 0, 0, 0.85)", color:"white"}}>
            <Form.Label className="ml-3 mt-1" style={{fontSize: '14px', textAlign:"center"}}>© 2021 <b style={{color: '#3c8dbc'}}>eventage.</b> All rights reserved</Form.Label>
        </Container>
    )
}

export default Footer
