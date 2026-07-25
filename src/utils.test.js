import { describe, it, expect } from "vitest";
import { ticketCode, initials, fileUrl } from "./utils";

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

describe("fileUrl", () => {
  it("returns null when no path is given", () => {
    expect(fileUrl(null)).toBeNull();
    expect(fileUrl(undefined)).toBeNull();
  });

  it("passes through an absolute URL unchanged (e.g. Cloudinary)", () => {
    const cloudinaryUrl = "https://res.cloudinary.com/demo/image/upload/v1/maintenance-system/abc.jpg";
    expect(fileUrl(cloudinaryUrl)).toBe(cloudinaryUrl);
  });

  it("prefixes a relative local-disk path with the API host", () => {
    const result = fileUrl("/uploads/abc123.jpg");
    expect(result.endsWith("/uploads/abc123.jpg")).toBe(true);
    expect(result.startsWith("http")).toBe(true);
  });
});
