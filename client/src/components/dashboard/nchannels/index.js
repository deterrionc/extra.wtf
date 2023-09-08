import React from "react"
import { Route, Routes } from "react-router"
import DashboardNchannelList from "./DashboardNchannelList"
import DashboardNchannelCreate from "./DashboardNchannelCreate"
import DashboardNchannelEdit from "./DashboardNchannelEdit"

const DashboardNchannelContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<DashboardNchannelList />} />
        <Route path="/create" element={<DashboardNchannelCreate />} />
        <Route path="/edit/:id" element={<DashboardNchannelEdit />} />
      </Routes>
    </React.Fragment>
  )
}

export default DashboardNchannelContainer