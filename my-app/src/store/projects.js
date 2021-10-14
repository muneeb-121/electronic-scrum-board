import db from "./common"
import { v4 as uuidv4 } from 'uuid'
import moment from "moment"
import { DefaultBoard } from "./seedData"
import { authUserData } from "."


function allProjects(userGuid) {
    const users = db.read("users").filter(x => x.guid === userGuid)
    if (users.length) return users[0]
    return null
}

function addProject(project) {
    const userGuid = authUserData().guid
    const users = db.read("users")
    const index = users.findIndex(x => x.guid === userGuid)
    project = {
        ...project,
        guid: uuidv4(),
        createdAt: moment().format("MMM-DD-YYYY h:mm:ss a")
    }
    users[index] = { ...users[index], projects: [ ...users[index].projects, project ] }
    db.save("users", users)
    db.save(project.guid, DefaultBoard)
}

function removeProject(projectGuid) {
    const userGuid = authUserData().guid
    const users = db.read("users")

    const userIndex = users.findIndex(x => x.guid === userGuid)
    users[userIndex].projects = users[userIndex].projects.filter(x => x.guid !== projectGuid)
    db.save("users", users)
    db.deleteKey(projectGuid)
}

function updateUserProjects(projectGuid, data) {
    const userGuid = authUserData().guid
    const users = db.read("users")
    const userIndex = users.findIndex(x => x.guid === userGuid)
    const projectIndex = users[userIndex].projects.findIndex(x => x.guid === projectGuid)

    users[userIndex].projects[projectIndex].name = data.name
    users[userIndex].projects[projectIndex].description = data.description
    db.save("users", users)
}

function updateProjectData(projectGuid, data) {
    db.save(projectGuid, data)
}

export {
    addProject,
    removeProject,
    updateUserProjects,
    updateProjectData,
    allProjects
}