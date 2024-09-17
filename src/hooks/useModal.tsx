// @ts-nocheck
import { createContext, useContext, useState } from 'react';


export enum ModalType {
  Personality,
}


export interface ModalArgsType {
  icon?: string;
  nickName?: string;
  name?: string;
  method?: string; 
}


export interface ModalContextType<T extends ModalArgsType> {
  openPersonality: () => void;
  close: () => void;
  type?: ModalType;
  args: T;
  setArgs: any;
  init?: () => void;
}


export const ModalContext = createContext<ModalContextType<ModalArgsType>>(
  {} as ModalContextType<ModalArgsType>
);


export const ModalContextProvider: React.FC = ({ children }) => {
  const { setSwitchNetworkError, currentAccount } = useWeb3Context();
  const [type, setType] = useState<ModalType>();
  const [args, setArgs] = useState<ModalArgsType>({});


  return (
    <ModalContext.Provider
      value={{
        openPersonality: () => {
          setType(ModalType.Personality)
          setArgs({});
        },
        


        close: () => {
          setType(undefined);
          setArgs({});
        },
        type,
        args,
        setArgs
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return context;
};
