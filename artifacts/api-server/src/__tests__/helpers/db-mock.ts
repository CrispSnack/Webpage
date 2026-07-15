/**
 * Mock factory for Drizzle ORM's chainable query builder.
 *
 * Drizzle queries are fluent chains that are Promise-like (thenable).
 * Every method (from, where, limit, orderBy, values, set) returns the
 * same chain object.  When the chain is awaited, it resolves to `result`.
 * .returning() also returns a Promise that resolves to `result`.
 */
import { vi } from "vitest";

// Sentinel so tests can assert the mock was called
export type MockChain = {
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => Promise<unknown>;
};

export function makeChain(result: unknown): MockChain {
  const chain: any = {};
  for (const m of ["from", "where", "limit", "orderBy", "values", "set"]) {
    chain[m] = vi.fn(() => chain);
  }
  chain.returning = vi.fn(() => Promise.resolve(result));
  // Make the chain itself awaitable — resolves to `result`
  chain.then = (
    resolve: (v: unknown) => unknown,
    reject: (e: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return chain as MockChain;
}

// ---------------------------------------------------------------------------
// Pre-built mock db object — replace per-test with mockReturnValueOnce
// ---------------------------------------------------------------------------
export const mockDb = {
  select: vi.fn(() => makeChain([])),
  insert: vi.fn(() => makeChain([])),
  update: vi.fn(() => makeChain([])),
  delete: vi.fn(() => makeChain(undefined)),
};

/** Convenience: prime the NEXT select() call to resolve with `rows`. */
export function whenSelect(rows: unknown[]) {
  mockDb.select.mockReturnValueOnce(makeChain(rows));
}

/** Convenience: prime the NEXT insert().values().returning() to resolve with `rows`. */
export function whenInsert(rows: unknown[]) {
  mockDb.insert.mockReturnValueOnce(makeChain(rows));
}

/** Convenience: prime the NEXT update().set().where().returning() to resolve with `rows`. */
export function whenUpdate(rows: unknown[]) {
  mockDb.update.mockReturnValueOnce(makeChain(rows));
}

/** Reset all mock call counts and return values between tests. */
export function resetDb() {
  mockDb.select.mockReset().mockReturnValue(makeChain([]));
  mockDb.insert.mockReset().mockReturnValue(makeChain([]));
  mockDb.update.mockReset().mockReturnValue(makeChain([]));
  mockDb.delete.mockReset().mockReturnValue(makeChain(undefined));
}
