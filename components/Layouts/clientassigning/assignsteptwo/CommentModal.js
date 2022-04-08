import React, { useEffect, useState } from 'react'
import { Col, Row, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios'
import Cookies from 'js-cookie';
import Router, {useRouter} from 'next/router'

const CommentModal = (props) => {

  const router = useRouter();
  const id = router.query.id;

  const[comment, setComment] = useState('')

  useEffect(() => {
    console.log(props)
  }, [])
  

  const createComment = (e) => {
    e.preventDefault();
    axios.post(process.env.NEXT_PUBLIC_EVE_ADD_CAMPAIGN_COMMENT,
      {
        comment:comment, clientId:props.campaignDetail.ClientId,
        campaignId:props.campaignDetail.CampaignId, agentId:Cookies.get("loginId"), clientCampaignAssignId:props.campaignDetail.id
      }
    ).then(()=>{
          Router.push(`assignclientsteptwo?id=${id}`);
    })
  }

  return (
    <div style={{maxHeight:"500px"}}>
      <Form onSubmit={createComment} className="p-3">
            <Row>
                <h3 className=''>Add A Comment</h3>
            </Row>
            <br/>
            <Row>
                <Col md={4}><div className='task-fonts'>Campaign :</div></Col>
                <Col>{props.campName}</Col>
            </Row>
            <hr/>
            <Row>
            <Col md={4}><div className='task-fonts'>Company :</div></Col>
                <Col>{props.campaignDetail.Client.companyName}</Col>
            </Row>
            <hr/>
            <Row>
                <Col md={4}><div className='task-fonts'>Comment:</div></Col>
            </Row>
            <Row>
                <Col className='mt-2'>
                    <Form.Group className="" controlId="formBasicComment">
                      <Form.Control as="textarea" rows={3} style={{maxHeight:"100px"}} value={comment} onChange={(e)=>setComment(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <div>
              <Button style={{float:"right"}} className='mt-3 px-4' type="submit" >Submit</Button>
            </div>
        </Form>
    </div>
  )
}

export default CommentModal