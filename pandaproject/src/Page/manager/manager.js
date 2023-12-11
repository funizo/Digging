import React, { useState, useEffect } from "react";
import "./manager.css";

function Manager() {
  const [userInfo, setUserInfo] = useState([]);
  const [alertValue, setAlertValue] = useState("");
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
    setAlertValue(""); // 폼 초기화
  };

  const handleSaveClick = (userId) => {
    // 서버에 업데이트 요청 보내는 함수
    async function updateUserAlert(userId, alertValue) {
      try {
        const response = await fetch(
          `http://localhost:8080/manager/user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              alert: alertValue,
            }),
          }
        );

        if (response.ok) {
          // 성공 시
          console.log("User alert updated successfully");
          setSelectedUserId(null); // 선택된 사용자 초기화
          setAlertValue(""); // 폼 초기화
        } else {
          throw new Error("Failed to update user alert");
        }
      } catch (error) {
        console.error("Error updating user alert:", error);
      }
    }

    updateUserAlert(userId, alertValue);
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
