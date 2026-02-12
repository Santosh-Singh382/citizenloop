# 🌍 Citizen Loop - Smart City Civic Engagement Platform

**Bridging citizen participation, municipal operations, and sustainable development through transparent, data-driven urban governance.**

---

## Overview

Citizen Loop is a full-stack web application that empowers citizens to report civic infrastructure issues (waste, water, roads, streetlights, hazards) while enabling municipalities to track resolution metrics and align operations with UN Sustainable Development Goals (SDGs).

### Key Features

- **👥 Citizen Portal**
  - Register & login with JWT authentication
  - Report civic issues with geolocation, photos, and category selection
  - Track complaint status in real-time
  - View personal complaint history and statistics
  - Automatic SDG mapping for sustainability impact

- **👨‍💼 Admin Operations Dashboard**
  - Comprehensive complaint management interface
  - Filter by status (Pending/In Progress/Resolved) and category
  - Bulk status updates and resolution tracking
  - Real-time operational metrics (total, pending, in-progress, resolved)
  - Category distribution analysis

- **🌐 Public Transparency Dashboard**
  - View resolved issues with full public accountability
  - SDG impact analytics and goal-wise complaint breakdown
  - Resolution rate metrics and average turnaround time
  - Issues categorized by sustainable development goals
  - Citizen-generated data for policy visibility

---

## Tech Stack

### Backend (Spring Boot REST API)
- **Framework**: Spring Boot 3.5.10 with Java 17
- **Security**: JWT authentication (jjwt 0.11.5), BCrypt password encryption
- **Database**: MySQL with Spring Data JPA + Hibernate
- **Architecture**: Layered (Controller → Service → Repository → Model)

### Frontend (React Single Page Application)
- **Framework**: React 19.2.4 with React Router 7.13.0
- **API Client**: Axios 1.13.5 with JWT interceptors
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Custom CSS with responsive design (mobile-first)

### Database Schema
```sql
-- Users Table
users (id, name, email, password_encrypted, role: CITIZEN/ADMIN, createdAt, updatedAt)

-- Complaints Table
complaints (
  id, 
  complaintId (unique: "CL-TIMESTAMP-UUID"),
  title, 
  description, 
  category: WASTE/WATER/ROAD/STREETLIGHT/HAZARD,
  latitude, 
  longitude, 
  imageUrl,
  status: PENDING/IN_PROGRESS/RESOLVED,
  sdgGoal (auto-mapped),
  createdAt, 
  updatedAt, 
  resolvedAt,
  user_id (FK)
)
```

---

## Project Structure

```
citizenloop-backend/
├── pom.xml                          # Maven dependencies
├── src/main/
│   ├── java/com/citizenloop/
│   │   ├── CitizenloopBackendApplication.java
│   │   ├── config/
│   │   │   ├── CorsConfig.java      # CORS for localhost:3000/3001
│   │   │   ├── JwtTokenProvider.java # Token generation & validation
│   │   │   └── SecurityConfig.java   # BCrypt password encoding
│   │   ├── controller/
│   │   │   ├── AuthController.java   # POST /register, /login
│   │   │   ├── CitizenController.java # Citizen issue operations
│   │   │   ├── AdminController.java   # Admin dashboard & filtering
│   │   │   └── PublicController.java  # Public transparency endpoints
│   │   ├── model/
│   │   │   ├── User.java            # JPA entity + enums for Role
│   │   │   └── Complaint.java       # JPA entity + ComplaintCategory/Status enums
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── ComplaintRepository.java
│   │   └── service/
│   │       ├── AuthService.java      # Registration, login, JWT generation
│   │       ├── ComplaintService.java # CRUD + analytics
│   │       ├── AdminService.java     # Dashboard statistics
│   │       └── DashboardService.java # Public transparency metrics
│   └── resources/
│       └── application.properties     # DB, JWT, logging config

citizenloop-frontend/
├── package.json
├── public/                           # Static assets
│   └── index.html
├── src/
│   ├── App.js                       # Router setup & navigation
│   ├── index.js                     # React entry point
│   ├── pages/
│   │   ├── Login.js                 # Register/Login toggle
│   │   ├── Dashboard.js             # Citizen dashboard
│   │   ├── AdminDashboard.js        # Admin operations
│   │   ├── ComplaintForm.js         # Issue reporting
│   │   ├── PublicMap.js             # Transparency dashboard
│   │   └── Profile.js               # User profile management
│   ├── components/
│   │   ├── Navbar.js               # Role-based navigation
│   │   ├── ComplaintFormComponent.js # Form with geolocation
│   │   └── MapView.js              # Map placeholder
│   ├── services/
│   │   ├── api.js                  # Axios client + JWT interceptors
│   │   ├── citizenService.js       # /citizen/* endpoints
│   │   ├── adminService.js         # /admin/* endpoints
│   │   └── publicService.js        # /public/* endpoints
│   └── styles/
│       └── ui.css                  # 900+ lines global styling
└── build/                           # Production build output
```

