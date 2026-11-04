# Week 6 Practice: Explain It Answers

### 1. DELETE /events/2 returns 204 and the second call returns 404. Is DELETE still idempotent? Explain with what idempotent means.
Yes, DELETE is still idempotent. An HTTP method is idempotent if executing multiple identical requests produces the exact same side-effect on the server's resource state as executing it just once. The first DELETE call removes the event (returning 204), and subsequent calls return 404 because the resource is gone, but the server's state does not change any further. Idempotency concerns the net resource state on the server, not having identical HTTP response status codes.

### 2. The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can curl read it anyway?
The web browser blocks the response due to its built-in Same-Origin Policy and Cross-Origin Resource Sharing (CORS) security rules. The API server actually receives and replies to the request, but the browser blocks the frontend JavaScript from reading the response because the server did not include the proper `Access-Control-Allow-Origin` header. In contrast, curl is a command-line HTTP client rather than a browser; it does not enforce browser same-origin security policies, so it displays the response directly.

### 3. EventsController never writes new EventsService(). Who creates the service, when, and how many are created?
The NestJS Inversion of Control (IoC) / Dependency Injection container creates the `EventsService`. It is instantiated during application bootstrap when Nest scans and resolves module dependencies before starting the HTTP server. Because NestJS providers are singletons by default, exactly one shared instance is created for the entire application and injected into any controller or service that requests it.

### 4. A client sends { "title": "Pitch Night", ..., "booked": 50 }. Which line of code refuses it, and what would happen to booked without it?
The line `forbidNonWhitelisted: true` inside `ValidationPipe` (in `src/setup.ts`) refuses the request with a `400 Bad Request` because `booked` is not declared as an allowed field in `CreateEventDto`. Without `forbidNonWhitelisted: true`, `whitelist: true` would silently strip `booked` so the server ignores it, but if `ValidationPipe` whitelisting were omitted entirely, `booked: 50` would pass into the service and allow clients to forge or overwrite the internal booking count.

### 5. Why is the “not enough seats” rule in BookingsService and not in BookingsController or only in the Vue form?
Client-side validation in the Vue form is only for user experience (UX) and quick feedback, but it provides no real security because clients can bypass the UI using curl, Postman, or automated scripts. Inside the NestJS backend, the rule belongs in `BookingsService` rather than `BookingsController` because controllers are solely responsible for handling HTTP transport (routing, parsing parameters, status codes). The service layer encapsulates business logic, data consistency (checking remaining capacity against requested seats), and state mutation, making the business rules reusable and testable in isolation without simulating HTTP requests.

