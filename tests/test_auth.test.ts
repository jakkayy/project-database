import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import { requireAuth } from "../lib/auth";
import { HttpError } from "../lib/error";

const SECRET = "test-secret";
// testing github action
beforeAll(() => {
  process.env.JWT_SECRET = SECRET;
});

function makeToken(payload: object, expiresIn = "1d") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

describe("requireAuth", () => {
  it("throws 401 when token is undefined", () => {
    expect(() => requireAuth(undefined)).toThrowError(HttpError);
    try {
      requireAuth(undefined);
    } catch (e: any) {
      expect(e.status).toBe(401);
    }
  });

  it("throws 401 when token is invalid string", () => {
    expect(() => requireAuth("invalid.token.here")).toThrowError(HttpError);
    try {
      requireAuth("invalid.token.here");
    } catch (e: any) {
      expect(e.status).toBe(401);
    }
  });

  it("throws 403 when role does not match required role", () => {
    const token = makeToken({ user_id: 1, role: "USER" });
    expect(() => requireAuth(token, "ADMIN")).toThrowError(HttpError);
    try {
      requireAuth(token, "ADMIN");
    } catch (e: any) {
      expect(e.status).toBe(403);
    }
  });

  it("returns payload when token is valid and no role required", () => {
    const token = makeToken({ user_id: 42, role: "USER" });
    const result = requireAuth(token);
    expect(result.user_id).toBe(42);
    expect(result.role).toBe("USER");
  });

  it("returns payload when token matches required role", () => {
    const token = makeToken({ user_id: 7, role: "ADMIN" });
    const result = requireAuth(token, "ADMIN");
    expect(result.user_id).toBe(7);
    expect(result.role).toBe("ADMIN");
  });
});
