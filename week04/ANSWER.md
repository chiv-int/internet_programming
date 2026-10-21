# Week 04 Answers

### 1. In EventList, what goes wrong if you use the array index as :key and the list gets filtered while a card has local state?
When using the array index as `:key`, Vue tracks elements by their numerical position rather than their unique identity. When the list is filtered, the element that shifts into index 0 reuses the existing DOM node at index 0, causing local state (such as an expanded card, an open dropdown, or form input) to leak onto the wrong event.

### 2. Why is visible a computed and not a function called from the template? What is the difference when you type in the search box?
A `computed` property caches its return value based on its reactive dependencies (`events`, `search`, `category`) and only recalculates when one of those dependencies changes. If a plain method were called directly in the template, it would re-execute on every single re-render of the component, even on unrelated state updates.

### 3. EventCard emits book instead of changing event.booked. Give two reasons.
First, Vue enforces strict one-way data flow: props are read-only, and mutating a prop directly causes unpredictable side effects and triggers runtime warnings. Second, `App.vue` owns the event list and handles persistence in `localStorage`; keeping state modifications in the root owner ensures a single source of truth.

### 4. You write const { booked } = reactive(event); booked++. The page does not change. Why?
Destructuring a reactive object extracts primitive values (numbers/strings) as raw values rather than preserving reactive proxy bindings. Incrementing `booked++` only increments an isolated local JavaScript variable, completely bypassing Vue's reactive tracking and triggering no re-renders.

### 5. Where does myBookings live, and why not in EventCard or EventList?
`myBookings` lives in the top-level `App.vue` component because it represents global session state that both the header counter and `localStorage` persistence depend on. Placing it in `EventCard` would isolate bookings to an individual card, while placing it in `EventList` would make it inaccessible to the parent header without unnecessary event bubbling.