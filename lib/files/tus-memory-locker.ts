import { ERRORS, Lock, Locker, RequestRelease } from "@tus/utils";

/**
 * MemoryLocker is a simple in-memory implementation of the Locker interface
 * for local development purposes. This should NOT be used in production
 * as it only works for single-instance deployments.
 */

interface MemoryLockerOptions {
  acquireLockTimeout?: number;
}

export class MemoryLocker implements Locker {
  timeout: number;
  private locks = new Map<string, { lockId: string; timestamp: number }>();

  constructor(options: MemoryLockerOptions = {}) {
    this.timeout = options.acquireLockTimeout ?? 1000 * 30; // default: 30 seconds
  }

  newLock(id: string) {
    return new MemoryLock(id, this, this.timeout);
  }

  private isLocked(id: string): boolean {
    const lock = this.locks.get(id);
    if (!lock) return false;

    // Check if lock has expired
    if (Date.now() - lock.timestamp > this.timeout) {
      this.locks.delete(id);
      return false;
    }

    return true;
  }

  private acquireLock(id: string, lockId: string): boolean {
    if (this.isLocked(id)) {
      return false;
    }

    this.locks.set(id, { lockId, timestamp: Date.now() });
    return true;
  }

  private releaseLock(id: string, lockId: string): boolean {
    const lock = this.locks.get(id);
    if (lock && lock.lockId === lockId) {
      this.locks.delete(id);
      return true;
    }
    return false;
  }
}

class MemoryLock implements Lock {
  private lockId: string;

  constructor(
    private id: string,
    private locker: MemoryLocker,
    private timeout: number = 1000 * 30, // default: 30 seconds
  ) {
    this.lockId = Math.random().toString(36).substring(2, 15);
  }

  async lock(signal: AbortSignal, cancelReq: RequestRelease): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < this.timeout) {
      if (signal.aborted) {
        throw new Error("Lock acquisition aborted");
      }

      if ((this.locker as any).acquireLock(this.id, this.lockId)) {
        return;
      }

      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw ERRORS.ERR_LOCK_TIMEOUT;
  }

  async unlock(): Promise<void> {
    (this.locker as any).releaseLock(this.id, this.lockId);
  }
}
