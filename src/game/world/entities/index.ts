// Entity system for future ECS expansion
// Entities are collections of components

export interface Entity {
  id: string;
  components: Map<string, unknown>;
}

export class EntityManager {
  private entities: Map<string, Entity> = new Map();
  private nextId = 0;

  public createEntity(): Entity {
    const id = `entity_${this.nextId++}`;
    const entity: Entity = {
      id,
      components: new Map(),
    };
    this.entities.set(id, entity);
    return entity;
  }

  public destroyEntity(id: string): void {
    this.entities.delete(id);
  }

  public getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  public getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }
}
