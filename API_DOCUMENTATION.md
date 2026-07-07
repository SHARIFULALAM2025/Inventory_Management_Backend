# Mini ERP – Backend API Documentation

Base URL (local): `http://localhost:5000/api`
Base URL (production): `<your-deployed-backend-url>/api`

## Authentication

All protected endpoints require a JWT token sent in the request header:

```
Authorization: Bearer <token>
```

The token is obtained from the Login endpoint and contains the user's `id` and `role`.

---

## Response Format

All API responses follow a consistent structure.

**Success:**
```json
{
  "statusCode": 200,
  "data": { },
  "message": "Descriptive success message",
  "success": true
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": []
}
```

## HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | OK — request succeeded |
| 201 | Created — resource created successfully |
| 400 | Bad Request — validation error / missing fields |
| 401 | Unauthorized — missing/invalid token, or invalid credentials |
| 403 | Forbidden — authenticated but role does not have permission |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — duplicate resource (e.g., SKU already exists) |
| 500 | Internal Server Error |

---

## 1. Authentication

### 1.1 Login

```
POST /auth/login
```

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@erp.com",
  "password": "Admin@123"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "6a4c603eed0d860a4a6bf193",
      "name": "Super Admin",
      "email": "admin@erp.com",
      "role": "Admin"
    }
  },
  "message": "Login successful",
  "success": true
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": []
}
```

---

## 2. Products

### 2.1 Get Products (Search + Pagination)

```
GET /products?search=<term>&page=<number>&limit=<number>
```

**Access:** Admin, Manager, Employee (any authenticated user)

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| search | string | No | Filters by name, SKU, or category (case-insensitive) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "products": [
      {
        "_id": "6a4c603eed0d860a4a6bf200",
        "name": "Wireless Mouse",
        "sku": "WM001",
        "category": "Electronics",
        "purchasePrice": 500,
        "sellingPrice": 750,
        "stockQuantity": 15,
        "imageUrl": "https://i.ibb.co/xxxx/image.jpg",
        "createdAt": "2026-07-01T10:00:00.000Z",
        "updatedAt": "2026-07-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "totalProducts": 1,
      "currentPage": 1,
      "totalPages": 1,
      "limit": 10
    }
  },
  "message": "Products fetched successfully",
  "success": true
}
```

### 2.2 Get Product by ID

```
GET /products/:id
```

**Access:** Admin, Manager, Employee

**Success Response (200):** Single product object under `data`.

**Error Response (404):** Product not found.

### 2.3 Create Product

```
POST /products
```

**Access:** Admin, Manager

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| name | string | Yes |
| sku | string | Yes (must be unique) |
| category | string | Yes |
| purchasePrice | number | Yes |
| sellingPrice | number | Yes |
| stockQuantity | number | No (default 0) |
| image | file | Yes |

**Success Response (201):** Created product object under `data`.

**Error Response (400):** Missing required fields or missing image.
**Error Response (409):** SKU already exists.

### 2.4 Update Product

```
PUT /products/:id
```

**Access:** Admin, Manager

**Content-Type:** `multipart/form-data`

Same fields as Create; all optional. If `image` is omitted, the existing image is retained.

**Success Response (200):** Updated product object under `data`.

### 2.5 Delete Product

```
DELETE /products/:id
```

**Access:** Admin (verify against your middleware — adjust this section if Manager is also permitted)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Product deleted successfully",
  "success": true
}
```

---

## 3. Sales

### 3.1 Create Sale

```
POST /sales
```

**Access:** Admin, Manager, Employee

**Request Body:**
```json
{
  "items": [
    { "productId": "6a4c603eed0d860a4a6bf200", "quantity": 2 },
    { "productId": "6a4c603eed0d860a4a6bf201", "quantity": 1 }
  ]
}
```

**Backend Logic:**
- Validates stock availability for each product
- Reduces stock atomically (MongoDB transaction)
- Calculates grand total using each product's current selling price
- Stores the sale with `priceAtSale` per item (preserves historical price)

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "6a4c603eed0d860a4a6bf300",
    "items": [
      { "product": "6a4c603eed0d860a4a6bf200", "quantity": 2, "priceAtSale": 750 }
    ],
    "grandTotal": 1500,
    "createdBy": "6a4c603eed0d860a4a6bf193",
    "createdAt": "2026-07-07T10:00:00.000Z"
  },
  "message": "Sale created successfully",
  "success": true
}
```

**Error Response (400):** Insufficient stock or invalid product/quantity.

### 3.2 Get All Sales (Sale History)

```
GET /sales
```

**Access:** Admin (verify against your middleware)

**Success Response (200):** Array of sales under `data`, with `items.product` and `createdBy` populated.

---

## 4. Dashboard

### 4.1 Get Dashboard Statistics

```
GET /dashboard
```

**Access:** Admin, Manager, Employee (any authenticated user)

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "totalProducts": 12,
    "totalSales": 5,
    "lowStockCount": 2,
    "lowStockProducts": [
      { "_id": "...", "name": "USB Cable", "sku": "USB01", "stockQuantity": 3 }
    ]
  },
  "message": "Dashboard stats fetched successfully",
  "success": true
}
```

---

## Roles & Permissions Summary

| Endpoint | Admin | Manager | Employee |
|---|---|---|---|
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /products | ✅ | ✅ | ✅ |
| GET /products/:id | ✅ | ✅ | ✅ |
| POST /products | ✅ | ✅ | ❌ |
| PUT /products/:id | ✅ | ✅ | ❌ |
| DELETE /products/:id | ✅ | ✅ | ❌ |
| POST /sales | ✅ | ✅ | ✅ |
| GET /sales | ✅ | ✅ | ❌ |
| GET /dashboard | ✅ | ✅ | ✅ |



## Test Credentials (for reviewers)

| Role | Email | Password |
|---|---|---|
| Admin | admin@erp.com | Admin@123 |
