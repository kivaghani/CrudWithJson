import React, { useEffect, useState } from "react";
import axios from "axios";
import "./app.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    userCity: "",
    salary: "",
    mobile: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // Fetch users from the JSON server
  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file change for the profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: URL.createObjectURL(file) });
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      console.log("Updating user with id:", editUserId); // Log to check the user ID
      axios
        .put(`http://localhost:3000/users/${editUserId}`, formData)
        .then((response) => {
          setUsers(
            users.map((user) =>
              user.id === editUserId ? response.data : user
            )
          );
          setIsEditing(false);
          setEditUserId(null);
          resetForm();
        })
        .catch((error) => console.log("Error while updating:", error));
    } else {
      axios
        .post("http://localhost:3000/users", { ...formData, id: Date.now() })
        .then((response) => {
          setUsers([...users, response.data]);
          resetForm();
        })
        .catch((error) => console.log(error));
    }
  };

  // Reset the form after submission
  const resetForm = () => {
    setFormData({
      name: "",
      userCity: "",
      salary: "",
      mobile: "",
      profilePicture: "",
    });
  };

  // Handle editing the user
  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    setFormData(user);
    setIsEditing(true);
    setEditUserId(id);
  };

  // Handle deleting the user
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <label>City</label>
        <input
          type="text"
          name="userCity"
          value={formData.userCity}
          onChange={handleInputChange}
        />

        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleInputChange}
        />

        <label>Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
        />

        <label>Profile Picture</label>
        <input type="file" name="profilePicture" onChange={handleFileChange} />

        <button type="submit" className="submit-btn">
          {isEditing ? "Update" : "Submit"}
        </button>
      </form>

      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Salary</th>
            <th>Mobile</th>
            <th>Profile Picture</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.userCity}</td>
              <td>{user.salary}</td>
              <td>{user.mobile}</td>
              <td>
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    style={{ width: "50px", height: "50px" }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
