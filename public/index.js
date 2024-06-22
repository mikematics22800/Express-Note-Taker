if (window.location.pathname === '/notes') {
  let noteForm;
  let noteTitle;
  let noteText;
  let saveNoteBtn;
  let newNoteBtn;
  let noteList;

  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-group');

  // Show an element
  const show = (elem) => {
    elem.style.display = 'inline';
  };

  // Hide an element
  const hide = (elem) => {
    elem.style.display = 'none';
  };

  // GET request promise
  const getNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const notes = await response.json();
      return notes
    } catch (err) {
      console.error(err);
    }
  };

  let notesArray

  // Render list of notes and update notesArray
  const renderNoteList = (notes) => {
    if (notes.length > 0) {
      notesArray = notes
      const empty = document.querySelector('.empty');
      hide(empty);
      noteList.forEach((el) => (el.innerHTML = ''));
      // Returns HTML element with or without a delete button
      const createListItem = (note, delBtn = true) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.id = note.id
        li.addEventListener('click', selectNote);
        const span = document.createElement('span');
        span.classList.add('list-item-title');
        span.innerText = note.text;  
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
    };
  }

  // Once GET request promise is fulfilled, render notes list
  const getAndRenderNotes = () => {
    getNotes().then((notes) => renderNoteList(notes));
  }

  // Get and render notes when page loads
  getAndRenderNotes();

  // POST request promise
  const saveNote = async (note) => {
    try {
      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
      })
    } catch {
      console.error(err);
    }
  }

  // Once POST request promise is fulfilled, add note and update list
  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value
    };
    saveNote(newNote).then(() => {
      getAndRenderNotes();
    });
  };

  // DELETE request promise
  const deleteNote = async (id) => {
    try {
      fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch {
      console.error(err);
    }
  }

  // Once DELETE request promise is fulfilled, delete note and update list
  const handleNoteDelete = (e) => {
    // Prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();
    const id = e.target.parentElement.getAttribute('id')
    deleteNote(id).then(() => {
      getAndRenderNotes();
      selectNote();
    });
  };

  // Render selected note
  const selectNote = (e) => {
    const id = e.target.getAttribute('id')
    if (id) {
      hide(clearBtn);
      hide(saveNoteBtn);
      show(newNoteBtn);
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      const note = notesArray.find(note => note.id === id)
      noteTitle.value = note.title;
      noteText.value = note.text;
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

  // Add event listeners
  saveNoteBtn.addEventListener('click', handleNoteSave);
  noteForm.addEventListener('input', handleRenderBtns);
  newNoteBtn.addEventListener('click', selectNote);
}
