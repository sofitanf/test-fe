import { StateCreator, create } from 'zustand';
import { INote } from '../types/note';

interface NoteStore {
  notes: INote[];
  filteredNotes: INote[];
  addNote: (note: INote) => void;
  removeNote: (id: string) => void;
  editNote: (id: string, note: INote) => void;
}

const noteStore: StateCreator<NoteStore> = (set, get) => ({
  filteredNotes: [],
  notes: (() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  })(),
  addNote: (note: INote) => {
    set((state) => ({
      notes: [note, ...state.notes],
    }));
    const notes = get().notes;
    localStorage.setItem('notes', JSON.stringify(notes));
  },
  removeNote: (id: string) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
    const notes = get().notes;
    localStorage.setItem('notes', JSON.stringify(notes));
  },
  editNote: (id: string, note: INote) => {
    set((state) => ({
      notes: state.notes.map((item) => (id === item.id ? note : item)),
    }));
    const notes = get().notes;
    localStorage.setItem('notes', JSON.stringify(notes));
  },
});

const useNoteStore = create(noteStore);

export default useNoteStore;
