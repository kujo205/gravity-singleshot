import { MainMenuScene, GameScene, RoundSelectionScene } from './scenes';

const gameScenes = {
  MAIN_MENU: MainMenuScene,
  ROUND_SELECTION: RoundSelectionScene,
  GAME_SCENE: GameScene
} as const;

export type TGameScenes = keyof typeof gameScenes;

export const config = {
  GAME_SCENES: gameScenes,
  SCENE_CHANGE_EVENT: 'SCENE_CHANGE_EVENT'
};
