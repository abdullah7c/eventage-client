import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Headers from './Header';
import Cookies from 'js-cookie';
import Router,{ useRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import { faCalendarDay,faTasks,faBell,faChartPie,faSignOutAlt,faUsers, faCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { Nav,Navbar,Container } from "react-bootstrap";
import 
{ TeamOutlined,UserAddOutlined,ApartmentOutlined,ProfileOutlined,AppstoreAddOutlined,UserOutlined,AlignLeftOutlined,
  BellOutlined, FileSearchOutlined, PieChartOutlined, LogoutOutlined, MenuUnfoldOutlined, UnorderedListOutlined, CalendarOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '@fortawesome/fontawesome-svg-core/styles.css'; // Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const Layouts = ({ children }) => {
  const [users, setUsers] = useState([])
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const fetchUsers = async() => {
    const res = await axios.get(process.env.NEXT_PUBLIC_EVE_GET_AGENTS);
    setUsers(res.data);
  }
  useEffect(() => { 
    fetchUsers();
  
  },[]);
  const values = () => {
    let value = '1';
      if(router.pathname === '/dashboard'){ value='1' }
      else if(router.pathname === '/viewcategorylist'){ value='2' }
      else if(router.pathname === '/campaigns'){ value='3' }
      else if(router.pathname === '/agents'){ value='4' }
      else if(router.pathname === '/viewallclient'){ value='5' }
      else if(router.pathname === '/createsystem'){ value='6' }
      else { value='null' }
    return value
  }
  const [keys, setKeys] = useState(values());
  const [LogoutLoad, setLogoutLoad] = useState(false);

  const name = Cookies.get('username');
  const type = Cookies.get('type');

  const toggle = () => {
    setCollapsed(!collapsed)
  };

  const logOut = async() => {
    await axios.post(process.env.NEXT_PUBLIC_EVE_LOGOUT,{id:`${Cookies.get('loginId')}`,loginTime:`${Cookies.get('loginTime')}`})
    Cookies.remove('username');
    Cookies.remove('type');
    Cookies.remove('token');
    Cookies.remove('loginTime');
    Cookies.remove('loginId');
    Router.push('/signin');
  }

    return (
      <Layout className='main-layout'>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <div className='' style={{fontSize:"30px", marginLeft:"22px",marginTop:"3px", marginBottom:"13px"}} onClick={toggle}>
              <AlignLeftOutlined  style={{cursor:"pointer", color:"white"}} />
            </div>
          <Menu className='' theme="dark" mode="inline" defaultSelectedKeys={[keys]}>
            
            <Menu.Item key="1" icon={<ProfileOutlined />}>
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            
            <Menu.Item key="2" icon={<ApartmentOutlined />}>
              <Link href="/viewcategorylist">Categories</Link>
            </Menu.Item>
            
            <Menu.Item key="3" icon={<AppstoreAddOutlined />}>
              <Link href="/campaigns">Campaigns</Link>
            </Menu.Item>
            
            <Menu.Item key="5" icon={<TeamOutlined />}>
              <Link href="/viewallclient">Client Management</Link>
            </Menu.Item>

            {
              type==="Admin" &&
              <>
                <Menu.Item key="4" icon={<UserOutlined />}>
                  <Link href="/agents">Agents</Link>
                </Menu.Item>

                {/* <Menu.Item key="6" icon={<UserAddOutlined />}>
                  <Link href="/createsystem">System User A/C</Link>
                </Menu.Item> */}

                <SubMenu key="sub1" icon={<UserOutlined />} title="Member Status">
                  {
                    users.map((user,index)=>{
                      return(
                      <Menu.Item key={`sub${index+1}`}>
                        <FontAwesomeIcon className={user.login_status=='1'?'log-online':'log-offline'} icon={faCircle}/> {user.name} 
                        <span className="user-type"> ( Agent )</span>
                      </Menu.Item>
                      )
                    })
                  }
                </SubMenu>
              </>
            }
          </Menu>
        </Sider>
        <Layout className="site-layout">
        <Navbar collapseOnSelect expand="lg" style={{backgroundColor:"#001529"}}>
          <Container>
          <Navbar.Brand className="nav_items_l nav_brand">
            <Nav>
                <div className='white'>Welcome</div>
            </Nav>
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" /> 
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
              <div className="nav_parent">
                  <span style={{fontSize:"16px", position:"relative",top:"2px"}} className='white'> {name}</span>
                  <span style={{fontSize:"12px", position:"relative",top:"1px"}} className='white'> ({type})</span>
              </div>
              </Nav>
              <Nav>
                {type==="Agent" && 
                  <div className="nav_parent mx-3">
                    <CalendarOutlined className="nav_icon"/>
                    <Link href="/calendar">Calendar Tasks</Link>
                  </div>
                }
                {type==="Agent" && 
                  <div className="nav_parent mx-3">
                    <AlignLeftOutlined className="nav_icon "/>
                    <Link href="/campaintasks">Campain Tasks</Link>
                  </div>
                }
                {type==="Agent" && 
                  <div className="nav_parent mx-3">
                    <AlignLeftOutlined className="nav_icon "/>
                    <Link href="/mytasks">My Tasks</Link>
                  </div>
                }
                {type==="Admin" && 
                  <div className="nav_parent mx-3">
                    <BellOutlined className="nav_icon"/>
                    <Link href="/notifications">Notifications</Link>
                  </div>
                }
                {type==="Admin" && 
                  <div className="nav_parent mx-3">
                    <UnorderedListOutlined className="nav_icon"/>
                    <Link href="/agentlogs">Agent Logs</Link>
                  </div>
                }
                <div className="nav_parent mx-3">
                  <PieChartOutlined className="nav_icon"/>
                  <Link href="/graphs">Graphs</Link>
                </div>
                <div className="nav_parent mx-3">
                <LogoutOutlined className="nav_icon"/>
                  <span style={{color:"white", fontSize:"17px",cursor:"pointer"}} onClick={()=>{logOut(); setLogoutLoad(true)}}> Logout </span>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 1px',
              padding: 0,
              minHeight: 852,
            }}
          >
           {!LogoutLoad?children:null}
          </Content>
        </Layout>
      </Layout>
    );
}
export default Layouts
// const  Layout = ({ children }) => {
//   //const { data: session } = useSession()
//   // useEffect(() => {
//   //   if(session==null){
//   //     Router.push('/signin')
//   //   }
//   //   console.log(session)
//   // }, [session])
//   return (
//     <>
//       <Header/> 
//       <div className="mb-5 pb-5" style={{ height: 'auto' , minHeight: '85vh' }}>
//         {children}
//       </div>
//       <Footer/>
//     </>
//   )
// }
// export default withRouter(Layout)