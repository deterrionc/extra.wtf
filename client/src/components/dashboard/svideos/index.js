import React from "react"
import { Route, Routes } from "react-router"
import DashboardSvideoList from "./DashboardSvideoList"
import DashboardSvideoCreate from "./DashboardSvideoCreate"
import DashboardSvideoEdit from "./DashboardSvideoEdit"

const DashboardSvideoContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<DashboardSvideoList />} />
        <Route path="/create" element={<DashboardSvideoCreate />} />
        <Route path="/edit/:id" element={<DashboardSvideoEdit />} />
      </Routes>
    </React.Fragment>
  )
}

export default DashboardSvideoContainer