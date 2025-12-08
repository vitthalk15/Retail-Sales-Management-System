# Architecture Documentation

## Project Overview

Retail Sales Management System built with Node.js/Express backend and React/Vite frontend. The system provides comprehensive sales data management with search, filtering, sorting, and pagination capabilities.

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CSV Processing**: csv-parse

### Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication handlers
│   │   └── salesController.js   # Sales data handlers
│   ├── services/
│   │   ├── dataService.js       # MongoDB data access
│   │   └── salesService.js      # Business logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── salesRoutes.js       # Sales endpoints
│   ├── models/
│   │   └── User.js              # User schema
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── utils/
│   │   └── importData.js        # CSV to MongoDB import
│   └── index.js                 # Application entry
├── data/
│   └── truestate_assignment_dataset.csv
└── package.json
```

### Module Responsibilities

#### Controllers
- **authController.js**: Handles user signup and login
- **salesController.js**: Processes sales data requests, builds filter objects from query params

#### Services
- **dataService.js**: MongoDB connection and Sales model management
- **salesService.js**: Core business logic for search, filtering, sorting, pagination

#### Routes
- **authRoutes.js**: `/api/auth/signup`, `/api/auth/login`
- **salesRoutes.js**: `/api/sales`, `/api/sales/filters`

### Data Processing Pipeline

1. **Request** → Route → Controller
2. **Controller** → Parses query parameters → Builds filter object
3. **Service** → Builds MongoDB query → Executes query
4. **Client-side filtering** (for phone numbers and tags)
5. **Pagination** → Returns paginated results
6. **Response** → Data + Pagination + Summary

## Frontend Architecture

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)

### Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FilterDropdown.jsx   # Multi-select/range filters
│   │   ├── Pagination.jsx       # Page navigation
│   │   ├── SalesTable.jsx      # Data table
│   │   ├── SearchBar.jsx        # Search input
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── SummaryCards.jsx     # Statistics display
│   │   ├── Toast.jsx            # Toast notification
│   │   └── ToastContainer.jsx  # Toast manager
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   └── SalesManagement.jsx  # Main dashboard
│   ├── hooks/
│   │   ├── useSalesData.js      # Data fetching hook
│   │   └── useToast.js          # Toast management hook
│   ├── services/
│   │   └── api.js               # API client
│   ├── styles/
│   │   └── index.css            # Global styles (Tailwind)
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # Entry point
├── public/
└── package.json
```

### Component Hierarchy

```
App
└── Router
    ├── Login
    ├── Signup
    └── SalesManagement
        ├── Sidebar
        ├── SearchBar
        ├── FilterDropdown (multiple)
        ├── SummaryCards
        ├── SalesTable
        ├── Pagination
        └── ToastContainer
```

## Data Flow

### Search Flow
1. User types in SearchBar
2. Input debounced (300ms)
3. Query params built with search term
4. Backend processes: MongoDB query for text, client-side for phone numbers
5. Results filtered and returned

### Filter Flow
1. User selects filter options
2. State updated in SalesManagement
3. Query params rebuilt
4. Backend applies MongoDB filters
5. Client-side filtering for tags (comma-separated)
6. Results returned

### Sort Flow
1. User selects sort option
2. Sort field and direction sent to backend
3. MongoDB sorts data
4. Paginated results returned

## Data Model

### Sales Document (MongoDB - Flexible Schema)
All fields from CSV are stored:
- **Customer**: ID, Name, Phone Number, Gender, Age, Region, Type
- **Product**: ID, Name, Brand, Category, Tags
- **Sales**: Quantity, Price per Unit, Discount Percentage, Total Amount, Final Amount
- **Operational**: Date, Payment Method, Order Status, Delivery Type, Store ID, Store Location, Salesperson ID, Employee Name

### User Document
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- timestamps (createdAt, updatedAt)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Authenticate user

### Sales Data
- `GET /api/sales` - Get filtered, sorted, paginated data
  - Query params: search, page, pageSize, sortBy, sortOrder, regions[], genders[], ageMin, ageMax, categories[], tags[], paymentMethods[], dateFrom, dateTo
- `GET /api/sales/filters` - Get available filter options

## Security

- JWT token-based authentication
- Password hashing with bcrypt
- CORS enabled for frontend
- Input validation on backend
- MongoDB injection prevention via Mongoose

## Performance Optimizations

- Debounced search (300ms)
- MongoDB queries with indexes
- Client-side filtering for phone numbers (50K batch)
- Pagination to limit data transfer
- Efficient tag filtering (Set-based)

## Deployment

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_API_URL`

### Backend (Render)
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`

## Edge Cases Handled

- No search results → Empty state message
- Conflicting filters → MongoDB handles via query
- Invalid numeric ranges → Backend validation
- Large filter combinations → Efficient MongoDB queries
- Missing optional fields → Default values ('-')
- Phone number search → Client-side filtering for numeric searches
- Tag filtering → Handles comma-separated strings
