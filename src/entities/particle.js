export class ParticlePool {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = Array.from({ length: capacity }, () => ({ active: false }));
  }

  resize(newCapacity) {
    if (newCapacity === this.capacity) return;
    if (newCapacity < this.capacity) {
      this.items.length = newCapacity;
    } else {
      for (let i = this.capacity; i < newCapacity; i += 1) {
        this.items.push({ active: false });
      }
    }
    this.capacity = newCapacity;
  }

  reset() {
    for (const p of this.items) p.active = false;
  }

  spawn(init) {
    const slot = this.items.find((p) => !p.active);
    if (!slot) return null;
    Object.assign(slot, init, { active: true });
    return slot;
  }

  activeCount() {
    let count = 0;
    for (const p of this.items) if (p.active) count += 1;
    return count;
  }
}
