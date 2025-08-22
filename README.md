# Jenga Safe - React Frontend

A modern, responsive React frontend for the Jenga Safe rental property management system. Built with TypeScript, Tailwind CSS, and integrated with Laravel backend API.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Role-based Interfaces** - Separate dashboards for tenants and landlords
- **OTP Authentication** - Secure login with email/SMS OTP
- **Real-time Dashboard** - Live statistics and activity feeds
- **Property Management** - Complete property and unit management
- **Payment Tracking** - Rent collection and payment history
- **Messaging System** - Communication between users
- **Maintenance Requests** - Submit and track maintenance issues
- **Bill Management** - View and manage utility bills
- **Mobile-Ready** - Optimized for mobile devices

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 📋 Requirements

- Node.js 18 or higher
- npm or yarn
- Laravel backend running on port 8000

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jenga-rental-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Make sure Laravel backend is running on http://localhost:8000

## 🔐 Demo Accounts

### Tenant Account
- **Email:** tenant@example.com
- **Password:** password
- **Features:** Property registration, payments, maintenance, messages

### Landlord Account
- **Email:** landlord@example.com
- **Password:** password
- **Features:** Property management, tenant oversight, financial reports

## 📱 Features by User Type

### Tenant Portal
- **Dashboard** - Overview of rent, bills, and messages
- **Property Registration** - Register for assigned property
- **Payments** - View payment history and make payments
- **Water Usage** - Monitor water consumption
- **Garbage Services** - Manage garbage collection
- **Emergency Services** - Access emergency contacts
- **Maintenance** - Submit and track maintenance requests
- **Messages** - Communicate with landlord
- **Documents** - Access lease and property documents
- **File Complaints** - Submit formal complaints

### Landlord Portal
- **Dashboard** - Property overview and financial metrics
- **Properties** - Manage properties and units
- **Tenants** - Tenant management and communication
- **Reports** - Financial and occupancy reports
- **Water Monitoring** - Track water usage across properties
- **Garbage Management** - Manage waste collection services
- **Emergency Management** - Handle emergency situations
- **Complaint Management** - Review and respond to complaints
- **Maintenance** - Assign and track maintenance work
- **Messages** - Communicate with tenants

## 🔧 Configuration

### Environment Variables
The app automatically connects to the Laravel backend at `http://localhost:8000/api`. 

For production, update the API base URL in `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### API Integration
The frontend uses a comprehensive API client (`src/lib/api.ts`) that handles:
- Authentication with Laravel Sanctum
- Token management and refresh
- Error handling and validation
- All CRUD operations
- File uploads and downloads

## 🎨 Styling

The application uses Tailwind CSS for styling with:
- **Responsive design** - Mobile-first approach
- **Dark/Light themes** - Automatic theme detection
- **Custom components** - Reusable UI components
- **Consistent spacing** - Tailwind's spacing system
- **Modern animations** - Smooth transitions and effects

## 📦 Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment.

## 🚀 Deployment Options

### Static Hosting (Netlify, Vercel, etc.)
```bash
npm run build
# Deploy the dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Apache/Nginx
Serve the `dist/` folder as static files with proper routing configuration.

## 🔒 Security Features

- **Token-based authentication** with automatic refresh
- **Role-based route protection** 
- **Input validation** and sanitization
- **CSRF protection** via Laravel backend
- **Secure API communication** with proper headers

## 📱 Mobile Optimization

- **Responsive breakpoints** for all screen sizes
- **Touch-friendly interfaces** with proper tap targets
- **Mobile navigation** with collapsible menus
- **Optimized images** and lazy loading
- **Fast loading** with code splitting

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the Laravel backend API documentation
- Review the setup guide for configuration help

## 🎯 Roadmap

- [ ] Progressive Web App (PWA) support
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Multi-language support
- [ ] Accessibility improvements

## 🔗 Related Projects

- **[Jenga Safe Laravel Backend](../jenga-rental-laravel)** - API backend
- **Jenga Safe Mobile App** - Coming soon (React Native/Flutter)

---

Built with ❤️ using React 18 and TypeScript
