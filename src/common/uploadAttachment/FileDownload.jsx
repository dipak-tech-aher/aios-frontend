import React, { useEffect, useState } from 'react'
import { properties } from '../../properties';
import { get, remove } from "../../util/restUtil";
import { toast } from "react-toastify";

const FileDownload = (props) => {
    const [files, setFiles] = useState([])
    let customerID = 10;
    let id = 9
    let entityId = "0113297f-7860-43db-9b61-887001ee098c"
    let entityType = "customer"
    useEffect(() => {
        get(properties.ATTACHMENT_API + "?entity-id=" + entityId + "&entity-type=" + entityType)
            .then((resp) => {
                if (resp.data.length > 0) {
                    setFiles(resp.data)
                    toast.success('File Fetched Successfully' + resp.status)
                }
                else {
                    toast.error("No Existing Files - " + resp.status);
                }
            })
            .catch((error) => {
                console.error('Error while fetching data', error);
            })
    }, [])

    const handleDelete = (id) => {
        remove(properties.ATTACHMENT_API + "/" + id)
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success(resp.message)
                }
                else {
                    toast.error("Attchment not deleted")
                }
            })
            .catch((error) => {
                console.error('Error while deleting attachment', error);
            })
    }

    return (
        <div style={{ width: "400px", display: "flex", justifyContent: "space-around" }}>
            {
                files.map((file) => {
                    return (
                        <>
                            <a key={file.attachmentId} download={file.fileName} href={file.content}>{file.fileName}</a>
                            <span onClick={() => handleDelete(file.attachmentId)} className="cursor-pointer"><i className="fa fa-paperclip" aria-hidden="true"></i></span>
                        </>
                    );
                })
            }
        </div >
    );
}

export default FileDownload;