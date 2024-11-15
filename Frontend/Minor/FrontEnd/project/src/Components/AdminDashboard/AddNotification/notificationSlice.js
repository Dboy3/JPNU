import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  notifications: [
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
  ],
};

// Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
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
});

export const { addNotification, editNotification, deleteNotification } =
  notificationSlice.actions;



export default notificationSlice.reducer;
