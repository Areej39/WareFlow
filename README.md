# WareFlow — Warehouse Management System

WareFlow is a web-based Warehouse Management System (WMS) built with Next.js and Firebase. It is designed to help administrators and warehouse staff manage warehouse operations through role-based access, centralized data management, and an intuitive dashboard.

## Features

### Authentication & Authorization
- Firebase Authentication for secure email/password login.
- Firestore user profiles linked to Firebase Authentication UIDs.
- Role-based access control for Admin and Staff.
- Protected routes based on user roles.
- Admin-controlled staff account creation.
- Account status management.
- Separate Admin and Staff dashboard experiences.

### Admin Management
- Admin dashboard with warehouse management overview.
- Staff account management.
- Create, update, and deactivate warehouse records.
- Reusable management components and layouts.

### Warehouse Management
- Create new warehouses.
- View warehouse records.
- Update warehouse information.
- Deactivate warehouses without permanently deleting records.
- Prevent duplicate warehouse codes.

### User Interface
- Responsive dashboard layout.
- Reusable UI components.
- Sidebar navigation based on user roles.
- Light and dark theme support.
- Initial application loading screen.
- Searchable management tables.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React | User interface |
| JavaScript | Application development |
| Tailwind CSS | Styling and responsive design |
| Firebase Authentication | User authentication |
| Cloud Firestore | NoSQL database |
| Firebase Admin SDK | Privileged server-side operations |
| Lucide React | Icons |
| next-themes | Theme management |
| Vercel | Deployment |

## User Roles

WareFlow supports two types of users.

### Admin
- Access the Admin dashboard.
- Create and manage Staff accounts.
- Manage warehouse information.
- Manage categories and products.
- Oversee inventory operations.
- Access administrative reports.

### Staff
- Access the Staff dashboard.
- View assigned warehouse information.
- View products and inventory.
- Perform permitted warehouse operations.
- Access their own activity records.

*Note: Some Staff and inventory operations are planned for future development.*

## Project Structure

```text
wareflow/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   └── bootstrap-admin/
│   ├── admin/
│   │   ├── staff/
│   │   ├── warehouses/
│   │   ├── categories/
│   │   └── products/
│   ├── dashboard/
│   ├── login/
│   ├── staff/
│   ├── unauthorized/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
│
├── components/
│   ├── auth/
│   ├── categories/
│   ├── layout/
│   ├── providers/
│   ├── ui/
│   ├── warehouses/
│   └── products/
│
├── lib/
│   ├── firebase.js
│   ├── firebase-admin.js
│   ├── server-auth.js
│   ├── auth.js
│   ├── warehouse.js
│   └── category.js
│
├── public/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

*The structure above represents the intended project organization; some directories and modules are still being developed.*

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd wareflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project and enable:

- Firebase Authentication (Email/Password).
- Cloud Firestore.

Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Configure the Firebase Admin SDK credentials using the environment variable names expected by `lib/firebase-admin.js`.

**Important:** Never commit Firebase Admin private keys, service account credentials, or `.env.local` to GitHub.

### 4. Configure Firestore

Create the required Firestore database and configure security rules for authenticated users and their respective roles.

The initial data model includes:

- `users`
- `warehouses`
- `categories`
- `products`
- `inventory`

Additional collections will be introduced as warehouse operations are implemented.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment & Security

- Keep sensitive credentials in environment variables.
- Use Firebase Authentication to verify user identity.
- Store user roles and account status in Firestore.
- Protect frontend routes using role-based guards.
- Validate permissions in server-side operations.
- Enforce access restrictions through Firestore Security Rules.
- Never expose Firebase Admin credentials in client-side code.

## Development Roadmap

- [x] Firebase Authentication setup
- [x] Admin account initialization
- [x] Firestore user profiles
- [x] Admin and Staff roles
- [x] Staff account creation
- [x] Protected routes
- [x] Role-based navigation and dashboards
- [x] Warehouse CRUD operations
- [x] Reusable UI components
- [x] Light and dark theme
- [x] Initial loading screen
- [ ] Category Management
- [ ] Product Management
- [ ] Inventory Management
- [ ] Stock Receiving and Issuing
- [ ] Stock Transfers
- [ ] Stock Adjustment and Approval
- [ ] Inventory Reports and Analytics
- [ ] Complete Staff operational workflows
- [ ] Production security review

## Future Improvements

- Warehouse-specific staff assignments.
- Inventory movement history.
- Low-stock notifications.
- Advanced reporting and analytics.
- Audit logs for administrative actions.
- Improved inventory tracking and stock valuation.

## License

This project is developed for educational and portfolio purposes.