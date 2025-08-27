import { react, useState } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <TabForm />
    </div>
  );
}
const TabForm = () => {
  const [formData, setFormData] = useState({
    name: "Hitesh",
    age: 20,
    email: "1hitesh@gmail.com",
    interests: ["coding", "reading"],
    theme: "dark",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    age: "",
    interests: "",
  });
  const tabs = [
    {
      name: "Profile",
      component: Profile,
      validate: () => {
        const err = {};
        if (formData.name.length < 2) {
          err.name = "invalid name";
        }
        if (formData.age < 18) {
          err.age = "under age";
        }
        if (!formData.email.includes("@")) {
          err.email = "invalid email";
        }
        setErrors(err);
        return err.name || err.age || err.email ? false : true;
      },
    },
    {
      name: "Interests",
      component: Interests,
      validate: () => {
        const err = {};
        if (formData.interests.length < 1) {
          err.interests = "atleast interests";
        }
        setErrors(err);
        return err.interests ? false : true;
      },
    },
    {
      name: "Settings",
      component: Settings,
      validate: () => true,
    },
  ];

  const ActiveTabComponent = tabs[activeTab].component;
  const handleNextClick = () => {
    if (tabs[activeTab].validate()) setActiveTab((prev) => prev + 1);
  };
  const handlePrevClick = () => {
    if (tabs[activeTab].validate()) setActiveTab((prev) => prev - 1);
  };
  const handleSubmitClick = () => {
    // make api call
    console.log(formData);
  };
  return (
    <div>
      <div className="heading-container">
        {tabs.map((tab, i) => {
          return (
            <div
              className="headings"
              tabIndex={i}
              key={tab}
              onClick={() => setActiveTab(i)}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
      <div className="tab-body">
        <ActiveTabComponent
          data={formData}
          errors={errors}
          setData={setFormData}
        />
      </div>
      <div>
        {activeTab === tabs.length - 1 && (
          <button onClick={handleSubmitClick}>Submit</button>
        )}
        {activeTab > 0 && <button onClick={handlePrevClick}>prev</button>}
        {activeTab < tabs.length - 1 && (
          <button onClick={handleNextClick}>next</button>
        )}
      </div>
    </div>
  );
};

const Profile = ({ data, setData, errors }) => {
  const { name, age, email } = data;
  const handleDataChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div>
      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" value={name} onChange={handleDataChange} />
        <span className="error">{errors.name}</span>
      </div>
      <div>
        <label htmlFor="email">email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleDataChange}
        />
        <span className="error">{errors.email}</span>
      </div>
      <div>
        <label htmlFor="age">age:</label>
        <input id="age" type="number" value={age} onChange={handleDataChange} />
        <span className="error">{errors.age}</span>
      </div>
    </div>
  );
};

const Interests = ({ data, setData, errors }) => {
  const { interests } = data;
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      interests: e.target.checked
        ? [...prev.interests, e.target.name]
        : prev.interests.filter((i) => i !== e.target.name),
    }));
  };
  return (
    <div>
      <div>
        <label htmlFor="coding">
          <input
            id="coding"
            type="checkbox"
            checked={interests.includes("coding")}
            name="coding"
            onChange={handleChange}
          />
          Coding
        </label>
      </div>
      <div>
        <label htmlFor="reading">
          <input
            id="reading"
            type="checkbox"
            checked={interests.includes("reading")}
            name="reading"
            onChange={handleChange}
          />
          reading
        </label>
      </div>
      <div>
        <label htmlFor="js">
          <input
            id="js"
            type="checkbox"
            checked={interests.includes("js")}
            name="js"
            onChange={handleChange}
          />
          js
        </label>
      </div>
      {errors.interests && <span className="error">{errors.interests}</span>}
    </div>
  );
};

const Settings = ({ data, setData, errors }) => {
  const { theme } = data;
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      theme: e.target.name,
    }));
  };
  return (
    <div>
      <div>
        <label htmlFor="dark">
          <input
            id="dark"
            type="radio"
            name="dark"
            checked={theme == "dark"}
            onChange={handleChange}
          />
          dark
        </label>
      </div>
      <div>
        <label htmlFor="light">
          <input
            type="radio"
            name="light"
            id="light"
            checked={theme == "light"}
            onChange={handleChange}
          />
          light
        </label>
      </div>
    </div>
  );
};
