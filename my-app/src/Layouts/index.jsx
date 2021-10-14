import React from 'react';
import { authUserData, logout } from '../store';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LogoutOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import { capitalize } from "lodash"
import { useHistory } from 'react-router-dom'
const { Header, Content, Footer } = Layout;

export default function NavBar(props) {
    const user = authUserData()
    const router = useHistory()
    return (
    <Layout className="layout">
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: "0px" }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="user" icon={<UserOutlined />}>
            {capitalize(user.name)}
          </Menu.Item>
          <Menu.Item onClick={() => router.push("/projects")} key="projects" icon={<FundProjectionScreenOutlined />}>
              Projects
          </Menu.Item>
          <Menu.Item onClick={logout} key="logout" icon={<LogoutOutlined />}>
              Logout
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '10px 10px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          {props.children}
        </div>
      </Content>
      {/* <Footer></Footer> */}
    </Layout>
    )
}

