# Welcome to my project

## Project info

## How can I edit this code?

There are several ways of editing your application.

Changes made will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# HealthMate Application

A comprehensive health and fitness tracking application.

## Setting Up Google Sign-In

To enable Google Sign-In in this application, you need to set up Firebase:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup steps
   - Enable Google Analytics if desired

2. **Register Your Web App**:
   - In your Firebase project, go to Project Settings (gear icon)
   - Scroll down to "Your apps" section and click the web icon (</>) 
   - Register your app with a name (e.g., "HealthMate")
   - Firebase will generate configuration settings

3. **Update Firebase Configuration**:
   - Open `src/lib/firebase.ts` in your project
   - Replace the placeholder firebaseConfig object with your own configuration:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Enable Google Auth in Firebase**:
   - In Firebase Console, go to Authentication
   - Click "Set up sign-in method"
   - Enable Google as a sign-in provider
   - Add your authorized domain (localhost for development)
   - Save the changes

5. **Run Your Application**:
   - After saving the configuration, rebuild your application
   - The "Sign in with Google" button should now work properly

## Starting the Application

1. Start the backend server:
   ```
   node server.js
   ```

2. In a separate terminal, start the frontend:
   ```
   npm run dev
   ```

3. Access the application at http://localhost:5173
