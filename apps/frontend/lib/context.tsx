import { createContext } from "react";

export const EditorContext = createContext<{ chatId: string | null }>({ chatId: null })
