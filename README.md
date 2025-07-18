# StudentPay

A full stack Student Fee Management System built with React, TypeScript, Tailwind CSS, and Firebase (Firestore & Auth).

## Features

- **Secure Authentication:** Email/password and Google sign up & login (Firebase Auth)
- **Profile Management:** View and edit student details (name, email)
- **Fee Payment:** Simulated payment form with toast notification and sound
- **All Students Page:** View all registered students and their fee status
- **Real-Time Updates:** Instantly reflects fee status and profile changes across all clients (Firestore listeners)
- **Responsive UI:** Modern, professional design with Tailwind CSS
- **Accessible:** Keyboard and screen reader friendly

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend/Database:** Firebase (Firestore, Auth)
- **Notifications:** react-toastify

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Setup:**
   - The project is pre-configured for Firebase. If you want to use your own Firebase project:
     - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
     - Enable Email/Password and Google authentication in Firebase Auth
     - Create a Firestore database
     - Replace the config in `src/lib/firebase.ts` with your own credentials

4. **Add Success Sound:**
   - Place your `success.mp3` file in the `public/` folder for payment notifications.

5. **Run the app:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

## Usage

- **Sign Up / Login:**
  - Use email/password or Google to register and log in.
- **Profile:**
  - View and edit your name/email.
  - See your fee payment status.
  - If fees are unpaid, click "Pay Fees" to simulate payment.
- **All Students:**
  - View all registered students and their fee status in real time.

## Project Structure

```
project/
  ├── public/
  │   └── success.mp3
  ├── src/
  │   ├── components/
  │   ├── contexts/
  │   ├── lib/
  │   └── ...
  ├── package.json
  ├── README.md
  └── ...
```

## License

This project is for educational/demo purposes. Feel free to use and modify for your own learning! 