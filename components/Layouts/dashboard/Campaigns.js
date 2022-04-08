import React from 'react'
import Link from 'next/link'
import {Table} from 'react-bootstrap'
import Router from 'next/router'

const Campaigns = ({campaign}) => {
    React.useEffect(() => {
      console.log(campaign)
    }, [])

  return (
    <div className='campaigns'>            
    <div className="border shadow p-4" style={{backgroundColor: 'white' , borderRadius: '8px'}}>
    <h6><b style={{color: 'rgb(60,141,188)'}}><Link href='/campaigns'><a style={{color: 'rgb(60,141,188)'}}>Campaigns</a></Link></b></h6>
    <hr/>
    <div className="" style={{ height: '48vh'}}>
    <Table className="" style={{width: '100%', backgroundColor: 'white' , borderRadius: '8px'}}>
    <thead className="bg-light">
        <tr>
            <th scope="col" className="border-0"> Sr. </th>
            <th scope="col" className="border-0"> Exhibition Name </th>
            <th scope="col" className="border-0"> Assigning Steps </th>
        </tr>
    </thead>
    <tbody>
        {
            campaign.map((campaigns, index)=>{
                return(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{campaigns.name}</td>
                    <td>
                    <span className='steps'
                        onClick={()=>{
                            Router.push(`/assignclientstepone?id=${campaigns.id}`); 
                        }}
                    > 1st 
                    </span> |
                    <span className='steps'
                        onClick={()=>{
                            Router.push(`assignclientsteptwo?id=${campaigns.id}`); 
                        }}
                    > 2nd </span> |
                    <span className='steps'
                        onClick={()=>{
                            Router.push(`assignclientstepthree?id=${campaigns.id}`); 
                        }}
                    > 3rd </span>
                    </td>
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

export default Campaigns