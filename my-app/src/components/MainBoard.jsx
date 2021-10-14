import React from "react";
import Board from 'react-trello'

const MainBoard = () => {
  const data = {
    lanes: [
      {
        id: 'back-log',
        title: 'BackLog',
        cards: []
      },
      {
        id: 'to-do',
        title: 'To Do',
        cards: []
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

  return (
    <Board
      style={{ backgroundColor: "unset", overflow: "unset" }}
      // style={{ backgroundColor: "unset", justifyContent: "space-between",  }}
      cardDraggable={true}
      collapsibleLanes={true}
      editable={true}
      hideCardDeleteIcon={false}
      data={data} 
    />
  )
}

export default MainBoard