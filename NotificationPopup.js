import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <NotificationSystem />
    </div>
  );
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([
    // { text: "Notification 1", id: 1 },
    // { text: "Notification 2", id: 2 },
  ]);

  const addNotification = () => {
    const note = {
      id: notifications.length + 1,
      text: `Notification is with id ${notifications.length + 1}`,
    };
    setNotifications((prev) => [...prev, note]);
  };
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <button onClick={addNotification}>Add</button>
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: "20px",
          position: "absolute",
          bottom: 20,
          right: 20,
          height: "80%",
          overflowY: "auto",
          // scrollbarWidth: "none",
        }}
      >
        {notifications.map((N, i) => (
          <NotificationCard
            key={N.id}
            text={N.text}
            id={N.id}
            onClose={() => removeNotification(N.id)}
          />
        ))}
      </div>
    </div>
  );
};

const NotificationCard = ({ text, id, onClose }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return prev + 100 / 30; // 100% in 3 seconds 30 steps
      });
    }, 100);

    const timerId = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      style={{
        border: "1px solid red",
        padding: "10px",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "lightcoral",
      }}
    >
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <h3>Notification - {id}</h3>
        <button onClick={onClose} style={{ height: "20px", cursor: "pointer" }}>
          X
        </button>
      </div>
      <p>{text}</p>
      <progress
        id="timer"
        value={progress}
        max="100"
        style={{ backgroundColor: "green", borderRadius: "10px", width: "90%" }}
      ></progress>
      {/* Custom progress bar */}
      <div
        style={{
          width: "90%",
          height: "10px",
          backgroundColor: "#eee",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "green",
            borderRadius: "10px",
            transition: "width 0.1s linear",
          }}
        ></div>
      </div>
    </div>
  );
};

/* Fully styling <progress> is limited and inconsistent across browsers.

For complex UIs, it's often better to use a custom-styled div-based progress bar. */