import React from 'react'
import Router from 'next/router'

const Main = ({sessionData}) => {
    
    React.useEffect(() => {
        
    if(sessionData.isLoggedIn==true){
        Router.push('/dashboard')
    }else if(sessionData.isLoggedIn==false){
        Router.push('/signin')
    }

    return () => {

    }
}, [sessionData])

    return (
        <div>
            
        </div>
    )
}

export default Main
