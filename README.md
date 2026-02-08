# Crowdsourced Disaster Preparedness Platform

A full-stack web application designed to build community resilience. This platform connects citizens with critical resources during disasters using real-time, crowdsourced data and geospatial technology.

---

## 👥 Group Members
*   **Member 1 Name:** Aditee Srivastava
*   **Member 2 Name:** Pallawi Kumari
*   **Member 3 Name:** Naman Mittal
*   **Member 4 Name:** Rehmat Kaur
*   **Member 5 Name:** Saksham Singh
*   **Member 6 Name:** Mohammed Jasir N M

---

## 🚀 Project Overview & Features
This platform aims to provide a single source of truth during emergencies.

### Core Features (Planned & In-Progress)
*   **Interactive Map:** A real-time map showing shelters, hospitals, and supply centers.
*   **Crowdsourcing:** Users can add new resources, update status (Open/Full), and add comments.
*   **User Accounts:** Citizens can register to contribute data and receive alerts.
*   **Smart Filtering:** Search for resources by type (Medical, Shelter, etc.) or name.
*   **Disaster Alerts (Planned):** AI-powered predictions for floods/heatwaves with SMS warnings.
*   **Community Hub (Planned):** A feed for local updates and volunteer coordination.
*   **Admin Dashboard (Planned):** For officials to issue verified warnings.

---

## 🛠️ Tech Stack
*   **Frontend:** React, Leaflet (Maps)
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL with PostGIS (Geospatial Data)
*   **AI/ML:** Python (Predictive Modeling)

---

## ✅ Current Progress (Backend)
The core backend architecture is **complete**. The API is ready to handle Users, Resources, and Comments.

### 1. User Management
*   **Register:** Create a new account with GPS location.
*   **Login:** Secure login with password hashing.
*   **Profile:** (In Progress) Fetch current user details.

### 2. Resource Mapping
*   **View Map:** Fetch all pins for the map.
*   **Add Resource:** Users can drop a pin for a new shelter/hospital.
*   **Filter & Search:** Backend supports filtering by type (e.g., "hospital") and searching by name.
*   **Geospatial Storage:** Locations are stored using PostGIS for accurate distance calculations.

### 3. Community Interaction
*   **Comments:** Users can comment on specific resources (e.g., "This shelter is full").
*   **Linked Data:** Comments are automatically linked to the User and the Resource.

---

## 📡 Frontend-Backend Communication Flow

This section explains the lifecycle of data for our three core features: how the Frontend requests it and how the Backend responds.

### 1. Feature: User Authentication (Register & Login)
**The Handshake:**
1.  **Frontend Action:** User fills out the signup form and clicks "Register".
2.  **Request:** Frontend sends a `POST` request to `/api/users/register` containing the user's details and GPS location.
3.  **Backend Logic:**
    *   Hashes the password for security.
    *   Saves the user and their location (PostGIS point) to the database.
4.  **Response:** Backend sends back a "Success" message.
5.  **Frontend Update:** Redirects user to the Login page.
6.  **Login Flow:** When logging in, Backend verifies credentials and sends back a **JWT Token**. Frontend saves this token to verify the user's identity for future actions.



### 2. Feature: Resource Mapping (The Interactive Map)
**Scenario A: Loading the Map**
1.  **Frontend Action:** The Map component loads (using `useEffect`).
2.  **Request:** Frontend sends a `GET` request to `/api/resources`.
3.  **Backend Logic:** Queries the database for all resources, converts coordinates to JSON, and returns an array.
4.  **Frontend Update:** Frontend loops through this array and places a `<Marker />` pin for every item found.

