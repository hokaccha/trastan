import type { IpcRenderer } from "electron";
import { ipcRenderer } from "electron";

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    env: Record<string, string | undefined>;
  }
}

process.once("loaded", () => {
  window.ipcRenderer = ipcRenderer;
});
