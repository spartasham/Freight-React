# React Shipments Frontend

A concise guide to installing, configuring, and running the React frontend application. This project is built with Vite + TypeScript, Chakra UI v3, RTK Query, TanStack Table & Virtual for large data sets, React Router DOM v7 for routing, and various other libraries. It is designed to work seamlessly with a RESTful backend (e.g., Django DRF), but you can adapt it to any backend of your choice.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack & Key Libraries](#tech-stack--key-libraries)  
3. [Prerequisites](#prerequisites)  
4. [Installation](#installation)  
5. [Configuration](#configuration)  
   1. [Environment Variables](#environment-variables)  
   2. [Vite Proxy Setup](#vite-proxy-setup)  
   3. [Connecting to a Backend of Your Choice](#connecting-to-a-backend-of-your-choice)  
6. [Folder Structure](#folder-structure)  
7. [Available Scripts](#available-scripts)  
8. [Running the App](#running-the-app)  
9. [Building for Production](#building-for-production)  
10. [Linting & Formatting](#linting--formatting)  
11. [Testing](#testing)  
12. [Component & Feature Overview](#component--feature-overview)  
13. [Deploying](#deploying)  
14. [Troubleshooting & Common Issues](#troubleshooting--common-issues)  
15. [References](#references)  

---

## Project Overview

This React application provides:

- **File Upload Page** (CSV upload via drag-and-drop)  
- **Dashboard Page** (charts & metrics)  
- **Shipments Page** (filterable, virtualized table + detail drawer)  
- **Consolidations Page** (cards grid, CSV download per consolidation, detail modal)  

Built with:

- **Vite** for fast development and HMR  
- **TypeScript** for type safety  
- **@chakra-ui/react v3** for design system & components  
- **@reduxjs/toolkit + RTK Query** for state management and data fetching  
- **@tanstack/react-table & @tanstack/react-virtual** for large‐data virtualization  
- **react-router-dom v7** for client‐side routing  
- **react-dropzone** for drag‐and‐drop CSV uploads  
- **papaparse** / **react-papaparse** for CSV parsing & generation  
- **recharts** for data visualization (bar charts, pie charts)  

Although this README describes a Django DRF backend by default (listening on `http://127.0.0.1:8000/api`), you can adapt it to any RESTful backend by adjusting environment variables or the Vite proxy config.

---

## Tech Stack & Key Libraries

- **Framework**: React 19 + TypeScript  
- **Bundler/Dev Server**: Vite  
- **Styling & UI**:  
  - `@chakra-ui/react` v3 (components, theming)  
  - `@chakra-ui/icons`, `@chakra-ui/progress`, `@chakra-ui/system`, `@chakra-ui/theme-tools`  
  - `@emotion/react` & `@emotion/styled` (peer dependencies for Chakra)  
- **State & Data Fetching**:  
  - `@reduxjs/toolkit` (slices, store)  
  - `@reduxjs/toolkit/query/react` (RTK Query for auto‐caching, polling, invalidation)  
  - React Redux (`react-redux`)  
- **Routing**: `react-router-dom` v7  
- **Table & Virtualization**:  
  - `@tanstack/react-table` v8 (headless, hook‐based table)  
  - `@tanstack/react-virtual` v3 (windowing/virtual scroll)  
  - `react-virtualized-auto-sizer` (auto‐sizing container)  
- **CSV Handling**: `react-dropzone` (drag‐n‐drop), `papaparse` (parsing/unparsing)  
- **Charts**: `recharts` (bar, pie, responsive containers)  
- **Icons**: `react-icons`  
- **Theming & Utility**: `framer-motion`, `next-themes` (if dark/light theming)  
- **Linting & Formatting**: ESLint (`@eslint/js`, `eslint-plugin-react-hooks`, etc.)  
- **TypeScript**: 5.x  
- **Vite Plugins**: `@vitejs/plugin-react`  

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (>= 18.x) and **npm** (>= 9.x) (or Yarn) installed  
- A RESTful backend running locally or remotely (e.g. Django DRF at `http://127.0.0.1:8000/api`)  
- (Optional) **Git** for version control  

To check your Node & npm versions:

```bash
node -v
npm -v
