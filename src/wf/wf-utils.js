import WFConfig from './wfConfig.json'

const xml2JS = require('xml2js')
let clone = require('clone');

export const convertProcessJSONToBPMNJSON = (input) => {

    // console.log(input)

    let processContent = {}

    let stepConfig = []

    let bpmnJSON

    const activities = input.wfDefinition.definitions.process.activities
    const transitions = input.wfDefinition.definitions.process.transitions
    const processId = input.wfDefinition.definitions.process.processId

    processContent.$ = {
        id: processId
    }

    for (let a of activities) {

        // console.log('utils', a.name)

        let key
        let idx
        if (a.type === 'START') {
            key = 'startEvent'
        } else if (a.type === 'TASK') {
            key = 'task'
        } else if (a.type === 'END') {
            key = 'endEvent'
        } else if (a.type === 'DECISION') {
            key = 'exclusiveGateway'
        }

        if (!processContent[key]) {
            processContent[key] = []
        }

        if (processContent[key].length === 0) {

            processContent[key].push({
                $: {
                    id: a.activityId,
                    name: a.name
                }
            })

            idx = processContent[key].length - 1

        } else {
            let match = false
            let pos = 0
            for (let s of processContent[key]) {
                if (s.$.id === a.activityId) {
                    match = true
                    s.$.name = a.name
                    break
                }
                pos++
            }
            if (!match) {
                processContent[key].push({
                    $: {
                        id: a.activityId,
                        name: a.name
                    }
                })
                idx = processContent[key].length - 1
            } else {
                idx = pos
            }
        }
        for (let t of transitions) {
            // console.log(t.from, a.activityId, key, idx)
            if (t.from === a.activityId) {
                if (!processContent[key][idx].outgoing) {
                    // console.log('init', a.activityId)
                    processContent[key][idx].outgoing = []
                }
                // console.log('pushing', a.activityId)
                processContent[key][idx].outgoing.push(t.transitionId)
            }

            if (t.to === a.activityId) {
                if (!processContent[key][idx].incoming) {
                    processContent[key][idx].incoming = []
                }
                processContent[key][idx].incoming.push(t.transitionId)
            }
        }
        if (a.tasks) {
            stepConfig.push({
                activityId: a.activityId,
                activityContextPrefix: a.activityContextPrefix,
                name: a.name,
                tasks: clone(a.tasks),
                transactions: clone(a.transactions)
            })
        } else if(a.condition) {
            stepConfig.push({
                activityId: a.activityId,
                activityContextPrefix: a.activityContextPrefix,
                name: a.name,
                condition: a.condition
            })
        } else {
            stepConfig.push({
                activityId: a.activityId,
                activityContextPrefix: a.activityContextPrefix,
                name: a.name
            })
        }
    }

    processContent['sequenceFlow'] = []

    for (let t of transitions) {
        processContent['sequenceFlow'].push({
            $: {
                id: t.transitionId,
                sourceRef: t.from,
                targetRef: t.to
            }
        })
    }

    // bpmnJSON = {
    //   definitions: {
    //     $: {
    //       ...input.wfDefinition.definitions.$
    //     },
    //     process: [
    //       {
    //         ...processContent
    //       }
    //     ],
    //     "bpmndi:BPMNDiagram": [
    //       {
    //         ...input.wfDefinition.definitions["bpmndi:BPMNDiagram"][0]
    //       }
    //     ]
    //   }
    // }

    // console.log('processContent', processContent)

    delete input.wfDefinition.definitions.process

    input.wfDefinition.definitions.process = []
    input.wfDefinition.definitions.process.push(processContent)

    // console.log('input.wfDefinition', input.wfDefinition)

    // console.log('stepConfig', stepConfig)

    return { input: input, stepConfig: stepConfig }

}

export const convertJSONToXML = (input) => {

    const builder = new xml2JS.Builder();
    const xml = builder.buildObject(input);

    // console.log('input.xml', xml)

    return xml
}

