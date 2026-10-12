import { describe, it, expect } from "vitest";
import { projects } from "./projects";
describe("portfolio content", () => {
  it("has unique routes and honest concept descriptions", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    for (const p of projects) {
      expect(p.description).toMatch(/imagined|fictional/);
      expect(p.brief.length).toBeGreaterThan(30);
      expect(p.value).toMatch(/^Designed to/);
    }
  });
});
