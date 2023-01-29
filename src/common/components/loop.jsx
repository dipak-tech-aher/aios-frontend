import React, { useRef, useState, useEffect } from "react";
import ReactSelect from 'react-select'
import { getNextId, formatValue } from '../../wf/wf-utils'
let clone = require('clone');

const Loop = (props) => {

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

    const taskId = props.data.taskId
    const wfConfig = props.data.wfConfig
    const loopData = props.data.loopData

    const setLoopData = props.handler.setLoopData

    useEffect(() => {
        // console.log('Rule Builder Use Effect ', taskId, rules)
    }, [])

    return (
        <div>
            <div className="form-row col-12 workflow-step-label-bg-color">
                <label className="col-form-label"><u>Loop</u></label>
            </div>
            {/* console.log('loopData', loopData) */}
            {
                (loopData) ?
                    <div className="form-row col-12 workflow-step-bg-color">
                        <div className="ml-3 mt-1 radio radio-primary">
                            <input type="radio" id="loopType0" className="form-check-input" name="loopType" value="NONE"
                                checked={(loopData.loopType === 'NONE')}
                                onChange={(e) => {
                                    setLoopData({ ...loopData, loopType: e.target.value })
                                }}
                            />
                            <label htmlFor="loopType1">None</label>
                        </div>
                        <div className="ml-3 mt-1 radio radio-primary">
                            <input type="radio" id="loopType1" className="form-check-input" name="loopType" value="TIMES"
                                checked={(loopData.loopType === 'TIMES')}
                                onChange={(e) => {
                                    setLoopData({ ...loopData, loopType: e.target.value })
                                }}
                            />
                            <label htmlFor="loopType1">Times</label>
                        </div>
                        <div className="ml-3 mt-1 radio radio-primary">
                            <input type="radio" id="loopType2" className="form-check-input" name="loopType" value="FOR_EACH"
                                checked={(loopData.loopType === 'FOR_EACH')}
                                onChange={(e) => {
                                    setLoopData({ ...loopData, loopType: e.target.value })
                                }}
                            />
                            <label htmlFor="loopType2">For Each</label>
                        </div>
                    </div>
                    :
                    <></>
            }

            {
                (loopData && loopData.loopType === 'TIMES') ?
                    <div className="form-row col-12 ml-0 mt-2">
                        <div className="d-flex">
                            <input type="text"
                                className="form-control mr-2"
                                value={loopData.times} id="times"
                                placeholder="Enter No of times"
                                maxLength="3"
                                onChange={(e) => {
                                    setLoopData({ ...loopData, times: e.target.value })
                                }}
                                style={{ width: "120px", height: "30px", fontSize: "0.7rem" }}
                            />
                            <label className="m-auto" htmlFor="times">times<span>*</span></label>
                        </div>
                    </div>
                    :
                    <></>
            }
            {
                (loopData && loopData.loopType === 'FOR_EACH') ?
                    <div className="row col-12">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="expression" className="col-form-label">Array Expression<span>*</span></label>
                                <input type="text" className="form-control"
                                    value={loopData.arrayExpression}
                                    id="arrayExpression" placeholder="Enter array expression"
                                    maxLength="20"
                                    onChange={(e) => {
                                        setLoopData({ ...loopData, arrayExpression: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="indexVariableName" className="col-form-label">Index Variable Name<span>*</span></label>
                                <input type="text" className="form-control"
                                    value={loopData.indexVariableName}
                                    id="indexVariableName" placeholder="Enter index variable name"
                                    onChange={(e) => {
                                        setLoopData({ ...loopData, indexVariableName: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="dataVariableName" className="col-form-label">Data Variable Name<span>*</span></label>
                                <input type="text" className="form-control"
                                    value={loopData.dataVariableName}
                                    id="dataVariableName" placeholder="Enter data variable name"
                                    onChange={(e) => {
                                        setLoopData({ ...loopData, dataVariableName: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    );
};
export default Loop;