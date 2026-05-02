import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { setup, teardown } from "./test-helpers.js";

// Note: Ensure your test helpers are set up correctly
// See next steps if `test-helpers.ts` is missing.

describe("Firestore Security Rules", () => {
    let unauthedDb: any;
    let authedDb: any;
    let otherAuthedDb: any;

    beforeAll(async () => {
        const env = await setup({
            projectId: "test-project",
            rulesPath: "DRAFT_firestore.rules"
        });
        unauthedDb = env.unauthenticatedContext().firestore();
        authedDb = env.authenticatedContext("user123").firestore();
        otherAuthedDb = env.authenticatedContext("hacker999").firestore();
    });

    afterAll(async () => {
        await teardown();
    });

    it("P1 (Spoofing) - Hacker tries to read victim meta", async () => {
        const ref = otherAuthedDb.doc("users/user123/appState/meta");
        await expect(ref.get()).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P2 (Spoofing) - Hacker tries to write victim meta", async () => {
        const ref = otherAuthedDb.doc("users/user123/appState/meta");
        await expect(ref.set({ chunks: 5 })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P3 (Size Exceeded) - Try to write more than 1MB to chunk_0", async () => {
        const ref = authedDb.doc("users/user123/appState/chunk_0");
        const largeStr = "a".repeat(1048577);
        await expect(ref.set({ data: largeStr })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P4 (Resource Poisoning) - Write to invalid path", async () => {
        const ref = authedDb.doc("users/user123/appState/meta/hidden/data");
        await expect(ref.set({ foo: "bar" })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P5 (Unauthenticated) - Read", async () => {
        const ref = unauthedDb.doc("users/user123/appState/meta");
        await expect(ref.get()).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P6 (Unauthenticated) - Write", async () => {
        const ref = unauthedDb.doc("users/user123/appState/meta");
        await expect(ref.set({ chunks: 2 })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P7 (Missing required field) - Meta without 'chunks'", async () => {
        const ref = authedDb.doc("users/user123/appState/meta");
        await expect(ref.set({ somethingElse: 5 })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P8 (Invalid document ID) - random_name", async () => {
        const ref = authedDb.doc("users/user123/appState/random_name");
        await expect(ref.set({ chunks: 5 })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P9 (Type Violation) - Chunk data is a number", async () => {
        const ref = authedDb.doc("users/user123/appState/chunk_1");
        await expect(ref.set({ data: 12345 })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P10 (Type Violation) - Meta chunks is a string", async () => {
        const ref = authedDb.doc("users/user123/appState/meta");
        await expect(ref.set({ chunks: "2" })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P11 (Orphaned Write) - Meta with extra fields", async () => {
        const ref = authedDb.doc("users/user123/appState/meta");
        await expect(ref.set({ chunks: 5, extra: true })).rejects.toThrow("PERMISSION_DENIED");
    });

    it("P12 (Orphaned Write) - Chunk with extra fields", async () => {
        const ref = authedDb.doc("users/user123/appState/chunk_0");
        await expect(ref.set({ data: "hello", extra: "world" })).rejects.toThrow("PERMISSION_DENIED");
    });

    // Valid ones should pass
    it("Valid - Meta", async () => {
        const ref = authedDb.doc("users/user123/appState/meta");
        await expect(ref.set({ chunks: 5 })).resolves.toBeUndefined();
    });

    it("Valid - Chunk", async () => {
        const ref = authedDb.doc("users/user123/appState/chunk_0");
        await expect(ref.set({ data: "hello" })).resolves.toBeUndefined();
    });
});
