import React from "react"
import { Route, Routes } from "react-router"
import DashboardVideoList from "./DashboardVideoList"
import DashboardVideoCreate from "./DashboardVideoCreate"
import DashboardVideoEdit from "./DashboardVideoEdit"

const DashboardVideoContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<DashboardVideoList />} />
        <Route path="/create" element={<DashboardVideoCreate />} />
        <Route path="/edit" element={<DashboardVideoEdit />} />
      </Routes>
    </React.Fragment>
  )
}

export default DashboardVideoContainer