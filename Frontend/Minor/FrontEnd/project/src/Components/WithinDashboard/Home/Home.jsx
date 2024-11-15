import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const NotificationCard = ({ time, content, onClick }) => (
  <div
    onClick={onClick}
    className="p-5 bg-gray-50 rounded-lg shadow-md mb-6 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:bg-primary-lightest hover:shadow-xl active:scale-95"
  >
    <h1 className="text-lg font-semibold text-primary-darkest mb-2">New Notification</h1>
    <p className="text-sm text-primary-dark mb-3">{content}</p>
    <p className="text-xs text-primary-darker">Time: {time}</p>
  </div>
);

const Home = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  console.log(notifications);  // This will show the latest notifications when they change
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`d/jobs/${id}`);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6">
      {/* Left Column: Notifications */}
      <div className="flex-1 md:w-2/3 bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-auto md:h-screen  transition-shadow hover:shadow-xl">
        <h2 className="text-2xl font-bold text-primary-dark mb-6 border-b-2 border-primary-dark pb-2">
          Latest Notifications
        </h2>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            {...notification}
            onClick={() => handleCardClick(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
