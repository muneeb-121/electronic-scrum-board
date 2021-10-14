import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Row, Col, Card, Button, Form, Modal, Input, Popconfirm, message } from "antd"
import { authUserData } from "../store";
import { allProjects, updateUserProjects, addProject, removeProject } from "../store/projects";
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
const { Meta } = Card;


const Projects = () => {
    const [user, setUserData] = useState({})
    const [selectedProject, setSelectedProject] = useState({ name: "", description: "" })
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setUserData(allProjects(authUserData().guid))
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
        setUserData(allProjects(authUserData().guid))
    }

    function onCancel() {
        setVisible(false)
    }

    return (
        <>
        <ProjectForm onCancel={onCancel} visible={visible} onSubmit={onSubmit} project={selectedProject} />
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {
                user?.projects?.map((project, idx) => (
                    <Col className="gutter-row" span={6} key={"project_" + idx}>
                        <Link to={`/projects/${project.guid}`}>
                        <Card
                            style={{ minHeight: "150Px", marginTop: 16, cursor: "pointer" }}
                            actions={[
                                <EditOutlined key="edit" onClick={() => {
                                    setSelectedProject(project)
                                    setVisible(true)
                                }} />,
                                <Popconfirm
                                    title="Are you sure to delete this project?"
                                    onConfirm={() => {
                                        removeProject(project.guid)
                                        setUserData(allProjects(authUserData().guid))
                                        message.success("Project removed successfully!")
                                    }}
                                    okText="Confirm"
                                    cancelText="Cancel"
                                >
                                    <DeleteOutlined key="delete"/>
                                </Popconfirm>
                            ]}
                            >
                                <Meta
                                title={project.name}
                                description={project.description}
                                />
                        </Card>
                        </Link>
                    </Col>
                ))
            }
            <Col className="gutter-row" span={6} style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center" }} >
                <Button
                    type="dashed"
                    onClick={() => {
                        setSelectedProject({ name: "", description: ""})
                        setVisible(true)
                    }}
                    icon={<PlusOutlined />}
                >
                    Add project
                </Button>
            </Col>
        </Row>
        </>
    )
}

const ProjectForm = ({ visible, onSubmit, onCancel, project }) => {
  const [form] = Form.useForm();
  useEffect(() => {
      form.setFieldsValue(project)
  }, [project, form])

  return (
    <Modal
        width={350}
        visible={visible}
        title={project.guid ? "Update Project" : "Create a new project" }
        okText="Confirm"
        cancelText="Cancel"
        onCancel={onCancel}
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

export default Projects