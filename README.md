# Gravity Singleshot

A physics-based puzzle game built with PixiJS and TypeScript where players launch a ball through challenging levels using gravity and momentum.

## 🎮 Game Overview

Gravity Singleshot is a minimalist puzzle game where you must navigate a ball from start to finish in as few shots as possible. Master the physics, time your launches perfectly, and collect stars based on your performance!

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kujo205/gravity-singleshot.git
cd gravity-singleshot
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:
```bash
pnpm dev
```

The game will open in your default browser at `http://localhost:3000`

### Building

Build for production:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## 🧪 Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with UI:
```bash
pnpm test:ui
```

## 🛠️ Development Tools

### Code Quality

Format code:
```bash
pnpm format
```

Lint code:
```bash
pnpm lint
```

Fix linting issues:
```bash
pnpm lint:fix
```

Check and fix all issues:
```bash
pnpm check
```

Type check:
```bash
pnpm type-check
```

## 📁 Project Structure

```
gravity-singleshot/
├── public/                      # Static assets
│   ├── index.html              # HTML entry point
│   ├── assets/                 # Game assets
│   │   ├── audio/             # Sound effects and music
│   │   └── images/            # Sprites and textures
│   └── levels/                # Level JSON files
│       ├── level-1.json
│       ├── level-2.json
│       └── level-3.json
├── src/
│   ├── core/                  # Core engine
│   │   ├── App.ts            # Main application
│   │   ├── Scene.ts          # Base scene class
│   │   ├── SceneManager.ts   # Scene management
│   │   ├── Assets.ts         # Asset loading
│   │   ├── Input.ts          # Input handling
│   │   ├── Audio.ts          # Audio management
│   │   └── Resize.ts         # Window resize handling
│   ├── game/
│   │   ├── world/            # Game world
│   │   │   ├── World.ts      # Main world container
│   │   │   ├── systems/      # Game systems
│   │   │   │   ├── PhysicsSystem.ts
│   │   │   │   ├── CollisionSystem.ts
│   │   │   │   ├── TrajectoryPreviewSystem.ts
│   │   │   │   ├── CheckpointSystem.ts
│   │   │   │   └── CameraSystem.ts
│   │   │   ├── components/   # ECS components
│   │   │   └── entities/     # ECS entities
│   │   ├── levels/           # Level management
│   │   │   ├── schema.ts     # Level schema
│   │   │   ├── LevelFactory.ts
│   │   │   └── index.ts
│   │   └── services/         # Game services
│   │       ├── Progress.ts   # Player progress
│   │       └── RNG.ts        # Random number generation
│   ├── scenes/               # Game scenes
│   │   ├── BootScene.ts      # Loading scene
│   │   ├── MenuScene.ts      # Main menu
│   │   ├── LevelSelectScene.ts
│   │   ├── PlayScene.ts      # Gameplay scene
│   │   ├── ResultsScene.ts   # Level completion
│   │   └── ShopScene.ts      # In-game shop
│   ├── ui/                   # UI components
│   │   ├── Button.ts         # Interactive button
│   │   ├── Panel.ts          # Container panel
│   │   └── HUD.ts            # Heads-up display
│   ├── utils/                # Utilities
│   │   ├── math.ts           # Math helpers
│   │   └── tweening.ts       # Animation easing
│   ├── config/               # Configuration
│   │   ├── constants.ts      # Game constants
│   │   └── tuning.ts         # Gameplay tuning
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   └── main.ts               # Entry point
├── biome.json                # Biome configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest configuration
├── package.json              # Package configuration
└── README.md                 # This file
```

## 🎯 Game Features

- **Physics-based gameplay** - Realistic gravity and collision mechanics
- **Level progression** - 20 challenging levels with increasing difficulty
- **Star rating system** - Earn up to 3 stars per level based on performance
- **Checkpoints** - Strategic checkpoint placement for complex levels
- **Different platform types** - Normal, bouncy, and sticky platforms
- **Trajectory preview** - See your shot before launching
- **Progress tracking** - Local storage saves your progress
- **In-game shop** - Unlock skins, trails, and power-ups

## 🎨 Technology Stack

- **[PixiJS](https://pixijs.com/)** - 2D WebGL renderer
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[pnpm](https://pnpm.io/)** - Efficient package manager

## 📝 Game Architecture

### Core Systems

- **App**: Main application container managing PixiJS
- **SceneManager**: Handles scene transitions and lifecycle
- **Scene**: Base class for all game scenes
- **Assets**: Asset loading and management
- **Input**: Mouse and touch input handling
- **Audio**: Sound effects and music playback

### Game Systems

- **PhysicsSystem**: Gravity and velocity calculations
- **CollisionSystem**: Collision detection and resolution
- **TrajectoryPreviewSystem**: Trajectory prediction rendering
- **CheckpointSystem**: Checkpoint activation tracking
- **CameraSystem**: Smooth camera following

### Scene Flow

```
BootScene (Loading) → MenuScene → PlayScene
                          ↓           ↓
                    LevelSelectScene  ResultsScene
                          ↓
                       ShopScene
```

## 🎮 How to Play

1. **Aim**: Click and drag from the ball to set your launch direction and power
2. **Launch**: Release to launch the ball
3. **Complete**: Guide the ball to the red goal marker
4. **Optimize**: Try to complete levels within par to earn 3 stars

### Controls

- **Mouse/Touch**: Drag to aim and launch
- **Reset Button**: Restart the current level
- **Pause Button**: Return to menu

## 🔧 Configuration

### Constants (`src/config/constants.ts`)

Adjust game constants like colors, physics parameters, and UI dimensions.

### Tuning (`src/config/tuning.ts`)

Fine-tune gameplay parameters for difficulty, scoring, and visual effects.

## 📦 Building Levels

Levels are defined in JSON format in `public/levels/`. Each level includes:

- **platforms**: Array of platform objects with position, size, and type
- **start**: Starting position coordinates
- **end**: Goal position coordinates
- **obstacles**: Array of obstacle objects
- **checkpoints**: Array of checkpoint positions
- **gravity**: Gravity vector (x, y)
- **par**: Target number of shots for 3 stars

Example level structure:
```json
{
  "id": "level-1",
  "name": "First Steps",
  "difficulty": 1,
  "par": 3,
  "platforms": [...],
  "start": { "x": 150, "y": 300 },
  "end": { "x": 750, "y": 200 },
  "obstacles": [...],
  "checkpoints": [...],
  "gravity": { "x": 0, "y": 200 }
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [PixiJS](https://pixijs.com/)
- Inspired by physics puzzle games
- Thanks to the open-source community

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ using PixiJS and TypeScript
