import moment from "moment"

export const Users = [
  {
    name: "Muneeb Ahmad",
    username: "muneebahmad",
    email: "muneeb.ahmad@email.com",
    guid: "9ed14516-0780-4404-7285-27d28a4a95f9",
    role: "owner",
    password: "password",
  }
]

export const Projects = [
  {
    name: "Welcom Board",
    description: "This is a test board.",
    guid: "9ed24516-0780-4204-1285-27d2a4a99f9",
    createdAt: moment().format("MMM-DD-YYYY h:mm:ss a")
  }
] 

export const ProjectAccessList = [
  {
    role: "owner",
    userGuid: "9ed14516-0780-4404-7285-27d28a4a95f9",
    projectGuid: "9ed24516-0780-4204-1285-27d2a4a99f9"
  }
]

export const DefaultBoard = {
  lanes: [
    {
      id: 'back-log',
      title: 'BackLog',
      cards: []
    },
    {
      id: 'to-do',
      title: 'To Do',
      cards: [],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: []
    },
    {
      id: 'in-review',
      title: 'Review',
      cards: []
    },
    {
      id: 'done',
      title: 'Done',
      cards: []
    },
    {
      id: 'bugs',
      title: 'Bugs',
      cards: [],
      style: { display: "flex" }
    }
  ]
}