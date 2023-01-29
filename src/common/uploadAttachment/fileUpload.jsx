import React, { useEffect, useState } from 'react'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { properties } from '../../properties';
import { get, post } from "../../util/restUtil";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from '../../common/spinner'
const FileUpload = (props) => {

    const { currentFiles = [], existingFiles, entityType, interactionId, shouldGetExistingFiles = true,permission = false } = props.data;
    const { setCurrentFiles, setExistingFiles } = props.handlers;

    useEffect(() => {
        if (shouldGetExistingFiles) {
            showSpinner()
            get(properties.ATTACHMENT_API + "?entity-id=" + interactionId + "&entity-type=" + entityType)
                .then((resp) => {
                    if (resp.data && resp.data.length) {
                        setExistingFiles(resp.data)
                    }
                })
                .catch((error) => {
                    console.error("error", error)
                })
                .finally(hideSpinner)
        }
    }, [])

    let array = []
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            //fileReader.readAsBinaryString(file)
            //fileReader.readAsArrayBuffer(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
                return fileReader.result
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleDelete = (id) => {
        let finalData = []
        finalData = existingFiles.filter((item) => item.attachmentId !== id)
        setExistingFiles(finalData)
        toast.success("File Deleled Successfully")
    }

    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file,remove }, status) => {
        if(file.size > 5242880 )
        {   
            if(status === "preparing")
            {
                remove()
                toast.error("Attached file size is big greater than 5MB")
                return false;
            }
            else
            {
                return false;
            }
        }
        let name = file.name
        let arrayObject = {}
        if (status == 'done') {
            showSpinner();
            (async () => {
                let base64 = await convertBase64(file);
                let filebody = {
                    fileName: file.name,
                    fileType: file.type,
                    entityType: entityType,
                    content: base64
                }
                post(properties.ATTACHMENT_API, [filebody])
                    .then((resp) => {
                        if (resp.data) {
                            arrayObject = resp.data[0];
                            arrayObject.metaId = meta.id;
                            array.push(arrayObject)
                            setCurrentFiles([...currentFiles, ...array])
                            toast.success(`${file.name} Uploaded Successfully`)
                            hideSpinner();
                        }
                        else {
                            toast.error("Failed to upload document");
                        }
                    })
                    .catch((error) => {
                        console.error('Error while uploading data', error);
                    })
            })();
        }
        else if (status == 'removed') {
            let data = currentFiles.filter((item) => item.metaId !== meta.id)
            setCurrentFiles(data)
            // let data = []
            // data = array.filter((item) => item.fileName !== name)
            // array = data
            // setCurrentFiles([...data])
        }
    }

    const handleFileDownload = (id) => {
        showSpinner()
            get(properties.ATTACHMENT_API + "/" + id + "?entity-id=" + interactionId + "&entity-type=" + entityType)
                .then((resp) => {
                    if (resp.data) {
                        var a = document.createElement("a"); 
                        a.href = resp.data.content; 
                        a.download = resp.data.fileName; 
                        a.click();
                    }
                })
                .catch((error) => {
                    console.error("error", error)
                })
                .finally(() => {
                    hideSpinner() 
                })
    }

    return (
        <>
            <div className="row attach-block">
                {
                    permission !== true && 
                    <div className="col-lg-12 mt-2 pl-3 pr-3">
                        <span className="errormsg">Each File Size allowed : less than 5 mb</span>
                        <Dropzone
                            classNames="w-100"
                            onChangeStatus={handleChangeStatus}
                            // onSubmit={handleSubmit}
                            styles={{ dropzone: { height: "250px" } }}
                            accept="image/*,.pdf,.txt,.docx,.doc,.xlsx,.xls,.csv"
                            submitButtonContent=""
                            //maxSizeBytes="5242880"
                            // maxFiles={3}
                        />
                        {/* <span>Maximum 3 files</span> */}
                    </div>
                }
                <div className="" style={{ width: "900px" }}>
                    {
                        existingFiles && existingFiles.map((file) => {
                            return (
                                <div className="attach-btn">
                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                    <a key={file.attachmentId} onClick={() => handleFileDownload(file.attachmentId)}>{file.fileName}</a>
                                    {/* <button type="button" disabled={permission} className="close ml-2" onClick={() => handleDelete(file.attachmentId)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button> */}
                                </div>
                            );
                        })
                    }
                </div>
                {
                    permission === true && existingFiles && existingFiles.length === 0 && 
                    <div className="col-12 msg-txt pl-2 pr-2 pb-0">
                        <p>No Attachments Found</p>
                    </div>
                }
            </div>
        </>
    );
}


export default FileUpload;