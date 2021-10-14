import React from 'react';
import { authUserData, logout } from '../store';
import { allProjects } from '../store/projects';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LogoutOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import { capitalize } from "lodash"
import { useHistory, useLocation } from 'react-router-dom'
const { Header, Content } = Layout;

export default function NavBar(props) {
    const user = authUserData()
    const { projects } = allProjects(user.guid)
    const router = useHistory()
    const location = useLocation()

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
      <Content style={{ padding: '60px 10px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
         { projects ? 
            location.pathname.split("/").map((x, idx) => <Breadcrumb.Item key={"bread_crumb_"+idx}>{capitalize(getName(projects,x))}</Breadcrumb.Item>)
          : null}
        </Breadcrumb>
        <div className="site-layout-content">
          {props.children}
        </div>
      </Content>
    </Layout>
    )
}

function getName (projects, string) {
  const projectName = projects.find(x => x.guid === string)
  if (projectName) return projectName.name
  else return string
}

