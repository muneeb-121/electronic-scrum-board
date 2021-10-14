import { Users, DefaultBoard } from "./seedData"
import db from "./common"
import { v4 as uuidv4 } from "uuid"

function initStore() {
    try {
        db.read("users")
        console.log("Store already initialized")
    } catch (error) {
        db.save("users", Users)
        db.save(Users[0].projects[0].guid, DefaultBoard)
    }
}

function authenticateUser(email, password) {
    let user = db.read("users").filter((x) => x.email === email || x.username === email)
    if (!user.length) throw new Error("Provided email doest not exist")
    user = user.filter((x) => x.password === password)
    if (!user.length) throw new Error("Password doest not match")
    makeToken({ name: user[0].name, username: user[0].name, email: user[0].email, exp: Date.now() + 60*60000, guid: user[0].guid })
    return user
}

function newUser(newUser) {
    const allUsers = db.read("users")

    let user = allUsers.find((x) => x.email === newUser.email)
    if (user) throw new Error("An account already exists with this email")

    user = allUsers.find((x) => x.username === newUser.username)
    if (user) throw new Error("This username is alredy taken")

    newUser = { 
        ...newUser,
        uuid: uuidv4(),
        projects: []
    }
    allUsers.push(newUser)
    db.save("users", allUsers)
}

function tokenisValid() {
    try {
        const token = db.read("token")
        if (!token) return false
        const data = decodeToken(token)
        if (data.exp > Date.now()) return data
        return false 
    } catch (error) {
        return false
    }
}

function makeToken(user) {
    let token = JSON.stringify(user)
    for (let index = 0; index < 4; index++) {
        token = Buffer.from(token).toString("base64")
    }
    db.save("token", token)
    return token
}

function authUserData() {
    const token = db.read("token")
    return decodeToken(token)
}

function decodeToken(token) {
    let data = token
    for (let index = 0; index < 4; index++) {
        data = Buffer.from(data, "base64").toString("ascii")
    }
    return JSON.parse(data)
}

function logout() {
    db.deleteKey("token")
    window.location.href = "/"
}

export {
    initStore,
    authenticateUser,
    tokenisValid,
    logout,
    authUserData,
    newUser
}