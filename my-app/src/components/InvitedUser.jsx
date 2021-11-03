import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Tabs, Alert, Space, message  } from 'antd';
import { Link, useHistory, useParams } from "react-router-dom"
import { authenticateUser, newUser } from '../store';
import { addToResourceList, updateResourceFromList } from '../store/common';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { getInviteData } from '../store/invites';
import { useForm } from 'antd/lib/form/Form';

const { TabPane } = Tabs;

const tabPanesStyle = {
  display: "flex",
  justifyContent: "center",
}

const Login = () => {
  const { inviteId } = useParams()
  const [userData, setUserData] = useState(null)
  const [inviteData, setInviteData] = useState(null)

  function getUserData(guid) {
      try {
        const { user, invite } = getInviteData(guid)
        console.log(user, invite)
        setUserData(user)
        setInviteData(invite)
      } catch (error) {
        message.error(error.message)
      }
  }
  
  useEffect(() => {
      getUserData(inviteId)
      return () => {
        setUserData(null)
        setInviteData(null)
      }
  }, [inviteId])

  return (
    <Card 
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: "500px",
        minHeight: "350px"
      }}
    >
    <h3>
    {"You can join the project by" + (userData ? " authentcating." : " registrting new account.")}
    <span style={{ display: "block" }}>Or <Link to="/login">Go to Home</Link></span>
    </h3>
      <Tabs centered activeKey={ userData ? "1" : "2"}>
        <TabPane key="1">
          <SignIn inviteData={inviteData} />
        </TabPane>
        <TabPane key="2">
          <SignUp inviteData={inviteData} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

const SignIn = (props) => {
  const [error, setError] = useState("")
  const router = useHistory()
  const [form] = useForm()

  useEffect(() => {
    form.setFieldsValue({ email: props?.inviteData?.email })
    return () => {
      form.setFieldsValue({})
    }
}, [props])

  const onFinish = (values) => {
    try {
      const newUserData = authenticateUser(values.email, values.password)
      addToResourceList("accessList", props.inviteData.projects.map(x => ({
        projectGuid: x,
        userGuid: newUserData.guid,
        role: "collaborator",
      })))
      updateResourceFromList("invites", props.inviteData.guid, { status: "completed" })
      setError("")
      router.push("/projects")
    } catch (error) {
      setError(error.message)          
    }
  }
  return (
  <Space direction="vertical" style={tabPanesStyle}>
    {error ? 
      <Alert
        message={error}
        type="error"
        showIcon
        closable
        onClose={()=>setError("")}
      /> : null}
    <Form
      name="signin"
      form={form}
      labelCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        shouldUpdate={false}
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input readOnly onBlur={() => form.setFieldsValue({ email: props.inviteData.email })} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email or username"/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="password" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" className="submit">
          Join
        </Button>
      </Form.Item>
    </Form>
  </Space>
  )
}

const SignUp = (props) => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form] = useForm()
  const history = useHistory()

  useEffect(() => {
      form.setFieldsValue({ email: props?.inviteData?.email })
      return () => {
        form.setFieldsValue({})
      }
  }, [props])

  const onFinish = ({ email, username, password, name }) => {
    try {
      const newUserData = newUser({ email, username, password, name })
      addToResourceList("accessList", props.inviteData.projects.map(x => ({
        projectGuid: x,
        userGuid: newUserData.guid,
        role: "developer",
      })))
      updateResourceFromList("invites", props.inviteData.guid, { status: "completed" })
      authenticateUser(newUserData.email, newUserData.password)
      setError("")
      setSuccess("SignUp successfull!")
      form.resetFields()
      history.push("/projects")
    } catch (error) {
      setError(error.message)    
      setSuccess("")      
    }
  }
  return (
  <Space direction="vertical" style={tabPanesStyle}>
    {error ? 
      <Alert
        message={error}
        type="error"
        showIcon
        closable
        onClose={()=>setError("")}
      /> : null}

    {success ? 
      <Alert
        message={success}
        type="success"
        showIcon
        closable
        onClose={()=>setSuccess("")}
    /> : null}
    <Form
      form={form}
      name="signup"
      labelCol={{ span: 8 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input readOnly onBlur={() => form.setFieldsValue({ email: props?.inviteData?.email })} prefix={<MailOutlined className="site-form-item-icon" />} placeholder="email"/>
      </Form.Item>

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your full name!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="full name"/>
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="username"/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }, { min: 8, message: "Password should contain 8 atleast characters"}]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="password" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" className="submit">
          Join
        </Button>
      </Form.Item>
    </Form>
  </Space>
  )
}

export default Login