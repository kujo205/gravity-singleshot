import { type TGameScenes, config } from '../config';

type CallbackFunction = (scene: TGameScenes) => void;

export function onSceneChange(cb: CallbackFunction) {
  window.addEventListener(config.SCENE_CHANGE_EVENT, (e: Event) => {
    const customEvent = e as CustomEvent;
    const scene = customEvent.detail.scene as TGameScenes;
    cb(scene);
  });
}

export function emitSceneChange(scene: TGameScenes) {
  const event = new CustomEvent(config.SCENE_CHANGE_EVENT, {
    detail: { scene }
  });
  window.dispatchEvent(event);
}