export const addHighlights = (input, highlightData) => {
    // console.log('addHighlights', input)
    // console.log('addHighlights', input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]["bpmndi:BPMNEdge"])

    if (input && input.definitions && input.definitions["bpmndi:BPMNDiagram"]
        && input.definitions["bpmndi:BPMNDiagram"][0] && input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"]
        && input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]) {

        if (input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]["bpmndi:BPMNEdge"]) {

            for (let e of input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]["bpmndi:BPMNEdge"]) {
                if (highlightData && highlightData.wfTxn && input.definitions.process && input.definitions.process[0].sequenceFlow) {
                    for(let flw of input.definitions.process[0].sequenceFlow) {
                        // console.log('Edge', e.$.id, flw.$.id + '_id', (e.$.id === flw.$.id + '_di'))
                        for (let elm of highlightData.wfTxn) {      
                            if(flw.$.targetRef === elm.activityId && flw.$.id + '_di' === e.$.id) {
                                e.$["bioc:stroke"] = WFConfig.viewer.statusColor.doneStrokeColor
                            }
                        }
                    }
                }
            }
        }

        if (input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]["bpmndi:BPMNShape"]) {
            for (let e of input.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]["bpmndi:BPMNShape"]) {

                if (highlightData && highlightData.wfTxn) {
                    let strokeColor = ''
                    let fillColor = ''
                    let colorType = ''
                    for (let s of highlightData.wfTxn) {
                        // console.log('highlightData', e.$.id, s.activityId, (e.$.id === s.activityId))
                        if (e.$.id === s.activityId + '_di') {
                            
                            if(colorType === '') {
                                if(s.wfTxnStatus === 'DONE') {
                                    strokeColor = WFConfig.viewer.statusColor.doneStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.doneFillColor
                                } else if(s.wfTxnStatus === 'SYSWAIT') {
                                    strokeColor = WFConfig.viewer.statusColor.sysWaitStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.sysWaitFillColor
                                } else if(s.wfTxnStatus === 'USRWAIT') {
                                    strokeColor = WFConfig.viewer.statusColor.userWaitStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.userWaitFillColor
                                } else if(s.wfTxnStatus === 'ERROR') {
                                    strokeColor = WFConfig.viewer.statusColor.errorStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.errorFillColor
                                }
                            } else if(colorType === 'DONE') {
                                if(s.wfTxnStatus === 'SYSWAIT') {
                                    strokeColor = WFConfig.viewer.statusColor.sysWaitStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.sysWaitFillColor
                                } else if(s.wfTxnStatus === 'USRWAIT') {
                                    strokeColor = WFConfig.viewer.statusColor.userWaitStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.userWaitFillColor
                                } else if(s.wfTxnStatus === 'ERROR') {
                                    strokeColor = WFConfig.viewer.statusColor.errorStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.errorFillColor
                                }
                            } else if(colorType === 'SYSWAIT') {
                                if(s.wfTxnStatus === 'USRWAIT') {
                                    strokeColor = WFConfig.viewer.statusColor.userWaitStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.userWaitFillColor
                                } else if(s.wfTxnStatus === 'ERROR') {
                                    strokeColor = WFConfig.viewer.statusColor.errorStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.errorFillColor
                                }
                            } else if(colorType === 'USRWAIT') {
                                if(s.wfTxnStatus === 'ERROR') {
                                    strokeColor = WFConfig.viewer.statusColor.errorStrokeColor
                                    fillColor = WFConfig.viewer.statusColor.errorFillColor
                                }
                            }
                            e.$["bioc:stroke"] = strokeColor
                            e.$["bioc:fill"] = fillColor
                        }
                    }
                }
            }
        }
    }

    // const builder = new xml2JS.Builder();
    // const xml = builder.buildObject(input.wfDefinition);

    // console.log('input.xml', xml)

    return input
}

