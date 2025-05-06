import { createContext, ReactNode, useContext } from 'react';

interface GroupContextType {
  group: string;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

interface GroupProviderProps {
  children: ReactNode;
  group: string;
}

export function GroupProvider({ children, group }: GroupProviderProps) {
  return (
    <GroupContext.Provider value={{ group }}>{children}</GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}
