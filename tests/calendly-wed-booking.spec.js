import { test, expect } from '@playwright/test';

const TARGET_URL = 'https://calendly.com/woodbury-tkd/white-belt-class';

/**
 * Random delay to simulate human behavior
 */
async function humanDelay(page, min = 300, max = 800) {
  const delay = Math.floor(Math.random() * (max - min) + min);
  await page.waitForTimeout(delay);
}

/**
 * Type text like a human (with random delays between keystrokes)
 */
async function humanType(locator, text) {
  await locator.click();
  await locator.pressSequentially(text, { delay: Math.floor(Math.random() * 100) + 50 });
}

/**
 * Move mouse to element before clicking (more human-like)
 */
async function humanClick(page, locator) {
  const box = await locator.boundingBox();
  if (box) {
    // Move to element with some randomness
    await page.mouse.move(
      box.x + box.width / 2 + (Math.random() * 10 - 5),
      box.y + box.height / 2 + (Math.random() * 10 - 5),
      { steps: 10 }
    );
    await humanDelay(page, 100, 300);
  }
  await locator.click();
}

/**
 * Apply anti-detection measures to the page
 */
async function applyAntiDetection(page) {
  await page.addInitScript(() => {
    // Remove webdriver flag
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    
    // Add missing plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
        { name: 'Native Client', filename: 'internal-nacl-plugin' },
      ],
    });

    // Add languages
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

    // Override permissions query
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);

    // Add chrome object if missing
    if (!window.chrome) {
      window.chrome = { runtime: {} };
    }
  });
}

/**
 * Opens Calendly page and handles cookie banner if present
 */
async function openCalendly(page) {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Wait for calendar to load
  await page.getByRole('table', { name: 'Select a Day' }).waitFor({ state: 'visible', timeout: 15000 });

  // Random delay after page load
  await humanDelay(page, 500, 1500);

  // Handle cookie banner if present
  const cookieButton = page.getByRole('button', { name: 'I understand' });
  if (await cookieButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await humanClick(page, cookieButton);
    await humanDelay(page, 300, 700);
  }
}

/**
 * Collects all available Wednesday dates in February from the calendar
 */
async function getAvailableWednesdayDates(page) {
  await openCalendly(page);

  // Find all enabled Wednesday buttons with "Times available"
  const wednesdayButtons = page.getByRole('button', { name: /Wednesday, February \d+ - Times available/i });

  const count = await wednesdayButtons.count();
  const dates = [];

  for (let i = 0; i < count; i++) {
    const buttonName = await wednesdayButtons.nth(i).getAttribute('aria-label') ||
                       await wednesdayButtons.nth(i).textContent();
    // Extract the date number from the button name (e.g., "Wednesday, February 18 - Times available")
    const match = buttonName?.match(/February (\d+)/i);
    if (match) {
      dates.push(parseInt(match[1], 10));
    }
  }

  return dates;
}

/**
 * Books the 5:05 PM slot for a specific Wednesday date
 */
async function bookWednesdaySlot(page, date) {
  // Click on the specific Wednesday date
  const dateButton = page.getByRole('button', { name: `Wednesday, February ${date} - Times available` });
  await expect(dateButton).toBeVisible({ timeout: 10000 });
  await humanClick(page, dateButton);

  // Human-like delay for time slots to load
  await humanDelay(page, 800, 1500);

  // Wait for time slots to appear and click 5:05pm (button text includes "spots left")
  const timeSlotButton = page.getByRole('button', { name: /5:05pm.*spots left/i });
  await expect(timeSlotButton).toBeVisible({ timeout: 10000 });
  await humanClick(page, timeSlotButton);

  // Human delay before clicking Next
  await humanDelay(page, 500, 1000);
  const nextButton = page.getByRole('button', { name: /^Next/i });
  await expect(nextButton).toBeVisible({ timeout: 10000 });
  await humanClick(page, nextButton);

  // Wait for booking form to load
  await page.getByRole('textbox', { name: 'Name *' }).waitFor({ state: 'visible', timeout: 10000 });
  await humanDelay(page, 500, 1000);

  // Fill in Name (human typing)
  const nameField = page.getByRole('textbox', { name: 'Name *' });
  await humanType(nameField, 'Ritvika');

  await humanDelay(page, 300, 600);

  // Fill in Email (human typing)
  const emailField = page.getByRole('textbox', { name: 'Email *' });
  await humanType(emailField, 'Karunakaran.saranya@gmail.com');

  await humanDelay(page, 500, 1000);

  // Click Schedule Event
  const scheduleButton = page.getByRole('button', { name: 'Schedule Event' });
  await humanClick(page, scheduleButton);

  // Wait for page response after submission
  await humanDelay(page, 2000, 3000);

  // Check for error message first
  const errorMessage = page.getByRole('heading', { name: /something went wrong/i });
  const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (hasError) {
    throw new Error(`Calendly booking failed for February ${date}. The API returned an error - this may happen with automated/test bookings.`);
  }

  // Verify "You are scheduled" confirmation message
  await expect(page.getByText(/You are scheduled/i)).toBeVisible({ timeout: 15000 });
}

test.describe('Calendly White Belt Class Booking', () => {

  test('Book 5:05 PM slot for all available Wednesdays in February', async ({ page }) => {
    // Apply anti-detection measures before any navigation
    await applyAntiDetection(page);

    // First, collect all available Wednesday dates
    const wednesdays = await getAvailableWednesdayDates(page);

    console.log(`Found ${wednesdays.length} available Wednesdays in February: ${wednesdays.join(', ')}`);
    expect(wednesdays.length).toBeGreaterThan(0);

    // Book each available Wednesday
    for (const date of wednesdays) {
      console.log(`Booking Wednesday, February ${date}...`);

      // Navigate fresh to the page for each booking
      await openCalendly(page);

      // Book the slot
      await bookWednesdaySlot(page, date);

      console.log(`Successfully booked Wednesday, February ${date}`);
    }
  });

});
