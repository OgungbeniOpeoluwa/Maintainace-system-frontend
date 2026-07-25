import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderAt(path, allowedRoles) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route
          path="/protected"
          element={
            <PrivateRoute allowedRoles={allowedRoles}>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("PrivateRoute", () => {
  it("redirects to /login when there is no logged-in user", () => {
    useAuth.mockReturnValue({ user: null });
    renderAt("/protected");
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the protected content when the user's role is allowed", () => {
    useAuth.mockReturnValue({ user: { role: "ADMIN" } });
    renderAt("/protected", ["ADMIN"]);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects home when the user's role is not in the allowed list", () => {
    useAuth.mockReturnValue({ user: { role: "STUDENT_STAFF" } });
    renderAt("/protected", ["ADMIN"]);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("allows access when no role restriction is set, for any logged-in user", () => {
    useAuth.mockReturnValue({ user: { role: "OFFICER" } });
    renderAt("/protected");
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
