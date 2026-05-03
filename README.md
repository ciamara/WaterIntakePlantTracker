# Water Intake Plant Tracker

## About the app
Hydration Houseplant is a full-stack MVP application that allows users to track their daily water intake. However instead of boring charts, the visual indicator of your hydration is an animated plant. As you log the water you drink, the plant comes to life, grows, and flourishes, providing positive motivation to stay hydrated throughout the day.

### Main Features:
* **Water Logging:** Quickly add the amount of water you've consumed in milliliters.
* **Full CRUD Operations:** View your daily log history, edit entered values (e.g., if you made a typo), and delete entries.
* **Dynamic UI:** A real-time, responsive plant animation where the growth stage is directly tied to the percentage of your daily hydration goal (2000 ml).
* **Automatic Summaries:** Automatically calculates and displays the total water consumed for the current day.

---

## Technical Overview

The application is built on a client-server architecture, where the backend and frontend are two independent entities communicating via a REST API.

### Tech Stack:
* **Backend:** C# ASP.NET Core Web API (using controllers to maintain a clean, `RESTful` structure).
* **Database:** Entity Framework Core with an `In-Memory` database.
* **Frontend:** React (initialized with Vite).
* **Styling:** Vanilla CSS3.
* **Vector Animations:** The `lottie-react` library for rendering JSON-based vector animations.

### Notable Technical Solutions:
1. **Lottie Frame Control:** Instead of playing the plant animation on an infinite loop, the app uses the `useRef` hook to mathematically bind the animation frames to the daily hydration percentage. The frontend calculates the percentage (e.g., 50%), finds the corresponding frame in the JSON file, and uses the `goToAndStop()` method, turning the animation into a fluid, visual progress bar.
2. **CORS Configuration:** The backend includes a precisely configured Cross-Origin Resource Sharing (CORS) policy that allows secure communication with the local React development server (Vite), preventing browser blocking errors.

---

## Local Setup Instructions

The application consists of two separate parts that must be run simultaneously in two separate terminal windows.

**Prerequisites:** Make sure you have the **.NET SDK** (to run C#) and **Node.js** (to run React) installed on your machine.

### Step 1: Run the API (Backend)
1. Open your terminal (or command prompt).
2. Navigate to the main backend folder.
3. Start the C# server using the following command:
   ```bash
   dotnet run
4. The terminal will display the port the server is listening on.
5. Leave the terminal running in the background.
   
### Step 2: Run the Front-end (React)
1. Open a new second terminal.
2. Navigate to the frontend folder.
3. Download and install all required dependencies (including React and Lottie) by typing:
   ```bash
   npm install
4. Start the local Vite development server:
   ```bash
   npm run dev
6. The terminal will display a local URL. Click it or paste it into your browser's address bar.
