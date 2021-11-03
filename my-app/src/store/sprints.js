import db from "./common"
import moment from "moment"

function createSprint(sprint) {
    const project = db.read(sprint.projectId)
    project.sprint.lanes.push({
        id: sprint.name + Date.now(),
        title: sprint.name,
        type: "sprint",
        status: "new",
        startDate: moment(sprint.startDate).format("MMM-DD-YYYY h:mm:ss a"),
        endDate: moment(sprint.endDate).format("MMM-DD-YYYY h:mm:ss a"),
        cards: sprint.cards
    })

    const cardIds = sprint.cards.map(x => x.id)

    project.sprint.lanes[0].cards = project.sprint.lanes[0].cards.filter(x => !cardIds.includes(x.id))

    db.save(sprint.projectId, project)
}

function deleteSprint(projectId, sprintId) {
    const project = db.read(projectId)
    const sprint = project.sprint.lanes.find(x => x.id === sprintId)

    let allCards = []
    for (const index in project.board.lanes) {
        if (project.board.lanes[index].id !== "done") {
            allCards.push(...project.board.lanes[index].cards)
        }
        project.board.lanes[index].cards = []
    }

    if (sprint.status === "new") {
        allCards = sprint.cards
    }
    
    project.sprint.lanes[0].cards = [...project.sprint.lanes[0].cards, ...allCards]
    project.sprint.lanes = project.sprint.lanes.filter(x => x.id !== sprintId)
    db.save(projectId, project)
    return true
}

function startSprint(projectId, sprintId) {
    const project = db.read(projectId)
    const index = project.sprint.lanes.findIndex(x => x.id === sprintId)
    project.sprint.lanes[index].status = "started"
    const cardIds = project.sprint.lanes[index].cards.map(x => x.id)
    project.board.lanes[0].cards = project.board.lanes[0].cards.filter(x => !cardIds.includes(x.id))
    project.board.lanes[0].cards = [...project.board.lanes[0].cards, ...project.sprint.lanes[index].cards]
    db.save(projectId, project)
    return true
}

function completeSprint(projectId, sprintId) {
    const project = db.read(projectId)
    const sprint = project.sprint.lanes.find(x => x.id === sprintId)
    sprint.status = "completed"
    project.sprint.lanes = project.sprint.lanes.filter(x => x.id !== sprintId)

    const allCards = []
    for (const index in project.board.lanes) {
        if (project.board.lanes[index].id !== "done") {
            allCards.push(...project.board.lanes[index].cards)
        }
        project.board.lanes[index].cards = []
    }
    const allCardIds = allCards.map(x => x.id)

    project.sprint.lanes[0].cards = project.sprint.lanes[0].cards.filter(x => !allCardIds.includes(x.id))
    project.sprint.lanes[0].cards = [...project.sprint.lanes[0].cards, ...allCards]

    db.save(projectId, project)
    return true

}

export {
    createSprint,
    deleteSprint,
    startSprint,
    completeSprint
}