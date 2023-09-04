import React from "react"
import { Route, Routes } from "react-router"
import DashboardArticleList from "./DashboardArticleList"
import DashboardArticleCreate from "./DashboardArticleCreate"
import DashboardArticleEdit from "./DashboardArticleEdit"

const DashboardArticleContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<DashboardArticleList />} />
        <Route path="/create" element={<DashboardArticleCreate />} />
        <Route path="/edit" element={<DashboardArticleEdit />} />
      </Routes>
    </React.Fragment>
  )
}

export default DashboardArticleContainer