export const convertProcessJSONToInternal = (result, activitiesTasksConfig) => {

    const processJSON = { activities: [], transitions: [] }

    const p = result.definitions.process[0]

    for (let k of Object.keys(p)) {

        if (k === '$') {

            processJSON.processId = p[k].id

        } else {
            for (let e of p[k]) {

                let type

                if (k === 'startEvent') {
                    type = 'START'
                } else if (k === 'task') {
                    type = 'TASK'
                } else if (k === 'endEvent') {
                    type = 'END'
                } else if (k === 'exclusiveGateway') {
                    type = 'DECISION'
                }

                if (['task', 'startEvent', 'endEvent'].includes(k)) {
                    let tasks
                    let transactions
                    let activityContextPrefix
                    if (activitiesTasksConfig && activitiesTasksConfig.length > 0) {
                        for (let a of activitiesTasksConfig) {
                            if (a.activityId === e.$.id) {
                                tasks = a.tasks
                                transactions = a.transactions
                                if(a.activityContextPrefix) {
                                    activityContextPrefix = a.activityContextPrefix
                                } else {
                                    activityContextPrefix = a.activityId
                                }
                            }
                        }
                    }
                    if (tasks) {
                        processJSON.activities.push({
                            name: e.$.name,
                            type: type,
                            activityId: e.$.id,
                            activityContextPrefix: activityContextPrefix,
                            tasks: tasks,
                            transactions: transactions
                        })
                    } else {
                        processJSON.activities.push({
                            name: e.$.name,
                            type: type,
                            activityId: e.$.id,
                            activityContextPrefix: activityContextPrefix
                        })
                    }
                }

                if (k === 'exclusiveGateway') {
                    let activityContextPrefix
                    let condition
                    if (activitiesTasksConfig && activitiesTasksConfig.length > 0) {
                        for (let a of activitiesTasksConfig) {
                            if (a.activityId === e.$.id) {
                                condition = a.condition
                                if(a.activityContextPrefix) {
                                    activityContextPrefix = a.activityContextPrefix
                                } else {
                                    activityContextPrefix = a.activityId
                                }
                            }
                        }
                    }

                    if (condition) {
                        processJSON.activities.push({
                            name: e.$.name,
                            type: type,
                            activityId: e.$.id,
                            activityContextPrefix: activityContextPrefix,
                            condition: condition
                        })
                    } else {
                        processJSON.activities.push({
                            name: e.$.name,
                            type: type,
                            activityContextPrefix: activityContextPrefix,
                            activityId: e.$.id
                        })
                    }

                }

                if (['task', 'startEvent', 'exclusiveGateway', 'endEvent'].includes(k)) {
                    if (processJSON.transitions.length === 0) {
                        if (e.outgoing) {
                            processJSON.transitions.push({
                                from: e.$.id,
                                transitionId: e.outgoing[0]
                            })
                        }

                        if (e.incoming) {
                            processJSON.transitions.push({
                                to: e.$.id,
                                transitionId: e.incoming[0]
                            })
                        }
                    } else {
                        if (e.outgoing) {
                            for (let f of e.outgoing) {
                                let matched = false
                                for (let t of processJSON.transitions) {
                                    if (f === t.transitionId) {
                                        t.from = e.$.id
                                        matched = true
                                        break
                                    }
                                }
                                if (!matched) {
                                    processJSON.transitions.push({
                                        from: e.$.id,
                                        transitionId: f
                                    })
                                }
                            }
                        }

                        if (e.incoming) {
                            for (let f of e.incoming) {
                                let matched = false
                                for (let t of processJSON.transitions) {

                                    if (f === t.transitionId) {
                                        t.to = e.$.id
                                        matched = true
                                        break
                                    }
                                }
                                if (!matched) {
                                    processJSON.transitions.push({
                                        to: e.$.id,
                                        transitionId: f
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // console.log('processJSON', processJSON)
    return processJSON
}

export const getNextId = (obj, idAttr) => {
    let nextId = -1
    if (obj && obj.length === 0) {
        nextId = 1
    } else {
        for (let o of obj) {
            if (o[idAttr] > nextId) {
                nextId = o[idAttr]
            }
        }
        nextId = nextId + 1
    }
    return nextId
}

export const formatValue = (columnOptions, tableName, columnName, valueType, value) => {

    if (valueType === 'EXPR') {
        return value
    } else {
        for (let co of columnOptions.current) {
            if (co.tableName === tableName) {
                for (let coo of co.options) {
                    if (coo.value === columnName) {
                        if (coo.dataType === 'NUMBER') {
                            if (value === null) {
                                return value
                            } else {
                                return Number(value)
                            }
                        } else {
                            if (value === null) {
                                return ''
                            } else {
                                return value
                            }
                        }
                    }
                }
            }
        }
    }

}

export const updateSchemaForQuerySQL = (wfConfig, fragment, tables) => {
    // console.log('updateSchemaForQuerySQL', fragment)
    for (let t1 of wfConfig.database.tables) {

        for(let t2 of tables) {
            if(t1.tableName === t2) {
                if(!fragment.hasOwnProperty(t1.tableName)) {
                    fragment[t1.tableName] = {
                        type: "object",
                        show: "true",
                        properties: {}
                    }
                }
                for(let c of t1.columns) {
                    if(!fragment[t1.tableName].properties.hasOwnProperty(c.columnName)) {
                        fragment[t1.tableName].properties[c.columnName] = {
                            type: (c.dataType === 'TEXT')? 'string' : 'integer'
                        }
                    }
                }
            }
        }
    }
}
