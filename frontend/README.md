## FRONTEND/README.md

This is the **React + Tailwind** frontend for **BetMate**, a friendly betting web application for IPL matches.

### Features
- **Responsive UI**: Built with Tailwind CSS.
- **React Router**: Seamless page navigation.
- **Context-based** state management with `AuthContext` (for user auth) and `MatchContext` (for selected matches).
- **Axios** for backend communication.

### Pages
- **LandingPage**: Public homepage for non-logged-in users.
- **SignIn** / **SignUp**: Authentication forms.
- **HomePage**: Displays matches filtered by status (active, upcoming, completed) once a betmate is selected.
- **BetMates**: Manage friend requests (accept/decline), remove betmates.
- **CoinFlip**: Initiate a coin toss or view results, then pick teams if you won.
- **CurrentBets**: Lists all ongoing or past bets for the logged-in user.
- **MyPoints**: Shows total points vs. a selected betmate, plus a match-by-match breakdown.

### Project Structure

    frontend/
    ├─ src/
    │  ├─ pages/
    │  ├─ components/
    │  ├─ context/
    │  ├─ apiConfig.js
    │  └─ ...
    ├─ public/
    ├─ package.json
    └─ ...

### Getting Started
1. **Install Dependencies**:

       cd frontend
       npm install

2. **Configure Environment**:  
   Create a `.env` file (or set environment variables) for `VITE_BACKEND_API_URL`:

       VITE_BACKEND_API_URL=http://localhost:3000

3. **Run Development Server**:

       npm run dev

   The app typically runs at `http://localhost:5173`.

### Contributing
- Open issues or pull requests on GitHub.
- For major changes, discuss them first.

### License
BetMate is for **friendly betting only**—no real money is involved.  
Provided as-is, with no warranties. If you plan to distribute widely, add an open-source license (e.g., MIT).