**Scenario B: Filtering (e.g., "Show Hospitals Only")**
1.  **Frontend Action:** User toggles the "Medical Centers" switch.
2.  **Request:** Frontend sends a `GET` request with a query parameter: `/api/resources?type=hospital`.
3.  **Backend Logic:** Detects the `?type` parameter and modifies the SQL query to `WHERE type = 'hospital'`.
4.  **Response:** Returns a filtered list containing *only* hospitals.
5.  **Frontend Update:** Clears the map and redraws only the hospital pins.
type= is for CATEGORIES (The Toggle Switches).
It asks: "Show me all the hospitals."
?search= is for NAMES (The Search Bar).
It asks: "Show me the specific place named 'City General'."

**Scenario C: Adding a Pin**
1.  **Frontend Action:** User fills the "Add Resource" form and submits.
2.  **Request:** Frontend sends a `POST` request to `/api/resources` with the location and details.
3.  **Backend Logic:** Inserts the new row into the database.
4.  **Frontend Update:** Immediately re-fetches the map data so the new pin pops up instantly.



### 3. Feature: Community Comments
**The Handshake:**
1.  **Frontend Action:** User clicks on a shelter pin and types a comment ("This place is full").
2.  **Request:** Frontend sends a `POST` request to `/api/comments`.
    *   *Payload includes:* `user_id` (Who wrote it), `resource_id` (Which pin), and `text`.
3.  **Backend Logic:**
    *   Validates that the User and Resource actually exist.
    *   Saves the comment with a timestamp.
4.  **Response:** Returns the saved comment.
5.  **Reading Comments:** When a user clicks a pin, Frontend sends `GET /api/comments/resource/:id`. Backend joins the `users` table to return the comment text *plus* the name of the person who wrote it (e.g., "Rahul said: ...").

---
## ⚠️ Instructions for Frontend Team
**Please follow these rules to prevent errors:**

1.  **DO NOT run the Backend:** Since the PostgreSQL database is hosted locally on my machine, the backend code **will not run** on your computers. It will crash.
2.  **Work in `/frontend` only
3.  **Use the API:** Replace your hardcoded mock data with `fetch('http://localhost:5000/api/...')` calls using the endpoints listed below.
4.  **Testing:** You might not see real data appear on your screen while coding (since you can't run the backend). Build the UI, push the code, and **I will pull it to my machine to test the connection.**

---
The Endpoints You Need
Use these exact routes for your fetch calls:
1. Login: POST /api/users/login
2. Register: POST /api/users/register
3 .Get Map Pins: GET /api/resources
4. Filter Map: GET /api/resources?type=hospital (or shelter, etc.)
5. Add Pin: POST /api/resources
6. Add Comment: POST /api/comments
---
## 📦 Data Structures (Schema Contracts)

**IMPORTANT:** Your frontend JSON data **must** match these structures exactly, or the database will reject it.

### 1. User Data Structure
**When Registering (Sending Data):**
```json
{
  "name": "Rahul",
  "phone_number": "9876543210",
  "password": "securePassword123",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```
###2. Resource Data Structure (Map Pins)
**When Adding a Pin (Sending Data):**
```
{
  "name": "City General Hospital",
  "type": "hospital", 
  "status": "open",
  "description": "Emergency ward available",
  "contact_number": "555-0123",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

###When Viewing the Map (Receiving Data):
**Note: The backend sends coordinates in GeoJSON format.**
```
{
  "id": 1,
  "name": "City General Hospital",
  "type": "hospital",
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716] // [Longitude, Latitude]
  }
}
```

###Comment Data Structure
**When Commenting (Sending Data):**

```
{
  "user_id": 1,       // The ID of the logged-in user
  "resource_id": 5,   // The ID of the shelter they are commenting on
  "text": "This shelter is full!"
}
```

## 🐙 GitHub Workflow
1.  **Pull** the latest code: `git clone`
2.  **Make changes** inside the `frontend` folder.
3.  **Stage changes:** `git add .`
4.  **Commit:** `git commit -m "Description of frontend changes"`
5.  **Push:** `git push origin main`
6. pull the project again to get the updated file when new changes occur in the repo

### for dependency u can just run npm install in both the folders seperately which will download the nodemodules as well as all the packages
