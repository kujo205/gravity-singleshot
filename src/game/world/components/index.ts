// Component system for future ECS expansion
// Components define data that entities can have

export interface Component {
  type: string;
}

export interface TransformComponent extends Component {
  type: 'transform';
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface VelocityComponent extends Component {
  type: 'velocity';
  x: number;
  y: number;
}

export interface ColliderComponent extends Component {
  type: 'collider';
  radius?: number;
  width?: number;
  height?: number;
  shape: 'circle' | 'rectangle';
}
