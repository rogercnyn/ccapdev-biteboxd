# Introduction

Welcome to BiteBoxd! BiteBoxd is a web application designed to revolutionize the culinary exploration experience by centralizing restaurant reviews and empowering a diverse community of users to contribute their unique insights and preferences.

Link to site: https://biteboxd.onrender.com/

## Setting Up and Running the Application Locally

To set up and run the application locally on your machine, follow these simple steps:
Certainly! Below are the steps to run the application on both macOS and Windows:

### macOS:

1. **Clone the Repository**:
    Open Terminal and run the following command:
    ```bash
    git clone https://github.com/cookietriestoprogram/ccapdev-biteboxd.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd ccapdev-biteboxd
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run the Application**:
    ```bash
    node app.js
    ```

5. **Access the Application**:
    Open your web browser and visit `http://localhost:3000`.

### Windows:

1. **Clone the Repository**:
    Open Command Prompt and run the following command:
    ```bash
    git clone https://github.com/cookietriestoprogram/ccapdev-biteboxd.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd ccapdev-biteboxd
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run the Application**:
    ```bash
    node app.js
    ```

5. **Access the Application**:
    Open your web browser and visit `http://localhost:3000`.

Make sure you have Node.js installed on your system before running the application. If you encounter any issues during the installation or running process, feel free to reach out for further assistance!


## Description of the Web Application

BiteBoxd is a platform dedicated to centralizing restaurant reviews and fostering a community-driven approach to culinary exploration. Here are some key features of the web application:

### Login
- Users can register or log in using their existing username and password.
- Account credentials are validated against the user data stored in the database.
- Upon successful login, users are redirected to their profile page.

### Logout
- Users can log out of their accounts, which redirects them to the login page.
- Account data becomes inaccessible until the user logs in again.

### Register a Foodie Profile
- Visitors can register by providing a username, password, avatar, bio, and taste profile.
- Taste profiles include tags such as salty, sweet, sour, bitter, Japanese, Chinese, Korean, Italian, and Indian.
- Registered users can leave contextualized reviews based on their taste preferences.

### Review a Restaurant
- Registered users can leave reviews comprising a title, rating system, and textual body.
- Rating criteria include food quality, service, and price, with corresponding weights for computing the overall score.
- Users can also upload up to 4 pictures to complement their reviews.

### View Restaurants
- Unregistered visitors can view a list of featured establishments with details such as name, location, price range, and rating.
- Clicking on a restaurant opens its review page.

### Search Restaurants/Reviews
- Users can search for restaurants by name, menu, location, or rating.
- Reviews can be filtered based on keywords, rating range, or reviewer's taste profile.

### Edit/Delete Review
- Users can edit or delete their reviews, with an additional confirmation prompt for security.

### View a User Profile
- Each user has a dedicated profile page showcasing their details, credibility, profile picture, bio, and taste profile.
- Visitors can view mutual restaurant visits and latest reviews.

### Edit Profile
- Logged-in users can edit their profile details.

### Restaurant Owner Response
- Restaurant owners can respond to user reviews to address concerns and improve services.

### Discover Restaurants
- Users are directed to trending restaurants aligned with their taste profile and friend recommendations.

## Conclusion

BiteBoxd aims to provide a comprehensive platform for culinary enthusiasts to share their experiences, discover new restaurants, and connect with like-minded foodies. Start exploring today!

Sure, here's the updated section with the contributors added:

## Contributors

- [Mark Daniels Aquino](https://github.com/Mark03-lab)
- [Roger Canayon](https://github.com/rogercnyn)
- [Maria China Ortiz](https://github.com/cookietriestoprogram)
- [Yumi Ann Pangan](https://github.com/pngnyume)

