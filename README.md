# BetMate: Frontend and Backend READMEs (Single Markdown File)

Below is **one** markdown file that contains two sections:
1. **FRONTEND/README.md** content
2. **BACKEND/README.md** content

You can download this entire `.md` file, save it locally (e.g., `BetMate_READMEs.md`), and then copy/paste each section into your respective `frontend/README.md` and `backend/README.md` if desired.

---

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

---

## BACKEND/README.md

This is the **Node.js + Express** backend for **BetMate**, using **Prisma** and **PostgreSQL** to handle data storage and logic.

### Features
- **RESTful API**: Manages user auth, friend requests, bet logic, and match updates.
- **Prisma ORM**: Simplifies PostgreSQL interactions.
- **JWT-based** authentication: Cookies store the JWT securely.
- **Cricbuzz (via RapidAPI)** integration for real match data (optional).

### Endpoints Overview
- **Auth**: `/api/auth/` (register, login, logout, validate)
- **Matches**: `/api/matches/` (fetch matches, update from Cricbuzz)
- **Bets**: `/api/bets/` (initiate toss, choose team, get user bets)
- **Friends**: `/api/friends/` (send request, accept/decline, remove betmate)
- **Users**: `/api/users/` (search, get user data)

### Project Structure

    backend/
    ├─ app.js
    ├─ server.js
    ├─ prisma/
    ├─ controllers/
    ├─ routes/
    ├─ middleware/
    ├─ prismaClient.js
    └─ ...

### Getting Started
1. **Install Dependencies**:

       cd backend
       npm install

2. **Create `.env`** with environment variables, for example:

       DATABASE_URL=postgresql://user:password@localhost:5432/betmate
       JWT_SECRET=super_secret_key
       X_RAPIDAPI_KEY=your_rapidapi_key
       PORT=3000
       NODE_ENV=development

3. **Run Migrations**:

       npx prisma migrate dev

4. **Start the Server**:

       npm start

   By default, it listens on `http://localhost:3000`.

5. **(Optional)** Use helper scripts like `insertTestMatches.js` to populate sample data.

### Contributing
Feel free to open issues or pull requests.

### License
Provided for **friendly betting**—no real money involved.  
Distributed as-is, with no warranties. If needed, apply a suitable open-source license (e.g., MIT).

---
