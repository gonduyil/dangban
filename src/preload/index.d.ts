import { ElectronAPI } from "@electron-toolkit/preload";
import { Todo } from "../main/model/Todo";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAll: () => Promise<Todo[]>
      add: (todo: any) => Promise<boolean>
      deleteTodo: (id: any) => Promise<boolean>
      updateStatus: (id: any, status: any) => Promise<boolean>
    };
  }
}
