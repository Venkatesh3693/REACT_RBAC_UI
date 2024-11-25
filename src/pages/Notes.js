// src/pages/Notes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from '../components/NoteList';

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/notes')
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the notes!", error);
      });
  }, []);

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      axios.post('http://localhost:3001/notes', newNote)
        .then((response) => {
          setNotes([response.data, ...notes]);
          setNewNote({ title: '', content: '' });
        })
        .catch((error) => {
          console.error("There was an error adding the note!", error);
        });
    }
  };

  const handleDeleteNote = (id) => {
    axios.delete(`http://localhost:3001/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the note!", error);
      });
  };

  const handleUpdateNote = (id, updatedContent) => {
    const updatedNote = notes.find(note => note.id === id);
    const updatedNoteObject = { ...updatedNote, content: updatedContent };

    axios.put(`http://localhost:3001/notes/${id}`, updatedNoteObject)
      .then((response) => {
        setNotes(notes.map(note => note.id === id ? response.data : note));
      })
      .catch((error) => {
        console.error("There was an error updating the note!", error);
      });
  };

  return (
    <div className="container">
      <h2>Notes</h2>
      {(user.role === 'Admin' || user.role === 'Moderator') && (
        <div>
          <input type="text" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} placeholder="Title" />
          <textarea value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} placeholder="Content" maxLength="2000"></textarea>
          <button onClick={handleAddNote}>+</button>
        </div>
      )}
      <NoteList notes={notes} user={user} handleDeleteNote={handleDeleteNote} handleUpdateNote={handleUpdateNote} />
    </div>
  );
};

export default Notes;
