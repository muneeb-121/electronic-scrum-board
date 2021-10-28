import db from "./common"
import { v4 as uuidv4 } from 'uuid'
import moment from "moment"
import { authUserData } from "."


function createNewInvite(email, projects) {
    const userGuid = authUserData().guid
    const invite = {
        invitedBy: userGuid,
        email,
        role: "developer",
        projects,
        guid: uuidv4(),
        status: "pending", // pending, completed
        createdAt: moment().format("MMM-DD-YYYY h:mm:ss a")
    }
    db.addToResourceList("invites", invite)
    return `http://localhost:3000/invite/${invite.guid}`
}

function getInviteData(guid) {
    const invite = db.read("invites").find(x => x.guid === guid && x.status === "pending")
    if (!invite) throw new Error("Invite link is invalid")
    const user = db.read("users").find(x => x.email === invite.email)
    return { user, invite }
}

export {
    createNewInvite,
    getInviteData
}