---

## UN Sustainable Development Goals Mapping

| Issue Category | SDG | Goal |
|---|---|---|
| 🗑️ **WASTE** | SDG 11 | Sustainable Cities & Communities |
| 💧 **WATER** | SDG 6 | Clean Water & Sanitation |
| 🚗 **ROAD** | SDG 9 | Industry, Innovation & Infrastructure |
| 💡 **STREETLIGHT** | SDG 7 | Affordable & Clean Energy |
| ⚠️ **HAZARD** | SDG 3 | Good Health & Well-being |

Auto-mapped on complaint submission → Supports analytics and public reporting

---

## API Endpoints

### Authentication (`/auth`)
```
POST   /auth/register          # Register new citizen/admin
POST   /auth/login             # Login (returns JWT + user metadata)
```

### Citizen Operations (`/citizen/{userId}`)
```
POST   /citizen/{userId}/complaint           # Submit new complaint
GET    /citizen/{userId}/complaints          # Get my complaints
GET    /citizen/{userId}/complaints/{id}     # Track specific complaint
GET    /citizen/{userId}/profile             # Get profile
PUT    /citizen/{userId}/profile             # Update profile
```

### Admin Operations (`/admin`)
```
GET    /admin/complaints                     # All complaints
GET    /admin/complaints?status=PENDING      # Filter by status
GET    /admin/complaints?category=WASTE      # Filter by category
GET    /admin/complaints?status=X&category=Y # Dual filter
PUT    /admin/complaints/{id}/status         # Update complaint status
GET    /admin/dashboard/stats                # Dashboard metrics
DELETE /admin/complaints/{id}                # Delete complaint
```

### Public Transparency (`/public`)
```
GET    /public/dashboard/stats               # Resolution rate, avg time, totals
GET    /public/complaints/resolved           # All resolved issues
GET    /public/complaints/map                # Complaints with geolocation
GET    /public/sdg-analytics                 # SDG-wise breakdown
GET    /public/complaints/sdg/{sdgGoal}      # Filter by SDG goal
```

---

## Setup & Installation

### Prerequisites
- Java 17+ & Maven 3.8+
- Node.js 18+ & npm
- MySQL 8.0+

### Backend Setup

1. **Clone & Navigate**
   ```bash
   cd citizenloop-backend
   ```

2. **Configure Database** (application.properties)
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/citizenloop
   spring.datasource.username=root
   spring.datasource.password=YourPassword
   spring.jpa.hibernate.ddl-auto=update
   jwt.secret=YourSuperSecretKeyMin32Characters!!
   jwt.expiration=86400000
   ```

3. **Build & Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   Server starts on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd ../citizenloop-frontend
   npm install
   ```

2. **Configure API** (services/api.js)
   ```javascript
   const BASE_URL = 'http://localhost:8080/api';
   ```

3. **Run Development Server**
   ```bash
   npm start
   ```
   App opens on `http://localhost:3000`

---

## Demo Credentials

### Citizen Account
- **Email**: citizen@example.com
- **Password**: demo1234
- **Role**: CITIZEN

### Admin Account
- **Email**: admin@example.com
- **Password**: admin1234
- **Role**: ADMIN

---

## Key Workflows

