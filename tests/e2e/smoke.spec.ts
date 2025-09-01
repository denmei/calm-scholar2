import { test, expect } from "@playwright/test";

test("landing loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Calm Scholar")).toBeVisible();
});
