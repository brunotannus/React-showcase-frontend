## 📖 Project Description

The _React Showcase_ is a web application that combines newsletter reading functionalities with gamification. Users can increase their streaks (daily sequences) and high scores by interacting with newsletters, unlocking new avatars. The application also includes an administrative panel with useful metrics and statistics.

## 🚀 How to Run the Project Using Containers

The project can be easily run using Docker containers, eliminating the need to manually configure the MySQL database or install dependencies locally.

## 1\. Prerequisites

Ensure you have installed:

-   [Docker](https://www.docker.com/)
    
-   [Docker Compose](https://docs.docker.com/compose/)
    

## 2\. Clone the Repositories

Clone the frontend and backend repositories:

bash

`git clone https://github.com/brunotannus/reactshowcase-frontend.git frontend git clone https://github.com/brunotannus/reactshowcase-backend.git backend`

## 2\. Install Dependencies

Navigate to the frontend and backend folders separately and install the dependencies:

**In the frontend**

`npm install`

**In the backend**

`npm install`

## **Initialize the Containers**

In the project root, run the command to start all containers:

`docker compose -f ./backend/docker-compose.yml up --build`

This will do the following:

-   Create and start a container for MySQL.
    
-   Build the images for the backend and frontend and start their containers.
    
-   Map local ports to the services:
    
    -   Frontend at `http://localhost:3000`
        
    -   Backend at `http://localhost:3001`
        
    -   MySQL on port `3306`
        

## 🧪 **Testing the Application**

## 1\. Available Users for Testing

-   **Regular User**:
    
    -   Email: `user1@example.com`
        
    -   Password: `123`
        
-   **Administrator**:
    
    -   Email: `admin@example.com`
        
    -   Password: `123`
        

## 2\. Regular User Features

-   User `user1` starts without streaks or high scores.
    
-   Click on newsletters to increase your daily streak and try to achieve a high score.
    
-   Use the "Time Machine" at the top of the page to control the current day.
    
-   Rules to increase the streak:
    
    -   The user must read a newsletter posted on the same day.
        
    -   The newsletter must not have been read previously by the user.
        

## 3\. Administrator Features

-   The administrator can access the administrative panel that contains:
    
    -   A leaderboard with users' high scores generated randomly.
        
    -   Useful statistics about users.
        

## 📅 **Simulating Days and Posting Newsletters**

-   A new newsletter is automatically posted every day (except Sundays) until February 28, 2025.
    
-   Use the "Time Machine" to advance or reset days and test different scenarios.
    

## 🛠️ **Technical Details**

## Backend

-   The backend generates an array of 5 fictional users with random variables such as streak, high score, and beehive variables.
    
-   Default backend address: `http://localhost:3001`.
    

## Frontend

-   The frontend connects to the backend for authentication, reading newsletters, controlling streaks, and displaying statistics.
    
-   Default frontend address: `http://localhost:3000`.
    

## 📊 **Administrative Panel**

The administrative panel includes:

-   **Leaderboard**: Displays users' high scores generated randomly.
    
-   **Statistics**:
    
    -   Useful metrics about users, such as streaks, high scores, and interactions.
        

## 📝 **Final Considerations**

This project was developed to simulate a gamified experience in reading newsletters, allowing for complete testing with different scenarios. Enjoy exploring the features!

## 📝 **Test Video**

[screen-capture.webm](https://github.com/user-attachments/assets/0aeb8ecd-8b07-4c6e-8fbb-e81e18cd81a6)

🎉 **Good testing!**



