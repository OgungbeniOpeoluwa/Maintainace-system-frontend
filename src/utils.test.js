import { describe, it, expect } from "vitest";
import { ticketCode, initials } from "./utils";

describe("ticketCode", () => {
  it("formats the last 6 characters of an id, uppercased, with a # prefix", () => {
    expect(ticketCode("abc123DEF456")).toBe("#DEF456");
  });

  it("returns a placeholder when no id is given", () => {
    expect(ticketCode(null)).toBe("#——————");
    expect(ticketCode(undefined)).toBe("#——————");
  });
});

describe("initials", () => {
  it("builds initials from a first and last name", () => {
    expect(initials("Jane Doe")).toBe("JD");
  });

  it("handles a single-word name", () => {
    expect(initials("Cher")).toBe("C");
  });

  it("returns a placeholder when no name is given", () => {
    expect(initials("")).toBe("?");
    expect(initials(undefined)).toBe("?");
  });
});
