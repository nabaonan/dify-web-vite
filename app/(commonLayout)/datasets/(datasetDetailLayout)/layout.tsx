import React from 'react'
import { Outlet } from 'react-router-dom'

const DatasetDetailLayout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default React.memo(DatasetDetailLayout)
