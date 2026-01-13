import { createContext, useContext, ReactNode } from "react";

// This will be used to share state between pages if needed
// For now, we'll keep state local to each page

export const AppContext = createContext<{}>({});

export const useAppContext = () => useContext(AppContext);

