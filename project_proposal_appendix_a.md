# Jomnouy

## Problem
Local community members lack a simple, dedicated space to ask for urgent assistance, borrow everyday tools, or pass along second-hand goods without dealing with noisy commercial marketplace ads. Jomnouy provides a lightweight, neighborhood-first bulletin board where people can exchange practical help, questions, rentals, and pre-owned items directly without in-app monetary transactions.

## Users and roles
User: can register, post listings across community categories, post anonymously when desired, comment publicly on posts, send private direct messages to coordinate in-person exchanges or offline payments, and edit or resolve their own listings.
Moderator: can view all listings and comments, delete spam or predatory commercial listings, and moderate abusive messages to keep the community space safe and focused on mutual aid.

## User stories
1. As a User, I want to filter listings by category and urgency so that I can quickly spot urgent requests for help or items available for rent without scrolling through unrelated posts.
Accepted when: the user selects a category (Question, Help, Giveaway, Rent, Sell); the feed updates without a full page reload; the backend returns paginated results of at most 10 items per page; urgency tags are highlighted.

2. As a User, I want to create a new listing with an optional anonymous toggle so that I can ask sensitive questions or request assistance without revealing my personal identity to neighbors.
Accepted when: the form requires a title, description, and category; selecting category "Help" exposes an urgency flag; checking "Post Anonymously" hides the author's real username on the public card; the listing is saved in the database associated with the user's account ID.

3. As a User, I want to send a private direct message to a listing owner so that we can coordinate meeting locations or exchange bank account details without sharing private info publicly.
Accepted when: clicking "Message" on an active listing opens a direct message composer; the message is stored with sender and recipient IDs; the recipient sees the conversation thread in their private inbox.

4. As a User, I want to post public comments on a listing so that I can answer a question openly or ask clarifying questions about an item offered for rent or giveaway.

5. As a User, I want to mark my listing as resolved so that community members know help is no longer needed or the item is no longer available.

6. As a User, I want to edit or delete my own listing so that I can correct details or remove the post when it is no longer relevant.

7. As a Moderator, I want to delete any listing or comment that violates community rules so that the board does not become flooded with commercial retail spam or abusive behavior.

8. As a User, I want to view a paginated list of all active listings so that the application loads quickly and does not fetch the entire database at once.

## MVP scope
Must have: story 1, 2, 3, 4, 5, 6, 7
Nice to have: story 8

## Entities
| Entity | Main attributes | Relations |
|---|---|---|
| User | id, username, email, password_hash, role, created_at | has many Listings, has many Comments, has many sent DirectMessages, has many received DirectMessages |
| Listing | id, user_id, title, description, category, urgency_level, is_anonymous, is_resolved, created_at | belongs to one User, has many Comments |
| Comment | id, listing_id, user_id, message_body, created_at | belongs to one User, belongs to one Listing |
| DirectMessage | id, sender_id, receiver_id, message_body, created_at | belongs to one User (sender), belongs to one User (receiver) |

## Stretch feature
One of: search + pagination, file upload, real-time, scheduled task.
What it does in this app: Search, filter, and pagination. It allows users to filter community listings by category (Question, Help, Giveaway, Rent, Sell) and urgency level, while limiting the response payload to 10 items per page with page controls to keep response times fast and resource usage low.

## Repository
https://github.com/your-username/jomnouy