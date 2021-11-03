import db from "./common"
import { v4 as uuidv4 } from 'uuid'
import moment from "moment"
import { DefaultBoard } from "./seedData"
import { authUserData } from "."


function allProjects(userGuid) {
    const accessList = db.read("accessList").filter(x => x.userGuid === userGuid)
    const actionsAccessList = accessList.reduce((acc, x) => {
        acc[x.projectGuid] = x
        return acc
    },{})

    let projects = db.read("projects").filter(x => accessList.map(x => x.projectGuid).includes(x.guid))
    
    projects = projects.map(x => {
        x.role = actionsAccessList[x.guid].role
        return x
    })
    return projects
}

function addProject(project) {
    const userGuid = authUserData().guid
    project = {
        ...project,
        guid: uuidv4(),
        userGuid,
        createdAt: moment().format("MMM-DD-YYYY h:mm:ss a")
    }

    db.addToResourceList("projects", project)
    db.addToResourceList("accessList", {
        projectGuid: project.guid,
        userGuid,
        role: "owner",
    })
    db.save(project.guid, DefaultBoard)
}

function removeProject(projectGuid) {
    db.filterResourceList("projects", "guid", projectGuid)
    db.filterResourceList("accessList", "projectGuid", projectGuid)
    db.deleteKey(projectGuid)
}

function updateUserProjects(projectGuid, data) {
    const projects = db.read("projects")
    const projectIndex = projects.findIndex(x => x.guid === projectGuid)

    projects[projectIndex].name = data.name
    projects[projectIndex].description = data.description

    db.save("projects", projects)
}

function updateProjectData(projectGuid, key, data) {
    const project = db.read(projectGuid) 
    project[key] = data
    db.save(projectGuid, project)
}

function readProjectData(projectGuid) {
    return db.read(projectGuid)
}


export {
    addProject,
    removeProject,
    updateUserProjects,
    updateProjectData,
    allProjects,
    readProjectData
}