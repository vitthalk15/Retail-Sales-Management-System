# Retail Sales Management System

## Overview

A full-stack retail sales management application built with React and Node.js. The system provides comprehensive data management capabilities including full-text search, multi-select filtering, sorting, and pagination. It features a modern, responsive UI and handles large datasets efficiently using MongoDB for data storage.

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## Search Implementation Summary

Full-text search is implemented across Customer Name and Phone Number fields. For text searches (Customer Name), MongoDB regex queries are used with case-insensitive matching. For numeric searches (Phone Number), the system fetches a larger batch of records (50,000) and performs client-side filtering since phone numbers are stored as numeric types in MongoDB. Search is debounced by 300ms on the frontend to reduce API calls. The search works seamlessly with filters and sorting, maintaining state across all operations.

## Filter Implementation Summary

Multi-select and range-based filtering is implemented for Customer Region, Gender, Age Range, Product Category, Tags, Payment Method, and Date Range. Multi-select filters use MongoDB's `$in` operator for efficient querying. Age and Date ranges use `$gte` and `$lte` operators. Tags are handled with regex matching for comma-separated values, with additional client-side filtering for accuracy. All filters work independently and can be combined. Filter state is maintained alongside search and sorting operations. A reset button clears all active filters and search queries.

## Sorting Implementation Summary

Sorting is implemented for Date (newest/oldest first), Quantity (high to low / low to high), and Customer Name (A-Z / Z-A). Sorting is performed at the database level using MongoDB's `sort()` method for optimal performance. The sort criteria are applied before pagination to ensure correct ordering. Sorting preserves active search queries and filter selections, allowing users to sort filtered results. The frontend provides a dropdown selector for choosing sort field and direction.

## Pagination Implementation Summary

Pagination is implemented with a page size of 10 items per page. The system uses MongoDB's `skip()` and `limit()` methods for efficient server-side pagination. For searches requiring client-side filtering (phone numbers), pagination is applied after filtering. The pagination component displays page numbers (up to 5 visible), Previous/Next buttons, and current page highlighting. All pagination state (current page, total pages, has next/previous) is maintained and preserved when search, filters, or sorting change. The pagination metadata is calculated based on filtered results.

## Setup Instructions

1. **Prerequisites**: Install Node.js 18+ and ensure MongoDB is set up (local or Atlas).

2. **Install Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Backend**:
   Create `backend/.env` file:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=3001
   ```

4. **Add Data**:
   Place your CSV file in `backend/data/` folder. The system will automatically import it on first startup.

5. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

6. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access Application**:
   Open `http://localhost:3000` in your browser.
