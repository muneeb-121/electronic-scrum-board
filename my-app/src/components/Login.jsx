import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, Alert, Space  } from 'antd';
import { useHistory } from "react-router-dom"
import { authenticateUser, newUser } from '../store';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const tabPanesStyle = {
  display: "flex",
  justifyContent: "center",
}

const Login = () => {
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
      <Tabs centered>
        <TabPane tab="SignIn" key="1">
          <SignIn/>
        </TabPane>
        <TabPane tab="Sign Up" key="2">
          <SignUp/>
        </TabPane>
      </Tabs>
    </Card>
  );
};

const SignIn = () => {
  const [error, setError] = useState("")
  const router = useHistory()

  const onFinish = (values) => {
    try {
      authenticateUser(values.email, values.password, values.role)
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
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email or username"/>
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
          Login
        </Button>
      </Form.Item>
    </Form>
  </Space>
  )
}

const SignUp = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const onFinish = ({ email, username, password }) => {
    try {
      newUser({ email, username, password })
      setError("")
      setSuccess("SignUp successfull!")
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
        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="email"/>
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
        rules={[{ required: true, message: 'Please input your password!' }]}
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
          Login
        </Button>
      </Form.Item>
    </Form>
  </Space>
  )
}

export default Login
