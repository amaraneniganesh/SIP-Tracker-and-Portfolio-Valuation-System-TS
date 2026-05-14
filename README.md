# SIP Tracker and Portfolio Valuation System

A backend fintech solution for managing Systematic Investment Plans (SIPs), mutual funds, and investor portfolios. This system ensures data integrity through a normalized relational database and provides secure REST APIs for financial operations.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript  |
| Database | Relational (Normalized to 3NF) |
| API Documentation | Postman |
| Authentication | JWT (JSON Web Tokens) |

---

## Features

- **Investor Management** – Secure registration, login, and profile tracking.
- **Mutual Fund Management** – CRUD operations for funds and real-time NAV updates.
- **SIP Engine** – Register SIPs with custom amounts and execution dates.
- **Transaction Tracking** – Automated installment processing and comprehensive history logs.
- **Portfolio Analytics** – Real-time calculation of holdings and total net worth.

---

## Database Schema

The system implements a normalized relational schema (3NF) to maintain referential integrity.

| Table | Description |
|-------|-------------|
| `investors` | Personal details and authentication data |
| `funds` | Mutual fund information, AMC details, and latest NAV |
| `sips` | Registration links between investors and funds |
| `transactions` | Records of units allotted, price paid, and transaction dates |
| `token_blacklist` | Security layer for managing logged-out JWT sessions |

---

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/venkatakarthikm/SIP-Tracker
   cd SIP-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. **Run the server**
   ```bash
   npm start
   ```

   Server will start at `http://localhost:3000`

---

## Data Integrity and Transactions

The system uses **ACID-compliant** database transactions for critical operations like SIP Processing. This ensures that updating unit balances and creating transaction records happen as a single, atomic operation:

```
BEGIN TRANSACTION
  → Update unit balance
  → Create transaction record
COMMIT (on success)
ROLLBACK (on any failure — prevents data corruption)
```

---

## API Endpoints

All protected endpoints require the `Authorization` header with a valid JWT token obtained from the login endpoint.

```
Authorization: <your_jwt_token>
```

---

### 👤 Investor APIs

---

#### `POST /api/investors/register`

Registers a new investor account.

**Request Body:**
```json
{
  "name": "karthik",
  "email": "karthik@gmail.com",
  "password": "1234",
  "phone": "9876543210"
}
```

**Response `201 Created`:**
```json
{
  "message": "Investor registered successfully",
  "investor": {
    "id": 1,
    "name": "karthik",
    "email": "karthik@gmail.com",
    "phone": "9876543210"
  }
}
```

---

#### `POST /api/investors/login`

Authenticates an investor and returns a JWT token.

**Request Body:**
```json
{
  "email": "karthik@gmail.com",
  "password": "1234"
}
```

**Response `200 OK`:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc4MTM4NzU3LCJleHAiOjE3NzgxNzQ3NTd9.4MsbQ1oVKvtB0QffIlDf73iDB6zFlAZ75XeGn5CBAVM"
}
```

---

#### `POST /api/investors/logout`

Invalidates the current JWT token by blacklisting it.

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "message": "Logged out successfully"
}
```

---

#### `GET /api/investors/:id`

Fetches the profile details of an investor by ID.

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "name": "karthik",
  "email": "karthik@gmail.com",
  "phone": "9876543210",
  "created_at": "2025-01-01T10:00:00.000Z"
}
```

---

#### `GET /api/investors/holdings/:id`

Returns all mutual fund holdings of an investor — total units held per fund.

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "investor_id": 1,
  "holdings": [
    {
      "fund_id": 1,
      "fund_name": "Nifty 50 Index Fund",
      "amc_name": "LIC Mutual Fund",
      "total_units": 24.87,
      "current_nav": 150.75,
      "current_value": 3749.14
    }
  ]
}
```

---

#### `GET /api/investors/:id/networth`

Calculates and returns the total net worth of an investor across all holdings.

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "investor_id": 1,
  "total_networth": 3749.14,
  "currency": "INR"
}
```

---

### 💹 Fund APIs

---

#### `POST /api/funds`

Adds a new mutual fund to the system.

**Headers:**
```
Authorization: <jwt_token>
```

**Request Body:**
```json
{
  "fund_name": "Nifty 50 Index Fund",
  "amc_name": "LIC Mutual Fund",
  "current_nav": 1205.45
}
```

**Response `201 Created`:**
```json
{
  "message": "Fund added successfully",
  "fund": {
    "id": 1,
    "fund_name": "Nifty 50 Index Fund",
    "amc_name": "LIC Mutual Fund",
    "current_nav": 1205.45,
    "created_at": "2025-01-01T10:00:00.000Z"
  }
}
```

---

#### `GET /api/funds`

Retrieves a list of all available mutual funds.

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "funds": [
    {
      "id": 1,
      "fund_name": "Nifty 50 Index Fund",
      "amc_name": "LIC Mutual Fund",
      "current_nav": 150.75,
      "updated_at": "2025-01-05T10:00:00.000Z"
    }
  ]
}
```

---

#### `PUT /api/funds/:id/nav`

Updates the current NAV (Net Asset Value) of a specific fund.

**Headers:**
```
Authorization: <jwt_token>
```

**Request Body:**
```json
{
  "current_nav": 150.75
}
```

