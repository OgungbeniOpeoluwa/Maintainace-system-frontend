import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PriorityChip from "./PriorityChip";

describe("PriorityChip", () => {
  it("renders High for HIGH priority", () => {
    render(<PriorityChip priority="HIGH" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders Medium for MEDIUM priority", () => {
    render(<PriorityChip priority="MEDIUM" />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders Low for LOW priority", () => {
    render(<PriorityChip priority="LOW" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });
});