### 1. Citizen Issue Reporting
```
Register/Login → Dashboard → Report Issue → 
Auto-Geolocation + Photo + Category → Submit →
Unique ID Generated (CL-TIMESTAMP-UUID) → 
Status: PENDING → Track Progress →
Admin Updates Status → Resolution Tracked
```

### 2. Admin Management
```
Login (Admin) → AdminDashboard → 
View Stats (Total/Pending/In-Progress/Resolved) → 
Filter by Status/Category → 
Bulk Update Status → 
View Category Distribution → 
Analytics Export
```

### 3. Public Transparency
```
PublicMap.js → Fetch Stats/SDG Analytics →
Display Resolution Rate & Avg Time → 
Show Category Distribution → 
Filter by SDG Goal → 
View Resolved Issues with Metadata
```

---

## Security Features

✅ **JWT Authentication** - Secure token-based auth with 24-hour expiration
✅ **Password Encryption** - BCrypt with 10 rounds
✅ **CORS Configuration** - Restricted to localhost:3000/3001
✅ **Role-Based Access Control** - CITIZEN/ADMIN routes enforced
✅ **XSS Prevention** - React escapes user input by default
✅ **CSRF Protection** - JWT tokens in Authorization header

---

## Performance Optimizations

- **Frontend**: React memoization, lazy loading, CSS variables for theming
- **Backend**: Database indexing on frequently filtered columns (category, status), JPA query optimization
- **Network**: JWT interceptors reduce re-login requests, CSS minification in production build

---

## Database Initialization

### Create Database
```sql
CREATE DATABASE citizenloop;
USE citizenloop;
```

### Seed Demo Data (Optional)
```sql
-- Create demo admin
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', 'ENCRYPTED_PASSWORD', 'ADMIN');

-- Create demo citizen
INSERT INTO users (name, email, password, role) VALUES 
('Demo Citizen', 'citizen@example.com', 'ENCRYPTED_PASSWORD', 'CITIZEN');

-- Add sample complaints
INSERT INTO complaints (complaint_id, title, description, category, status, sdg_goal, latitude, longitude, user_id) VALUES 
('CL-1701234567-abc12345', 'Garbage pile at junction', '...', 'WASTE', 'RESOLVED', 'SDG 11: Sustainable Cities & Communities', 28.6139, 77.2090, 1);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error on login | Check backend CorsConfig matches frontend origin |
| JWT token expired | Auto-logout triggered; re-login required |
| 404 complaint not found | Verify complaintId format: CL-TIMESTAMP-UUID |
| Database connection failed | Check MySQL running, credentials in application.properties |
| Frontend build fails | `node_modules` corruption; run `npm install --legacy-peer-deps` |

---

## Future Enhancements

🚀 **Phase 2 Roadmap**:
- Real-time WebSocket notifications for admin
- Leaflet.js map visualization with geolocation heatmap
- Chart.js/Recharts dashboard analytics
- Email notifications on status changes
- File upload to AWS S3 for complaints
- Mobile app (React Native)
- Advanced analytics export (CSV/PDF)
- Gamification (citizen badges for consistent reporting)
- Multi-language support (i18n)
- Docker containerization for easy deployment

---

## Deployment Guide

### Docker Deployment
```bash
# Build backend image
docker build -t citizenloop-backend ./citizenloop-backend

# Build frontend image
docker build -t citizenloop-frontend ./citizenloop-frontend

# Use docker-compose for entire stack
docker-compose up
```

### Cloud Deployment (AWS/Azure)
- Backend: Deploy to Elastic Beanstalk / App Service
- Frontend: Deploy to S3 + CloudFront / Static Web Apps
- Database: RDS MySQL / Azure Database for MySQL

---

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Open pull request with test coverage

---

## License

MIT License - See LICENSE file for details

---

## Support & Contact

For issues, questions, or feedback:
- 📧 Email: support@citizenloop.com
- 🐛 GitHub Issues: [repo-issues](link)
- 📱 Demo App: [citizenloop.app](link)

---

## Acknowledgments

Built for sustainable urban development aligned with **UN Sustainable Development Goals**.
Inspired by citizen participation models and municipal transparency initiatives worldwide.

**Last Updated**: January 2025
**Version**: 1.0.0 (Beta)
