import axios from 'axios'
//import cookieCutter from 'cookie-cutter'
import Cookies from 'js-cookie'
import React,{useState,useEffect} from 'react'
import {Form, Button, Container, Row, Col, Alert, Spinner} from 'react-bootstrap'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from "jwt-decode";

const SignIn = ({sessionData}) => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [detailWarning, setDetailWarning] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(sessionData)
        if(sessionData.isLoggedIn==true){
            Router.push('/dashboard')
        }
        return () =>{
            setEmail('')
            setPass('')
            setDetailWarning(false)
            setLoading(false)
        }
    }, [sessionData])

    const login = (e) => {
        setLoading(true)
        e.preventDefault();
        axios.post(process.env.NEXT_PUBLIC_EVE_LOGIN,
            {
                email:email,
                pass:pass
            })
            .then((x)=>{
                console.log(x)
                if(x.data.message=="Success"){
                    //console.log(jwt_decode(x.data.token).username)
                    Cookies.set('token', x.data.token, { expires: 1 })
                    Cookies.set('username', jwt_decode(x.data.token).username, { expires: 1 })
                    Cookies.set('type', jwt_decode(x.data.token).type, { expires: 1 })
                    Cookies.set('loginTime', jwt_decode(x.data.token).loginTime, { expires: 1 })
                    Cookies.set('loginId', jwt_decode(x.data.token).loginId, { expires: 1 })
                    Router.push('/dashboard')
                }else if(x.data.message=="Invalid"){
                    setLoading(false)
                    setDetailWarning(true)
                }
        })
    }

    return (
        <div className='signin_styles' >
            <div className='bg' style={{ height:"100vh",width:"100%", zIndex:"1", position:"absolute"}}>
            <Container >
            
            <Row className="justify-content-md-center my-5">
                <Col className='my-5' md={12}>
                <div className='text-center white'  md={12}>
                    <FontAwesomeIcon className='login-icon' style={{fontSize:"90px"}} icon={faUsers} />
                    <br/>
                    <Form.Text className="text-muted">
                        Lead Management System
                    </Form.Text>
                </div>
                </Col>
                <Col className='mb-5 p-5 box' md={4}>
                
                <div className='text-center' md={12}>
                    <h4 className=''>Sign-in to continue</h4>
                </div>
                
                {detailWarning===true && <div className='my-3'></div>}
                {detailWarning===false && <div className='my-5'></div>}    
                {detailWarning===true && 
                        <Alert variant="danger">
                            Incorrect<strong> Email </strong>or <strong>Password</strong> !
                        </Alert>
                    }
                <Form onSubmit={login}>
                <Row className="justify-content-md-center">
                    <Col md={12}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
                        <Form.Text className="text-muted">
                            We&apos;ll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    </Col>
                    <Col md={12}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required value={pass} onChange={(e)=>setPass(e.target.value)} />
                    </Form.Group>
                    </Col>
                    <Col md={12}>
                        {!loading && <Button className='mt-5' style={{width:"100px"}} variant="dark" type="submit"> Submit </Button>}
                        {loading && 
                        <Button className='mt-5' disabled style={{width:"100px"}} variant="dark" type="submit"> 
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                        </Button>
                        }
                    </Col>
                </Row>
                </Form>
                
                </Col>
            </Row>
            </Container>
            </div>
        </div>
    )
}

export default SignIn