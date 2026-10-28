import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { connectDatabase, disconnectDatabase } from "../src/database/connect.js";
import { createApp } from "../src/app.js";

describe("API health", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("returns a healthy response", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, data: { status: "ok" } });
  });

  it("exposes a CSRF token", async () => {
    const response = await request(createApp()).get("/api/v1/auth/csrf");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(typeof response.body.data.csrfToken).toBe("string");
  });
});
