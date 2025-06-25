# LayrBase

A clean, modern web application for business management built with React and Tailwind CSS.

## Features

- **Company Setup**: Manage company information, legal documents, and team members
- **Finance**: Track revenue, expenses, cash flow, and financial transactions
- **Cap Table**: Monitor ownership structure and equity distribution
- **Marketing**: Manage campaigns, track metrics, and marketing tools
- **HR**: Employee management, recruitment, and HR processes

## Tech Stack

- React 18
- Tailwind CSS
- React Router DOM
- Modern JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd layrbase
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TopNav.js       # Top navigation bar
│   └── SecondaryNav.js # Secondary navigation tabs
├── pages/              # Page components
│   ├── CompanySetup.js
│   ├── Finance.js
│   ├── CapTable.js
│   ├── Marketing.js
│   └── HR.js
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Design System

The app uses a consistent design system with:
- Light, clean background theme
- Primary blue color scheme
- Responsive grid layouts
- Modern card-based UI components
- Consistent spacing and typography

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 