**Response `200 OK`:**
```json
{
  "message": "NAV updated successfully",
  "fund": {
    "id": 1,
    "fund_name": "Nifty 50 Index Fund",
    "current_nav": 150.75,
    "updated_at": "2025-01-05T12:00:00.000Z"
  }
}
```

---

### 🔁 SIP APIs

---

#### `POST /api/sips`

Creates and registers a new SIP for an investor.

**Headers:**
```
Authorization: <jwt_token>
```

**Request Body:**
```json
{
  "investor_id": 1,
  "fund_id": 1,
  "amount": 5000,
  "execution_date": 10
}
```

> `execution_date` — Day of the month (1–28) on which the SIP will be executed.

**Response `201 Created`:**
```json
{
  "message": "SIP created successfully",
  "sip": {
    "id": 1,
    "investor_id": 1,
    "fund_id": 1,
    "amount": 5000,
    "execution_date": 10,
    "status": "active",
    "created_at": "2025-01-01T10:00:00.000Z"
  }
}
```

---

#### `POST /api/sips/:id/process`

Processes a SIP installment — calculates units allotted based on current NAV and records the transaction. Uses an atomic DB transaction (BEGIN → COMMIT / ROLLBACK).

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "message": "SIP processed successfully",
  "transaction": {
    "id": 1,
    "sip_id": 1,
    "investor_id": 1,
    "fund_id": 1,
    "amount_invested": 5000,
    "nav_at_purchase": 150.75,
    "units_allotted": 33.17,
    "transaction_date": "2025-01-10T10:00:00.000Z"
  }
}
```

---

#### `GET /api/sips/transactions/:id`

Fetches the full transaction history for a given investor (by investor ID).

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "investor_id": 1,
  "transactions": [
    {
      "transaction_id": 1,
      "sip_id": 1,
      "fund_name": "Nifty 50 Index Fund",
      "amount_invested": 5000,
      "nav_at_purchase": 150.75,
      "units_allotted": 33.17,
      "transaction_date": "2025-01-10T10:00:00.000Z"
    },
    {
      "transaction_id": 2,
      "sip_id": 1,
      "fund_name": "Nifty 50 Index Fund",
      "amount_invested": 5000,
      "nav_at_purchase": 155.00,
      "units_allotted": 32.26,
      "transaction_date": "2025-02-10T10:00:00.000Z"
    }
  ]
}
```

---

#### `GET /api/sips/:id`

Fetches all active SIPs registered for a specific investor (by investor ID).

**Headers:**
```
Authorization: <jwt_token>
```

**Response `200 OK`:**
```json
{
  "investor_id": 1,
  "sips": [
    {
      "sip_id": 1,
      "fund_id": 1,
      "fund_name": "Nifty 50 Index Fund",
      "amc_name": "LIC Mutual Fund",
      "amount": 5000,
      "execution_date": 10,
      "status": "active",
      "created_at": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

## API Summary Table

### Investor APIs
| Name | Method | Endpoint | Auth Required |
|------|--------|----------|---------------|
| Register | `POST` | `/api/investors/register` | ❌ |
| Login | `POST` | `/api/investors/login` | ❌ |
| Logout | `POST` | `/api/investors/logout` | ✅ |
| Get Investor | `GET` | `/api/investors/:id` | ✅ |
| Investor Holdings | `GET` | `/api/investors/holdings/:id` | ✅ |
| Net Worth | `GET` | `/api/investors/:id/networth` | ✅ |

### Fund APIs
| Name | Method | Endpoint | Auth Required |
|------|--------|----------|---------------|
| Add Fund | `POST` | `/api/funds` | ✅ |
| Get Funds | `GET` | `/api/funds` | ✅ |
| Update NAV | `PUT` | `/api/funds/:id/nav` | ✅ |

### SIP APIs
| Name | Method | Endpoint | Auth Required |
|------|--------|----------|---------------|
| Create SIP | `POST` | `/api/sips` | ✅ |
| Process SIP | `POST` | `/api/sips/:id/process` | ✅ |
| Get Transactions | `GET` | `/api/sips/transactions/:id` | ✅ |
| Get SIPs | `GET` | `/api/sips/:id` | ✅ |

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| `400 Bad Request` | Missing or invalid request fields |
| `401 Unauthorized` | Missing or expired JWT token |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Duplicate resource (e.g., email already registered) |
| `500 Internal Server Error` | Unexpected server-side error |

**Example error response:**
```json
{
  "error": "Unauthorized",
  "message": "Token is invalid or has expired"
}
```

---

## Security

- Passwords are **hashed** before being stored in the database.
- JWT tokens have an **expiry** (10 hours by default).
- Logged-out tokens are stored in a **blacklist table** to prevent reuse.
- All sensitive routes are protected via **JWT middleware**.

---

## Project Structure

```
SIP-Tracker/
├── controllers/
│   ├── investorController.js
│   ├── fundController.js
│   └── sipController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── investorRoutes.js
│   ├── fundRoutes.js
│   └── sipRoutes.js
├── db/
│   └── connection.js
├── .env
├── server.js
└── package.json
```

---

## Author

Developed as part of the **Backend and Database Assignment for Fintech Systems**.

GitHub: [amaraneniganesh/SIP-Tracker-and-Portfolio-Valuation-System/](https://github.com/amaraneniganesh/SIP-Tracker-and-Portfolio-Valuation-System/)
