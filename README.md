# Instagram Non-Followers Checker

A browser console script that checks which accounts you follow on Instagram
that **don't follow you back**. Runs entirely client-side using your own
logged-in session — no login credentials, third-party tools, or external
services required.

## What it does

1. Grabs your Instagram user ID from your profile page.
2. Fetches your full **followers** list and full **following** list using
   Instagram's internal web API (paginated, 50 at a time).
3. Compares the two lists and finds everyone you follow who isn't in your
   followers list.
4. Prints a readable table (`console.table`) with username, full name, and a
   clickable profile link for each non-follower.
5. Copies a formatted plain-text version of the list to your clipboard.

## How it works (technical overview)

- **Auth**: No credentials are handled by the script. It piggybacks on your
  existing logged-in session cookies in the browser, the same way the
  Instagram web app itself makes requests.
- **Endpoints used**:
  - `GET /api/v1/users/web_profile_info/?username=<you>` — resolves your
    username to a numeric user ID.
  - `GET /api/v1/friendships/<user_id>/followers/` — paginated followers list.
  - `GET /api/v1/friendships/<user_id>/following/` — paginated following list.
- **Pagination**: Instagram returns 50 users per request along with a
  `next_max_id` cursor. The script loops until no cursor is returned,
  with an ~800ms delay between requests to avoid tripping rate limits.
- **Comparison**: Followers are loaded into a `Set` for O(1) lookups, then
  the following list is filtered down to usernames not present in that set.
- **Output**: Results are rendered with `console.table()` for a sortable
  grid (Username / Full Name / Profile URL), and also copied to your
  clipboard as `username (Full Name) — profile_url` lines.

## Usage

1. Go to **your own profile** on [instagram.com](https://instagram.com) in a
   desktop browser (Chrome/Firefox recommended).
2. Open Developer Tools:
   - Windows/Linux: `F12` or `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`
3. Go to the **Console** tab.
4. Paste the full script below and press `Enter`.
5. Wait — for large accounts (thousands of followers/following) this can
   take a couple of minutes due to the rate-limit delay.
6. Read the results in the table, or paste the clipboard contents wherever
   you need them.

## Notes & limitations

- **Unofficial API**: This relies on Instagram's internal web API, which is
  not officially documented or supported for this kind of scripted use.
  Instagram can change these endpoints at any time without notice, which
  may break the script.
- **Rate limiting**: The script paginates with a delay to stay reasonable,
  but running it repeatedly in a short window may still trigger Instagram's
  automation/rate-limit detection. Avoid running it too frequently.
- **Read-only**: The script only reads data tied to your logged-in session.
  It does not follow, unfollow, post, or modify anything.
- **Desktop web only**: Instagram's mobile app doesn't expose a console the
  same way, so this is intended for desktop browsers on instagram.com.

## Disclaimer

This script is provided for personal, educational use on your own account.
Use of Instagram's private/internal endpoints outside their official API may
violate Instagram's Terms of Service — use at your own discretion and risk.