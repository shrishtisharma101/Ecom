import { useEffect, useState } from "react";

import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaTimes,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import TablePagination from "../components/TablePagination";
import { useTablePagination } from "../hooks/useTablePagination";
// import AdminPageHeader from "../components/AdminPageHeader";
import { useAdminDateFilter } from "../context/AdminDateFilterContext";

const Contact = () => {
  const { refreshVersion } = useAdminDateFilter();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const [search, setSearch] = useState("");
  const contactPagination = useTablePagination(filteredContacts, search);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View modal
  const [selectedContact, setSelectedContact] = useState(null);

  // Delete confirmation
  const [deleteContact, setDeleteContact] = useState(null);

  // Success message
  const [successMessage, setSuccessMessage] = useState("");


  // =========================================================
  // FETCH CONTACTS
  // =========================================================

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8000/api/contact"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch contacts"
        );
      }

      setContacts(data.contacts || []);
      setFilteredContacts(data.contacts || []);

    } catch (error) {
      console.error("Fetch Contacts Error:", error);

      setError(
        error.message || "Unable to load contacts"
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchContacts();
  }, [refreshVersion]);


  // =========================================================
  // SEARCH
  // =========================================================

  useEffect(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    const filtered = contacts.filter((contact) =>
      [
        contact.name,
        contact.email,
        contact.phone,
        contact.project,
        contact.subject,
        contact.message,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchText)
        )
    );

    setFilteredContacts(filtered);

  }, [search, contacts]);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };


  // =========================================================
  // GET FIRST LETTER
  // =========================================================

  const getInitial = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };


  // =========================================================
  // DELETE CONTACT
  // =========================================================

  const handleDelete = async () => {
    if (!deleteContact) return;

    try {

      const response = await fetch(
        `http://localhost:8000/api/contact/${deleteContact._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete contact"
        );
      }


      // Remove from contacts
      setContacts((prevContacts) =>
        prevContacts.filter(
          (contact) =>
            contact._id !== deleteContact._id
        )
      );


      // Remove from filtered contacts
      setFilteredContacts((prevContacts) =>
        prevContacts.filter(
          (contact) =>
            contact._id !== deleteContact._id
        )
      );


      // Close delete popup
      setDeleteContact(null);


      // Success popup
      setSuccessMessage(
        "Contact deleted successfully"
      );


      // Hide success popup
      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);

    } catch (error) {

      console.error(
        "Delete Contact Error:",
        error
      );

      setDeleteContact(null);

      setError(
        error.message ||
        "Unable to delete contact"
      );
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="
        w-full
        min-h-full
        bg-[#f6ede0]
        p-3
        sm:p-4
        lg:p-5
        overflow-x-hidden
      "
    >


      {/* =====================================================
          HEADER
      ===================================================== */}

      {/* <AdminPageHeader
        title="Contacts"
        description="Messages received from your website"
      /> */}


      {/* =====================================================
          SEARCH
      ===================================================== */}

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
              placeholder="Search contacts..."
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


          {/* MESSAGE COUNT */}

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
            {filteredContacts.length} Messages
          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

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
            items-center
            justify-between
            gap-3
          "
        >

          <span>
            {error}
          </span>

          <button
            onClick={() => setError("")}
            className="
              text-red-500
              hover:text-red-700
            "
          >
            <FaTimes />
          </button>

        </div>

      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

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


      ) : filteredContacts.length === 0 ? (

        /* ===================================================
           EMPTY
        =================================================== */

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

          <FaEnvelope
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
            No Contacts Found
          </h2>

          <p
            className="
              text-[#8c7661]
              text-sm
              mt-1
            "
          >
            No contact messages are available.
          </p>

        </div>


      ) : (

        /* ===================================================
           TABLE
        =================================================== */

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
                min-w-[1050px]
                border-collapse
              "
            >

              {/* =================================================
                  TABLE HEADER
              ================================================= */}

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
                    Name
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
                    Project
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
                    Subject
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
                    Date
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


              {/* =================================================
                  TABLE BODY
              ================================================= */}

              <tbody>

                {contactPagination.pageItems.map(
                  (contact, index) => (

                    <tr
                      key={contact._id}
                      className="
                        border-b
                        border-[#eee1d5]
                        hover:bg-[#fffaf6]
                        transition
                      "
                    >

                      {/* ================= #
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                          text-xs
                          font-semibold
                          text-[#8c7661]
                        "
                      >
                        {(contactPagination.currentPage - 1) * contactPagination.pageSize + index + 1}
                      </td>


                      {/* ================= NAME
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2.5
                          "
                        >

                          {/* PROFILE CIRCLE */}

                          <div
                            className="
                              w-8
                              h-8
                              rounded-full
                              bg-[#c8a279]
                              text-white
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                              uppercase
                              flex-shrink-0
                              shadow-sm
                            "
                          >
                            {getInitial(
                              contact.name
                            )}
                          </div>


                          {/* NAME */}

                          <span
                            className="
                              text-xs
                              font-semibold
                              text-[#4d3d2f]
                              whitespace-nowrap
                            "
                          >
                            {contact.name ||
                              "Unknown"}
                          </span>

                        </div>

                      </td>


                      {/* ================= EMAIL
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                        "
                      >

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

                          {contact.email ||
                            "N/A"}

                        </div>

                      </td>


                      {/* ================= PHONE
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                        "
                      >

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

                          {contact.phone ||
                            "N/A"}

                        </div>

                      </td>


                      {/* ================= PROJECT
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                        "
                      >

                        <span
                          className="
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            bg-[#f6ede0]
                            text-[#4d3d2f]
                            text-[11px]
                            font-medium
                            whitespace-nowrap
                          "
                        >
                          {contact.project ||
                            "N/A"}
                        </span>

                      </td>


                      {/* ================= SUBJECT
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                        "
                      >

                        <div
                          className="
                            max-w-[170px]
                            truncate
                            text-xs
                            font-medium
                            text-[#4d3d2f]
                          "
                        >
                          {contact.subject ||
                            "N/A"}
                        </div>

                      </td>


                      {/* ================= DATE
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
                        "
                      >

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
                            contact.createdAt
                          )}

                        </div>

                      </td>


                      {/* ================= ACTION
                      ================= */}

                      <td
                        className="
                          px-3
                          py-3
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
                              setSelectedContact(
                                contact
                              )
                            }
                            title="View message"
                            className="
                              w-8
                              h-8
                              flex
                              items-center
                              justify-center
                              bg-[#c8a279]
                              text-white
                              rounded-lg
                              hover:bg-[#b07a4b]
                              transition
                              shadow-sm
                            "
                          >

                            <FaEye size={12} />

                          </button>


                          {/* DELETE */}

                          <button
                            onClick={() =>
                              setDeleteContact(
                                contact
                              )
                            }
                            title="Delete contact"
                            className="
                              w-8
                              h-8
                              flex
                              items-center
                              justify-center
                              bg-[#b07a4b]
                              text-white
                              rounded-lg
                              hover:bg-[#9a653d]
                              transition
                              shadow-sm
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
          <TablePagination {...contactPagination} />
        </div>

      )}


      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {selectedContact && (

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
        >

          <div
            className="
              bg-white
              w-full
              max-w-xl
              rounded-xl
              shadow-2xl
              overflow-hidden
            "
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
                  Contact Details
                </h2>

                <p
                  className="
                    text-xs
                    text-[#8c7661]
                    mt-0.5
                  "
                >
                  {selectedContact.subject ||
                    "Contact Message"}
                </p>

              </div>


              <button
                onClick={() =>
                  setSelectedContact(null)
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
                  transition
                "
              >

                <FaTimes size={13} />

              </button>

            </div>


            {/* MODAL BODY */}

            <div
              className="
                p-5
                space-y-4
              "
            >

              {/* PROFILE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  bg-[#f6ede0]
                  rounded-xl
                  p-3
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#c8a279]
                    text-white
                    flex
                    items-center
                    justify-center
                    text-base
                    font-bold
                    uppercase
                  "
                >
                  {getInitial(
                    selectedContact.name
                  )}
                </div>


                <div>

                  <p
                    className="
                      text-sm
                      font-bold
                      text-[#4d3d2f]
                    "
                  >
                    {selectedContact.name ||
                      "Unknown"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#8c7661]
                    "
                  >
                    {selectedContact.email ||
                      "N/A"}
                  </p>

                </div>

              </div>


              {/* DETAILS GRID */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                {/* EMAIL */}

                <div>

                  <p
                    className="
                      text-[11px]
                      text-[#8c7661]
                    "
                  >
                    Email
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#4d3d2f]
                      break-all
                    "
                  >
                    {selectedContact.email ||
                      "Not provided"}
                  </p>

                </div>


                {/* PHONE */}

                <div>

                  <p
                    className="
                      text-[11px]
                      text-[#8c7661]
                    "
                  >
                    Phone
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#4d3d2f]
                    "
                  >
                    {selectedContact.phone ||
                      "Not provided"}
                  </p>

                </div>


                {/* PROJECT */}

                <div>

                  <p
                    className="
                      text-[11px]
                      text-[#8c7661]
                    "
                  >
                    Project
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#4d3d2f]
                    "
                  >
                    {selectedContact.project ||
                      "Not provided"}
                  </p>

                </div>


                {/* DATE */}

                <div>

                  <p
                    className="
                      text-[11px]
                      text-[#8c7661]
                    "
                  >
                    Date
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#4d3d2f]
                    "
                  >
                    {formatDate(
                      selectedContact.createdAt
                    )}
                  </p>

                </div>

              </div>


              {/* MESSAGE */}

              <div
                className="
                  bg-[#faf0e8]
                  rounded-lg
                  p-4
                "
              >

                <p
                  className="
                    text-[11px]
                    font-bold
                    text-[#8c7661]
                    mb-2
                  "
                >
                  Message
                </p>

                <p
                  className="
                    text-sm
                    text-[#4d3d2f]
                    whitespace-pre-line
                    leading-6
                  "
                >
                  {selectedContact.message ||
                    "No message"}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteContact && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-sm
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            {/* TOP */}

            <div
              className="
                bg-[#faf0e8]
                px-5
                py-5
                text-center
                border-b
                border-[#e3d3c2]
              "
            >

              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  mb-3
                  rounded-full
                  bg-[#f6ede0]
                  text-[#b07a4b]
                  flex
                  items-center
                  justify-center
                "
              >

                <FaTrash size={18} />

              </div>


              <h2
                className="
                  text-lg
                  font-bold
                  text-[#4d3d2f]
                "
              >
                Delete Contact?
              </h2>


              <p
                className="
                  text-xs
                  text-[#8c7661]
                  mt-1
                "
              >
                Are you sure you want to delete
                this contact?
              </p>

            </div>


            {/* CONTACT */}

            <div className="px-5 py-4">

              <div
                className="
                  flex
                  items-center
                  gap-3
                  bg-[#f6ede0]
                  rounded-xl
                  p-3
                "
              >

                {/* PROFILE */}

                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#c8a279]
                    text-white
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-bold
                    uppercase
                    flex-shrink-0
                  "
                >
                  {getInitial(
                    deleteContact.name
                  )}
                </div>


                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#4d3d2f]
                      truncate
                    "
                  >
                    {deleteContact.name}
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#8c7661]
                      truncate
                    "
                  >
                    {deleteContact.email}
                  </p>

                </div>

              </div>

            </div>


            {/* BUTTONS */}

            <div
              className="
                px-5
                pb-5
                flex
                gap-3
              "
            >

              {/* CANCEL */}

              <button
                onClick={() =>
                  setDeleteContact(null)
                }
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  border
                  border-[#e3d3c2]
                  text-[#4d3d2f]
                  text-sm
                  font-semibold
                  hover:bg-[#f6ede0]
                  transition
                "
              >
                Cancel
              </button>


              {/* DELETE */}

              <button
                onClick={handleDelete}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  bg-[#b07a4b]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-[#9a653d]
                  transition
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <FaTrash size={12} />

                Delete

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {successMessage && (

        <div
          className="
            fixed
            inset-0
            z-[300]
            flex
            items-center
            justify-center
            pointer-events-none
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              border
              border-[#e3d3c2]
              px-7
              py-5
              flex
              flex-col
              items-center
              min-w-[260px]
            "
          >

            {/* CHECK */}

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-[#f6ede0]
                text-[#b07a4b]
                flex
                items-center
                justify-center
                mb-3
              "
            >

              <FaCheck size={20} />

            </div>


            <h3
              className="
                text-base
                font-bold
                text-[#4d3d2f]
              "
            >
              Successfully Deleted
            </h3>


            <p
              className="
                text-xs
                text-[#8c7661]
                mt-1
              "
            >
              Contact has been removed.
            </p>

          </div>

        </div>

      )}

    </div>
  );
};

export default Contact;
