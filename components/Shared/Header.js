import React, { useState, useEffect } from 'react';
import { Nav,Navbar,Container } from "react-bootstrap"
import Cookies from 'js-cookie'
import { Drawer, Menu} from 'antd';
import { BsChevronBarLeft } from "react-icons/bs";
import { IoLogOut,IoPieChartSharp,IoFilterSharp,IoPeople,IoPersonAddSharp } from "react-icons/io5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendarDay, faTasks, faBell, faChartPie, faSignOutAlt, faBars, faListAlt, faDoorOpen, faUsers, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'
import Router from 'next/router'

const { SubMenu } = Menu;

const Header = () => {
    
    const name = Cookies.get('username');
    const type = Cookies.get('type');
    const [visible, setVisible] = useState(false)
    const showDrawer = () => {
        setVisible(true)
    };

    const onClose = () => {
        setVisible(false)
    };


    return (
        <>
             <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container fluid>
            <Nav.Link className='nav_item' style={{fontSize:"30px",marginTop:"-5px"}} onClick={showDrawer} ><BsChevronBarLeft/></Nav.Link>
            <Navbar.Brand className="nav_items_l nav_brand">
                <Nav>
                    <div><Link href="/dashboard">CRM</Link></div>
                </Nav>
            </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <div className="nav_parent">
                        <span><FontAwesomeIcon icon={faUser} className="white" style={{fontSize:"18px"}} /></span>
                        <span style={{fontSize:"16px", position:"relative",top:"3px"}} className='white'> {name}</span>
                        <span style={{fontSize:"12px", position:"relative",top:"3px"}} className='white'> ({type})</span>
                    </div>
                    </Nav>
                        {
                            type==="Admin" && <Nav>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faBell} className="nav_icon"/><Link href="/calendar">Notifications</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faChartPie} className="nav_icon"/><Link href="/graphs">Graphs</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faUser} className="nav_icon"/><Link href="/calendar">Logs</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faSignOutAlt} className="nav_icon"/>
                                    <span style={{color:"white", fontSize:"17px",cursor:"pointer"}}> Logout </span>
                                </div>
                            </Nav>
                        }
                        {
                            type==="Agent" && <Nav>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faCalendarDay} className="nav_icon"/><Link href="/calendar">Calendar</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faTasks} className="nav_icon"/><Link href="/exhibitiontasks">Exhibition Tasks</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faTasks} className="nav_icon"/><Link href="/mytasks">My Tasks</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faChartPie} className="nav_icon"/><Link href="/graphs">Graphs</Link></div>
                                <div className="nav_parent mx-3"><FontAwesomeIcon icon={faSignOutAlt} className="nav_icon"/>
                                    <span style={{color:"white", fontSize:"17px",cursor:"pointer"}}> Logout </span>
                                </div>
                            </Nav>
                        }
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
        
        {/*<Drawer
            title=""
            theme="dark"
            placement={'left'}
            closable={false}
            onClose={onClose}
            visible={visible}
            key={'left'}
        >
        <div className="mt-5">

            
            <div className="mt-5">
            <div style={{marginBottom:"12px"}}>
                <Link href="/dashboard" >
                    <a style={{textDecoration:"none",marginLeft:"-2px",color:"rgba(255, 255, 255, 0.65)"}}><FontAwesomeIcon icon={faBars} className='left-menu-icons'/><span style={{marginLeft:"10px"}}>Dashboard</span></a>
                </Link>
            </div>
            <Menu style={{marginLeft:"-25px"}} theme="dark" dashed={true} defaultSelectedKeys={['1']} mode="inline">
            <SubMenu  key="sub1" icon={<FontAwesomeIcon icon={faListAlt} className='left-menu-icons'/>} title="Categories">
                <Menu.Item key="4"><Link href="/viewcategorylist" ><a style={{marginLeft:"-2px",color:"rgba(0, 0, 0, 0.85)"}}><span style={{marginLeft:"10px"}}>View Category List </span></a></Link></Menu.Item>
            </SubMenu>
            <SubMenu  key="sub2" icon={<FontAwesomeIcon icon={faDoorOpen} className='left-menu-icons'/>} title="Manage Exhibition">
            <Menu.Item key="6"><Link href="/exhibitions" ><a style={{marginLeft:"-2px",color:"rgba(0, 0, 0, 0.85)"}}><span style={{marginLeft:"10px"}}>View All Exhibition</span></a></Link></Menu.Item>
            </SubMenu>
            { type==="Admin" && <SubMenu  key="sub3" icon={<FontAwesomeIcon icon={faUserCircle} className='left-menu-icons'/>} title="Manage Agents">
            <Menu.Item key="7"><Link href="/exhibitions" ><a style={{marginLeft:"-2px",color:"rgba(0, 0, 0, 0.85)"}}><span style={{marginLeft:"10px"}}>View Agents</span></a></Link></Menu.Item>
            </SubMenu>}
            <SubMenu  key="sub4" icon={<FontAwesomeIcon icon={faUsers} className='left-menu-icons'/>} title="Manage Clients">
            <Menu.Item key="8"><Link href="/addnewClient" ><a style={{marginLeft:"-2px",color:"rgba(0, 0, 0, 0.85)"}}><span style={{marginLeft:"10px"}}>Add new client</span></a></Link></Menu.Item>
            <Menu.Item key="9"><Link href="/viewallclient" ><a style={{marginLeft:"-2px",color:"rgba(0, 0, 0, 0.85)"}}><span style={{marginLeft:"10px"}}>View All client</span></a></Link></Menu.Item>
            <Menu.Item key="10"><Link href="/clientrating" ><a style={{marginLeft:"-2px",color:"rgba(0, 0, 0, 0.85)"}}><span style={{marginLeft:"10px"}}>Client Rating</span></a></Link></Menu.Item>
            </SubMenu>
            </Menu>
            <div style={{marginTop:"12px"}}><Link href="/createsystem" ><a style={{marginLeft:"-2px",color:"rgba(255, 255, 255, 0.65)"}}><FontAwesomeIcon icon={faUserPlus} className='left-menu-icons'/><span style={{marginLeft:"10px"}}>Create System User A/C</span></a></Link></div>
        </div>
           
        </div>
        </Drawer> */}
        </>
    );
}

export default Header
