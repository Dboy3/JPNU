import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";

const AddNotifications = () => {
  // const [notifications, setNotifications] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      time: "14/11/2024, 17:23:07",
      content:
        "Tech Corp is hiring a Software Developer to develop and maintain web applications. The application window opens on 12th August 2024 at 7:30 AM and closes on 14th August 2024 at 12:00 AM.",
    },
    {
      id: 2,
      time: "13/11/2024, 09:15:30",
      content:
        "Reminder: Application deadline approaching for Design Intern position at Creative Minds Inc. Closes on 15th November 2024.",
    },
    {
      id: 3,
      time: "10/11/2024, 14:50:15",
      content:
        "New opening: Data Analyst role at Analytics Solutions. Apply before 20th November 2024.",
    },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddNotification = () => {
    setCurrentNotification(null);
    reset();
    setShowForm(true);
  };

  const handleEditNotification = (notification) => {
    setCurrentNotification(notification);
    reset({ content: notification.content });
    setShowForm(true);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const onSubmit = (data) => {
    const newNotification = {
      id: currentNotification ? currentNotification.id : Date.now(),
      time: new Date().toLocaleString(),
      content: data.content,
    };

    if (currentNotification) {
      setNotifications(
        notifications.map((notification) =>
          notification.id === currentNotification.id
            ? newNotification
            : notification
        )
      );
    } else {
      setNotifications([...notifications, newNotification]);
    }

    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleAddNotification}
        >
          + Add Notification
        </button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications available. Add one using the button above.</p>
      ) : (
        <div className="grid gap-8">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-6 border rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">
                    <strong>Time:</strong> {notification.time}
                  </p>
                  <p className="mt-4">{notification.content}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditNotification(notification)}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl mb-4">
              {currentNotification ? "Edit Notification" : "Add Notification"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Notification Content
                </label>
                <textarea
                  {...register("content", { required: true })}
                  className="border px-4 py-2 rounded w-full"
                  rows="4"
                ></textarea>
                {errors.content && (
                  <p className="text-red-500 text-sm">Content is required</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {currentNotification
                    ? "Update Notification"
                    : "Add Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNotifications;
