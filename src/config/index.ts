import {
  MainMenuScene,
  GameScene,
  RoundSelectionScene,
  LostGameScene,
  WinGameScene
} from '../scenes';

const gameScenes = {
  MAIN_MENU: MainMenuScene,
  ROUND_SELECTION: RoundSelectionScene,
  GAME_SCENE: GameScene,
  LOST_GAME_SCENE: LostGameScene,
  WIN_GAME_SCENE: WinGameScene
} as const;

export type TGameScenes = keyof typeof gameScenes;

export const config = {
  GAME_SCENES: gameScenes,
  SCENE_CHANGE_EVENT: 'SCENE_CHANGE_EVENT'
};
