# Simplebks Assessment

A job assessment from Simplebks, this Node.js API provides routes for managing order items and seller information for the Brazilian E-Commerce Public Dataset by Olist.

## Prerequisites

Before you can run this API, you will need to have the following installed:

* Node.js
* MongoDB
* StandardJS linter

### Setup

1. Clone the repository to your local machine.
2. Install the dependencies:

```bash
cd simplebks-assessment
npm install
npm run dev
```

### API Documentation

Refer to the [Postman Documentation↗](https://documenter.getpostman.com/view/25333551/2s9YeD8DN9) for sample requests and response documentation.

#### Authentication

Authentication is via HTTP Basic using the `seller_id` and `seller_zip_code_prefix` from the `olist_sellers_dataset` collection as username and password respectively.

#### Endpoints

##### `/order_items`

* **GET**
  * Lists all order items that belong to the logged-in user.
  * Allow sorting by `price` or `shipping_limit_date` (default).
  * Allow showing from 20 (default) to up to 100 results at once with a `limit` parameter, and an `offset` query parameter to also easily get different result pages. The response should be in the format:

    json
    {
     data:[{
      id: order_item_id,
      product_id: product_id,
      product_category: products.product_category_name
      price: price,
      date: shipping_limit_date
     }],
     total: 90214,
     limit: 20,
     offset: 560
    }

##### `/order_items/:id`

* **DELETE**
  * Deletes an order item ID from the order item collection

##### `/account`

* **PUT**
  * Updates are logged in the seller's city or/and state.
  * Should return new seller city and state as a response.

### Error Handling

The API returns appropriate HTTP status codes for errors, such as 401 (Unauthorized) for invalid authentication credentials, 404 (Not Found) for resources that do not exist, and 500 (Internal Server Error) for unexpected errors.

### Testing

The API endpoints are covered by unit tests using the Mocha and Chai frameworks. To run the tests, execute the following command:

```bash
npm test
```
