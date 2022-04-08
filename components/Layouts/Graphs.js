import React, { useEffect, useState, useRef } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
import Aos from 'aos'
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official'
import ReactToPrint from 'react-to-print';

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}
const Graphs = ({graphs, sessionData}) => {
    const inputRef = useRef(null);
    const [campaignId, setCampaignId] = useState('');
    const [campaignList, setCampaignList] = useState([]);
    const [graphValues, setGraphValues] = useState({ accepted:0.0, hot:0.0, warm:0.0, cold:0.0, pending:0.0, denied:0.0 });
    const [clientStatus, setClientStatus] = useState({ accepted:0, hot:0, warm:0, cold:0, pending:0, denied:0 });
    const [deniedClientValues, setDeniedClientValues] = useState({ 
        Participation_rejected_by_TDAP:0, Yearly_Subsidy_Quota_availed:0, Exhibiting_elsewhere:0, Junk_Lead:0, No_Budget:0, No_Govt_Funding:0,
        Not_Relevant:0, Out_of_Business:0, Personal_Problem:0, Stand_Location:0, Visa_Problem:0, Distributors_present_in_region:0, Visiting_only:0,
        Political_problem_in_region:0
    });
    const [acceptedList, setAcceptedList] = useState([]);
    const [totalClients, setTotalClients] = useState(0);
    const [totalDeniedClients, setTotalDeniedClients] = useState(0);
    useEffect(() => {
        Aos.init({duration:500});
        console.log(graphs)
        createCampaignList()
      }, [])
    useEffect(() => {
        if(sessionData.isLoggedIn==false){
            Router.push('/signin')
        }
        return () => { }
    }, [sessionData])
    const createCampaignList = () => {
        let val = []
        graphs.forEach((camp, index)=>{
            val[index] = {
                id:camp.id,
                title:camp.name
            }
        });
        console.log(val)
        setCampaignList(val)
    }
    const options = {
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.2f} %'
            },
            colors: ['#80ff80', '#ff8400', '#1aadce', '#f1d104', '#01152d', '#910000']
            }
        },
        series: [{
            name: 'Status',
            colorByPoint: true,
            data: [
            {
                name: 'Accepted',
                y: graphValues.accepted,
                sliced: true,
                selected: true
            },
            {
                name: 'Hot',
                y: graphValues.hot,
            },
            {
                name: 'Cold',
                y: graphValues.cold,
            },
            {
                name: 'Warm',
                y: graphValues.warm,
            },
            {
                name: 'Pending',
                y: graphValues.pending,
            },
            {
                name: 'Denied',
                y: graphValues.denied,
            },
            ],
            type:'pie'
        }],
        exporting: {
            chartOptions: {
              title: {
                text: 'export title'
              },
            }
          }
    };
    const selectCampaign = (id) => {
        setCampaignId(id);
        if(id!=''){
            let values = graphs.find((value)=>{
                if(value.id==id){
                    return value.Client_Campaign_Assigns
                }
            })
            let tempState = {accepted:0.0, hot:0.0, warm:0.0, cold:0.0, pending:0.0, denied:0.0};
            let tempStateTwo = {accepted:0, hot:0, warm:0, cold:0, pending:0, denied:0};
            let acceptedClientList = [];
            let tempDeniedClientList = {
                Participation_rejected_by_TDAP:0, Yearly_Subsidy_Quota_availed:0, Exhibiting_elsewhere:0, Junk_Lead:0, No_Budget:0, No_Govt_Funding:0,
                Not_Relevant:0, Out_of_Business:0, Personal_Problem:0, Stand_Location:0, Visa_Problem:0, Distributors_present_in_region:0, Visiting_only:0,
                Political_problem_in_region:0
            }
            let percentPerStatus = 100/(values.Client_Campaign_Assigns.length==0?'none':values.Client_Campaign_Assigns.length);
            let tempTotalDeniedClients = 0;
            let minDenial = 0;
            
            setTotalDeniedClients(minDenial);
            values.Client_Campaign_Assigns.forEach((status)=>{
                if(status.status_order==="-1"){
                    minDenial+=1;
                    tempState.denied = tempState.denied + percentPerStatus;
                    tempStateTwo.denied = tempStateTwo.denied + 1;
                    tempTotalDeniedClients= tempTotalDeniedClients+ 1;
                    status.ClientDeniedReasonId=='1'?tempDeniedClientList.Participation_rejected_by_TDAP+=1:status.ClientDeniedReasonId=='2'?tempDeniedClientList.Yearly_Subsidy_Quota_availed+=1:
                    status.ClientDeniedReasonId=='3'?tempDeniedClientList.Exhibiting_elsewhere+=1:status.ClientDeniedReasonId=='4'?tempDeniedClientList.Junk_Lead+=1:
                    status.ClientDeniedReasonId=='5'?tempDeniedClientList.No_Budget+=1:status.ClientDeniedReasonId=='6'?tempDeniedClientList.No_Govt_Funding+=1:
                    status.ClientDeniedReasonId=='7'?tempDeniedClientList.Not_Relevant+=1:status.ClientDeniedReasonId=='8'?tempDeniedClientList.Out_of_Business+=1:
                    status.ClientDeniedReasonId=='9'?tempDeniedClientList.Personal_Problem+=1:status.ClientDeniedReasonId=='10'?tempDeniedClientList.Stand_Location+=1:
                    status.ClientDeniedReasonId=='11'?tempDeniedClientList.Visa_Problem+=1:status.ClientDeniedReasonId=='12'?tempDeniedClientList.Distributors_present_in_region+=1:
                    status.ClientDeniedReasonId=='13'?tempDeniedClientList.Visiting_only+=1:status.ClientDeniedReasonId=='14'?tempDeniedClientList.Political_problem_in_region+=1:0

                }else if(status.status_order==="0"){
                    tempState.pending = tempState.pending + percentPerStatus;
                    tempStateTwo.pending = tempStateTwo.pending + 1;
                }else if(status.status_order==="1"){
                    tempState.cold = tempState.cold + percentPerStatus;
                    tempStateTwo.cold = tempStateTwo.cold + 1;
                }else if(status.status_order==="2"){
                    tempState.warm = tempState.warm + percentPerStatus;
                    tempStateTwo.warm = tempStateTwo.warm + 1;
                }else if(status.status_order==="3"){
                    tempState.hot = tempState.hot + percentPerStatus;
                    tempStateTwo.hot = tempStateTwo.hot + 1;
                }else if(status.status_order==="4"){
                    tempState.accepted = tempState.accepted + percentPerStatus;
                    tempStateTwo.accepted = tempStateTwo.accepted + 1;
                    acceptedClientList.push({name:status.Client.companyName})
                }
            })
            setDeniedClientValues(tempDeniedClientList)
            console.log(tempDeniedClientList)
            setTotalDeniedClients(tempTotalDeniedClients)
            values.Client_Campaign_Assigns.length==0?setGraphValues({ accepted:0.0, hot:0.0, warm:0.0, cold:0.0, pending:0.0, denied:0.0}):setGraphValues(tempState)
            setTotalClients(values.Client_Campaign_Assigns.length)
            values.Client_Campaign_Assigns.length==0?setClientStatus({ accepted:0, hot:0, warm:0, cold:0, pending:0, denied:0}):setClientStatus(tempStateTwo)
            setAcceptedList(acceptedClientList)
        }
        else{
            setGraphValues({ accepted:0.0, hot:0.0, warm:0.0, cold:0.0, pending:0.0, denied:0.0 });
            setDeniedClientValues({
                Participation_rejected_by_TDAP:0, Yearly_Subsidy_Quota_availed:0, Exhibiting_elsewhere:0, Junk_Lead:0, No_Budget:0, No_Govt_Funding:0,
                Not_Relevant:0, Out_of_Business:0, Personal_Problem:0, Stand_Location:0, Visa_Problem:0, Distributors_present_in_region:0, Visiting_only:0,
                Political_problem_in_region:0
            });
            setTotalDeniedClients(0);
        }
        
    }
    const optionsTwo = {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.2f}%'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<b>{point.y:.2f}%</b> of total ${totalDeniedClients} <br/>`
        },
        xAxis: {
          categories: [
            'Participation rejected by TDAP', 'Yearly Subsidy Quota availed', 'Exhibiting elsewhere', 'Junk Lead',
            'No Budget', 'No Govt Funding', 'Not Relevant', 'Out of Business', 'Personal Problem', 'Stand Location',
            'Visa Problem', 'Distributors present in region','Visiting only', 'Political problem in region'
        ]},
        series: [{
          name:'Total',
          type: 'column',
          colorByPoint: true,
          data: [
            (deniedClientValues.Participation_rejected_by_TDAP/totalDeniedClients)*100,
            (deniedClientValues.Yearly_Subsidy_Quota_availed/totalDeniedClients)*100,
            (deniedClientValues.Exhibiting_elsewhere/totalDeniedClients)*100,
            (deniedClientValues.Junk_Lead/totalDeniedClients)*100,
            (deniedClientValues.No_Budget/totalDeniedClients)*100,
            (deniedClientValues.No_Govt_Funding/totalDeniedClients)*100,
            (deniedClientValues.Not_Relevant/totalDeniedClients)*100,
            (deniedClientValues.Out_of_Business/totalDeniedClients)*100,
            (deniedClientValues.Personal_Problem/totalDeniedClients)*100,
            (deniedClientValues.Stand_Location/totalDeniedClients)*100,
            (deniedClientValues.Visa_Problem/totalDeniedClients)*100,
            (deniedClientValues.Distributors_present_in_region/totalDeniedClients)*100,
            (deniedClientValues.Visiting_only/totalDeniedClients)*100,
            (deniedClientValues.Political_problem_in_region/totalDeniedClients)*100
        ],showInLegend: false}]}
    const optionsThree = {
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.2f}%'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<b>{point.y:.2f}%</b> of total ${totalDeniedClients} <br/>`
        },
        xAxis: {
          categories: [
            'Participation rejected by TDAP', 'Yearly Subsidy Quota availed', 'Exhibiting elsewhere', 'Junk Lead',
            'No Budget', 'No Govt Funding', 'Not Relevant', 'Out of Business', 'Personal Problem', 'Stand Location',
            'Visa Problem', 'Distributors present in region','Visiting only', 'Political problem in region'
        ]},
        series: [{
          name:'Total',
          type: 'column',
          colorByPoint: true,
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],showInLegend: false}]}

    return (
    <div data-aos="fade-right" style={{maxHeight:"88vh", overflow:"auto"}}>
        <Container className='border shadow mt-3 p-5 bg-white' style={{borderRadius:"12px"}}>
        <Row>
          <Col md={1}>
            <h3>Graph</h3>
          </Col>
          <Col>
            <ReactToPrint
                content={() =>inputRef}
                trigger={() => <button className="btn btn-dark btn-sm mt-1">Print to PDF!</button>}
            />
          </Col>
          <Col>
              <h6 className='mt-2' style={{float:"right"}}>Select Campaign</h6>
          </Col>
          <Col>
            <Form.Select  className='mt-1' value={campaignId} onChange={(e)=>selectCampaign(e.target.value)}>
            <option value={''} >--select--</option>
            {
            campaignList.map((list) => {
                return(<option value={list.id} key={list.id}>{list.title}</option>)
            })
            }
            </Form.Select>
          </Col>
        </Row>
        </Container>
        <Container className='border shadow mt-3 p-5 bg-white' style={{borderRadius:"12px", minHeight:"640px"}} ref={(response) => (inputRef = response)}>
            <h3 className='text-center'>Campaign</h3>
            <hr/>
        <Row className='p-2'>
            <Col>
                <HighchartsReact highcharts={Highcharts}  options={options} />
            </Col>
            <Col>
            <Row>
                <h5 className='mb-4 mt-2'>Client Summary</h5>
            </Row>
            <Row>
                <Col>
                    <div className='top-bottom-border p-2'>Total Clients <span style={{float:'right'}}>{totalClients}</span></div>
                    <div className='bottom-border p-2'>Accepted Clients <span style={{float:'right'}}>{clientStatus.accepted}</span></div>
                    <div className='bottom-border p-2'>Hot Clients <span style={{float:'right'}}>{clientStatus.hot}</span></div>
                    <div className='bottom-border p-2'>Warm Clients <span style={{float:'right'}}>{clientStatus.warm}</span></div>
                    <div className='bottom-border p-2'>Cold Clients <span style={{float:'right'}}>{clientStatus.cold}</span></div>
                    <div className='bottom-border p-2'>Pending Clients <span style={{float:'right'}}>{clientStatus.pending}</span></div>
                    <div className='bottom-border p-2'>Denied Clients <span style={{float:'right'}}>{clientStatus.denied}</span></div>
                </Col>
                <Col>
                    <div className='top-bottom-border p-2'><span>Sr.</span><span className='px-3'>Client Name</span></div>
                    {acceptedList.map((clients, index)=>{
                        return(<div className='bottom-border p-2' key={index}><span>{index+1}</span><span className='px-3'>{clients.name}</span></div>)
                    })}
                </Col>
            </Row>
            </Col>
        </Row>
        <Row>
            <Col><h3 className='text-center'>{totalDeniedClients} Total Deiend Clients</h3></Col>
        </Row>
        <Row>    
            <Col md={12}>
                <HighchartsReact highcharts={Highcharts}  options={totalDeniedClients==0?optionsThree:optionsTwo} />
            </Col>
            <Col>
            <Row>
                <h5 className='mb-4 mt-2'>Client Summary</h5>
            </Row>
            <Row>
                <Col>
                    <div className='top-bottom-border p-2'>Total Clients <span style={{float:'right'}}>{totalDeniedClients}</span></div>
                    <div className='bottom-border p-2'>Participation rejected by TDAP <span style={{float:'right'}}>{ deniedClientValues.Participation_rejected_by_TDAP}</span></div>
                    <div className='bottom-border p-2'>Yearly Subsidy Quota availed <span style={{float:'right'}}>{deniedClientValues.Yearly_Subsidy_Quota_availed }</span></div>
                    <div className='bottom-border p-2'>Exhibiting elsewhere <span style={{float:'right'}}>{deniedClientValues.Exhibiting_elsewhere }</span></div>
                    <div className='bottom-border p-2'>Junk Lead <span style={{float:'right'}}>{deniedClientValues.Junk_Lead }</span></div>
                    <div className='bottom-border p-2'>No Budget <span style={{float:'right'}}>{deniedClientValues.No_Budget }</span></div>
                    <div className='bottom-border p-2'>No Govt Funding <span style={{float:'right'}}>{deniedClientValues.No_Govt_Funding }</span></div>
                    <div className='bottom-border p-2'>Not Relevant <span style={{float:'right'}}>{deniedClientValues.Not_Relevant }</span></div>
                    <div className='bottom-border p-2'>Out of Business <span style={{float:'right'}}>{deniedClientValues.Out_of_Business }</span></div>
                    <div className='bottom-border p-2'>Personal Problem <span style={{float:'right'}}>{deniedClientValues.Personal_Problem }</span></div>
                    <div className='bottom-border p-2'>Stand Location <span style={{float:'right'}}>{deniedClientValues.Stand_Location }</span></div>
                    <div className='bottom-border p-2'>Visa Problem <span style={{float:'right'}}>{deniedClientValues.Visa_Problem }</span></div>
                    <div className='bottom-border p-2'>Distributors present in region <span style={{float:'right'}}>{deniedClientValues.Distributors_present_in_region }</span></div>
                    <div className='bottom-border p-2'>Visiting only <span style={{float:'right'}}>{ deniedClientValues.Visiting_only}</span></div>
                    <div className='bottom-border p-2'>Political/Export problem in region <span style={{float:'right'}}>{deniedClientValues.Political_problem_in_region }</span></div>
                </Col>
            </Row>
            </Col>
        </Row>
        </Container>
    </div>
    )
}

export default Graphs
