
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:4321")
            response = page.goto("http://localhost:4321")
            print(f"Response status: {response.status if response else 'None'}")

            # Wait for the page to load content.
            # I'll look for text "Hipoteca" or similar if possible, or just wait.
            # Let's wait for a bit to ensure hydration (React) happens.
            page.wait_for_timeout(5000)

            print("Taking screenshot...")
            page.screenshot(path="verification/screenshot.png", full_page=True)
            print("Screenshot taken.")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
