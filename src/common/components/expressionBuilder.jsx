import React, { useRef, useState, useEffect } from "react";
import SchemaViewer from "./jsonSchemaViewer"
import ReactSelect from 'react-select'
import { getNextId, formatValue } from '../../wf/wf-utils'
import contextSchema from './jsonSchema.json'

let clone = require('clone');

const ExpressionBuilder = (props) => {

    let wfSchema = props.data.wfSchema
    let key = props.data.key

    console.log('wfSchemay........', wfSchema)
    console.log('ExpressionBuilder-key', key)

    let handleDone = props.handler.handleDone
    let handleCancel = props.handler.handleCancel

    const customStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxHeight: '100%'
        }
    };

    const [wfExpression, setWFExpression] = useState()

    const handleRuleOrGroup = () => {

    }

    return (
        <>
            <div className="row d-flex justify-content-between pl-2 pr-2">
                <div><span><strong>Expression Builder</strong></span></div>
                <div>
                    <i onClick={() => handleDone(key, wfExpression)}
                        style={{ cursor: "pointer" }}
                        className="ml-2 fas fa-check font-18 icolor1">
                    </i>
                    <i onClick={handleCancel}
                        style={{ cursor: "pointer" }}
                        className="ml-2 fas fa-times font-18 icolor1">
                    </i>
                </div>
            </div>
            <hr className="mt-2 mb-2" />
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="expression" className="col-form-label">Selected Expression</label>
                        <textarea id="expression"
                            className="form-control"
                            value={wfExpression}
                            rows="2"
                            readOnly="true"
                        />
                    </div>
                </div>
            </div>
            {/*console.log('SchemaViewer', wfSchema)*/}
            <SchemaViewer
                data={{
                    renderSchema: wfSchema,
                    expressionBuilderSchema: {},
                    key: 'root',
                    useMode: 'builder'
                }}
                handler={{
                    handleNodeLeafSelect: setWFExpression,
                    handleSetValueType: null,
                    handleSetValue: null
                }}
            />
        </>
    );
};
export default ExpressionBuilder;