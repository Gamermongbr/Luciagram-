# Security Specification

## Data Invariants
1. Users can only access and modify their own `appState` documents located at `/users/{userId}/appState/{documentId}`.
2. The user ID in the path must strictly match the authenticated user's `uid`.
3. Documents must adhere strictly to the allowed fields and size limits. Specifically, `documentId` can only be `meta` or start with `chunk_`.

## The "Dirty Dozen" Payloads
1. **P1 (Spoofing)**: Attacker tries to read `users/{victimId}/appState/meta`.
2. **P2 (Spoofing)**: Attacker tries to write to `users/{victimId}/appState/meta`.
3. **P3 (Size Exceeded)**: Attacker tries to write a chunk document with data exceeding 1MB (simulated).
4. **P4 (Resource Poisoning)**: Attacker tries to write to a deeply nested invalid path like `users/{userId}/appState/meta/hidden/data`.
5. **P5 (Invalid Unauthenticated)**: Unauthenticated user tries to read data.
6. **P6 (Invalid Unauthenticated)**: Unauthenticated user tries to write data.
7. **P7 (Missing required field)**: Update valid user state with missing 'data' field in a chunk.
8. **P8 (Invalid document ID)**: Write to `/users/{userId}/appState/random_name`.
9. **P9 (Type Violation)**: Write `data` as a number instead of a string in a chunk.
10. **P10 (Type Violation - Meta)**: Write `chunks` as a string instead of an integer in `meta`.
11. **P11 (Orphaned Write)**: Ensure write to `meta` doesn't contain extra fields (`hasOnly()`).
12. **P12 (Orphaned Write - Chunk)**: Ensure write to `chunk_0` doesn't contain extra fields (`hasOnly()`).

