import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { properties } from "../../properties";
import { post, get, remove, put } from "../../util/restUtil";
import { showSpinner, hideSpinner } from "../../common/spinner";
import useDropDownArea from "./useDropDownArea";
import { string, object } from "yup";
//mock data

//components
import './todo.css'


const ToDo = () => {
    const [display, setDisplay] = useDropDownArea('switchNotes')
    const [toDoList, setToDoList] = useState([]);
    const [error, setError] = useState({});
    // const [checked, setChecked] = useState(false)
    const [data, setData] = useState({
        notes: "",
    })

    const validationSchema = object().shape({
        notes: string().required("Please enter note."),

    });

    useEffect(() => {


        if (display === false) {

            showSpinner();
            get(properties.NOTES_API).then(resp => {
                if (resp) {

                    setToDoList(resp.data)
                } else {
                    // toast.error("Error while fetching notes data")
                }
            }).finally(hideSpinner)
        }



    }, [display]);

    // var closebtns = document.getElementsByClassName("close");

    // var i;

    // for (i = 0; i < closebtns.length; i++) {
    //     closebtns[i].addEventListener("click", function () {
    //         this.parentElement.style.display = 'none';
    //     });
    // }
    const validate = () => {
        try {
            validationSchema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };



    const handleToggle = (todo) => {

        showSpinner();
        todo.status === "NEW" ? todo.status = "DONE" : todo.status = "NEW"

        put(properties.NOTES_API + "/" + todo.notesId, todo).then(resp => {
            if (resp.status === 200) {
                // toast.success("updated")
                get(properties.NOTES_API).then(resp => {
                    if (resp) {

                        setToDoList(resp.data)
                    } else {
                        // toast.error("Error while fetching notes data")
                    }
                }).finally(hideSpinner)
            } else {
                // toast.error("Error while fetching notes data")
            }
        }).finally(hideSpinner);




        // let mapped = toDoList.map(task => {
        //     return task.id === Number(id) ? { ...task, status: "NEW" } : { ...task };
        // });
        // setToDoList(mapped);
    }
    const deleteNote = (todo) => {
        
        showSpinner()
        remove(properties.NOTES_API + "/" + todo.notesId).then(resp => {
            if (resp.status === 200) {
                // toast.success("deleted")
                showSpinner()
                get(properties.NOTES_API).then(resp => {
                    if (resp) {

                        setToDoList(resp.data)
                    } else {
                        // toast.error("Error while fetching notes data")
                    }
                }).finally(hideSpinner)
            } else {
                // toast.error("Error while deleting notes data")
            }
        }).finally(hideSpinner);
    }


    const addTask = () => {
        const error = validate(validationSchema, data);
        if (error) return;

        let copy = [...toDoList];
        copy = [...copy, data];
        showSpinner();
        post(properties.NOTES_API, data)
            .then((resp) => {
                if (resp.status === 200) {
                    // toast.success("Note created successfully")
                    showSpinner()
                    get(properties.NOTES_API).then(resp => {
                        if (resp) {

                            setToDoList(resp.data)
                        } else {
                            // toast.error("Error while fetching notes data")
                        }
                    }).finally(hideSpinner)
                }
                else {
                    // toast.error("Error while creating Note")
                }
            })
            .finally(() => hideSpinner());

        setToDoList(copy);
        setData({ ...data, notes: "" })
    }

    return (

        <li className={`dropdown notification-list   ${display && "show"}`} id="switchNotes" style={{ height: "100", float: "right" }} >
            <span className="nav-link dropdown-toggle waves-effect waves-light" onClick={() => { 
                 setError({ ...error, notes: '' })
                 setDisplay(!display) }}>
                <i className="fe-edit noti-icon"></i>
            </span>

            <div className={`dropdown-menu dropdown-menu-right dropdown-lg    ${display && "show"}`} style={{ height: "700px", width: "350px" }} >
                {/* <div className="dropdown-item noti-title"> */}
                <h4 className="pb-2">
                    My Notes</h4>

                {/* <ToDoList toDoList={toDoList} handleToggle={handleToggle}  />
                     */}
                <div className="drop-height" style={{ overflowX: "hidden", overflowY: "auto", width: "100%" }}>
                    <div className="simplebar-mask"  >
                        <div className="simplebar-offset" >
                            <div className="simplebar-content-wrapper " >
                                <div className="simplebar-content" >
                                    {toDoList.map(todo => (
                                        <div className="pl-0" >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <input type="checkbox" style={{ marginTop: "5px", paddingTop: "5px", cursor: "pointer" }}
                                                    required
                                                    checked={todo.status === "NEW" ? false : true}
                                                    onChange={(e) => { handleToggle(todo) }}
                                                >

                                                </input>
                                                <span style={{ width: "100%", wordWrap: "break-word" }} className={todo.status === "DONE" ? "todo strike" : "todo"} >
                                                    {todo.notes}</span>
                                                <span className="close pr-2" style={{ position: "relative" }} onClick={(e) => deleteNote(todo)}>&times;</span>
                                            </div>
                                            <hr className="pr-3" style={{ width: "315px" }} />

                                        </div>


                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-items form-row mt-2 pl-2" style={{ display: "flex" }}  >
                    <div className="col-md-8">
                        <input
                            className={`form-control   ${error.notes ? "input-error" : ""}`}
                            type="text"
                          
                            onChange={(e) => {
                                setError({ ...error, notes: '' })
                                setData({ ...data, notes: e.target.value })
                            }}
                            value={data.notes}
                            placeholder="Add notes"
                            onKeyPress={(e) => {
                                if (e.key === "Enter") addTask();
                            }} />
                        {error.notes ? <span className="errormsg">{error.notes}</span> : ""}

                    </div>
                    <div className="col-md-2">
                        <button onClick={addTask} className="btn btn-primary">Add</button>
                    </div>
                </div>

            </div>

        </li>



    );
}

export default ToDo;
