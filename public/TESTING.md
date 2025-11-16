# Blood Bank Management System - Testing Guide

## How to Test the Appointment System

### Prerequisites
- Make sure the development server is running: `npm run dev`
- Access the application at: `http://localhost:3000`

### Quick Test Using the Test Page

1. **Open the test page:**
   ```
   http://localhost:3000/test-appointment.html
   ```

2. **Follow these steps in order:**

   **Step 1: Create Test Donor User**
   - Click "Create Donor" (default values are pre-filled)
   - You should see a success message

   **Step 2: Create Test Admin User**
   - Click "Create Admin" (default values are pre-filled)
   - You should see a success message

   **Step 3: Login as Donor**
   - Click "Login as Donor"
   - You should see a success message with user details
   - The "Create Appointment" button should become enabled

   **Step 4: Create Appointment**
   - The appointment date is pre-set to tomorrow at 10:00 AM
   - Add optional notes if desired
   - Click "Create Appointment"
   - You should see a success message with the donation ID

   **Step 5: Check Appointments (Admin View)**
   - Click "Check All Donations"
   - You should see a table with the newly created appointment
   - The status should be "PENDING"

   **Step 6: Update Appointment Status**
   - Click "Select" next to the appointment to auto-fill the ID
   - Choose a new status (e.g., "APPROVED")
   - Click "Update Status"
   - You should see a success message
   - The donations table will refresh automatically

### Manual Testing Through the Main Application

#### 1. Create Users
   - Go to `http://localhost:3000/create-admin.html` to create an admin user
   - Go to `http://localhost:3000` and register a donor account

#### 2. Initialize Inventory (Optional)
   - Go to `http://localhost:3000/init-inventory.html`
   - Click "Initialize Inventory"

#### 3. Test as Donor
   - Login as a donor
   - Go to Profile tab
   - Click "New Appointment"
   - Fill in appointment details and submit
   - Check the "Donation History" to see the new appointment

#### 4. Test as Admin
   - Login as an admin
   - Go to the "Donations" tab
   - You should see the newly created appointment
   - Use the action buttons to approve, reject, or complete the appointment

### Expected Behavior

#### When a donor creates an appointment:
1. The appointment should be saved with status "PENDING"
2. It should appear in the donor's donation history
3. It should appear in the admin's donations management panel

#### When an admin updates appointment status:
1. **PENDING → APPROVED**: Appointment is approved and scheduled
2. **APPROVED → COMPLETED**: 
   - Appointment is marked as completed
   - Blood inventory is automatically increased by 1 unit
   - Donor's donation history is updated
3. **Any status → REJECTED**: Appointment is cancelled

### Debugging

If you encounter issues:

1. **Check the browser console** for JavaScript errors
2. **Check the server logs** in the terminal where `npm run dev` is running
3. **Verify the database** by checking if records are created:
   - Donations should appear in the admin panel
   - User data should be properly saved

### Common Issues and Solutions

**Issue:** "Internal server error" when creating appointment
- **Solution:** Check that the user is logged in as a donor (not recipient or admin)

**Issue:** Appointment doesn't appear in admin panel
- **Solution:** Make sure you're looking at the "Donations" tab in the admin dashboard

**Issue:** Status update doesn't work
- **Solution:** Ensure you're using a valid donation ID from the donations table

### API Endpoints for Testing

- **Create User:** `POST /api/auth/register`
- **Create Admin:** `POST /api/auth/create-admin`
- **Login:** `POST /api/auth/login`
- **Create Donation:** `POST /api/donations`
- **Get All Donations:** `GET /api/donations/all`
- **Update Donation:** `POST /api/donations/update`
- **Get User Donations:** `GET /api/donations?userId=USER_ID`

### Database Schema

The system uses the following main tables:
- **User**: Stores user information (donors, recipients, admins)
- **Donation**: Stores donation appointments with status tracking
- **Request**: Stores blood requests from recipients
- **Inventory**: Stores blood bank inventory levels

### Success Criteria

The appointment system is working correctly if:
1. ✅ Donors can create appointments
2. ✅ Appointments appear with "PENDING" status
3. ✅ Admins can view all appointments
4. ✅ Admins can update appointment status
5. ✅ Status changes are reflected in real-time
6. ✅ Completed donations update blood inventory

### Support

If you encounter any issues not covered here, please check:
1. Browser developer tools for JavaScript errors
2. Server console for backend errors
3. Network tab for API request/response details