# Week 7 Answers
Name: Chiv Intherea 
ID: p20240019 

## 1. Why does Booking have an eventId column but Event has no bookingIds column?

A table cell in a relational database holds one value, not a list, so an event cannot store all of its booking ids in one column. Instead, the "many" side of a 1-N relation stores a foreign key that points to the "one" side, so each booking has an `eventId`. In Prisma, `Event.bookings` is only a virtual field used to query the relation, not a real column.

## 2. Why keep `booked`, and what must the code do so it never becomes wrong?

`booked` repeats what `COUNT` and `SUM` over the bookings could compute, but keeping it makes "are there seats left?" a cheap read of one row instead of an aggregate over many bookings. It also lets us check and update the seats in a single atomic `UPDATE`. To keep it correct, every booking create and delete must change `booked` in the same transaction, using `increment` and `decrement`, so the two never get out of sync.

## 3. What is the difference between `prisma migrate dev` and `prisma generate`?

`prisma migrate dev` compares the schema with the migrations, writes a new SQL migration file, and runs it, so it changes the database. `prisma generate` only rebuilds the typed Prisma Client in `src/generated` from the schema, and it does not touch the database. So `migrate dev` is the one that changes the database.

## 4. A page lists 20 events with their bookings. One version runs 1 query, another runs 21. Name the problem and show how `include` fixes it.

This is the N+1 query problem: one query loads the 20 events, and then one more query per event loads its bookings, giving 1 + 20 = 21 queries. Using `include` lets Prisma load the related rows together instead:

```ts
this.prisma.event.findMany({ include: { bookings: true } });
```

Prisma then fetches the events and all of their bookings in a fixed small number of queries, no matter how many events there are.

## 5. Two students book the last seat at the same moment. Why can the read-check-update version sell two seats, and why can the conditional `updateMany` not?

In the read-check-update version, student A and student B both read the event and both see `booked = capacity - 1`. Both pass the check in JavaScript, because neither has written yet, and then both run an update that adds a seat, so two seats are sold for one free place. With the conditional `updateMany`, the check is part of the SQL statement (`UPDATE ... WHERE booked <= capacity - seats`), so PostgreSQL locks the row for the first update. The second request waits, re-checks the `WHERE` condition against the new value, finds it false, and updates 0 rows, so the code sees `count` 0 and throws a 409 Conflict.
