import Utils from '../utils.js';
import Notes from '../data/local/notes.js';

const home = () => {
  const searchFormElement = document.querySelector('search-bar');
  const addNoteElement = document.querySelector('add-note');

  const noteListContainerElement = document.querySelector('#noteListContainer');
  const noteLoadingElement = noteListContainerElement.querySelector('.search-loading');
  const noteListElement = noteListContainerElement.querySelector('note-list');

  const showNotes = (query = '') => { 
    showLoading();

    const result = Notes.searchNotes(query);
    displayResult(result);

    showNoteList();
  };

  const onSearchHandler = (event) => {
    event.preventDefault();
    const { query } = event.detail;
    showNotes(query);
  };

  const onNoteAddedHandler = (event) => {
    const newNote = event.detail.newNote;
    console.log('New note added:', newNote);

    showNotes();
  };

  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;
      return noteItemElement;
    });
    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  addNoteElement.addEventListener('noteAdded', onNoteAddedHandler);

  searchFormElement.addEventListener('search', onSearchHandler);
  showNotes();
};

export default home;