import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Fetch all notifications on component mount
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/notification/pull");
        const data = await response.json();
        if (response.ok) {
          setNotifications(data);
        } else {
          console.error("Error fetching notifications:", data.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleAddNotification = () => {
    reset();
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/notification/push",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: data.content }),
          credentials : "include"
        }
      );

      const result = await response.json();
      if (response.ok) {
        setNotifications((prev) => [result.notification, ...prev]);
        setShowForm(false);
      } else {
        console.error("Error adding notification:", result.message);
      }
    } catch (error) {
      console.error("Error adding notification:", error);
    }
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
              key={notification._id}
              className="p-6 border rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">
                    <strong>Time:</strong>{" "}
                    {new Date(notification.date).toLocaleString()}
                  </p>
                  <p className="mt-4">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl mb-4">Add Notification</h2>
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
                  Add Notification
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
