import { Link } from "react-router-dom"

const DashboardArticleList = () => {
  return (
    <div className="p-3 bg-gray-100 rounded-lg flex flex-col">
      <h2 className="text-xl font-medium mb-4">Article List</h2>

      <div className="flex items-center justify-end mb-4">
        <Link
          to="/dashboard/articles/create"
          className="py-2 px-3 rounded bg-lime-900 text-white"
        >
          Create An Article
        </Link>
      </div>
      </div>
  )
}

export default DashboardArticleList