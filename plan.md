# Plan.md

## Project Structure
```
src/
├── app/
│   ├── core/                     # core layer with app-wide, reusable logic
│   │   ├── store/                # application state management (signal stores, state connected services)
│   │   │   ├── favorites.service.ts
│   │   │   ├── posts.store.ts
│   │   │   └── post-details.store.ts
│   │   ├── http/                 # HTTP client layer
│   │   │   └── api-http.service.ts
│   │   └── types/                # domain models (one file per entity type)
│   │       ├── comment.model.ts
│   │       ├── post.model.ts
│   │       ├── user.model.ts
│   │       └── list-filters.model.ts
│   │
│   ├── features/                 # feature modules
│   │   ├── posts-list/
│   │   │   ├── posts-list.component.ts
│   │   │   └── posts-list.component.html
│   │   ├── post-details/
│   │   │   ├── post-details.component.ts
│   │   │   └── post-details.component.html
│   │   ├── favorites/
│   │   │   ├── favorites.component.ts
│   │   │   └── favorites.component.html
│   │   └── gantt/
│   │       ├── gantt.component.ts
│   │       └── gantt.component.html
│   │
│   ├── app.routes.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   └── app.config.ts
│
├── main.ts
├── styles.css
├── custom-theme.scss
└── index.html
  ```


## Components

### Posts
- PostsListComponent (/posts)
  - Displays list of posts
  - Filters: searchText, userId (server-side), onlyFavorites (client-side)
  - Loader skeleton

- PostDetailsComponent (/posts/:id)
  - Full post content
  - Author data (User)
  - Comments
  - Toggle favorite

### Favorites
- FavoritesComponent (/favorites)
  - Shows only posts marked as favorites

### Gantt (bonus)
- GanttComponent (/gantt)
  - Simple timeline (mocked start–end dates based on posts)

## Services

### ApiHttpService
- HTTP service for BE calls
- Methods:
  - getPosts(userId?: number): Observable<Post[]>
  - getPost(id: number): Observable<Post>
  - getUser(id: number): Observable<User>
  - getCommentsForPost(id: number): Observable<Comment[]>

### FavoritesService
- In-memory Set of favorite post IDs
- API:
  - toggle(id: number): void
  - has(id: number): boolean
  - ids: Signal<Set<number>>

## State Management Approach

### Principles
- Scoped store per feature (provided at component via providers)
- Signals for UI state and derived selections:
  - signal, computed, effect from @angular/core
- Dumb components: bind to store signals, call store methods; no HTTP, no domain logic in components
- Zoneless: provideZonelessChangeDetection() in main.ts
- Routing: standalone + lazy-loaded features (/posts, /favorites, /gantt)


### Stores


#### PostsStore
The `PostsStore` is responsible for handling the **list of posts**.  
It provides all necessary logic for retrieving posts from the API, applying filters, managing pagination, and integrating with the favorites feature.

**Responsibilities and functionality:**
- Fetch posts from the backend (all posts or filtered by user).
- Ensure posts are fetched only once after reload; subsequent fetches happen only when the user filter changes or when explicitly forced.
- Expose the current loading and error state to the UI.
- Support filtering by:
  - **userId** (server-side filter, triggers API call).
  - **search text** (client-side filter on title/body).
  - **favorites only** (client-side filter, reuses FavoritesService).
- Allow toggling and checking the favorite status of a post.
- Provide a method to apply multiple filters in a single call.

**Behavior:**
- On initialization, attempts to fetch posts once.
- On user filter change, automatically fetches new data from the API.
- Client-side filters (search text, favorites) do not trigger API calls; they only filter already loaded data.


#### PostDetailsStore
The `PostDetailsStore` is responsible for handling the **details of a single post**, including its related author and comments.

**Responsibilities and functionality:**
- Fetch a specific post by ID from the backend.
- Fetch the post’s author details (user).
- Fetch all comments for the post.
- Expose the current loading and error state to the UI.
- Allow toggling and checking the favorite status of the loaded post.

**Behavior:**
- On `load(postId)`, performs all necessary API calls (`getPost`, `getUser`, `getCommentsForPost`).
- Provides a single entry point (`data`) that represents the full details of the post.
- Integrates with FavoritesService to mark/unmark the post as a favorite.

## Routing
- Standalone + lazy-loaded features:
  - /posts → features/posts/posts.routes.ts (list + details)
  - /favorites → features/favorites/favorites.routes.ts
  - /gantt → features/gantt/gantt.routes.ts
