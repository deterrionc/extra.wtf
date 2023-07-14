import React from "react"
import { Route, Routes } from "react-router"
import CategoryList from "./CategoryList"
import CategoryCreate from "./CategoryCreate"
import CategoryEdit from "./CategoryEdit"
import CategoryVideos from "./CategoryVideos"
import CategoryVideoUpload from "./CategoryVideoUpload"

const CategoryContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<CategoryList />} />
        <Route path="/create/:channelID" element={<CategoryCreate />} />
        <Route path="/edit/:id" element={<CategoryEdit />} />
        <Route path="/videos/:id" element={<CategoryVideos />} />
        <Route path="/upload/:id" element={<CategoryVideoUpload />} />
      </Routes>
    </React.Fragment>
  )
}

export default CategoryContainer