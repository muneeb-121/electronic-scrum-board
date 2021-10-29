import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Row, Col, Card, Button, Form, Modal, Input, Popconfirm, message, Select, Typography } from "antd"
import { authUserData } from "../store";
import { allProjects, updateUserProjects, addProject, removeProject } from "../store/projects";
import { EditOutlined, PlusOutlined, DeleteOutlined, ArrowRightOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { createNewInvite } from "../store/invites";
const { Paragraph } = Typography


const Projects = () => {
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState({ name: "", description: "" })
    const [visible, setVisible] = useState(false);
    const [visibleInviteForm, setVisibleInviteForm] = useState(false);

    useEffect(() => {
        setProjects(allProjects(authUserData().guid))
    }, [])

    function onSubmit(values) {
        if (values.guid) {
            updateUserProjects(values.guid, values)
            message.success("Project updated successfully!")
        }
        else {
            addProject(values)
            message.success("Project added successfully!")
        }
        setVisible(false)
        setProjects(allProjects(authUserData().guid))
    }

    function onCancel() {
      setVisible(false)
    }

    function onSubmitInviteForm(values) {
      console.log(values)
    }

    function onCancelInviteForm() {
      setVisibleInviteForm(false)
    }

    return (
        <>
        <InviteForm onCancel={onCancelInviteForm} visible={visibleInviteForm} onSubmit={onSubmitInviteForm} projects={projects.filter(x => x.role === "owner")} />
        <ProjectForm onCancel={onCancel} visible={visible} onSubmit={onSubmit} project={selectedProject} />
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {
                projects?.map((project, idx) => (
                    <Col className="gutter-row" span={6} key={"project_" + idx}>
                        <Card
                            title={project.name}
                            style={{ minHeight: "150Px", marginTop: 16 }}
                            extra={
                                <Link to={`/projects/${project.guid}/backlog`}><ArrowRightOutlined /></Link>
                            }
                            actions={project.role === "owner" ? [
                                <EditOutlined key="edit" onClick={() => {
                                    setSelectedProject(project)
                                    setVisible(true)
                                }} />,
                                <Popconfirm
                                    title="Are you sure to delete this project?"
                                    onConfirm={() => {
                                        removeProject(project.guid)
                                        setProjects(allProjects(authUserData().guid))
                                        message.success("Project removed successfully!")
                                    }}
                                    okText="Confirm"
                                    cancelText="Cancel"
                                >
                                    <DeleteOutlined key="delete"/>
                                </Popconfirm>
                            ] : []}
                        >
                            {project.description}
                        </Card>
                    </Col>
                ))
            }
            <Col className="gutter-row" style={{ flexDirection: "column", display: "flex", justifyContent: "center" }} >
                <Button
                    // style={{ margin: "0.5em 0 0.5em 0" }}
                    type="dashed"
                    onClick={() => {
                        setSelectedProject({ name: "", description: ""})
                        setVisible(true)
                    }}
                    icon={<PlusOutlined />}
                >
                    Add project
                </Button>
                {projects.filter(x => x.role === "owner").length ? <Button
                    style={{ margin: "0.5em 0 0.5em 0" }}
                    type="dashed"
                    onClick={() => {
                        setVisibleInviteForm(true)
                    }}
                    icon={<UsergroupAddOutlined />}
                >
                    Invite User
                </Button> : null }
            </Col>
        </Row>
        </>
    )
}

const ProjectForm = ({ visible, onSubmit, onCancel, project }) => {
  const [form] = Form.useForm();
  useEffect(() => {
      form.setFieldsValue(project)
  }, [project])

  return (
    <Modal
        width={350}
        visible={visible}
        title={project.guid ? "Update Project" : "Create a new project" }
        okText="Confirm"
        cancelText="Cancel"
        onCancel={onCancel}
        getContainer={false}
        onOk={() => {
            form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onSubmit({ ...project, ...values});
            })
        }}
    >
      <Form
        form={form}
        layout="vertical"
        name="project-form"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="name"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of project!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const InviteForm = ({ visible, onSubmit, onCancel, projects }) => {
    const [form] = Form.useForm();
    const [shareLink, setShareLink] = useState("")
    
    useEffect(() => {
        form.setFieldsValue({ projects: [] })
    }, [projects])

    useEffect(() => console.log(form.getFieldValue("projects")))
  
    return (
      <Modal
          width={400}
          visible={visible}
          title={"Invite Users to Collaborate" }
          okText="Confirm"
          cancelText="Cancel"
          onCancel={() => {
              setShareLink("")
              onCancel()
            }}
          getContainer={false}
          onOk={() => {
              form
              .validateFields()
              .then((values) => {
                  form.resetFields();
                  console.log(values)
                  setShareLink(createNewInvite(values.email, values.projects))
              })
          }}
      >
        <Form
          form={form}
          layout="vertical"
          name="project-form"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please input the email of user being invited!',
              },
              {
                  type: "email",
                    message: 'Please input a valid email address!',
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="projects"
            label="Projects"
          >
            <Select
            mode="multiple"
            placeholder="Inserted are removed"
            onChange={(values) => form.setFieldsValue({ projects: values }) }
            style={{ width: '100%' }}
            >
                {projects.map(item => (
                <Select.Option key={item.guid} value={item.guid}>
                    {item.name}
                </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
        { shareLink ? <Paragraph copyable>{shareLink}</Paragraph> : null }
      </Modal>
    );
};

export default Projects