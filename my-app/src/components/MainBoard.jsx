import React from "react";
import Board from 'react-trello'

const MainBoard = () => {
  const data = JSON.parse(localStorage.getItem("data")) || {
    lanes: [
      {
        id: 'back-log',
        title: 'BackLog',
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
      }
    ]
  }

  function onDataChange(newData) {
    localStorage.setItem("data", JSON.stringify(newData))
  }

  return (
          <Board
          style={{ backgroundColor: "#F9FAFB" }}
          onDataChange={onDataChange}
          draggable={true}
          cardDraggable={true}
          collapsibleLanes={true}
          editable={true}
          canAddLanes={true}
          hideCardDeleteIcon={false}
          editLaneTitle={true}
          data={data} />
  )
}

export default MainBoard