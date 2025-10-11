# DCS Technosis Task — Exam Form & Payment Portal

A full-stack web application built using **Laravel (Backend)** and **React.js (Frontend)**.  
This project allows users to register, fill out exam forms, make online payments, and download receipts.  
Admin users can manage forms, submissions, and payments via a secure dashboard.

---

## Project Setup Guide

Follow the steps below to set up and run the project locally.

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/JioRitik/dcs-technosis-task.git
cd dcs-technosis-task
```

---

## Backend Setup (Laravel)

### 1. Navigate to the Backend Folder

```bash
cd backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Create Environment File

```bash
cp .env.example .env
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Run Database Migrations

```bash
php artisan migrate
```

### 6. Seed the Database (for default admin account & sample data)

```bash
php artisan db:seed
```

### 7. Start the Backend Server

```bash
php artisan serve
```

The backend will run on:  
**http://127.0.0.1:8000**

---

## Frontend Setup (React.js)

### 1. Navigate to the Frontend Folder

```bash
cd frontend
```

### 2. Install Node Modules

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The frontend will run on:  
**http://localhost:5173** 

---

## Admin Credentials

| Email                | Password   |
|----------------------|------------|
| admin@examportal.com | admin123   |

Login with these credentials to access the **Admin Dashboard**.

---

## Tech Stack

### Backend
- Laravel 12
- MySQL
- Custom Authentication

### Frontend
- React.js (Vite)
- Axios for API requests
- React Router
- Tailwind CSS

### Payment Integration
- Razorpay / Stripe (as per implementation)

---

## 📸 Features

 - User Registration & Login  
 - Exam Form Submission  
 - Online Payment Integration  
 - PDF Receipt Generation  
 - Admin Dashboard for Managing Users, Forms, and Payments  
 - Responsive UI Design  

---

---

## License

This project is created for **DCS Technosis Task** and is open for educational and assessment purposes.

---

### Developed by
**Ritik Gwala**  
🛍 Jaipur, Rajasthan  
🌐 [GitHub Profile](https://github.com/JioRitik)
