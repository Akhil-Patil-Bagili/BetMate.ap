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