import React from "react";
import Board from 'react-trello'

const MainBoard = () => {
  const data = {
    lanes: [
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
        id: 'back-log',
        title: 'BackLog',
        cards: [],
        style: { display: "flex" }
      }
    ]
  }

  return (
          <Board
          style={{ backgroundColor: "#F9FAFB", justifyContent: "space-between", overflow: "initial" }}
          cardDraggable={true}
          collapsibleLanes={true}
          editable={true}
          hideCardDeleteIcon={false}
          data={data} />
  )
}

export default MainBoard