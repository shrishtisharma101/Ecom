import { useEffect, useMemo, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";

import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
import AdminPageHeader from "../components/AdminPageHeader";
import { useAdminDateFilter } from "../context/AdminDateFilterContext";

const LoginIds = () => {
  const { refreshVersion } = useAdminDateFilter();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users whenever refreshVersion changes.
  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch users"
          );
        }

        if (!ignore) {
          setUsers(
            Array.isArray(data.users) ? data.users : []
          );
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          console.error("Fetch Users Error:", err);
          setError(
            err.message || "Unable to load registered users"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [refreshVersion]);

  // Search users without a separate filtered state.
  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return users;
    }

    return users.filter((user) =>
      [user.fullName, user.email, user.phone]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(searchText)
        )
    );
  }, [users, search]);

  const userPagination = useTablePagination(
    filteredUsers,
    search
  );

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-full bg-[#f6ede0] p-3">
      <AdminPageHeader
        title="Login IDs"
        description="Registered website users"
      />

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border border-[#e3d3c2] p-3 mb-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7661]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e3d3c2] outline-none focus:border-[#c8a279]"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-[#c8a279] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white rounded-2xl border border-[#e3d3c2] p-12 text-center">
          <FaUser className="text-5xl text-[#c8a279] mx-auto mb-4" />

          <h2 className="text-xl font-bold text-[#4d3d2f]">
            No Users Found
          </h2>

          <p className="text-[#8c7661] mt-2">
            No registered users are available.
          </p>
        </div>
      ) : (
        /* USERS TABLE */
        <div className="bg-white rounded-2xl border border-[#e3d3c2] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-187.5">
              <thead className="bg-[#faf0e8]">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-bold text-[#4d3d2f]">
                    User
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-bold text-[#4d3d2f]">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-bold text-[#4d3d2f]">
                    Phone
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-bold text-[#4d3d2f]">
                    Registered
                  </th>
                </tr>
              </thead>

              <tbody>
                {userPagination.pageItems.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-[#e3d3c2] hover:bg-[#faf0e8] transition"
                  >
                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#c8a279] text-white flex items-center justify-center">
                          <FaUser />
                        </div>

                        <div>
                          <p className="font-semibold text-[#4d3d2f]">
                            {user.fullName || "Unknown"}
                          </p>

                          <p className="text-xs text-[#8c7661]">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[#4d3d2f]">
                        <FaEnvelope className="text-[#c8a279]" />
                        <span>{user.email || "N/A"}</span>
                      </div>
                    </td>

                    {/* PHONE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[#4d3d2f]">
                        <FaPhone className="text-[#c8a279]" />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                    </td>

                    {/* REGISTERED DATE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#8c7661]">
                        <FaCalendarAlt />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination {...userPagination} />
        </div>
      )}
    </div>
  );
};

export default LoginIds;