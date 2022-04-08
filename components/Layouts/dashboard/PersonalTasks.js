import React from 'react'
import Link from 'next/link'
import {Table} from 'react-bootstrap'
import moment from 'moment'

const PersonalTasks = ({personalTasks}) => {
    let date = moment().format('YYYY/MM/DD')
    let currentMonth = moment().format('MM')
    React.useEffect(() => {
      }, [])
  return (
    <div>
    <div className="border shadow p-4" style={{backgroundColor: 'white' , borderRadius: '8px'}}>
    <h6><b style={{color: 'rgb(60,141,188)'}}><Link href='/mytasks'><a style={{color: 'rgb(60,141,188)'}}>Personal Tasks</a></Link></b></h6>
        <hr/>
        <div className='table-md mt-4'>
            <Table responsive className="" style={{width: '100%', backgroundColor: 'white' , borderRadius: '8px'}}>
            <thead className="bg-light">
                <tr>
                <th scope="col" className="border-0">
                    Sr.
                </th>
                <th scope="col" className="border-0">
                    Task Title
                </th>
                <th scope="col" className="border-0">
                    Deadline
                </th>
                <th scope="col" className="border-0">
                    Start Date
                </th>
                </tr>
            </thead>
            <tbody>
                {
                    personalTasks.filter((task)=>{
                        if(task.status!='2'){
                            return task
                        }
                    }).filter((task)=>{
                        if(task.end_date.slice(5,7)<=currentMonth){
                            return task
                        }
                    }).sort((a,b)=>( moment(a.end_date,"YYYY/MM/DD").diff(moment(date,"YYYY/MM/DD"),'days')  - moment(b.end_date,"YYYY/MM/DD").diff(moment(date,"YYYY/MM/DD"),'days') )).map((task, index)=>{
                        return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td style={{maxWidth:"130px"}}>{task.title}</td>
                                <td>
                                    {
                                        (moment(task.end_date,"YYYY/MM/DD").diff(moment(date,"YYYY/MM/DD"),'days')).toString().charAt(0)=='-'?
                                            <span style={{color:"red"}}>{moment(task.end_date,"YYYY/MM/DD").diff(moment(date,"YYYY/MM/DD"),'days').toString().slice(1,10) + " Days Due"}</span>:
                                                moment(task.end_date,"YYYY/MM/DD").diff(moment(date,"YYYY/MM/DD"),'days').toString()=='0'?<span style={{color:"blue"}}>Last Day!</span>:
                                                    moment(task.end_date,"YYYY/MM/DD").diff(moment(date,"YYYY/MM/DD"),'days')+" Days Left"
                                    }
                                </td>
                                <td>{task.start_date}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
            </Table>
            </div>
        </div>
    </div>
  )
}

export default PersonalTasks