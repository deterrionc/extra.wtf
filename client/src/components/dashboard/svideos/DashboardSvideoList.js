import { Link } from "react-router-dom"

const DashboardSvideoList = () => {
  return (
    <div className="p-3 bg-gray-100 rounded-lg flex flex-col">
      <h2 className="text-xl font-medium mb-4">Single Video List</h2>

      <div className="flex items-center justify-end mb-4">
        <Link
          to="/dashboard/svideos/create"
          className="py-2 px-3 rounded bg-lime-900 text-white"
        >
          Create A Video
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Topic</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Link</th>
              <th className="py-3 px-6 text-left">Path</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

export default DashboardSvideoList