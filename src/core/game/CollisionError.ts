export class CollisionError extends Error {
  constructor() {
    super('Comet collided and lost!');
  }
}
