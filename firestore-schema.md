# Firestore schema

All collections are scoped under the anonymous-auth `uid`, except `catalog` which is shared/global.

## `users/{uid}/items/{itemId}`
Current shopping list.
```
{
  name: "milk",
  category: "dairy",
  quantity: 2,
  unit: "bottles",
  addedAt: Timestamp,
  status: "pending" | "confirmed"   // optimistic UI flag
}
```

## `users/{uid}/history/{entryId}`
Append-only log used for the low-stock heuristic. One entry per add/remove action.
```
{
  itemName: "bread",
  action: "add" | "remove",
  timestamp: Timestamp
}
```

## `catalog/{itemId}` (global, read-only from client)
Mock product data for search, price filtering, and substitutes.
```
{
  name: "almond milk",
  category: "dairy",
  brand: "Sofit",
  price: 3.49,
  inSeason: false,
  substituteFor: ["milk"]
}
```

## Low-stock heuristic (computed client-side from `history`)
For each item name: `avgInterval = mean(gap between consecutive "add" timestamps)`.
If `daysSinceLastAdd > avgInterval * 0.9` → surface as a suggestion.
Needs at least 2 prior "add" entries to compute an interval — falls back to silence
(no false suggestion) rather than guessing on sparse data.
