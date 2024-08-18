import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

const Player = () => {
  const { id } = useParams()
  
  return (
    <div>
      <FaArrowLeft />
    </div>
  )
}

export default Player