import React from 'react';
import {Row,Col,Container, Table} from 'react-bootstrap'
import aos from 'aos'
import Router from 'next/router'

const AgentLogs = ({sessionData,logData}) => {

    React.useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        aos.init()
        console.log(logData)
        return () => { }
    }, [sessionData])

  return (
    <div>
        <Container data-aos='fade-right' >
        <Row>
        <Col className="p-3 ml-auto mr-auto" xs="11" md="12" >
            <div className="border shadow p-5" style={{backgroundColor: 'white' , borderRadius: '8px'}}>
                <h4>Agent Logs</h4>
                <hr/>
                <div className="overflow-auto m-0 " style={{ height: '50vh'}}>
                <Table responsive >
                    <thead className="bg-light">
                    <tr>
                        <th className="border-0">Sr.</th>
                        <th className="border-0">Name</th>
                        <th className="border-0">Login Date</th>
                        <th className="border-0">Logout Date</th>
                    </tr>
                    </thead>
                    <tbody>
                        {logData.map((x, index)=>{
                            return(
                                <tr key={x}>
                                    <td>
                                        {index+1}
                                    </td>
                                    <td>
                                        {x['Agent.name']}
                                    </td>
                                    <td>
                                        {x.login}
                                    </td>
                                    <td>
                                        {x.logout}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                </div>
            </div>
        </Col>
        </Row>
        </Container>
    </div>
  );
};

export default AgentLogs;