import React from 'react'
import { Row, Col, FloatingLabel, Container, Button, Form, Table } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'

const Viewallexhibiton = () => {
    return (
        <>
        <Container>
            <div style={{ display: 'flex', flexDirection: "row", marginTop: "20px" }}>
                <h4>EXHIBITION</h4>
                <Button style={{ marginLeft: "80%" }}>+ Add New</Button>
            </div>
           
            <div style={{ marginTop: "20px", display: "flex" }}>
                <h6>Show Entries</h6>
                <select style={{ width: "50px", marginLeft: "20px" }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <input style={{ marginLeft: "70%", width: "15%" }} placeholder="Search"></input>
            </div >
            <div style={{ marginTop: "20px" }}>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>Sr.</th>
                            <th>Event Name</th>
                            <th>Industry</th>
                            <th>Organizer</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Assigining Details</th>
                            <th>Status</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Mark</td>
                            <td></td>
                            <td>Mark</td>
                            <td>Mark</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Mark</td>
                            <td></td>
                            <td>Mark</td>
                            <td>Mark</td>
                            
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>Mark</td>
                            <td></td>
                            <td>Mark</td>
                            <td>Mark</td>

                        </tr>
                    </tbody>
                </Table>
                <div style={{marginLeft:"30%", marginTop: "20%"}}>
                    <Pagination>
                        <Pagination.First />
                        <Pagination.Prev />
                        <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Ellipsis />

                        <Pagination.Item>{10}</Pagination.Item>
                        <Pagination.Item>{11}</Pagination.Item>
                        <Pagination.Item active>{12}</Pagination.Item>
                        <Pagination.Item>{13}</Pagination.Item>
                        <Pagination.Item disabled>{14}</Pagination.Item>

                        <Pagination.Ellipsis />
                        <Pagination.Item>{20}</Pagination.Item>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination>
                </div>
            </div>


        </Container>

    </>
    )
}

export default Viewallexhibiton
