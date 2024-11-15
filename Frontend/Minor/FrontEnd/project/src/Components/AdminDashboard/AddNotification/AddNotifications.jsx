import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  editNotification,
  deleteNotification,
} from "./notificationSlice";

const AddNotifications = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingNotificationId, setEditingNotificationId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddNotification = () => {
    setEditingNotificationId(null);  // Clear editing state for new notification
    reset();  // Reset form values
    setShowForm(true);  // Show form
  };

  const handleEditNotification = (notification) => {
    setEditingNotificationId(notification.id);  // Set the id of the notification being edited
    reset({ content: notification.content });  // Pre-fill form with existing content
    setShowForm(true);  // Show form
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id)); // Ensure it's correctly deleting from Redux
  };

  const onSubmit = (data) => {
    if (editingNotificationId) {
      // Editing an existing notification
      dispatch(editNotification({ id: editingNotificationId, content: data.content }));
    } else {
      // Adding a new notification
      dispatch(addNotification({ content: data.content }));
    }

    setShowForm(false);  // Hide the form after submit
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
              {editingNotificationId ? "Edit Notification" : "Add Notification"}
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
                  {editingNotificationId
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
