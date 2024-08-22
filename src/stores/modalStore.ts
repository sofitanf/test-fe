import { StateCreator, create } from 'zustand';

interface ModalStore {
  isDisplay: boolean;
  changeDisplay: (show: boolean) => void;
}

const modalStore: StateCreator<ModalStore> = (set, get) => ({
  isDisplay: false,
  changeDisplay: (show) => {
    set(() => ({
      isDisplay: show,
    }));
  },
});

const useModalStore = create(modalStore);

export default useModalStore;
