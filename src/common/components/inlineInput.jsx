import React, { useState } from "react";

const InlineInput = (props) => {

    const [titleBoxState, setTitleBoxState] = useState('view');

    const [value, setValue] = useState((props.data.value)? props.data.value : '');
    const textBoxHeight = (props.data.height)? props.data.height : '25px'
    const textBoxWidth = (props.data.width)? props.data.width : '100px'
    const inputType = props.data.inputType
    return (
        <div className="d-flex">
            {
                (titleBoxState === 'edit')?
                    <>
                        {inputType == "textArea" ? 
                            <textarea type="text" 
                                className="form-control" 
                                value={value} 
                                id={props.data.id}
                                placeholder={(props.data.placeHolder)? props.data.placeHolder : ''} 
                                onChange={(e) => {
                                    setValue(e.target.value)
                                }}
                                style={{height: textBoxHeight , width: textBoxWidth}}
                            />:
                            <input type="text" 
                                className="form-control" 
                                value={value} 
                                id={props.data.id}
                                placeholder={(props.data.placeHolder)? props.data.placeHolder : ''} 
                                onChange={(e) => {
                                    setValue(e.target.value)
                                }}
                                style={{height: textBoxHeight , width: textBoxWidth}}
                            />
                        }
                        <i 
                            style={{ cursor: "pointer" }} 
                            className="mt-auto mb-auto fas fa-check pl-2 font-16 icolor1"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation();
                                // console.log('Inline input clicked')
                                setTitleBoxState('view')
                                props.handler.setValue(props.data.setterKey, value)
                            }}
                        >
                        </i>
                        <i 
                            style={{ cursor: "pointer" }} 
                            className="mt-auto mb-auto fas fa-times pl-2 font-16 icolor1"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation();
                                // console.log('Inline input clicked')
                                setTitleBoxState('view')
                            }}
                        >
                        </i>

                    </>
                    :
                    <>
                        <span>
                            {
                                (props.data.value && props.data.value !== '')?
                                    props.data.value
                                    :
                                    <i>{props.data.placeHolder}</i>
                            }
                        </span>
                        <i 
                            style={{ cursor: "pointer" }} 
                            className="mt-auto mb-auto fas fa-pen pl-2 font-16 icolor1"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation();
                                // console.log('Inline input clicked')
                                setTitleBoxState('edit')
                            }}
                        >
                        </i>
                    </>
            }
        </div>
    );
};
export default InlineInput;