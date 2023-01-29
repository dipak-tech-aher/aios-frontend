import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const JSONTextArea = (props) => {

    const [titleBoxState, setTitleBoxState] = useState('view');

    const [value, setValue] = useState('');

    const [key, setKey] = useState(props.data.key)

    const [textAreaId, setTextAreaId] = useState(props.data.id)

    const [displayValue, setDisplayValue] = useState('');

    const handleDone = props.handler.handleDone

    useEffect(() => {
        // console.log('jsontextarea', props.data.id, props.data.valueJSON)
        if(titleBoxState === 'view') {
            if(props.data.valueJSON && props.data.valueJSON !== '' && props.data.valueJSON !== null) {
                setValue((props.data.valueJSON) ? JSON.stringify(props.data.valueJSON, null, 2) : '')
                // console.log('setting display value')
                setDisplayValue((props.data.valueJSON) ? JSON.stringify(props.data.valueJSON, null, 2) : '')
            } else {
                setDisplayValue('')
                setValue('')
            }
        }
    }, [titleBoxState, props.data.valueJSON])

    return (
        <>
            <div className="d-flex col-12 justify-content-end mb-1 mr-0 pr-0">
                {/* console.log('Rendering displayValue', textAreaId, titleBoxState, displayValue) */}
                {
                    (titleBoxState === 'edit') ?
                        <>
                            <textarea
                                rows="10"
                                className="form-control"
                                value={value}
                                id={textAreaId + '-edit'}
                                placeholder={(props.data.placeHolder) ? props.data.placeHolder : ''}
                                onChange={(e) => {
                                    setValue(e.target.value)
                                }}
                            />
                        </>
                        :
                        <textarea
                            rows="10"
                            className="form-control"
                            value={displayValue}
                            id={textAreaId + '-display'}
                            placeholder={(props.data.placeHolder) ? props.data.placeHolder : ''}
                            readOnly="true"
                        >TestValue
                        </textarea>

                }
                {
                    (titleBoxState === 'edit') ?
                        <div className="d-flex flex-column ml-1">
                            <i
                                style={{ cursor: "pointer" }}
                                className="fas fa-check font-16 icolor1"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation();
                                    try {
                                        let json = JSON.parse(value)
                                        handleDone(key, json)
                                        setTitleBoxState('view')
                                    } catch (err) {
                                        console.log(err)
                                        toast.error('JSON is not valid')
                                    }
                                }}
                            >
                            </i>
                            <i
                                style={{ cursor: "pointer" }}
                                className="fas fa-times mt-1 font-16 icolor1"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation();
                                    setTitleBoxState('view')
                                }}
                            >
                            </i>

                        </div>
                        :
                        <>
                            <i
                                style={{ cursor: "pointer" }}
                                className="fas fa-pen ml-1 font-16 icolor1 align-self-start"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation();
                                    // console.log('Text area clicked')
                                    setTitleBoxState('edit')
                                }}
                            >
                            </i>
                        </>
                }
            </div>
        </>
    );
};
export default JSONTextArea;