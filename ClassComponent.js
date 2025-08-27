import React, { Component } from 'react';
import './styles.css';

// Hardcoded user object
const user = {
  name: 'Jane Doe',
  bio: 'Frontend developer who loves React and coffee \u2615\ufe0f',
  image: 'https://do6gp1uxl3luu.cloudfront.net/question-webp/dummyUser.jpg'
};

class UserProfile extends Component {
  constructor(props) {
    super(props); // Calls the parent class's constructor and passes props, 
    // required when using 'this' in constructor
    // Initialize component state
    this.state = {
      showBio: false // Flag to control visibility of user bio
    };
  }

  // Toggles the value of showBio in state
  toggleBio = () => {
    this.setState(prev => ({
      showBio: !prev.showBio
    }));
  }

  render() {
    return (
      <div className="user-profile"> 
        {/* User avatar */}
        <img
          style={{ height: '50px', borderRadius: '50%' }}
          src={user.image}
          alt="User Avatar"
        />

        {/* User name */}
        <h2>{user.name}</h2>

        {/* Toggle button to show/hide bio */}
        <button onClick={this.toggleBio}>
          {this.state.showBio ? 'Hide Bio' : 'Show Bio'}
        </button>

        {/* Conditionally render bio if showBio is true */}
        {this.state.showBio && <p>{user.bio}</p>}
      </div>
    );
  }
}

export default UserProfile;
