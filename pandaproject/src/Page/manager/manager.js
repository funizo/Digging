import React, { useState, useEffect } from "react";
import "./manager.css";
import Toolbar from "../../components/toolbar/toolbar";

function Manager() {
  const [userInfo, setUserInfo] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // 서버에서 사용자 정보를 가져오는 함수
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
    const selectedUser = userInfo.find((user) => user._id === userId);
    setInputValue(selectedUser.alert || ""); // 선택된 사용자의 alert 값을 가져오기
  };

  const handleSaveClick = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/manager/userInfo/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ alert: inputValue }),
        }
      );

      if (response.ok) {
        console.log("Alert field updated successfully");
        const updatedUserInfo = userInfo.map((user) => {
          if (user._id === userId) {
            return { ...user, alert: inputValue };
          }
          return user;
        });
        setUserInfo(updatedUserInfo);
        setSelectedUserId(null);
      } else {
        throw new Error("Failed to update alert field");
      }
    } catch (error) {
      console.error("Error updating alert field:", error);
    }
  };

  return (
    <div>
      <Toolbar />
      <h2 className="user_info">User Information</h2>
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
                  value={inputValue || ""}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  className="send_button"
                  onClick={() => handleSaveClick(user._id)}
                >
                  Save
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Manager;
