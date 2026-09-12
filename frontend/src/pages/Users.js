import React, { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader";
import {
  getUserList,
  registerUser,
  deleteUser,
} from "../services/userService";

import Swal from "sweetalert2";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import "./users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= MODAL STATES =================
  const [showModal, setShowModal] = useState(false);

  const [viewModal, setViewModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // ================= FORM STATE =================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const tableRef = useRef(null);

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUserList();

      setUsers(data || []);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    loadUsers();
  }, []);

  // ================= DATATABLE =================
  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    if (users.length > 0) {
      setTimeout(() => {
        $(tableRef.current).DataTable({
          pageLength: 10,
          responsive: true,
          autoWidth: false,
          destroy: true,
        });
      }, 0);
    }
  }, [users]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD USER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.message || "User Added Successfully",
      });

      setShowModal(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });

      await loadUsers();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to register user",
      });
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5645d9",
      cancelButtonColor: "#e5484d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteUser(id);

        await loadUsers();

        Swal.fire(
          "Deleted!",
          res.message || "User deleted successfully",
          "success"
        );
      } catch (error) {
        console.error(error);

        Swal.fire(
          "Error!",
          error.response?.data?.message || "Failed to delete user",
          "error"
        );
      }
    }
  };

  // ================= VIEW USER =================
  const handleView = (user) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  // ================= EDIT USER =================
  const handleEdit = (user) => {
    setSelectedUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      password: "",
    });

    setEditModal(true);
  };

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="users-banner">
        <div className="banner-left">
          <i className="bi bi-people-fill"></i>
          <div>
            <h2>User list</h2>
            <p>
              Total users: <span className="banner-count">{users.length}</span>
            </p>
          </div>
        </div>

        <button className="add-user-btn" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i>
          Add User
        </button>
      </div>

      {/* LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <div className="users-table-wrap">
          <table
            ref={tableRef}
            className="display users-table w-100"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th width="150">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td className="muted">{index + 1}</td>

                  <td className="cell-strong">{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{user.address}</td>

                  <td>
                    <span className="status-badge">
                      {user.status || "Active"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      {/* VIEW */}
                      <button
                        className="icon-btn sky"
                        onClick={() => handleView(user)}
                        title="View user"
                      >
                        <FaEye />
                      </button>

                      {/* EDIT */}
                      <button
                        className="icon-btn violet"
                        onClick={() => handleEdit(user)}
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      <button
                        className="icon-btn rose"
                        onClick={() => handleDelete(user._id)}
                        title="Delete user"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="user-modal-backdrop">
          <div className="user-modal modal-lg">
            <div className="modal-header-custom">
              <h5>Add User</h5>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body-custom">
                <div className="form-grid">
                  <div className="form-group-custom">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group-custom span-2">
                    <label>Address</label>
                    <textarea
                      rows="3"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn-outline-action cancel"
                  onClick={() => setShowModal(false)}>
                  Close
                </button>
                  <button type="submit" className="add-user-btn">
                    Save User
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewModal && selectedUser && (
        <div className="user-modal-backdrop">
          <div className="user-modal">
            <div className="modal-header-custom">
              <h5>View User</h5>
              <button
                className="modal-close-btn"
                onClick={() => setViewModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              <div className="view-row">
                <span className="view-label">Name</span>
                <span className="view-value">{selectedUser.name}</span>
              </div>
              <div className="view-row">
                <span className="view-label">Email</span>
                <span className="view-value">{selectedUser.email}</span>
              </div>
              <div className="view-row">
                <span className="view-label">Phone</span>
                <span className="view-value">{selectedUser.phone}</span>
              </div>
              <div className="view-row">
                <span className="view-label">Address</span>
                <span className="view-value">{selectedUser.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editModal && (
        <div className="user-modal-backdrop">
          <div className="user-modal modal-lg">
            <div className="modal-header-custom">
              <h5>Edit User</h5>
              <button
                className="modal-close-btn"
                onClick={() => setEditModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              <div className="form-grid">
                <div className="form-group-custom">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-custom">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-custom">
                  <label>Address</label>
                  <input
                    type="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                 <div className="form-group-custom">
                  <label>Mobile</label>
                  <input
                    type="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-custom">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                 
              </div>
              <button type="submit" className="add-user-btn">
                  Update User
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
