import noteContext from "./noteContext";
import { useState } from "react";


const NoteState = (props) => {
  const host = "http://localhost:5000"
  const note1 = [];
  const [notes, setNotes] = useState(note1);


  // Get All Notes 
  const getAllNotes = async () => {

    // API call

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem('token')
        },
      });
      const json = await response.json();
      
      setNotes(json);
  };

  


  // Add a note
  const addNote = async (title, description, tag) => {

    // API call

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem('token')
        },

        body: JSON.stringify({title, description, tag}),
      });
      const note = await response.json();
      
      setNotes(notes.concat(note));
  };

  // Delete a note
  const deleteNote = async (id) => {

    // API call

    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token" : localStorage.getItem('token')
      }
    });
    const json  = await response.json();
    
    const newNote = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNote);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    // API call
    
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem('token')
        },

        body: JSON.stringify({title , description , tag}),
      });
      
    let newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote,getAllNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
