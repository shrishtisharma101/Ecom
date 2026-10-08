import { useEffect, useState } from "react";

import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaTimes,
  FaTrash,
  FaUser,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getAdminDateRange, useAdminDateFilter } from "../context/AdminDateFilterContext";
import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
import AdminPageHeader from "../components/AdminPageHeader";

const API_URL = "http://localhost:8000/api/users";

const Users = () => {
  const dateFilter = useAdminDateFilter();
  const { refreshVersion } = dateFilter;
  const { start: rangeStart, end: rangeEnd } = getAdminDateRange(dateFilter);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const userPagination = useTablePagination(
    filteredUsers,
    `${dateFilter.month}:${dateFilter.day}:${search}`
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserData, setDeleteUserData] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  // ==================================================
  // FETCH USERS
  // ==================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const contentType =
        response.headers.get("content-type") || "";

      // Prevent "Unexpected token '<'" when server
      // returns an HTML 404/500 page.
      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Server returned non-JSON response:",
          text
        );

        throw new Error(
          `Server returned ${response.status}. Check that GET ${API_URL} exists.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      const userList = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data)
          ? data
          : [];

      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error("Fetch Users Error:", error);

      setUsers([]);
      setFilteredUsers([]);

      setError(
        error.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    fetchUsers();
  }, [refreshVersion]);

  // ==================================================
  // SEARCH
  // ==================================================

  useEffect(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    if (!searchText) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      if (!user.createdAt) return false;
      const joinedAt = new Date(user.createdAt);
      if (joinedAt < rangeStart || joinedAt >= rangeEnd) return false;
      return [
        user.fullName,
        user.email,
        user.phone,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchText)
        );
    });

    setFilteredUsers(filtered);
  }, [rangeEnd, rangeStart, search, users]);

  // ==================================================
  // FORMAT DATE
  // ==================================================

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

  // ==================================================
  // PROFILE LETTER
  // ==================================================

  const getInitial = (name) => {
    if (!name) return "U";

    return String(name)
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  // ==================================================
  // DELETE USER
  // ==================================================

  const handleDeleteUser = async () => {
    if (!deleteUserData?._id) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${deleteUserData._id}`,
        {
          method: "DELETE",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "Delete server returned non-JSON:",
          text
        );

        throw new Error(
          `Server returned ${response.status} while deleting user.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete user"
        );
      }

      // Remove deleted user from UI
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user._id !== deleteUserData._id
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user._id !== deleteUserData._id
        )
      );

      // Close delete popup
      setDeleteUserData(null);

      // Close view popup if same user
      if (
        selectedUser?._id ===
        deleteUserData._id
      ) {
        setSelectedUser(null);
      }

      // Success message
      setSuccessMessage(
        "User deleted successfully"
      );

      // Hide success message
      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Delete User Error:",
        error
      );

      setError(
        error.message || "Failed to delete user"
      );

      setDeleteUserData(null);
    } finally {
      setDeleting(false);
    }
  };

  // ==================================================
  // CLOSE MODALS WITH ESCAPE
  // ==================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      if (deleting) return;

      setSelectedUser(null);
      setDeleteUserData(null);
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [deleting]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="
        w-full
        min-h-full
        bg-[#f6ede0]
        p-3
        overflow-x-hidden
      "
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      {/* <AdminPageHeader
        title="Users"
        description={`Users who joined during ${dateFilter.day
          ? new Date(`${dateFilter.day}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })
          : rangeStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`}
      /> */}

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div
        className="
          bg-white
          rounded-xl
          border
          border-[#e3d3c2]
          p-3
          mb-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              relative
              flex-1
            "
          >
            <FaSearch
              size={13}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#8c7661]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search users..."
              className="
                w-full
                pl-9
                pr-3
                py-2
                rounded-lg
                border
                border-[#e3d3c2]
                outline-none
                focus:border-[#c8a279]
                text-xs
                sm:text-sm
                text-[#4d3d2f]
              "
            />
          </div>

          <div
            className="
              bg-[#faf0e8]
              text-[#4d3d2f]
              px-3
              py-2
              rounded-lg
              text-xs
              font-semibold
              whitespace-nowrap
            "
          >
            {filteredUsers.length} Users
          </div>
        </div>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            bg-red-50
            border
            border-red-200
            text-red-600
            rounded-lg
            p-3
            mb-4
            text-sm
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div>{error}</div>

          <button
            onClick={() => setError("")}
            className="
              text-red-400
              hover:text-red-600
              flex-shrink-0
            "
            title="Close error"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div
          className="
            flex
            justify-center
            items-center
            py-16
          "
        >
          <div
            className="
              w-8
              h-8
              border-4
              border-[#c8a279]
              border-t-transparent
              rounded-full
              animate-spin
            "
          />
        </div>
      ) : filteredUsers.length === 0 ? (
        /* ==================================================
            EMPTY
        ================================================== */

        <div
          className="
            bg-white
            rounded-xl
            border
            border-[#e3d3c2]
            p-10
            text-center
          "
        >
          <FaUser
            className="
              text-4xl
              text-[#c8a279]
              mx-auto
              mb-3
            "
          />

          <h2
            className="
              text-lg
              font-bold
              text-[#4d3d2f]
            "
          >
            {search
              ? "No Matching Users"
              : "No Users Found"}
          </h2>

          <p
            className="
              text-[#8c7661]
              text-sm
              mt-1
            "
          >
            {search
              ? "Try searching with a different name, email, or phone number."
              : "No registered users are available."}
          </p>
        </div>
      ) : (
        /* ==================================================
            TABLE
        ================================================== */

        <div
          className="
            bg-white
            rounded-xl
            border
            border-[#e3d3c2]
            shadow-sm
            overflow-hidden
          "
        >
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[900px]
                border-collapse
              "
            >
              {/* TABLE HEADER */}

              <thead>
                <tr
                  className="
                    bg-[#faf0e8]
                    border-b
                    border-[#e3d3c2]
                  "
                >
                  <th
                    className="
                      px-3
                      py-3
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-[#8c7661]
                    "
                  >
                    #
                  </th>

                  <th
                    className="
                      px-3
                      py-3
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-[#8c7661]
                    "
                  >
                    User
                  </th>

                  <th
                    className="
                      px-3
                      py-3
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-[#8c7661]
                    "
                  >
                    Email
                  </th>

                  <th
                    className="
                      px-3
                      py-3
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-[#8c7661]
                    "
                  >
                    Phone
                  </th>

                  <th
                    className="
                      px-3
                      py-3
                      text-left
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-[#8c7661]
                    "
                  >
                    Registered
                  </th>

                  <th
                    className="
                      px-3
                      py-3
                      text-center
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-[#8c7661]
                    "
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody>
                {userPagination.pageItems.map(
                  (user, index) => (
                    <tr
                      key={
                        user._id ||
                        user.email ||
                        index
                      }
                      className="
                        border-b
                        border-[#eee1d5]
                        hover:bg-[#fffaf6]
                        transition
                      "
                    >
                      {/* NUMBER */}

                      <td
                        className="
                          px-3
                          py-3
                          text-xs
                          font-semibold
                          text-[#8c7661]
                        "
                      >
                        {(userPagination.currentPage - 1) * userPagination.pageSize + index + 1}
                      </td>

                      {/* USER */}

                      <td className="px-3 py-3">
                        <div
                          className="
                            flex
                            items-center
                            gap-2.5
                          "
                        >
                          <div
                            className="
                              w-8
                              h-8
                              min-w-8
                              rounded-full
                              bg-[#c8a279]
                              text-white
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                              shadow-sm
                            "
                          >
                            {getInitial(
                              user.fullName
                            )}
                          </div>

                          <div>
                            <p
                              className="
                                text-xs
                                font-semibold
                                text-[#4d3d2f]
                                whitespace-nowrap
                              "
                            >
                              {user.fullName ||
                                "Unknown User"}
                            </p>

                            <p
                              className="
                                text-[10px]
                                text-[#8c7661]
                              "
                            >
                              Customer
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td className="px-3 py-3">
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-[#4d3d2f]
                            whitespace-nowrap
                          "
                        >
                          <FaEnvelope
                            size={11}
                            className="
                              text-[#c8a279]
                            "
                          />

                          {user.email || "N/A"}
                        </div>
                      </td>

                      {/* PHONE */}

                      <td className="px-3 py-3">
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-[#4d3d2f]
                            whitespace-nowrap
                          "
                        >
                          <FaPhone
                            size={10}
                            className="
                              text-[#c8a279]
                            "
                          />

                          {user.phone || "N/A"}
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-3 py-3">
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-[#8c7661]
                            whitespace-nowrap
                          "
                        >
                          <FaCalendarAlt
                            size={10}
                            className="
                              text-[#c8a279]
                            "
                          />

                          {formatDate(
                            user.createdAt
                          )}
                        </div>
                      </td>

                      {/* ACTION */}

                      <td
                        className="
                          px-3
                          py-3
                          text-center
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >
                          {/* VIEW */}

                          <button
                            onClick={() =>
                              setSelectedUser(
                                user
                              )
                            }
                            title="View user"
                            className="
                              w-8
                              h-8
                              inline-flex
                              items-center
                              justify-center
                              bg-[#c8a279]
                              text-white
                              rounded-lg
                              hover:bg-[#b07a4b]
                              transition
                            "
                          >
                            <FaEye size={12} />
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              setDeleteUserData(
                                user
                              )
                            }
                            title="Delete user"
                            className="
                              w-8
                              h-8
                              inline-flex
                              items-center
                              justify-center
                              bg-[#c8a279]
                              text-white
                              rounded-lg
                              hover:bg-[#b07a4b]
                              transition
                            "
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <TablePagination {...userPagination} />
        </div>
      )}

      {/* ==================================================
          VIEW USER MODAL
      ================================================== */}

      {selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() =>
            setSelectedUser(null)
          }
        >
          <div
            className="
              bg-white
              w-full
              max-w-md
              rounded-xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div
              className="
                bg-[#faf0e8]
                px-5
                py-4
                flex
                items-center
                justify-between
                border-b
                border-[#e3d3c2]
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#4d3d2f]
                  "
                >
                  User Details
                </h2>

                <p
                  className="
                    text-xs
                    text-[#8c7661]
                    mt-0.5
                  "
                >
                  Registered customer
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  text-[#8c7661]
                  hover:text-red-500
                "
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* USER PROFILE */}

            <div className="p-5">
              <div
                className="
                  flex
                  flex-col
                  items-center
                  mb-5
                "
              >
                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-[#c8a279]
                    text-white
                    flex
                    items-center
                    justify-center
                    text-2xl
                    font-bold
                    shadow-sm
                    mb-3
                  "
                >
                  {getInitial(
                    selectedUser.fullName
                  )}
                </div>

                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#4d3d2f]
                  "
                >
                  {selectedUser.fullName ||
                    "Unknown User"}
                </h3>

                <p
                  className="
                    text-xs
                    text-[#8c7661]
                  "
                >
                  Customer
                </p>
              </div>

              {/* DETAILS */}

              <div className="space-y-3">
                {/* EMAIL */}

                <div
                  className="
                    bg-[#faf0e8]
                    rounded-lg
                    p-3
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-[#8c7661]
                      mb-1
                    "
                  >
                    Email
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-[#4d3d2f]
                      break-all
                    "
                  >
                    <FaEnvelope
                      size={12}
                      className="
                        text-[#c8a279]
                        flex-shrink-0
                      "
                    />

                    {selectedUser.email ||
                      "Not provided"}
                  </div>
                </div>

                {/* PHONE */}

                <div
                  className="
                    bg-[#faf0e8]
                    rounded-lg
                    p-3
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-[#8c7661]
                      mb-1
                    "
                  >
                    Phone
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-[#4d3d2f]
                    "
                  >
                    <FaPhone
                      size={11}
                      className="
                        text-[#c8a279]
                      "
                    />

                    {selectedUser.phone ||
                      "Not provided"}
                  </div>
                </div>

                {/* PASSWORD SECURITY */}

                <div className="rounded-lg border border-[#e3d3c2] bg-[#faf0e8] p-3">
                  <p className="mb-1 text-[10px] text-[#8c7661]">Password</p>
                  <div className="flex items-start gap-2 text-sm font-medium text-[#4d3d2f]">
                    <FaLock size={12} className="mt-0.5 shrink-0 text-[#c8a279]" />
                    <span>
                      Protected — passwords are securely hashed and cannot be viewed.
                    </span>
                  </div>
                </div>

                {/* REGISTERED DATE */}

                <div
                  className="
                    bg-[#faf0e8]
                    rounded-lg
                    p-3
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-[#8c7661]
                      mb-1
                    "
                  >
                    Registered On
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-[#4d3d2f]
                    "
                  >
                    <FaCalendarAlt
                      size={11}
                      className="
                        text-[#c8a279]
                      "
                    />

                    {formatDate(
                      selectedUser.createdAt
                    )}
                  </div>
                </div>

                {/* USER ID */}

                {selectedUser._id && (
                  <div
                    className="
                      bg-[#faf0e8]
                      rounded-lg
                      p-3
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        text-[#8c7661]
                        mb-1
                      "
                    >
                      User ID
                    </p>

                    <p
                      className="
                        text-xs
                        font-medium
                        text-[#4d3d2f]
                        break-all
                      "
                    >
                      {selectedUser._id}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {deleteUserData && (
        <div
          className="
            fixed
            inset-0
            z-[110]
            bg-black/45
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => {
            if (!deleting) {
              setDeleteUserData(null);
            }
          }}
        >
          <div
            className="
              bg-white
              w-full
              max-w-sm
              rounded-xl
              shadow-2xl
              p-6
              text-center
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* WARNING ICON */}

            <div
              className="
                w-12
                h-12
                mx-auto
                rounded-full
                bg-[#faf0e8]
                text-[#c8a279]
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <FaExclamationTriangle
                size={19}
              />
            </div>

            <h2
              className="
                text-lg
                font-bold
                text-[#4d3d2f]
              "
            >
              Delete User?
            </h2>

            <p
              className="
                text-sm
                text-[#8c7661]
                mt-2
                leading-5
              "
            >
              Are you sure you want to delete
              <span
                className="
                  font-semibold
                  text-[#4d3d2f]
                "
              >
                {" "}
                {deleteUserData.fullName ||
                  "this user"}
              </span>
              ?
            </p>

            <p
              className="
                text-xs
                text-[#a38d78]
                mt-1
              "
            >
              This action cannot be undone.
            </p>

            {/* BUTTONS */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                mt-5
              "
            >
              <button
                onClick={() =>
                  setDeleteUserData(null)
                }
                disabled={deleting}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-[#e3d3c2]
                  text-[#4d3d2f]
                  text-xs
                  font-semibold
                  hover:bg-[#faf0e8]
                  transition
                  disabled:opacity-60
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-[#c8a279]
                  text-white
                  text-xs
                  font-semibold
                  hover:bg-[#b07a4b]
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SUCCESS MESSAGE
      ================================================== */}

      {successMessage && (
        <div
          className="
            fixed
            inset-0
            z-[120]
            flex
            items-center
            justify-center
            pointer-events-none
          "
        >
          <div
            className="
              bg-white
              border
              border-[#e3d3c2]
              shadow-2xl
              rounded-xl
              px-6
              py-4
              text-center
            "
          >
            <div
              className="
                w-10
                h-10
                mx-auto
                rounded-full
                bg-[#faf0e8]
                text-[#c8a279]
                flex
                items-center
                justify-center
                mb-2
              "
            >
              <span
                className="
                  text-lg
                  font-bold
                "
              >
                ✓
              </span>
            </div>

            <p
              className="
                text-sm
                font-bold
                text-[#4d3d2f]
              "
            >
              {successMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
