# Domo Out-of-Stock Alerts App

A clean, minimal Domo Procode app for managing out-of-stock product alerts with acknowledgment functionality.

## 🚀 Live Preview

**[View Live Demo](https://james-tempus.github.io/domo-out-of-stock-alerts/)** - See the app in action with full functionality

## Features

- **Clean Summary Dashboard**: Color-coded summary boxes showing total, acknowledged, and pending alerts
- **Interactive Tabulator Table**: Full-featured table with sorting, filtering, and responsive design
- **Acknowledgment System**: Checkbox-based acknowledgment with localStorage persistence
- **Smart Filtering**: Filter by Pending, Acknowledged, or All Items
- **Row Auto-Hide**: Acknowledged items automatically hide after 1 second when viewing pending
- **Pre-filtered Loading**: No flash of all data - shows only relevant items from start
- **Domo-Inspired Design**: Clean, neutral colors matching Domo dashboard aesthetics

## Color Coding

- **Blue Border**: Total alerts (informational)
- **Green Border**: Acknowledged alerts (completed/resolved)
- **Red Border**: Pending alerts (urgent/needs attention)

## Technical Details

- **Tabulator.js**: Version 6.3.1 for modern table functionality
- **localStorage**: Simulates AppDB for acknowledgment persistence
- **Responsive Design**: Adapts to different screen sizes with proper column wrapping
- **Clean Styling**: Minimal, professional appearance with Domo-inspired design
- **GitHub Pages**: Automatically deployed from main branch

## Sample Data

Includes 8 sample products with various stock levels, priorities, and suppliers for testing.

## Usage

1. View pending alerts by default
2. Check acknowledgment boxes to mark items as acknowledged
3. Use filter buttons to switch between views
4. Acknowledged items persist across browser sessions

## Development

- Run locally with: `python3 -m http.server 8080`
- Access at: `http://localhost:8080`
- All changes are automatically reflected in the browser

## Deployment

- **GitHub Pages**: Automatically deployed from the main branch
- **Live URL**: https://james-tempus.github.io/domo-out-of-stock-alerts/
- **Repository**: https://github.com/james-tempus/domo-out-of-stock-alerts
- Updates are automatically deployed when changes are pushed to main

## Domo Integration

This app is designed to be deployed as a Domo Procode app and can be connected to real datasets for production use.
