'use client';

import { createContext, useContext } from 'react';

interface DocumentContextType {
  documentId: string;
  documentTitle: string;
  documentContent: string;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({
  children,
  documentId,
  documentTitle,
  documentContent,
}: React.PropsWithChildren<DocumentContextType>) {
  return (
    <DocumentContext.Provider value={{ documentId, documentTitle, documentContent }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
}
