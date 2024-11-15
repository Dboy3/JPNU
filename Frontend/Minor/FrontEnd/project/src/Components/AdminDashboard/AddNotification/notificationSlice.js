import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initState = {
  notifications: [],
  state: null,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotification",
  async () => {
    console.log("fetchNotifications is called");

    // Make sure the URL is correct and does not contain any invisible characters.
    const response = await fetch("http://localhost:8000/api/notification/pull");

    // If the response is not okay, throw an error.
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    // Parse the JSON data from the response
    const data = await response.json();
    console.log("The data: ", data);

    // Return the data to be used in the reducer
    return data;
  }
);

export const addNotificationAync = createAsyncThunk(
  "notifications/addNotification",
  async (obj) => {
    const response = await fetch(
      "http://localhost:8000/api/notification/push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(obj),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add notification");
    }
    const data = await response.json();
    console.log("the notification is ",data.notification);
    return data.notification;
  }
);

// Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: initState,
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        ...action.payload,
        id: Date.now(),
        time: new Date().toLocaleString(),
      };
      state.notifications.push(newNotification);
    },
    editNotification: (state, action) => {
      const { id, content } = action.payload;
      const notification = state.notifications.find((notif) => notif.id === id);
      if (notification) {
        notification.content = content;
        notification.time = new Date().toLocaleString();
      }
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(addNotificationAync.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.notifications.push(action.payload);
      });
  },
});

export const { addNotification, editNotification, deleteNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;

export const getNotificationList = (state) => state.notifications.notifications;
