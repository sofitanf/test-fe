import { useEffect, useState } from 'react';

import moonIcon from './assets/moon.svg';
import sunIcon from './assets/sun.svg';
import pencilIcon from './assets/pencil.svg';
import trashIcon from './assets/trash.svg';
import plusIcon from './assets/plus.svg';
import empty from './assets/empty.svg';

import useNoteStore from './stores/noteStore';
import useModalStore from './stores/modalStore';

import Modal from './components/Modal';

import { INote } from './types/note';

const DATA_FILTER = ['ALL', 'FINISHED', 'UNFINISHED', 'A-Z', 'Z-A'];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [filteredData, setFilteredData] = useState<INote[]>([]);
  const [id, setId] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isNote, setIsNote] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [formData, setFormData] = useState<INote>({
    id: '',
    title: '',
    description: '',
    datetime: new Date().toISOString().slice(0, 16),
    finish: false,
  });

  const { notes, addNote, removeNote, editNote } = useNoteStore((state) => ({
    notes: state.notes,
    addNote: state.addNote,
    removeNote: state.removeNote,
    editNote: state.editNote,
  }));

  const { changeDisplay, isDisplay } = useModalStore((state) => ({
    isDisplay: state.isDisplay,
    changeDisplay: state.changeDisplay,
  }));

  useEffect(() => {
    setFilteredData(notes);
  }, [notes]);

  // dark mode
  useEffect(() => {
    const html = document.querySelector('html');
    if (html && localStorage.getItem('darkMode') === 'true') {
      html.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const darkToggle = () => {
    const html = document.querySelector('html');
    if (html) {
      if (!darkMode) {
        html.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
        setDarkMode(true);
      } else {
        html.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
        setDarkMode(false);
      }
    }
  };

  // handle modal
  const handleModalNote = (type: boolean) => {
    setIsNote(type);
    changeDisplay(type);
  };

  const handleModalDelete = (type: boolean) => {
    setIsDelete(type);
    changeDisplay(type);
  };
  // end handle modal

  // submit note
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitNote = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) editNote(id, formData);
    else addNote({ ...formData, id: generateId() });

    handleModalNote(false);
    resetForm();
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  };
  // end submit note

  // reset form
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      datetime: new Date().toISOString().slice(0, 16),
      finish: false,
    });
  };

  // new note
  const handleNewNote = () => {
    resetForm();
    setIsEdit(false);
    handleModalNote(true);
  };

  // delete note
  const handleDeleteNote = () => {
    removeNote(id);
    setIsDelete(false);
  };

  // edit note
  const handleFinishNote = (id: string) => {
    const payload = notes.find((item) => item.id === id);
    if (payload) editNote(id, { ...payload, finish: !payload.finish });
  };

  // show detail note
  const handleDetailNote = (id: string) => {
    const payload = notes.find((item) => item.id === id);
    if (payload) {
      setIsEdit(true);
      setFormData(payload);
      handleModalNote(true);
    }
  };

  // filter
  const handleFilter = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    let result: INote[] = [];

    if (type === 'search') {
      result = notes.filter((note) =>
        note.title.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      if (value === 'A-Z') {
        result = notes.sort((a, b) => a.title.localeCompare(b.title));
      } else if (value === 'Z-A') {
        result = notes.sort((a, b) => b.title.localeCompare(a.title));
      } else if (value === 'FINISHED') {
        result = notes.filter((note) => note?.finish === true);
      } else if (value === 'UNFINISHED') {
        result = notes.filter((note) => note?.finish === false);
      } else {
        result = notes;
      }
    }

    setFilteredData(result);
  };

  return (
    <>
      <div className='container h-screen font-kanit dark:bg-black'>
        <div className='relative h-full'>
          <div className='flex flex-col gap-6 pt-10'>
            <h1 className='text-3xl font-semibold text-center dark:text-white'>
              TODO LIST
            </h1>
            <div className='flex gap-4'>
              <div className='grow'>
                <div className='relative w-full'>
                  <input
                    onChange={(e) => handleFilter('search', e)}
                    className='border-purple border outline-none rounded-md w-full px-3 py-2 text-purple focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:ring-opacity-50 dark:bg-black dark:border-white'
                    placeholder='Search note...'
                    type='text'
                  />
                </div>
              </div>
              <select
                onChange={(e) => handleFilter('filter', e)}
                className='box-purple'
              >
                {DATA_FILTER.map((item) => (
                  <option
                    key={item}
                    className='bg-white text-purple'
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
              <button onClick={darkToggle} className='box-purple'>
                <img src={darkMode ? sunIcon : moonIcon} alt='dark' />
              </button>
            </div>
            {filteredData?.length === 0 && (
              <div className='flex flex-col items-center gap-3'>
                <img src={empty} alt='empty' />
                <p className='dark:text-white'>Empty...</p>
              </div>
            )}
            <div className='flex justify-center'>
              <div className='w-3/4 flex flex-col'>
                {filteredData?.map((note) => {
                  return (
                    <div
                      key={note?.id}
                      onClick={() => setId(note?.id)}
                      className='border-b border-purple py-3'
                    >
                      <div className='flex justify-between mb-2'>
                        <div className='flex gap-4 items-center'>
                          <input
                            onChange={() => handleFinishNote(note?.id)}
                            id={note?.id}
                            checked={note?.finish}
                            type='checkbox'
                            className='w-[24px] h-[24px] outline-none border border-purple checked:bg-purple checked:border-violet-700'
                          />
                          <label
                            className={`${
                              note?.finish
                                ? 'line-through text-gray-400'
                                : 'dark:text-white'
                            } text-xl font-medium `}
                            htmlFor={note?.id}
                          >
                            {note?.title}
                          </label>
                        </div>
                        <div className='flex gap-2'>
                          <button
                            className='w-[16px] h-[16px]'
                            onClick={() => handleDetailNote(note?.id)}
                          >
                            <img src={pencilIcon} alt='edit' />
                          </button>
                          <button
                            className='w-[16px] h-[16px]'
                            onClick={() => handleModalDelete(true)}
                          >
                            <img
                              className='w-[16px] h-[16px] cursor-pointer'
                              src={trashIcon}
                              alt='delete'
                            />
                          </button>
                        </div>
                      </div>
                      <div className='pl-10 pr-4 flex flex-col'>
                        <p
                          className={`${
                            note?.finish
                              ? 'line-through text-gray-400'
                              : 'dark:text-white'
                          } `}
                        >
                          {note?.description}
                        </p>
                        <p
                          className={`${
                            note?.finish
                              ? 'line-through text-gray-400'
                              : 'dark:text-white'
                          } `}
                        >
                          Due:{' '}
                          <span className='font-medium'>{note?.datetime}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            onClick={handleNewNote}
            className='absolute bottom-[1.5rem] right-0 bg-purple mb-10 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg ring-2 ring-violet-200 ring-opacity-50 hover:bg-purple10 hover:border-violet-700'
          >
            <img src={plusIcon} alt='add' />
          </button>
        </div>
      </div>
      {isDisplay && isNote && (
        <Modal>
          <form onSubmit={submitNote}>
            <div className='bg-white dark:bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='flex flex-col gap-2'>
                <p className='text-2xl font-medium text-center dark:text-white'>
                  {isEdit ? 'EDIT' : 'NEW'} NOTE
                </p>
                <div className='flex flex-col gap-1'>
                  <label className='text-purple' htmlFor='title'>
                    Title
                  </label>
                  <input
                    required
                    onChange={handleChangeInput}
                    value={formData.title}
                    name='title'
                    className='input'
                    type='text'
                    id='title'
                    placeholder='Enter title'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='text-purple' htmlFor='description'>
                    Description
                  </label>
                  <textarea
                    required
                    onChange={handleChangeInput}
                    value={formData.description}
                    name='description'
                    className='input'
                    id='description'
                    placeholder='Enter description'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='text-purple' htmlFor='datetime'>
                    Due date and time
                  </label>
                  <input
                    required
                    onChange={handleChangeInput}
                    value={formData.datetime}
                    name='datetime'
                    className='input'
                    type='datetime-local'
                    id='datetime'
                    placeholder='Enter datetime'
                  />
                </div>
              </div>
            </div>
            <div className='bg-white dark:bg-black px-4 py-3 justify-between sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                type='submit'
                className='inline-flex w-full uppercase justify-center rounded-md bg-purple px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-900 sm:ml-3 sm:w-auto'
              >
                Apply
              </button>
              <button
                onClick={() => handleModalNote(false)}
                type='button'
                className='mt-3 uppercase text-purple border-purple inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-purple hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-black'
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDisplay && isDelete && (
        <Modal>
          <div className='bg-white dark:bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
            <div className='flex flex-col justify-center items-center gap-2 text-center'>
              <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-20 sm:w-20'>
                <svg
                  className='h-10 w-10 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
                  />
                </svg>
              </div>
              <h3
                className='text-2xl dark:text-white text-center font-semibold leading-6 text-gray-900 mt-4'
                id='modal-title'
              >
                Delete note
              </h3>
              <p className='text-sm dark:text-white text-gray-500'>
                Are you sure you want to remove your note?
              </p>
            </div>
          </div>
          <div className='bg-gray-50 dark:bg-black px-4 py-3 justify-between sm:flex sm:flex-row-reverse sm:px-6'>
            <button
              onClick={handleDeleteNote}
              type='button'
              className='inline-flex w-full justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
            >
              Delete
            </button>
            <button
              onClick={() => handleModalDelete(false)}
              type='button'
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-black dark:text-white'
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default App;
