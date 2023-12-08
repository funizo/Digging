import React, { useState, useEffect } from "react";
import "./manager.css";

function Manager() {
  const [userInfo, setUserInfo] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [alertValue, setAlertValue] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("http://localhost:8080/manager/userInfo");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          throw new Error("Failed to fetch user information");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    }

    fetchUserInfo();
  }, []);

  const handleEditClick = (userId) => {
    setSelectedUserId(userId);
    setAlertValue(null); // 폼 초기화
  };

  return (
    <div>
      <h2>User Information</h2>
      <ol>
        {userInfo.map((user, index) => (
          <li key={index}>
            <strong>Username:</strong> {user.username}, <strong>Email:</strong>{" "}
            {user.email}
            <strong>Address:</strong>
            {user.address}
            <br />
            <button
              className="edit_button"
              onClick={() => handleEditClick(user._id)}
            >
              Edit Alert
            </button>
            {selectedUserId === user._id && (
              <div>
                <input
                  type="text"
                  value={alertValue || ""}
                  onChange={(e) => setAlertValue(e.target.value)}
                />
                <button className="send_button">Save</button>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Manager;
