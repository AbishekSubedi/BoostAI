# BoostAI

A full-stack application with separate client and server components, featuring AI-powered advertising services.

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.x)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd BoostAI
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Environment Setup

Create a `.env` file in the server directory with the following variables:
```env
# Copy the variables from server/.env
# Add your environment variables here
```

## Running the Application

### Server
```bash
cd server
npm run dev
```

### Client
```bash
cd client
npm run dev
```

## Project Components

### Frontend (Client)
- Built with React/Next.js
- Includes Python-based ad service integration
- Located in the `client/` directory

### Backend (Server)
- Node.js/Express server
- RESTful API architecture
- Modular structure with separate routes, controllers, and services
- Database integration (PostSQL)
- Ad response handling system

### Ad Service
- Python-based advertising service
- Handles ad processing and delivery
- Located in `client/adService.py`


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License 
