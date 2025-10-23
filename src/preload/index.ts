import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getAll: () => ipcRenderer.invoke('todo-getAll'),
  add: (todo) => ipcRenderer.invoke('todo-add', todo),
  deleteTodo: (id) => ipcRenderer.invoke('delete-todo', id),
  updateStatus: (id, todoStatus) => ipcRenderer.invoke('update-status', id, todoStatus)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
