import React, { useEffect, useState } from "react";
import Board from 'react-trello'
import { readProjectData, updateProjectData } from "../store/projects"
import { useParams, useHistory } from 'react-router-dom'
import { Card, Typography, Popconfirm, message, Form, Input, DatePicker, Button, Row, Col, Select, Tag } from "antd"
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from "moment";
const { Paragraph, Text } = Typography;
const { Option } = Select;

const MainBoard = () => {

  const components = {
    Card: CustomCard,
    NewCardForm: NewCardForm,
    AddCardLink: () => null
  }

  const router = useHistory()

  const { projectId } = useParams()
  const [projectBoardData, setProjectBoardData] = useState(null)

  function onDataChange(data) {
    updateProjectData(projectId, "board", data)
    setProjectBoardData(data)
  }

  useEffect(() => {
    try {
      const { board } = readProjectData(projectId)
      setProjectBoardData(board)
    } catch (error) {
      router.push("/projects")      
    }
  }, [projectId])
  
  return (
    projectBoardData ? <Board
      style={{ backgroundColor: "white", overflow: "auto" }}
      cardDraggable={true}
      collapsibleLanes={true}
      editable={true}
      hideCardDeleteIcon={false}
      onDataChange={onDataChange}
      data={projectBoardData} 
      components={components}
    /> : null
  )
}


const CustomCard = (props) => {
  return (
    <Card 
        size="small"
        style={{ width: 250, margin: "3px 0px 3px 0px" }}
        title={<Paragraph style={{ whiteSpace: "break-spaces" }} editable={{ onChange: (value) => props.onChange({ ...props, title: value}) }}>{props.title}</Paragraph>} 
        extra={
          <Select size="small" value={props.priority} onChange={(priority) => props.onChange({ ...props, priority })}>
            <Option value="High"><Tag color="#ed312b"><InfoCircleOutlined title="Hight Priority"/></Tag>High</Option>
            <Option value="Medium"><Tag color="#d4db18"><InfoCircleOutlined title="Hight Priority"/></Tag>Medium</Option>
            <Option value="Low"><Tag color="#35b806"><InfoCircleOutlined title="Hight Priority"/></Tag>Low</Option>
          </Select>
        }
        actions={[
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => {
              props.onDelete()
              message.success("Task deleted successfully!")
            }}
            okText="Confrim"
            cancelText="Cancel"
          >
            <DeleteOutlined />
          </Popconfirm>
        ]}
      >
      <Paragraph style={{ whiteSpace: "break-spaces" }} editable={{ onChange: (value) => props.onChange({ ...props, description: value}) }}>
        {props.description}
      </Paragraph>
      <Text type="secondary">{props.dueDate}</Text>
    </Card>
  )
}

const NewCardForm = (props) => {
  const [form] = Form.useForm()
  useEffect(() => form.setFieldsValue({ priority: "Low" }), [])
  return (
    <Card 
        size="small"
        style={{ width: 250, margin: "3px 0px 3px 0px" }}
        title="Add Task" 
      >
      <Form
        form={form}
        onFinish={({ title, description, dueDate, priority }) => {
          props.onAdd({
            title,
            description,
            dueDate: moment(dueDate).format("MMM-DD-YYYY"),
            priority: priority || "Low"
          })
        }}
        size="small"
        layout="horizontal"
        name="project-form"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input the title of project!',
            },
          ]}
        >
          <Input placeholder="Title"/>
        </Form.Item>
        <Form.Item name="description" >
          <Input type="textarea" placeholder="Description" />
        </Form.Item>
        <Form.Item name="dueDate">
          <DatePicker placeholder="Due Date" style={{ width: "100%" }}/>
        </Form.Item>
        <Form.Item label="Priority" name="priority">
          <Select size="small" onChange={(priority) => form.setFieldsValue({ priority })}>
          <Option value="High"><Tag color="#ed312b"><InfoCircleOutlined title="Hight Priority"/></Tag>High</Option>
            <Option value="Medium"><Tag color="#d4db18"><InfoCircleOutlined title="Hight Priority"/></Tag>Medium</Option>
            <Option value="Low"><Tag color="#35b806"><InfoCircleOutlined title="Hight Priority"/></Tag>Low</Option>
          </Select>
        </Form.Item>
          <Row>
            <Col span={13}></Col>
            <Col span={5}>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="submit">
                  Add
                </Button>
              </Form.Item>
            </Col>
            <Col span={5}>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit" onClick={props.onCancel}>
                Cancel
              </Button>
            </Form.Item>
            </Col>
          </Row>
      </Form>
    </Card>
  )
}

export default MainBoard