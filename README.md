# Shopify - Referral Tracking App

A powerful Shopify application designed to automatically tag customers based on their referral source. This app helps merchants track and manage customer acquisition channels by automatically applying custom tags to customers when they place orders through tracked referrer links.

## Overview

The Referral Tracking App simplifies the process of organizing and analyzing customer data by referral source. When a customer completes a purchase and a referrer parameter is detected, the app automatically applies the corresponding tag to the customer profile in Shopify. This enables merchants to:

- **Segment customers** by their acquisition channel
- **Analyze marketing effectiveness** through customer tags
- **Automate tagging workflows** without manual intervention
- **Track multiple referrer sources** simultaneously
- **Enable/disable tracking** on demand

## Features

### 🏷️ Referrer Mapping Management
- Create, read, update, and delete referrer-to-tag mappings
- Define multiple referrer sources that should map to the same tag
- Support for comma-separated referrer values for flexible grouping
- User-friendly interface for managing all your mappings in one place

### 🔄 Automated Customer Tagging
- Automatic tag application when customers complete orders
- Real-time processing of order webhooks
- Accurate referrer parameter detection and matching
- Seamless integration with Shopify's native customer tags

### ⚙️ Referrer Mapping Controls
- Enable/disable individual referrer mappings
- Toggle the entire app on/off without losing configuration
- Update existing mappings without re-creating them
- Delete mappings individually or in bulk

### 📊 Dashboard
- Clean, intuitive dashboard showing all active referrer mappings
- Quick access to create new mappings
- In-line edit functionality for existing mappings
- Visual feedback for successful operations

### 🔐 Data Management
- Secure storage of referrer-to-tag mappings in the database
- Shop-specific data isolation for multi-tenant support
- Persistent configuration across app restarts
- Webhook handling for app installation and uninstallation

### 📱 User Experience
- Toast notifications for action confirmations
- Modal dialogs for creating and editing mappings
- Input validation for referrer names and tags
- Loading indicators for better feedback
- Responsive design powered by Shopify Polaris

### 🔗 Webhook Integration
- `app/uninstalled` webhook for cleanup on app removal
- `app/scopes_update` webhook for permission changes
- `orders/create` webhook for customer tagging on purchase
- Automatic webhook subscription management

## Tech Stack

- **Frontend**: React with Remix framework
- **Styling**: Shopify Polaris UI components
- **Backend**: Node.js with Remix
- **Database**: Prisma ORM with SQLite (can be adapted to PostgreSQL)
- **Authentication**: Shopify App Bridge React
- **API**: Shopify Admin GraphQL API
- **Build Tool**: Vite

## How It Works

1. **Configuration**: Merchants set up referrer-to-tag mappings in the app dashboard
2. **Order Detection**: When a customer places an order, the `orders/create` webhook is triggered
3. **Referrer Extraction**: The app extracts the referrer parameter from the order's referrer URL
4. **Tag Matching**: The app matches the referrer against configured mappings
5. **Customer Tagging**: If a match is found, the corresponding tag is applied to the customer
6. **Notification**: The merchant receives confirmation of the tagging action

## Getting Started

### Prerequisites
- Node.js 18.20 or higher
- Shopify CLI (installed globally)
- A Shopify development store

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run setup
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run deploy` - Deploy the app to Shopify
- `npm run lint` - Run ESLint to check code quality
- `npm run setup` - Initialize Prisma and run migrations
- `npm run prisma` - Access Prisma CLI commands

## Configuration

The app requires the following Shopify Admin API scopes:
- `read_orders` - To read order data
- `read_customers` - To read customer information
- `write_customers` - To apply tags to customers
- `unauthenticated_read_customer_tags` - To work with customer tags

These scopes are configured in the `shopify.app.toml` file.

## Database Schema

The app uses Prisma ORM with the following models:

- **ReferrerMapping**: Stores referrer-to-tag mappings with shop isolation
- **AppSetting**: Stores app-level settings like enable/disable status
- **Session**: Stores Shopify session information for authentication

## Webhooks

The app subscribes to the following webhooks:

- `app/uninstalled` - Cleanup when app is uninstalled
- `app/scopes_update` - Handle permission changes
- `orders/create` - Process new orders and apply tags

## Support & Contributing

For issues, feature requests, or contributions, please follow the standard GitHub workflow.

## License

This project is proprietary and confidential.
