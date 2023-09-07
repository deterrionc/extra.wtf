import { Link } from "react-router-dom"
import { getSvideos, deleteSvideo } from "../../../actions/svideo";
import { useEffect } from "react";
import { connect } from "react-redux";
import { FaIcon } from "../../../container/atoms/FaIcon";

const DashboardSvideoList = ({ getSvideos, deleteSvideo, svideos }) => {
  useEffect(() => {
    getSvideos();
  }, [getSvideos]);

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
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Path</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {svideos.map((svideo, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left" style={{ minWidth: '120px' }}>
                  {svideo.title}
                </td>
                <td className="py-3 px-6 text-left" style={{ wordBreak: 'break-word', minWidth: '100px' }}>
                  {svideo.path}
                </td>
                <td className="py-3 px-6 text-center">
                  <img
                    src={`/${svideo.path}/${svideo.image}`}
                    alt="SvideoImage"
                    className="rounded-md w-32 mx-auto aspect-[3/2]"
                  />
                </td>
                <td className="py-3 px-6 text-left" style={{ minWidth: '140px' }}>
                  <Link
                    to={`/dashboard/svideos/edit/${svideo.id}`}
                    className="py-2 px-3 rounded bg-teal-800 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-edit" />
                  </Link>
                  <button
                    className="py-2 px-3 rounded bg-orange-700 text-white mx-1"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this svideo?"
                        )
                      ) {
                        deleteSvideo(svideo.id);
                      }
                    }}
                  >
                    <FaIcon iconName="fa fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  svideos: state.svideo.svideos,
});

export default connect(mapStateToProps, { getSvideos, deleteSvideo })(
  DashboardSvideoList
);
