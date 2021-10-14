import React, { useEffect, useState } from "react";
import Board from 'react-trello'
import { readProjectData, updateProjectData } from "../store/projects"
import { useParams } from 'react-router-dom'


const MainBoard = () => {
  const { projectId } = useParams()
  const [projectData, setProjectData] = useState(null)

  function onDataChange(data) {
    updateProjectData(projectId, data)
    setProjectData(data)
    
  }

  useEffect(() => {
    setProjectData(readProjectData(projectId))
  }, [projectId])
  
  return (
    projectData ? <Board
      style={{ backgroundColor: "unset", overflow: "unset" }}
      cardDraggable={true}
      collapsibleLanes={true}
      editable={true}
      hideCardDeleteIcon={false}
      onDataChange={onDataChange}
      data={projectData} 
    /> : null
  )
}

export default MainBoard