import { StateCreator, create } from 'zustand';

interface ModeStore {
  isDark: boolean;
  changeDark: () => void;
}

const modeStore: StateCreator<ModeStore> = (set, get) => ({
  isDark: (() => {
    const storedMode = localStorage.getItem('mode');
    const html = document.querySelector('html');
    if (html && storedMode === 'dark') html.classList.add('dark');
    return storedMode === 'dark';
  })(),
  changeDark: () => {
    const html = document.querySelector('html');
    set((state) => ({
      isDark: !state.isDark,
    }));
    if (html) {
      if (get().isDark) {
        html.classList.add('dark');
        localStorage.setItem('mode', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('mode', 'light');
      }
    }
  },
});

const useModeStore = create(modeStore);

export default useModeStore;
