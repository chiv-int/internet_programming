# Week 5 Questions and Answers

**1. You refresh the browser on /events/2 and the page loads. Which program answered that request in development, and what must the production server do so it still works after deployment?**
In development, the Vite development server intercepts the refresh request and serves the single-page application. In production, the web server  must be configured to route all unknown paths back to `index.html` so Vue Router can handle displaying the correct page.

**2. The guard stops students from opening /events/new. Can a student still create an event? How, and what must stop them?**
Yes, a student can still manually send a POST request directly to the API endpoint using tools like Postman or cURL. Frontend router guards only hide the user interface; to truly prevent this, the backend server must enforce role-based authorization to reject unauthorized requests.

**3. EventDetailPage loads its event in a watch on the id with immediate: true, not in onMounted. What bug would onMounted alone cause?**
If a user navigates directly from one event to another (e.g., from `/events/1` to `/events/2`), Vue reuses the existing component to save resources rather than remounting it. If we only used `onMounted`, the data would not reload, and the screen would be stuck showing the old event's details.

**4. Why does EventsPage use storeToRefs(store) instead of const { events } = store?**
Standard JavaScript destructuring (like `const { events } = store`) strips away Vue's reactivity, meaning the screen won't update when the store's data changes. Using `storeToRefs` safely extracts the state while keeping it fully reactive and synchronized with the template.

**5. Booking makes two requests: POST the booking, then PATCH the seat count. What happens to the data if the second one fails? How could the server avoid this?**
If the PATCH fails, the database becomes corrupted/inconsistent because a booking exists, but the available seat count never decreased. The backend server can avoid this by handling both database actions within a single "transaction," which ensures both steps succeed together or both automatically roll back if one fails.