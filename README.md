# 📦 Product Price Comparison Automation

## 🎯 Objective
Automated test using **Playwright + TypeScript** to compare the price of **"iPhone 15 Plus"** between **Flipkart** and **Amazon.in**.

---

## ✅ Features

- Uses **Playwright with TypeScript**
- Navigates to both **Flipkart** and **Amazon**
- Validates **page URL and title**
- Searches for the product: `"iphone 15 plus"`
- Extracts the **price of the first product**
- Compares prices and:
  - ✅ **Passes** if Flipkart price < Amazon price
  - ❌ **Fails** otherwise with clear message
- Uses **parallel execution**
- Includes:
  - Assertions
  - Console output
  - Screenshot & trace on failure

---

## 🛠️ Tech Stack

- [Playwright](https://playwright.dev/)
- TypeScript
- Node.js

---

## 🧪 How to Run the Test

```bash
# Step 1: Install dependencies
npm install

# Step 2: Run the test
npx playwright test

# Optional: Open the HTML report after test
npx playwright show-report



## 🖥️ Sample Console Output

tests\compare-price.spec.ts:15:9 › Product Price Comparison (Parallel Execution) › Compare prices on Flipkart and Amazon simultaneously
Navigating to Flipkart...
Navigating to Amazon...
Flipkart URL and title validated.
Searching for "iphone 15 plus" on Flipkart...
Flipkart search results loaded.
Flipkart Price for "iphone 15 plus": ₹74900
Amazon URL and title validated.
Searching for "iphone 15 plus" on Amazon...
Amazon search results loaded.
Amazon Price for "iphone 15 plus": ₹72490

--- Price Comparison Results ---
Flipkart Price: ₹74900
Amazon Price: ₹72490
Test failed: Flipkart price (₹74900) is not less than Amazon price (₹72490).
