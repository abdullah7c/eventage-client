import React from 'react'
import { Col, Row } from 'react-bootstrap';

const ViewComments = ({campName, campaignDetail, commentList}) => {
  return (
    <div className='clients-assign p-3'>
        <Row className="px-2">
            <Col md={1}> Capmaign: </Col> <Col className="mx-3"> <strong>{campName}</strong> </Col>
            <Col md={1}> Client: </Col> <Col className=''><strong>{campaignDetail.Client.companyName}</strong></Col>
        </Row>
        <div className='p-2' style={{maxHeight:"485px", overflowY:"auto"}}>
        {commentList.map((task)=>{
            return(

                <Row key={task.id} className='task-box p-4'>
                    <Col className='task-title my-2'>{task.comment}</Col>
                    <Row>
                        <Col className='task-heading'>Created At: <span > {task.updatedAt.slice(0,10)} </span></Col>
                    </Row>
                </Row>
            )
        })}
        </div>
        {
            commentList.length<1 &&
                <h3 className='py-4 m-1 text-center' style={{fontWeight:"900", color:"silver" , borderRadius:"5px", border:"1px solid silver"}}> No Comment </h3>
            }
    </div>
  )
}
export default ViewComments