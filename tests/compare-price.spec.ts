import { test, expect, BrowserContext, Page } from '@playwright/test';

// Define the product to search for
const PRODUCT_NAME = "iphone 15 plus";

// Helper function to extract and clean price from a string
function parsePrice(priceString: string): number {
    // Remove currency symbols, commas, and extra spaces, then parse as float
    const cleanedPrice = priceString.replace(/₹|,|\s/g, '').trim();
    return parseFloat(cleanedPrice);
}

test.describe('Product Price Comparison (Parallel Execution)', () => {

    test('Compare prices on Flipkart and Amazon simultaneously', async ({ browser }) => {
        // Set an overall timeout for this specific test, as it performs parallel operations
        test.setTimeout(120000); // Increased to 120 seconds (2 minutes) for parallel operations

        let flipkartPrice: number | undefined;
        let amazonPrice: number | undefined;

        // Create two separate pages for parallel execution
        const flipkartPage = await browser.newPage();
        const amazonPage = await browser.newPage();

        // Use Promise.all to run Flipkart and Amazon operations in parallel
        await Promise.all([
            // Flipkart Operations
            (async () => {
                console.log('Navigating to Flipkart...');
                await flipkartPage.goto('https://www.flipkart.com/', { timeout: 60000 });
                await flipkartPage.waitForLoadState('domcontentloaded');

                // Validate URL and title
                await expect(flipkartPage).toHaveURL(/flipkart\.com/);
                await expect(flipkartPage).toHaveTitle(/Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More\. Best Offers!/);
                console.log('Flipkart URL and title validated.');

                // Handle potential login/location pop-ups on Flipkart
                try {
                    const closeButton = flipkartPage.locator('button._2doB4z, button[aria-label="Close"]');
                    if (await closeButton.isVisible()) {
                        await closeButton.click();
                        console.log('Closed Flipkart pop-up.');
                    }
                } catch (error) {
                    console.log('No Flipkart pop-up found or failed to close.');
                }

                // Search for the product on Flipkart
                console.log(`Searching for "${PRODUCT_NAME}" on Flipkart...`);
                const searchInputFlipkart = flipkartPage.locator('input[name="q"]');
                await expect(searchInputFlipkart).toBeVisible();
                await searchInputFlipkart.fill(PRODUCT_NAME);
                await searchInputFlipkart.press('Enter');

                // Wait for search results to load
                await flipkartPage.waitForSelector('div[data-id]', { state: 'visible', timeout: 30000 });
                console.log('Flipkart search results loaded.');

                // Extract price from the first matching product
                const priceElementFlipkart = flipkartPage.locator('div[data-id] >> text=/₹\\s*[\\d,]+/').first();
                await expect(priceElementFlipkart).toBeVisible({ timeout: 15000 });
                const priceTextFlipkart = await priceElementFlipkart.innerText();
                flipkartPrice = parsePrice(priceTextFlipkart);
                console.log(`Flipkart Price for "${PRODUCT_NAME}": ₹${flipkartPrice}`);

                // Optional: Add an assertion that the product name is visible in results
                await expect(flipkartPage.locator(`text=${PRODUCT_NAME}`).first()).toBeVisible();

            })(),

            // Amazon Operations
            (async () => {
                console.log('Navigating to Amazon...');
                await amazonPage.goto('https://www.amazon.in/', { timeout: 60000 });
                await amazonPage.waitForLoadState('domcontentloaded');

                // Validate URL and title
                await expect(amazonPage).toHaveURL(/amazon\.in/);
                await expect(amazonPage).toHaveTitle(/Amazon\.in/);
                console.log('Amazon URL and title validated.');

                // Search for the product on Amazon
                console.log(`Searching for "${PRODUCT_NAME}" on Amazon...`);
                const searchInputAmazon = amazonPage.locator('#twotabsearchtextbox');
                await expect(searchInputAmazon).toBeVisible();
                await searchInputAmazon.fill(PRODUCT_NAME);
                await searchInputAmazon.press('Enter');

                // Wait for search results to load
                await amazonPage.waitForSelector('[data-component-type="s-search-result"]', { state: 'visible', timeout: 30000 });
                console.log('Amazon search results loaded.');

                // Extract price from the first matching product
                const priceElementAmazon = amazonPage.locator('[data-component-type="s-search-result"] .a-price-whole').first();
                await expect(priceElementAmazon).toBeVisible({ timeout: 15000 });
                const priceTextAmazon = await priceElementAmazon.innerText();
                amazonPrice = parsePrice(priceTextAmazon);
                console.log(`Amazon Price for "${PRODUCT_NAME}": ₹${amazonPrice}`);

                // Optional: Add an assertion that the product name is visible in results
                await expect(amazonPage.locator(`text=${PRODUCT_NAME}`).first()).toBeVisible();

            })()
        ]);

        // Close pages after operations are complete
        await flipkartPage.close();
        await amazonPage.close();

        // Final comparison after both parallel operations are done
        console.log('\n--- Price Comparison Results ---');
        console.log(`Flipkart Price: ₹${flipkartPrice}`);
        console.log(`Amazon Price: ₹${amazonPrice}`);

        // Compare prices
        if (flipkartPrice === undefined || amazonPrice === undefined) {
            // This case should ideally be caught by earlier assertions, but as a fallback
            throw new Error('Could not retrieve prices from one or both sites for comparison.');
        }

        if (flipkartPrice < amazonPrice) {
            console.log('Result: Flipkart offers a better price!');
            expect(flipkartPrice).toBeLessThan(amazonPrice);
        } else {
            const errorMessage = `Test failed: Flipkart price (₹${flipkartPrice}) is not less than Amazon price (₹${amazonPrice}).`;
            console.error(errorMessage);
            // Fail the test explicitly with a custom message
            expect(flipkartPrice).toBeLessThan(amazonPrice);
        }
    });
});
