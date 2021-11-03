import React, { useEffect, useState } from "react";
import Board from 'react-trello'
import { readProjectData, updateProjectData } from "../store/projects"
import { createSprint, deleteSprint, startSprint, completeSprint } from "../store/sprints"
import { useParams, useHistory } from 'react-router-dom'
import { Card, Typography, Popconfirm, message, Form, Input, DatePicker, Button, Row, Col, Select, Tag, Modal, Checkbox } from "antd"
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined, CaretRightOutlined, CheckOutlined } from '@ant-design/icons';
import moment from "moment";
const { Paragraph, Text } = Typography;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

const MainBoard = () => {
  const router = useHistory()

  const { projectId } = useParams()
  const [projectBoardData, setProjectBoardData] = useState(null)

  const components = {
    Card: CustomCard,
    NewCardForm: NewCardForm,
    LaneHeader: (props) => <LaneHeader {...props} fecthData={fecthData} projectId={projectId}/>
  }

  function onDataChange(data) {
    updateProjectData(projectId, "sprint", data)
    setProjectBoardData(data)
  }

  function fecthData(pid) {
    try {
      const { sprint } = readProjectData(pid)
      setProjectBoardData(sprint)
    } catch (error) {
      router.push("/projects")      
    }
  }

  useEffect(() => {
    fecthData(projectId)
  }, [projectId])
  
  return (
    <>

      { projectBoardData ? <Board
        style={{ backgroundColor: "white", height: "100%" }}
        cardDraggable={true}
        collapsibleLanes={true}
        editable={true}
        hideCardDeleteIcon={false}
        onDataChange={onDataChange}
        data={projectBoardData} 
        components={components}
      /> : null }
    </>
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

const LaneHeader = (props) => {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState("")
  const [checkedList, setCheckedList] = useState([]);
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const options = props.cards.map(x => ({ label: x.title, value: x, key: x.id }))


  useEffect(() => {
    return () => {
      setVisible(false)
      setStartDate(null)
      setEndDate(null)
      setName("")
    }
  }, [])

  return (
    <div >
    <Modal
        width={350}
        visible={visible}
        title="Sprint"
        okText="Create Sprint"
        cancelText="Cancel"
        onCancel={() => setVisible(false)}
        getContainer={false}
        onOk={() => {
          if (startDate && endDate && checkedList.length && name) {
            createSprint({ startDate, endDate, cards: checkedList, projectId: props.projectId, name })
            props.fecthData(props.projectId)
            message.success(`Sprint "${name}" created successfully`)
            setVisible(false)
          } else message.error("Please provide all data")
        }}
    >
    Sprint Name
    <div>
    <Input type="text" onChange={(e) => setName(e.target.value)} required />
    </div>
    Select Task to include in sprint
    <CheckboxGroup style={{ display: "flex", flexDirection: "column", maxHeight: "300px", overflow: "scroll" }}  options={options} value={checkedList} onChange={(val) => setCheckedList(val)} />
    Sprint duration{
        startDate && endDate ? `(Duration: ${moment.duration(moment(startDate).diff(endDate)).humanize()})` : null
      }
    <div>
      <RangePicker onChange={(val) => {
        if (val) {
          setStartDate(val[0])
          setEndDate(val[1])
        } else {
          setStartDate(null)
          setEndDate(null)
        }
      }}/>
    </div>
    </Modal>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>{props.title}</h2>
      { props.type === "sprint" ? <CustomTag status={props.status}/> : null}
    </div>
      { props.title === "BackLog" ? <Button onClick={() => setVisible(true)}><PlusOutlined />Sprint</Button> : null }
      { props.type === "sprint" ? <div>
      <Button title="Delete Sprint" onClick={() => {
        try {
          deleteSprint(props.projectId, props.id)
          message.success(`Sprint: ${props.title} deleted successfully!`)
          props.fecthData(props.projectId)
        } catch (error) {
         message.error(error.message) 
        }
      }}><DeleteOutlined /></Button>

      {
        props.status === "new" ? 
        <Button title="Start Sprint" onClick={() => {
          try {
            startSprint(props.projectId, props.id)
            message.success(`Sprint: ${props.title} started successfully!`)
            props.fecthData(props.projectId)
          } catch (error) {
            message.error(error.message) 
          }
        }}><CaretRightOutlined /></Button>
        : <Button title="Complete Sprint" onClick={() => {
          try {
            completeSprint(props.projectId, props.id)
            props.fecthData(props.projectId)
            message.success(`Sprint: ${props.title} completed successfully!`)
            props.fecthData(props.projectId)
          } catch (error) {
            message.error(error.message) 
          }
        }}><CheckOutlined /></Button>
      }

      
      <Typography>
        {`From ${moment(props.startDate).format("YYYY-MMM-DD")} to ${moment(props.endDate).format("YYYY-MMM-DD")}`}
      </Typography>
      </div> : null }
    </div>
  )
}

const CustomTag = ({ status }) => {
  function getAttr (s) {
    let attr = {}
    switch (s) {
      case "started":
        attr = { color: "warning", text: "In progress"}
        break;
      default:
        attr = { color: "processing", text: "New" }
        break;
    }
    return attr
  }

  return (
    <Tag color={getAttr(status).color}>{getAttr(status).text}</Tag>
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