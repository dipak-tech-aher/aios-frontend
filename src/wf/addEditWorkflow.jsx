import React, { useRef, useState, useEffect } from "react";
import WFListModal from 'react-modal'
import DecisionModal from 'react-modal'
import StartEventConfigModal from 'react-modal'
import StepConfigModal from 'react-modal'
import WFStatusModal from 'react-modal'
import Modeler from 'bpmn-js/lib/Modeler';
import { newFlowXML } from './newFlowXML'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { get, put, post, remove } from "../util/restUtil";
import customControlsModule from './custom';
import WFList from './wfList'
import { properties } from "../properties";
import { convertProcessJSONToBPMNJSON, convertProcessJSONToInternal, convertJSONToXML } from './wf-utils'
import StartEventConfig from './tasks/startEventConfig'
import Decision from './tasks/decision'
import TasksLayout from './tasks/tasksLayout'
import WFConfig from './wfConfig.json'
import InlineInput from "../common/components/inlineInput"
import WFStatusViewer from "../common/components/wfStatusViewer"
import { getNextId, updateSchemaForQuerySQL } from './wf-utils'
import { unstable_batchedUpdates } from "react-dom";

const xml2JS = require('xml2js')

let clone = require('clone')

const AddEditWorkflow = () => {

  // console.log('useEffect 1')

  const containerRef = useRef(null);

  const [xmlData, setXMLData] = useState(null)

  const [workflowName, setWorkflowName] = useState(null)

  const [currentWFId, setCurrentWFId] = useState(null)

  const [importDone, setImportDone] = useState(false)

  const [bpmnModeler, setBpmnModeler] = useState(null)

  const [element, setElement] = useState(null)

  const [availableActivities, setAvailableActivities] = useState([])

  const [isOpen, setIsOpen] = useState(false)

  const [isStartEventConfigOpen, setIsStartEventConfigOpen] = useState(false)

  const [isStepConfigOpen, setIsStepConfigOpen] = useState(false)

  const [decisionConfigPopup, setDecisionConfigPopup] = useState(false)

  const [taskStepConfig, setTaskStepConfig] = useState(null)

  const [isWFStatusOpen, setIsWFStatusOpen] = useState(false)

  const [wfSchema, setWFSchema] = useState({
    "type": "object",
    "show": "true",
    "properties": {
      "entity": {
        "type": "string"
      },
      "entityType": {
        "type": "string"
      }
    }
  })

  const customStyles = {
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: '70%',
      maxHeight: '100%'
    }
  };

  useEffect(() => {

    // console.log('openWorkflow', wfId)
    showSpinner();
    get(properties.WORKFLOW_DBMODEL_API)
      .then((resp) => {
        if (resp && resp.status === 200 && resp.data) {
          WFConfig.database.tables = resp.data
        } else {
          if (resp && resp.status) {
            toast.error("Error fetching DB Schema Details - " + resp.status + ', ' + resp.message);
          } else {
            toast.error("Unexpected error fetching DB Schema Details");
          }
        }
      }).finally(() => {
        hideSpinner()
      });

  }, [])

  useEffect(() => {
    // console.log('useEffect 1')

    if (!bpmnModeler && containerRef.current) {

      // console.log('useEffect 1 X')

      const container = containerRef.current

      const modeler = new Modeler({
        container,
        keyboard: {
          bindTo: document
        },
        additionalModules: [
          customControlsModule
        ]
      });

      setBpmnModeler(modeler)
    }

  }, []);

  // useEffect(() => {

  // console.log('useEffect 2')

  //   if (!xmlData) {

  // console.log('useEffect 2 X', xmlData)

  //     const resp = axios.get(sampleData, {
  //       "Content-Type": "application/xml; charset=utf-8"
  //     })
  //       .then((response) => {
  // console.log('XML data loaded');
  //         setXMLData(response.data)
  //       });
  //   }
  // }, [bpmnModeler])

  useEffect(() => {

    // console.log('useEffect - Import XMLData', xmlData)

    if (bpmnModeler && xmlData && xmlData !== null) {
      // console.log('useEffect 3 X')

      bpmnModeler.importXML(xmlData)
        .then((done) => {
          setImportDone(true)
          if (done && done.warnings && done.warnings.length > 0) {
            toast.error('Unexpected error displaying process flow')
          }
          // console.log('warnings', done)
        }).catch((err) => {
          setCurrentWFId(null)
          setXMLData(null)
          console.log(err)
        })
      // console.log('after import')
    }

  }, [xmlData]);

  useEffect(() => {

    // console.log('useEffect 4')

    if (importDone && bpmnModeler) {

      // console.log('useEffect 4 X')

      const canvas = bpmnModeler.get("canvas");

      canvas.zoom('fit-viewport');

      // canvas.setColor("CalmCustomerTask", {
      //   stroke: "green",
      //   fill: "yellow"
      // });

      const events = [
        'element.click',
        'element.changed'
      ];


      const eventBus = bpmnModeler.get('eventBus');

      events.forEach(function (event) {

        eventBus.on(event, function (e) {
          // console.log(e)
          // e.element = the model element
          // e.gfx = the graphical element
          if (event === 'element.click') {
            // console.log('e.element', e.element)
            if (e.element && e.element.type !== 'bpmn:Process') {
              setElement(e.element)
              // console.log(e.element);
            } else {
              setElement(null)
            }
          } else if (event === 'element.changed') {
            let newTaskStepConfig
            if (!taskStepConfig || taskStepConfig === null) {
              newTaskStepConfig = []
            } else {
              newTaskStepConfig = clone(taskStepConfig)
            }
            if (e.element && e.element.type === 'bpmn:Task') {
              let found = false
              for (let t of newTaskStepConfig) {
                if (t.activityId === e.element.id) {
                  found = true
                  break
                }
              }
              if (!found) {
                newTaskStepConfig.push({
                  activityId: e.element.id,
                  tasks: []
                })
                setTaskStepConfig(newTaskStepConfig)
              }
              //console.log('Elements ', e.element);
            } else {
              setElement(null)
            }
          }
        });
      });

    }
  }, [importDone])

  useEffect(() => {
    // console.log('UseEffect schema', taskStepConfig)

    let schema = clone(wfSchema)

    if (taskStepConfig && taskStepConfig.length > 0) {

      for (let a of taskStepConfig) {

        // ('Activity', a.activityId, a.name)

        if (a.tasks) {
          let keyAttr
          if (a.activityContextPrefix && a.activityContextPrefix !== '') {
            keyAttr = a.activityContextPrefix
          } else {
            keyAttr = a.activityId
          }
          if (!schema.properties.hasOwnProperty(keyAttr)) {
            schema.properties[keyAttr] = {
              type: "object",
              show: "true",
              name: a.name,
              activityId: a.activityId,
              objType: 'bpmn',
              properties: {}
            }
          }

          for (let t of a.tasks) {
            if (!schema.properties[keyAttr].properties.hasOwnProperty('task_' + t.taskId)) {
              schema.properties[keyAttr].properties['task_' + t.taskId] = {
                type: "object",
                show: "true",
                name: t.taskName,
                taskId: t.taskId,
                properties: {}
              }
            }

            if (t.type === 'DB' && t.queryType === 'SELECT') {
              updateSchemaForQuerySQL(WFConfig, schema.properties[keyAttr].properties['task_' + t.taskId].properties, t.tables)
            } else if (t.type === 'MANUAL') {
              schema.properties[keyAttr].properties['task_' + t.taskId].properties = {
                ...schema.properties[keyAttr].properties['task_' + t.taskId].properties,
                deptId: {
                  type: 'string',
                  show: "true"
                },
                roleId: {
                  type: 'string',
                  show: "true"
                },
                status: {
                  type: 'string',
                  show: "true"
                }
              }
            }
          }

        }
      }
      // console.log('schema', schema)
      setWFSchema(schema)
    }

    // console.log('schema', schema)

  }, [taskStepConfig]);

  const handleNewFlow = () => {
    // console.log('handleNewFlow', newFlowXML)
    unstable_batchedUpdates(()=>{
      setXMLData(newFlowXML)
      setWorkflowName(null)
    });
    toast.success('You can start creating the drawing now')
  }

  const handleSave = async () => {

    if (!workflowName || workflowName === null || workflowName.trim() === '') {
      toast.error("Please enter a name for the workflow");
      return false
    }

    const xmlOutput = await bpmnModeler.saveXML({
      format: true
    })

    // console.log('xml', xml)

    const parser = new xml2JS.Parser(/* options */);
    parser.parseStringPromise(xmlOutput.xml)
      .then(function (result) {
        const converetedJSON = convertProcessJSONToInternal(result, taskStepConfig)

        delete result.definitions.process

        result.definitions.process = converetedJSON

        // console.log('result', result)
        if (currentWFId && currentWFId !== null) {
          put(properties.WORKFLOW_DEFN_API + '/' + currentWFId, {
            interactionType: 'REQSR',
            productType: 'FIXED',
            workflowName: workflowName,
            wfDefinition: result
          })
            .then((resp) => {
              if (resp) {
                if (resp.status === 200) {
                  toast.success('Workflow definition updated successfully');
                } else {
                  toast.error("Failed to save - " + resp.status);
                }
              } else {
                toast.error("Uexpected error ocurred " + resp.statusCode);
              }
            }).finally(hideSpinner);
        } else {
          post(properties.WORKFLOW_DEFN_API, {
            interactionType: 'REQSR',
            productType: 'FIXED',
            workflowName: workflowName,
            wfDefinition: result
          })
            .then((resp) => {
              if (resp.data) {
                if (resp.status === 200) {
                  setCurrentWFId(resp.data.workflowId)
                  toast.success('Workflow definition saved successfully');
                } else {
                  toast.error("Failed to save - " + resp.status);
                }
              } else {
                toast.error("Uexpected error ocurred " + resp.statusCode);
              }
            }).finally(hideSpinner);
        }
        // console.log('Done', result);
      }).catch(function (err) {
        console.log(err)
      });

    // bpmnModeler.saveXML({
    //   format: true
    // }, (err, xml) => {
    // console.log('xml', xml)
    // })
  }

  const handleAddEditSteps = async () => {
    // console.log('handleAddEditSteps', element)
    if (element.type === 'bpmn:StartEvent') {
      // console.log('Open dialog')
      setIsStartEventConfigOpen(true)
    } else if (element.type === 'bpmn:ExclusiveGateway') {
      // console.log('taskStepConfig', taskStepConfig)
      const newTaskStepConfig = clone(taskStepConfig)

      const xmlOutput = await bpmnModeler.saveXML({
        format: true
      })
      const parser = new xml2JS.Parser(/* options */);
      parser.parseStringPromise(xmlOutput.xml)
        .then(function (result) {
          // console.log(result)
          // console.log(taskStepConfig)
          const outGoingTransitions = []
          for (let x of result.definitions.process[0]["exclusiveGateway"]) {
            console.log('x is ', x)

            if (element.id === x.$.id) {
              for (let o of x.outgoing) {
                // console.log('o is ', o)
                outGoingTransitions.push({
                  transitionId: o
                })
              }
              break
            }
          }

          for (let t1 of result.definitions.process[0]["sequenceFlow"]) {
            for (let t2 of outGoingTransitions) {
              if (t1.$.id === t2.transitionId) {
                for (let a of result.definitions.process[0]["task"]) {
                  if (t1.$.targetRef === a.$.id) {
                    t2.activityId = a.$.id
                    t2.activityName = a.$.name
                  }
                }
              }
            }
          }

          let found = false
          for (let a of newTaskStepConfig) {
            // console.log(a.activityId, element.id, a)
            if (a.activityId === element.id) {
              // console.log('a.condition', a.condition)
              if (!a.condition) {
                a.condition = []
              }
              for (let og of outGoingTransitions) {
                let matchFound = false
                for (let c of a.condition) {
                  // console.log('og.transitionId', og.transitionId, c.transitionId)
                  if (og.transitionId === c.transitionId) {
                    matchFound = true
                    break
                  }
                }
                if (!matchFound) {
                  // console.log('a.condition', a.condition)
                  if (a?.condition?.length < outGoingTransitions?.length) {
                    const id = getNextId(a.condition, 'id')
                    a.condition.push({
                    id: id
                    })
                  }
                }
              }
            }
          }

          let avlAct = clone(outGoingTransitions)
          console.log(avlAct)
          setAvailableActivities(avlAct)
          setTaskStepConfig(newTaskStepConfig)
          setDecisionConfigPopup(true)

        })

    } else {
      setIsStepConfigOpen(true)
    }
  }

  const openWorkflow = (event, wfId) => {

    // console.log('openWorkflow', wfId)
    showSpinner();
    get(properties.WORKFLOW_DEFN_API + '/' + wfId)
      .then((resp) => {
        if (resp && resp.status === 200 && resp.data) {

          const bpmnJSON = convertProcessJSONToBPMNJSON(resp.data)
          const xml = convertJSONToXML(bpmnJSON.input.wfDefinition)

          setCurrentWFId(wfId)
          setXMLData(xml)
          setTaskStepConfig(bpmnJSON.stepConfig)
          setWorkflowName(resp.data.workflowName)
        } else {
          if (resp && resp.status) {
            toast.error("Error fetching workflow for edit - " + resp.status + ', ' + resp.message);
          } else {
            toast.error("Unexpected error fetching workflow for edit");
          }
        }
      }).finally(() => {
        hideSpinner()
      });
  }

  const handleSetWorkflowName = (key, value) => {
    setWorkflowName(value)
  }

  const handleActivityContextPrefixChange = (key, value) => {
    // console.log('handleActivityContextPrefixChange', key, value)
    // console.log('schema', wfSchema)

    let copyWFSchema = clone(wfSchema)

    let newWFSchema = {}

    newWFSchema.type = copyWFSchema.type
    newWFSchema.show = copyWFSchema.show
    newWFSchema.properties = {}

    for (let a in copyWFSchema.properties) {
      console.log('copyWFSchema.properties.objType', a, copyWFSchema.properties[a].objType)
      if (copyWFSchema.properties[a].objType && copyWFSchema.properties[a].objType === 'bpmn') {
        console.log('key', copyWFSchema.properties[a].activityId, key)
        if (copyWFSchema.properties[a].activityId === key) {
          newWFSchema.properties[value] = copyWFSchema.properties[a]
        } else {
          newWFSchema.properties[a] = copyWFSchema.properties[a]
        }
      } else {
        console.log(a, copyWFSchema.properties[a])
        newWFSchema.properties[a] = copyWFSchema.properties[a]
      }
    }

    let newTaskStepConfig = clone(taskStepConfig)

    for (let t of newTaskStepConfig) {
      if (t.activityId === key) {
        t.activityContextPrefix = value
        break
      }
    }

    setTaskStepConfig(newTaskStepConfig)
    setWFSchema(newWFSchema)
    console.log('newWFSchema', newWFSchema)
  }

  const handleTaskContextPrefixChange = (activityId, taskId, value) => {
    console.log('handleTaskContextPrefixChange', activityId, taskId, value, wfSchema)

    let copyWFSchema = clone(wfSchema)

    let newWFSchema = {}

    newWFSchema.type = copyWFSchema.type
    newWFSchema.show = copyWFSchema.show
    newWFSchema.properties = {}

    for (let a in copyWFSchema.properties) {
      if (copyWFSchema.properties[a].objType && copyWFSchema.properties[a].objType === 'bpmn') {
        if (copyWFSchema.properties[a].activityId === activityId) {

          newWFSchema.properties[a] = {}
          newWFSchema.properties[a].type = copyWFSchema.properties[a].type
          newWFSchema.properties[a].show = copyWFSchema.properties[a].show
          newWFSchema.properties[a].activityId = copyWFSchema.properties[a].activityId
          newWFSchema.properties[a].objType = copyWFSchema.properties[a].objType
          newWFSchema.properties[a].properties = {}

          for (let b in copyWFSchema.properties[a].properties) {
            if (copyWFSchema.properties[a].properties[b].taskId && copyWFSchema.properties[a].properties[b].taskId === taskId) {
              newWFSchema.properties[a].properties[value] = {}
              newWFSchema.properties[a].properties[value] = copyWFSchema.properties[a].properties[b]
            } else {
              newWFSchema.properties[a].properties[b] = {}
              newWFSchema.properties[a].properties[b] = copyWFSchema.properties[a].properties[b]
            }
          }
        } else {
          newWFSchema.properties[a] = copyWFSchema.properties[a]
        }
      } else {
        newWFSchema.properties[a] = copyWFSchema.properties[a]
      }
    }

    let newTaskStepConfig = clone(taskStepConfig)

    for (let t of newTaskStepConfig) {
      let breakNow = false
      
      if (t.activityId === activityId) {
        if(taskId === 'activityContextPrefix'){
          t.activityContextPrefix=value
          breakNow = true
          break
        }
        else{
          for (let r of t.tasks) {
            if (r.taskId === taskId) {
              r.taskContextPrefix = value
              breakNow = true
              break
            }
          }
        }
       
        if (breakNow) {
          break
        }
      }
    }

    setTaskStepConfig(newTaskStepConfig)
    setWFSchema(newWFSchema)
    console.log('newWFSchema', newWFSchema)

  }

  const handleDelete = () =>{
    console.log('currentWFId', currentWFId)
    showSpinner();
    remove(properties.WORKFLOW_DEFN_API + '/' + currentWFId)
      .then((resp) => {
        if (resp && resp.status === 200 && resp.data) {
          unstable_batchedUpdates(()=>{
            setCurrentWFId()
            setTaskStepConfig(null)
            setXMLData(newFlowXML)
            setWorkflowName(null)
          })

          toast.success('Workflow definition Deleted successfully');
        }
        else{
          toast.error('Unexpected error while Deleting workflow');
        }
      }).finally(() => {
        hideSpinner()
      });
  }
  return (
    <div className="container-fluid pb-2">
      <div className="form-row">
        <div className="row col-12">
          <div className="col-2">
            <div className="page-title-box">
              <h4 className="page-title">Manage Workflow</h4>
            </div>
          </div>
          <div className="row col-4">
            {
              ((xmlData && xmlData !== null) || (currentWFId && currentWFId !== null)) ?
                <>
                  <label className="mt-1"><strong>Workflow Name:&nbsp;&nbsp;</strong></label>
                  <span className="mt-1">
                    <InlineInput
                      data={{
                        id: 'workflowName',
                        placeHolder: 'Enter a Name',
                        value: workflowName,
                        setterKey: 1,
                        width: '300px'
                      }}
                      handler={{
                        setValue: handleSetWorkflowName
                      }}
                    />
                  </span>
                </>
                :
                <></>
            }
          </div>

          <div className="col-6 text-right mr-0 pr-0">
            {/* <button className="btn btn-primary mr-2" onClick={() => setIsWFStatusOpen(true)} type="button" style={{ height: "35px" }}>WF Status</button> */}
            <div className="wf-buttons btn-group bg-white shadow text-right">
              <button type="button" className="btn waves-effect waves-light btn-sm"
                onClick={handleNewFlow}
              >
                <i className="mdi mdi-plus font-16"></i>
              </button>

              <button
                type="button"
                className="btn waves-effect waves-light btn-sm"
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                <i className="mdi mdi-folder-open-outline font-16"></i>
              </button>

              <button type="button" className="btn waves-effect waves-light btn-sm" onClick={handleSave}>
                <i className="mdi mdi-content-save font-16"></i>
              </button>

              <button type="button" className="btn waves-effect waves-light btn-sm">
                <i className="mdi mdi-undo-variant font-16"></i>
              </button>

              <button type="button" className="btn waves-effect waves-light btn-sm">
                <i className="mdi mdi-redo-variant font-16"></i>
              </button>

              <button type="button" className="btn waves-effect waves-light btn-sm"><i className="mdi mdi-refresh font-16"></i></button>
              <button type="button" className="btn waves-effect waves-light btn-sm"><i className="mdi mdi-delete-forever-outline font-16" onClick={handleDelete}></i></button>
            </div>
          </div>
        </div>
      </div>

      <div className="form-row p-0 m-0" style={{ height: "100vh" }}>
        <div className="col-md-10 p-0 m-0">
          <div className="title-box col-12 p-0">
            <section className="triangle">
              <h4 className="pl-2">Workflow Details</h4>
            </section>
          </div>
          <div className="col-12 p-0">
            {
              ((!xmlData || xmlData === null) && (!currentWFId || currentWFId === null)) ?
                <span>Please use the "+" button to create a new workflow or the folder button to open an existing workflow.</span>
                :
                <></>
            }
          </div>
          <div className="form-row col-12 p-0 m-0" style={{ height: "100%" }}>
            <div id="paletteContainer" className="col-xs-1" style={{ marginLeft: "2px", height: "100%", width: "58px", border: "black 2px solid" }}>
            </div>
            <div ref={containerRef} className="flex-fill card p-0 mt-0" style={{ height: "100%" }}>
            </div>
          </div>
        </div>
        <div className="col-md-2 p-0 m-0">
          <div className="title-box col-12 p-0">
            <section className="triangle">
              <h4 className="pl-2">Task Properties</h4>
            </section>
          </div>
          <div className="card p-0 m-0">
            <div className="form-row ml-1">
              {
                
                (element && element.businessObject) ?
                  <>
                    <div className="row col-12">
                      <fieldset>
                        <label>Selected Task Name</label>
                        {
                          (element.businessObject.name && element.businessObject.name !== '') ?
                            <span><strong>{element.businessObject.name}</strong></span>
                            :
                            <span><strong>-</strong></span>
                        }

                      </fieldset>
                    </div>
                    <div className="row col-12">
                      <button type="button"
                        onClick={handleAddEditSteps}
                        className="btn btn-outline-primary btn-sm waves-effect waves-light mr-auto mt-2">
                        Add/Edit Steps
                      </button>
                    </div>
                  </>
                  :
                  <span>Please select a task</span>
              }
            </div>
          </div>
        </div>
      </div>
      <WFListModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Workflow List Modal" style={customStyles}>
        <WFList
          handler={{
            setIsOpen: setIsOpen,
            openWorkflow: openWorkflow
          }}
        />
      </WFListModal>
      {/*console.log('DecisionModal', decisionConfigPopup, '==element==', element)*/}
      {
        (decisionConfigPopup && element && element.businessObject.id) ?

          <DecisionModal isOpen={decisionConfigPopup} onRequestClose={() => setDecisionConfigPopup(false)} contentLabel="Decision Modal" style={customStyles}>
            <Decision key="decision1"
              data={{
                activityId: element.businessObject.id,
                taskStepConfig: taskStepConfig,
                wfConfig: WFConfig,
                availableActivities: availableActivities,
                wfSchema: wfSchema
              }}
              handler={{
                setDecisionConfigPopup: setDecisionConfigPopup,
                setTaskStepConfig: setTaskStepConfig
              }}
            />
          </DecisionModal>
          :
          <></>
      }

      <StartEventConfigModal isOpen={isStartEventConfigOpen} onRequestClose={() => setIsStartEventConfigOpen(false)} contentLabel="Start Event Configuration" style={customStyles}>
        <StartEventConfig
          handler={{
            setIsStartEventConfigOpen: setIsStartEventConfigOpen
          }}
        />
      </StartEventConfigModal>
      {
        (isStepConfigOpen && element && element.businessObject.id) ?
          <StepConfigModal isOpen={isStepConfigOpen}
            onRequestClose={() => setIsStepConfigOpen(false)}
            contentLabel="Start Event Configuration"
            style={customStyles} shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
            <TasksLayout
              data={{
                activityId: element.businessObject.id,
                activityName: element.businessObject.name,
                taskStepConfig: taskStepConfig,
                wfConfig: WFConfig,
                wfSchema: wfSchema
              }}
              handler={{
                setIsStepConfigOpen: setIsStepConfigOpen,
                setTaskStepConfig: setTaskStepConfig,
                setWFSchema: setWFSchema,
                handleActivityContextPrefixChange: handleActivityContextPrefixChange,
                handleTaskContextPrefixChange: handleTaskContextPrefixChange
              }}
            />
          </StepConfigModal>
          :
          <></>
      }
      {
        (isWFStatusOpen) ?
          <WFStatusModal isOpen={isWFStatusOpen}
            onRequestClose={() => setIsWFStatusOpen(false)}
            contentLabel="Start Event Configuration"
            style={customStyles} shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
            <WFStatusViewer
              data={{
                wfHdrId: 136
              }}
              handler={{
                setIsWFStatusOpen: setIsWFStatusOpen
              }}
            />
          </WFStatusModal>
          :
          <></>
      }
    </div>
  );
};

export default AddEditWorkflow;
