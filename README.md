# 🐙 OctoSustain

**Real-Time Eco-Collaboration Platform**

Track your eco-impact with OctoPods. Multitask like an octopus and save the planet!

![OctoSustain Banner](public/abstract-geometric-shapes.png)

## 🌟 Overview

OctoSustain is a comprehensive sustainability tracking platform that gamifies environmental impact monitoring through collaborative "OctoPods" (teams). Using an innovative octopus metaphor, each tentacle represents a different aspect of environmental impact, growing and evolving as users log their sustainable activities.

## ✨ Key Features

### 🐙 Interactive Octopus Dashboard
- **Real-time Visualization**: Animated SVG octopus with 6 tentacles representing different sustainability categories
- **Live Progress Tracking**: Tentacles grow and change color based on your environmental impact
- **WebSocket Integration**: Real-time updates across all connected users

### 🏆 Gamified Challenges
- **Sustainability Challenges**: Time-based challenges with points and rewards
- **Progress Tracking**: Individual and team progress monitoring
- **Social Competition**: Leaderboards and participant tracking
- **Custom Challenges**: Create your own sustainability challenges

### 👥 Collaborative OctoPods
- **Team Formation**: Create or join sustainability tracking groups
- **Invite System**: Unique invite codes for easy team joining
- **Role Management**: Admin and member roles with different permissions
- **Shared Goals**: Collaborative sustainability targets

### 📊 Comprehensive Tracking
Track your impact across 6 key categories:
- ⚡ **Energy**: Electricity and power consumption
- 🗑️ **Waste**: Waste production and recycling
- 🚗 **Transport**: Travel and commuting activities
- 💧 **Water**: Water usage and conservation
- 🍃 **Food**: Sustainable eating habits
- 📊 **Custom**: Create your own tracking categories

### 📈 Advanced Reporting
- **Automated Reports**: Weekly, monthly, and quarterly sustainability reports
- **Multiple Formats**: PDF, CSV, and JSON export options
- **Data Visualization**: Charts and graphs for impact analysis
- **Historical Tracking**: Long-term progress monitoring

### 🔄 Real-time Features
- **Live Activity Feed**: See team member activities in real-time
- **WebSocket Communication**: Instant updates across all devices
- **Push Notifications**: Stay updated on challenges and achievements
- **Collaborative Logging**: Team-based activity tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern styling with design tokens
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Primary database
- **Prisma ORM** - Database management and migrations
- **Socket.io** - WebSocket server for real-time features
- **JWT Authentication** - Secure session management

### Infrastructure
- **Vercel** - Deployment and hosting
- **Vercel Blob** - File storage for images and reports
- **bcryptjs** - Password hashing
- **HTTP-only Cookies** - Secure authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/octosustain.git
   cd octosustain
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Configure the following variables:
   \`\`\`env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/octosustain"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   
   # File Storage (Optional - for image uploads)
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   
   # WebSocket (Optional - for real-time features)
   SOCKET_IO_URL="http://localhost:3001"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed with demo data
   npx prisma db seed
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Account
Use these credentials to explore the platform:
- **Email**: demo@octosustain.com
- **Password**: demo123

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create your account or use the demo credentials
2. **Create/Join a Pod**: Start a new sustainability group or join an existing one
3. **Set Goals**: Define your sustainability targets across different categories
4. **Start Logging**: Begin tracking your environmental activities
5. **Watch Your Octopus Grow**: See your tentacles evolve as you make progress

### Logging Activities
1. Navigate to your Pod dashboard
2. Select a tentacle category (Energy, Waste, Transport, etc.)
3. Log your activity with value, unit, and optional notes
4. Upload photos for verification (optional)
5. Watch your octopus tentacle grow in real-time!

### Joining Challenges
1. Browse available challenges in the Challenges section
2. Click "Join Challenge" on challenges that interest you
3. Track your progress throughout the challenge period
4. Compete with other participants for points and achievements

### Creating Reports
1. Go to the Reports section
2. Select report type (weekly, monthly, quarterly)
3. Choose your date range and format (PDF, CSV, JSON)
4. Generate and download your sustainability report

## 🏗️ Project Structure

\`\`\`
octosustain/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── challenges/           # Challenge management
│   │   ├── dashboard/            # Dashboard data
│   │   ├── pods/                 # Pod management
│   │   └── reports/              # Report generation
│   ├── auth/                     # Authentication pages
│   ├── challenges/               # Challenge pages
│   ├── dashboard/                # Dashboard pages
│   ├── pods/                     # Pod management pages
│   └── reports/                  # Report pages
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── challenges/               # Challenge components
│   ├── dashboard/                # Dashboard components
│   ├── pods/                     # Pod components
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
├── prisma/                       # Database schema and migrations
└── public/                       # Static assets
\`\`\`

## 🔧 API Reference

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/logout` - Sign out user
- `GET /api/auth/me` - Get current user info

### Pods
- `GET /api/pods` - Get user's pods
- `POST /api/pods` - Create new pod
- `GET /api/pods/[id]` - Get pod details
- `POST /api/pods/[id]/join` - Join pod with invite code

### Dashboard
- `GET /api/dashboard/[podId]` - Get dashboard data
- `POST /api/dashboard/[podId]/log` - Log new activity
- `GET /api/dashboard/[podId]/goals` - Get pod goals

### Challenges
- `GET /api/challenges` - Get all challenges
- `POST /api/challenges` - Create new challenge
- `GET /api/challenges/[id]` - Get challenge details
- `POST /api/challenges/[id]/join` - Join challenge
- `POST /api/challenges/[id]/progress` - Update challenge progress

### Reports
- `GET /api/reports` - Get user reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/[id]/status` - Check report generation status

## 🎨 Design System

### Color Palette
- **Primary**: `#3b826b` (Eco Green)
- **Secondary**: `#ffb74d` (Warm Orange)
- **Accent**: `#ff6f61` (Coral)
- **Background**: `#f0f4f1` (Light Eco)
- **Foreground**: `#1f2937` (Dark Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight with 1.5 line height
- **Code**: Geist Mono for technical content

### Components
Built with shadcn/ui for consistency:
- Buttons, Cards, Forms, Modals
- Data Tables, Charts, Progress Bars
- Navigation, Tabs, Tooltips
- Custom Octopus Visualization

## 🧪 Testing

### Running Tests
\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Test Structure
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### Environment Variables for Production
\`\`\`env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Vercel** - For hosting and deployment platform
- **Prisma** - For the excellent ORM and database tools
- **Next.js Team** - For the amazing React framework

## 📞 Support

- **Documentation**: [docs.octosustain.com](https://docs.octosustain.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/octosustain/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/octosustain/discussions)
- **Email**: support@octosustain.com

## 🗺️ Roadmap

### Version 2.0 (Coming Soon)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered sustainability recommendations
- [ ] Integration with IoT devices
- [ ] Carbon footprint calculator
- [ ] Social media sharing
- [ ] Multi-language support

### Version 2.1
- [ ] Marketplace for eco-friendly products
- [ ] Corporate sustainability tracking
- [ ] API for third-party integrations
- [ ] Advanced reporting with ML insights

---

**Made with 💚 for a sustainable future**

*Track your impact. Grow your tentacles. Save the planet.*
