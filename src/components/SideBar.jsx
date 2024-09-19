import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const storedUsername = await localStorage.getItem('username');
      const storedPassword = await localStorage.getItem('password'); 
      setUsername(storedUsername);
      setPassword(storedPassword);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setNewUsername(username); // Set current username in the input
    setNewPassword(''); // Clear password field
    setIsModalOpen(true); // Open the modal
  };

  const handleSave = async () => {
    try {
      // Update local storage
      await localStorage.setItem('username', newUsername);
      const isAdmin = JSON.parse(await localStorage.getItem("isAdmin"));
    //   alert(isAdmin)
    //   await localStorage.setItem('password', newPassword); // Update password in local storage

      // Update the username and password in the database
      const userId = await localStorage.getItem('userId'); // Assuming you have userId stored
      await axios.put(`http://localhost:5000/user/${userId}`, { username: newUsername, password: newPassword, isAdmin: isAdmin ? isAdmin : false });

      setUsername(newUsername); // Update local state
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleLogout = async() => {
    await localStorage.removeItem('userId')
    await localStorage.removeItem('isAdmin')
    await localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="h-screen min-w-72 flex flex-col items-start border-r-2">
      <img
        src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
        alt="User Avatar"
        className="mb-4 w-24 h-24 rounded-full object-contain"
      />
      <p className="text-lg font-semibold">Username: {username}</p>
      <p className="text-md mb-2">Password: ****</p>
      <div className='flex gap-2 mt-4'>
      <button
        className="text-white bg-indigo-500 px-4 py-2 rounded-md"
        onClick={handleEditClick}
      >
        Edit
      </button>
      <button
        className="text-white bg-indigo-500 px-4 py-2 rounded-md"
        onClick={handleLogout}
      >
        Logout
      </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit User Details</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Enter new username"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Enter new password"
            />
            <div className="flex justify-end">
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
