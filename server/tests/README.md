# Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the MyContacts API, including authentication and contact management functionality.

## Test Results
✅ **All 30 tests passing**
- **Auth Tests**: 9 tests
- **Contact Tests**: 21 tests

## Running Tests

```bash
npm test
```

## Test Structure

### Authentication Tests (`auth.test.js`)

#### POST /auth/register
- ✅ Should register a new user successfully
- ✅ Should not register a user with duplicate email (400)
- ✅ Should not register a user without email (412)
- ✅ Should not register a user without password (412)

#### POST /auth/login
- ✅ Should login an existing user successfully
- ✅ Should not login with incorrect password (401)
- ✅ Should not login with non-existent email (401)
- ✅ Should not login without email (412)
- ✅ Should not login without password (412)

### Contact Tests (`contact.test.js`)

#### GET /api/contacts
- ✅ Should get all contacts for authenticated user
- ✅ Should return empty array when user has no contacts
- ✅ Should not get contacts without authentication (401)
- ✅ Should not get contacts with invalid token (401)

#### POST /api/contacts
- ✅ Should create a new contact successfully
- ✅ Should not create contact without firstName (400)
- ✅ Should not create contact without lastName (400)
- ✅ Should not create contact without phone (400)
- ✅ Should not create contact with phone less than 10 characters (400)
- ✅ Should not create contact without authentication (401)

#### PUT /api/contacts/:id
- ✅ Should update an existing contact successfully
- ✅ Should update only firstName (partial update)
- ✅ Should not update contact with invalid phone (400)
- ✅ Should not update non-existent contact (404)
- ✅ Should not update contact without authentication (401)
- ✅ Should not update another user's contact (404)

#### DELETE /api/contacts/:id
- ✅ Should delete an existing contact successfully
- ✅ Should not delete non-existent contact (404)
- ✅ Should not delete contact without authentication (401)
- ✅ Should not delete another user's contact (404)

#### Integration Tests
- ✅ Should perform complete CRUD operations (Create → Read → Update → Delete)

## Key Features Tested

### Security
- JWT token authentication
- User isolation (users can only access their own contacts)
- Proper authorization checks on all protected routes

### Validation
- Email format validation
- Password length validation (minimum 6 characters)
- Phone number length validation (10-20 characters)
- Required field validation for contacts

### Error Handling
- Proper HTTP status codes:
  - `200`: Success
  - `201`: Created
  - `400`: Bad Request (validation errors)
  - `401`: Unauthorized (authentication errors)
  - `404`: Not Found
  - `412`: Precondition Failed (missing required fields)
  - `500`: Internal Server Error

### Database Operations
- Proper database connection setup/teardown
- Data cleanup between tests
- Isolation between test cases

## Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
{
  testEnvironment: 'node',
  testTimeout: 20000,
  forceExit: true,
  detectOpenHandles: true
}
```

### Database
Tests use the MongoDB Atlas connection specified in `.env` file.
Each test suite:
1. Connects to database before all tests
2. Cleans up data after each test
3. Closes connection after all tests

## Code Coverage

The test suite covers:
- ✅ Authentication flow (register, login)
- ✅ Contact CRUD operations
- ✅ Input validation
- ✅ Authorization checks
- ✅ Error scenarios
- ✅ Edge cases (empty data, invalid tokens, etc.)

## Improvements Made

### Backend Fixes
1. **Auth Service**: Added proper status codes to errors (400, 401)
2. **Contact Service**: 
   - Added return statements for created/updated contacts
   - Added 404 error handling for non-existent contacts
   - Added user ownership validation
3. **Validation Middleware**: Created `contactValidation` for contact fields
4. **Error Handling**: Added global error handler middleware
5. **Contact Controller**: Updated delete to return 200 with message

### Test Enhancements
1. Comprehensive test coverage for all endpoints
2. Proper setup/teardown for database
3. Security tests (user isolation)
4. Integration tests for full CRUD flow
5. Edge case testing

## Dependencies

```json
{
  "jest": "^30.2.0",
  "supertest": "^7.1.4"
}
```

## Notes

- Tests run against the actual MongoDB database
- Each test is isolated and doesn't affect others
- Authentication tokens are generated fresh for each test
- All tests clean up their data automatically