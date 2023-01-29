import React, { useRef, useState, useEffect } from "react";
import RuleBuilder from "../../common/components/rule-builder"
let clone = require('clone');

const Decision = (props) => {

    const activityId = props.data.activityId
    const taskStepConfig = props.data.taskStepConfig
    const wfConfig = props.data.wfConfig
    const availableActivities = props.data.availableActivities

    const setTaskStepConfig = props.handler.setTaskStepConfig
    const setDecisionConfigPopup = props.handler.setDecisionConfigPopup
    const wfSchema = props.data.wfSchema

    const [decisionConfig, setDecisionConfig] = useState([])

    useEffect(() => {
        console.log('taskStepConfig==>', taskStepConfig)
        console.log('activityId==>', activityId)
        for (let a of taskStepConfig) {
            if (a.activityId === activityId) {
                console.log('conditions ', a)
                setDecisionConfig(clone(a.condition))
                break
            }
            console.log('conditions ', a)
            setDecisionConfig(clone(a.condition))
        }
    }, [taskStepConfig])

    const handleTransitionRule = (rules, id) => {
        // console.log('handleTransitionRule called', rules, id)

        setDecisionConfig((prevState) => {

            const newState = clone(prevState)

            for (let c of newState) {
                if (c.id === id) {
                    c.rules = rules
                    break
                }
            }
            // console.log('handleActivityChange', newState)
            return newState
        })
    }

    const handleActivityChange = (id, value) => {
        // console.log('handleActivityChange', outgoingActivityId, outgoingTransitionId)
        setDecisionConfig((prevState) => {

            const newState = clone(prevState)

            for (let c of newState) {
                if (c.id === id) {
                    for (let avl of availableActivities) {
                        if (avl.transitionId === value) {
                            c.activityName = avl.activityName
                            c.transitionId = avl.transitionId
                        }
                    }
                    break
                }
            }
            console.log('handleActivityChange', newState)
            return newState
        })

    }

    const handleRuleTypeChange = (id, type) => {
        console.log('handleRuleTypeChange', id, type)
        setDecisionConfig((prevState) => {
            console.log('prevState ', prevState)// this is not working
            const newState = clone(prevState)
            if (newState) {
                for (let c of newState) {
                    if (c.id === id) {
                        c.ruleType = type
                        if (type === 'RULE') {
                            c.rules = [{
                                level: 1,
                                id: 1,
                                rules: [],
                                combinator: 'AND'
                            }]
                        } else {
                            c.rules = []
                        }
                        break
                    }
                }
                console.log('handleRuleTypeChange', newState)
                return newState
            }


        })
    }

    const handleDone = () => {

        setTaskStepConfig((prevState) => {

            // console.log('prevState', prevState)

            const newState = clone(prevState)

            if (newState && newState.length > 0) {
                for (let a of newState) {
                    if (a.activityId === activityId) {

                        a.condition = decisionConfig
                    }
                }
            }
            // console.log('newState', newState)
            return newState
        })
        setDecisionConfigPopup(false)
    }

    return (
        <div className="form-popup" id="myForm-2" >
            <div className="form-container p-0">
                <div className="p-0" role="document">
                    <div className="modal-content">
                        <div className="modal-header p-0 m-0">
                            <h5 className="modal-title p-2" id="scrollableModalTitle">Decision Configuration</h5>
                            <button type="button" className="close p-0 mr-1" onClick={() => setDecisionConfigPopup(false)} data-dismiss="modal" aria-label="Close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body pt-0">
                            <div className="pt-0">
                                {console.log('Render decisionConfig', availableActivities)}
                                <hr style={{ height: "4px" }} />
                                <div id="content" className="pt-1">
                                    {/* it was with decisionConfig.map(), modified to availableActivities to bring the decision work*/
                                        (decisionConfig && decisionConfig.length > 0) ?
                                        decisionConfig.map((c, idx) => (
                                                <>
                                                    <div key={idx} className="row mt-2">
                                                        <div className="row col-md-12 pl-0">
                                                            <div className="col-md-4 mb-2">
                                                                <label htmlFor="transitionActivity" className="col-form-label">Transition to Activity<span>*</span></label>
                                                                <select id="transitionActivity" className="form-control" value={c.transitionId}
                                                                    onChange={(e) => {
                                                                        handleActivityChange(c.id, e.target.value)
                                                                    }}
                                                                >
                                                                    <option key="activity" value="">Select Activity</option>
                                                                    {
                                                                        availableActivities.map((e) => (
                                                                            <option key={e.transitionId} value={e.transitionId}>{e.activityName}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="col-md-6 mb-2 ml-4">
                                                                <label className="col-form-label">Condition<span>*</span></label>
                                                                <div className="d-flex">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio"
                                                                            className="form-check-input"
                                                                            id={'radio1-' + idx}
                                                                            name={'radio-' + idx}
                                                                            checked={((c.ruleType === 'RULE') ? "true" : "")}
                                                                            onChange={(event) => {
                                                                                // event.preventDefault()
                                                                                // event.stopPropagation()
                                                                                // if (event.nativeEvent) {
                                                                                //     event.nativeEvent.stopImmediatePropagation();
                                                                                // }
                                                                                handleRuleTypeChange(c.id, 'RULE')
                                                                            }}
                                                                        />
                                                                        <label htmlFor={'radio1-' + idx}>Set Rule</label>
                                                                    </div>
                                                                    <div className="radio radio-primary mb-2 ml-4">
                                                                        <input type="radio"
                                                                            className="form-check-input"
                                                                            id={'radio2-' + idx}
                                                                            name={'radio-' + idx}
                                                                            checked={((c.ruleType === 'DEFAULT') ? "true" : "")}
                                                                            onChange={(event) => {
                                                                                // event.preventDefault()
                                                                                // event.stopPropagation()
                                                                                // if (event.nativeEvent) {
                                                                                //     event.nativeEvent.stopImmediatePropagation();
                                                                                // }
                                                                                handleRuleTypeChange(c.id, 'DEFAULT')
                                                                            }}
                                                                        />
                                                                        <label htmlFor={'radio2-' + idx}>Set as Default</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            (c.ruleType === 'RULE') ?
                                                                <div className="col-12 pr-0 mb-2">
                                                                    <RuleBuilder
                                                                        data={{
                                                                            ruleType: 'LOGIC',
                                                                            rules: c.rules,
                                                                            availableColumnOptions: {},
                                                                            columnOptions: {},
                                                                            fieldColumnOptions: {},
                                                                            wfConfig: wfConfig,
                                                                            taskId: '',
                                                                            keyRef: c.id,
                                                                            wfSchema: wfSchema


                                                                        }}
                                                                        handler={{
                                                                            setRules: handleTransitionRule
                                                                        }}
                                                                    />
                                                                </div>
                                                                :
                                                                <></>
                                                        }
                                                    </div>
                                                    <hr style={{ height: "4px" }} />
                                                </>
                                            ))
                                            :
                                            <span>No outgoing transitions</span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer d-flex mt-2 justify-content-center">
                            <button className="btn btn-primary" onClick={handleDone} type="button">Done</button>
                            <button className="btn btn-secondary" onClick={() => setDecisionConfigPopup(false)} type="button">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Decision;