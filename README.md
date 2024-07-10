
# Project Management Software

Welcome to the Collaborative Project Management Software! This application is designed to streamline project management for teams, providing tools for task assignment, issue tracking, and workspace organization. Built with React and Node.js, the system uses JWT-based authentication and MongoDB for secure and efficient data management.

## 

<details>
    <summary>Click here to view images</summary> 
  <img src="Images/Home.png" alt="Image 1" width="600" />
  <img src="Images/Login.png" alt="Image 1" width="600" />
  <img src="Images/WorkSpace_Dashboard.png" alt="Image 1" width="600" />
  <img src="Images/Workspace_Setting.png" alt="Image 1" width="600" />
  <img src="Images/Project_Dashboard.png" alt="Image 1" width="600" />
  <img src="Images/Sprint_Issue.png" alt="Image 1" width="600" />
  <img src="Images/Project_Setting.png" alt="Image 1" width="600" />
  <img src="Images/Create_Issue.png" alt="Image 1" width="600" />
  <img src="Images/Issue_Info.png" alt="Image 1" width="600" />
  <img src="Images/Analytic_Page.png" alt="Image 1" width="600" />


</details>





## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Group Members and Roles](#group-members-and-roles)

## About the Project

This collaborative project management system helps teams manage their tasks and workflows efficiently. Users can create and manage workspaces, invite team members, and assign roles. Each workspace can contain multiple projects, allowing for organized and focused collaboration. Within each project, users can create and manage issues, move them through different stages, and analyze project progress using pie and bar charts. Additionally, users can create sprints to organize their work into manageable timeframes, improving productivity and tracking progress effectively.
## Tech Stack

- **Frontend**: React, Redux
- **Backend**: Node.js, Express
- **Authentication**: JWT (JSON Web Token)
- **Database**: MongoDB
- **Middleware**: Express.js
- **Testing**: Jest, Supertest
## Features

- User authentication and authorization with JWT
- Creation and management of multiple workspaces
- Invitation and management of workspace and project members
- Project and issue management within workspaces
- Task assignment and issue tracking
- Moveable issue management
- Project progress analysis with pie and bar charts
- Sprint creation and management
- User-friendly interface with responsive design

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Node.js and npm installed on your local machine
- MongoDB installed and running

### MongoDB Setup

1. Create an account on MongoDB Atlas.
2. Create a new project named `SE-Project`.
3. Create a cluster and get the connection URL.
4. Use this connection URL in the backend `.env` file.


### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Patel-Het03/SE_Project-Management-Software
    ```
    ```
    cd SE_Project-Management-Software/server
    ```

2. Make changes in `.env` file in the `server` directory with the following content:

    ```bash
    SECRET_KEY=your_secret_key_to_generate_usertoken
    MAIL_USER=your_email_to_send_otp_to_user
    MAIL_PASS=your_email_app_password (not email login password)
    MONGO_URI=your_mongodb_connection_url
    SMTP_SERVER=smtp.gmail.com
    ```

3. Install the dependencies and run the server:
    ```bash
    npm install
    nodemon server.js
    ```
### Frontend Setup

1. Open a new terminal window or tab.

2. Navigate to the client directory:
    ```bash
    cd SE_Project-Management-Software/client
    ```

3. Make changes a `.env` file in the `client` directory with the following content:
    ```env
    REACT_APP_BACKEND_BASE_URL = http://localhost:8000
    ```

4. Install the dependencies and run the frontend:
    ```bash
    npm install
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or login with an existing account.
3. Create and manage your workspaces, projects, and issues.


## Group Members and Roles

- **Manav Kumar** ([GitHub](https://github.com/optimuscodetron)): Project leader
- **Patel Het** ([GitHub](https://github.com/Patel-Het03)): Pod-1 Lead,Backend developer
- **Kushagra sharma** ([GitHub](https://github.com/Kushagrasharma18)): Pod-2 Lead,Backend developer
- **Nikhil Garg** ([GitHub](https://github.com/Nikhilg657)): Pod-1 Scrum master,Frontend developer
- **Khushboo Gupta** ([GitHub](https://github.com/khushboo56)): Pod-2 Scrum master,Frontend developer
- **Harsh Vavadiya** ([GitHub](https://github.com/HarshVavadiya2)): Pod-1 Frontend developer
- **Ayush Sahu** ([GitHub](https://github.com/AyushSahu1306)): Pod-2 Frontend developer
- **Shushil Kumar** ([GitHub](https://github.com/mrsushilkumar)): Frontend Tester
- **Chetan** ([GitHub](https://github.com/kamble268)): Pod-2 Frontend developer
- **Priyanshu Kumar** ([GitHub](https://github.com/PriyanshuKumar88885)): Pod-2 Frontend developer, Web designer
- **Piyush Kumar** ([GitHub](https://github.com/piuspk)): Pod-2 Backend developer


