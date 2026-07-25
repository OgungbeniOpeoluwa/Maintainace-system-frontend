import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the Pending label for a PENDING status", () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders the In Progress label for an IN_PROGRESS status", () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders the Completed label for a COMPLETED status", () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
