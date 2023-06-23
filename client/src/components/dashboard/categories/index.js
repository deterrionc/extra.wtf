import React from "react"
import { Route, Routes } from "react-router"
import CategoryList from "./CategoryList"
import CategoryCreate from "./CategoryCreate"
import CategoryEdit from "./CategoryEdit"

const CategoryContainer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<CategoryList />} />
        <Route path="/create" element={<CategoryCreate />} />
        <Route path="/edit/:id" element={<CategoryEdit />} />
      </Routes>
    </React.Fragment>
  )
}

export default CategoryContainer