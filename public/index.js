if (window.location.pathname === '/notes') {
  let noteForm;
  let noteTitle;
  let noteText;
  let saveNoteBtn;
  let newNoteBtn;
  let noteList;
  let noNotes;

  // Declare DOM element references
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-group');
  noNotes = document.querySelector('.no-notes');

  // Show an element
  const show = (elem) => {
    elem.style.display = 'inline';
  };

  // Hide an element
  const hide = (elem) => {
    elem.style.display = 'none';
  };

  // Initialize notes array
  let notes = []

  // GET request promise
  const getNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      notes = await response.json(); // Parse JSON response to notes array
    } catch (err) {
      console.error(err);
    }
  };

  // Render list of notes with unique ids and select/delete event listeners
  const renderNoteList = (notes) => {
    if (notes.length > 0) {
      hide(noNotes);
      noteList.forEach((el) => (el.innerHTML = ''));
      // Returns HTML element with or without a delete button
      const createListItem = (note, delBtn = true) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.id = note.id
        li.addEventListener('click', selectNote);
        const span = document.createElement('span');
        span.classList.add('list-item-title');
        span.innerText = note.title;  
        li.append(span);
        if (delBtn) {
          const delBtnEl = document.createElement('i');
          delBtnEl.classList.add(
            'fas',
            'fa-trash-alt',
            'float-right',
            'text-danger',
            'delete-note-btn',
          );
          delBtnEl.addEventListener('click', handleNoteDelete);
  
          li.append(delBtnEl);
        }
        return li;
      }

      const noteListItems = notes.map((note) => createListItem(note));
      noteListItems.forEach((note) => noteList[0].append(note));
    } else {
      show(noNotes);
    }
  }

  // Once GET request promise is fulfilled, render notes list
  const getAndRenderNotes = () => {
    getNotes().then(() => renderNoteList(notes));
  }

  getAndRenderNotes(); // Get and render notes when page loads

  // POST request promise
  const saveNote = async (note) => {
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(note) // Send note object as JSON string to add
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Once POST request promise is fulfilled, add note and update list
  const handleNoteSave = async () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value
    };
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      noteTitle.value = '';
      noteText.value = '';    
    });
  };

  // DELETE request promise
  const deleteNote = async (id) => {
    try {
      fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notes) // Send note object as JSON string to delete
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Once DELETE request promise is fulfilled, delete note and update list
  const handleNoteDelete = (e) => {
    e.stopPropagation(); // Prevents the click listener for the list from being called when the button inside of it is clicked
    const id = e.target.parentElement.getAttribute('id') // Get note id from parent list item attributes
    deleteNote(id).then(() => {
      getAndRenderNotes();
      selectNote(e);
    });
  };

  // Render selected note
  const selectNote = (e) => {
    const id = e.target.getAttribute('id') // Get note id from list item attributes
    // If no id is found, write new note
    if (id) {
      hide(clearBtn);
      hide(saveNoteBtn);
      show(newNoteBtn);
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      const note = notes.find(note => note.id === id)
      noteTitle.value = note.title;
      noteText.value = note.text;
    // If id is found, display note
    } else {
      hide(newNoteBtn);
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };

  // Renders the appropriate buttons based on the state of the form
  const handleRenderBtns = () => {
    show(clearBtn);
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(clearBtn);
    } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  // Add event listeners for note input and submission
  saveNoteBtn.addEventListener('click', handleNoteSave);
  noteForm.addEventListener('input', handleRenderBtns);
  newNoteBtn.addEventListener('click', selectNote);
}
