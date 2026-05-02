import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import fs from "fs";

let testEnv;

export async function setup({ projectId, rulesPath }) {
    const rules = fs.readFileSync(rulesPath, "utf8");
    testEnv = await initializeTestEnvironment({
        projectId,
        firestore: { rules }
    });
    return testEnv;
}

export async function teardown() {
    if (testEnv) {
        await testEnv.cleanup();
    }
}
