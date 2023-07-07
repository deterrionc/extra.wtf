import React from "react"
import { Route, Routes } from "react-router"
import DashboardChannelList from "./DashboardChannelList"
import DashboardChannelCreate from "./DashboardChannelCreate"
import DashboardChannelEdit from "./DashboardChannelEdit"

const DashboardChannelContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<DashboardChannelList />} />
        <Route path="/create" element={<DashboardChannelCreate />} />
        <Route path="/edit/:id" element={<DashboardChannelEdit />} />
      </Routes>
    </React.Fragment>
  )
}

export default DashboardChannelContainer