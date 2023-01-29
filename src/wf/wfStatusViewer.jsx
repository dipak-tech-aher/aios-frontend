import React, { useRef, useState, useEffect } from "react";
import WFListModal from 'react-modal'
import Viewer from 'bpmn-js/lib/NavigatedViewer';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { get } from "../util/restUtil";
import WFList from './wfList'
import { properties } from "../properties";
import { convertProcessJSONToBPMNJSON, convertJSONToXML, addHighlights } from './wf-utils'

const WFStatusViewer = (props) => {

    // console.log('useEffect 1')

    // const currentWFId = props.data.currentWFId
    const currentWFId = 8

    const containerRef = useRef(null);

    const [xmlData, setXMLData] = useState(null)

    const [importDone, setImportDone] = useState(false)

    const [bpmnViewer, setBpmnViewer] = useState(null)

    const [element, setElement] = useState(null)

    const [isOpen, setIsOpen] = useState(false)

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

        // console.log('use Effect 1')
        // console.log('useEffect 1', bpmnViewer, containerRef)

        if (!bpmnViewer && containerRef.current) {
            // console.log('useEffect 1 X')

            const container = containerRef.current
            const bpmnViewer = new Viewer({
                container,
                keyboard: {
                    bindTo: document
                }
            });
            setBpmnViewer(bpmnViewer)
        }

    }, []);

    useEffect(() => {

        const highlight = {
            "transitions": [
                {
                    "transitionId": "Flow_1wux1h9_di"
                }
            ],
            "activities": [
                {
                    "activityId": "Event_19qcs8y_di"
                }
            ]
        }

        // console.log('use Effect 2')
        if (currentWFId && currentWFId !== null) {
            // console.log('openWorkflow', currentWFId)
            showSpinner();
            get(properties.WORKFLOW_DEFN_API + '/' + currentWFId)
                .then((resp) => {
                    if (resp && resp.status === 200 && resp.data) {

                        const bpmnJSON = convertProcessJSONToBPMNJSON(resp.data)
                        const jsonWithHiglights = addHighlights(bpmnJSON.wfDefinition, highlight)
                        const xml = convertJSONToXML(jsonWithHiglights)
                        setXMLData(xml)

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
    }, []);

    // useEffect(() => {

    // console.log('useEffect 2')

    //   if (!xmlData) {

    // console.log('useEffect 2 X', xmlData)

    //     const resp = axios.get(sampleData, {
    //       "Content-Type": "application/xml; charset=utf-8"
    //     })
    //       .then((response) => {
    //         console.log('XML data loaded');
    //         setXMLData(response.data)
    //       });
    //   }
    // }, [bpmnModeler])

    useEffect(() => {


        // console.log('use Effect 3')

        // console.log('XMLData useEffect 2', bpmnViewer, xmlData)

        if (bpmnViewer && xmlData && containerRef.current && containerRef.current !== null && xmlData !== null) {
            // console.log('useEffect 3 X')

            //bpmnVw.importXML('<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_13r76gh" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.7.1">  <bpmn:process id="Process_0x282ee" isExecutable="false">    <bpmn:startEvent id="StartEvent_095xzot">      <bpmn:outgoing>Flow_0vg2u5w</bpmn:outgoing>    </bpmn:startEvent>    <bpmn:exclusiveGateway id="Gateway_028awdq">      <bpmn:incoming>Flow_0vg2u5w</bpmn:incoming>      <bpmn:outgoing>Flow_1a3q971</bpmn:outgoing>    </bpmn:exclusiveGateway>    <bpmn:sequenceFlow id="Flow_0vg2u5w" sourceRef="StartEvent_095xzot" targetRef="Gateway_028awdq" />    <bpmn:intermediateThrowEvent id="Event_0lziccr">      <bpmn:incoming>Flow_1a3q971</bpmn:incoming>    </bpmn:intermediateThrowEvent>    <bpmn:sequenceFlow id="Flow_1a3q971" sourceRef="Gateway_028awdq" targetRef="Event_0lziccr" />  </bpmn:process>  <bpmndi:BPMNDiagram id="BPMNDiagram_1">    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0x282ee">      <bpmndi:BPMNEdge id="Flow_0vg2u5w_di" bpmnElement="Flow_0vg2u5w">        <di:waypoint x="192" y="99" />        <di:waypoint x="295" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_1a3q971_di" bpmnElement="Flow_1a3q971">        <di:waypoint x="345" y="99" />        <di:waypoint x="452" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_095xzot">        <dc:Bounds x="156" y="81" width="36" height="36" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Gateway_028awdq_di" bpmnElement="Gateway_028awdq" isMarkerVisible="true">        <dc:Bounds x="295" y="74" width="50" height="50" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Event_0lziccr_di" bpmnElement="Event_0lziccr">        <dc:Bounds x="452" y="81" width="36" height="36" />      </bpmndi:BPMNShape>    </bpmndi:BPMNPlane>  </bpmndi:BPMNDiagram></bpmn:definitions>');
            bpmnViewer.importXML(xmlData)
                .then((done) => {
                    // console.log('Import done')
                    setImportDone(true)
                    if (done && done.warnings && done.warnings.length > 0) {
                        toast.error('Error displaying process flow')
                    }
                    // console.log('warnings', done)
                }).catch((err) => {
                    toast.error('Unexpected error displaying process flow')
                    console.log(err)
                })
            // console.log('after import')
        }
    }, [xmlData]);

    useEffect(() => {

        // console.log('use Effect 4')

        // console.log('useEffect 4')
        if (importDone && xmlData && bpmnViewer) {
            // console.log('useEffect 4 X')
            const canvas = bpmnViewer.get("canvas");
            canvas.zoom('fit-viewport');

            const eventBus = bpmnViewer.get('eventBus');

            const events = [
                'element.hover',
                'element.out',
                'element.click',
                'element.dblclick',
                'element.mousedown',
                'element.mouseup',
                'selection.changed',
                'element.changed'
            ];

            events.forEach(function (event) {

                eventBus.on(event, function (e) {
                    // e.element = the model element
                    // e.gfx = the graphical element
                    if (event === 'element.click') {
                        if (e.element) {
                            setElement(e.element)
                        }
                    }
                    // console.log(event, 'on', (e.element) ? e.element : 'NA');
                });
            });

        }
    }, [importDone])

    return (
        <div className="container-fluid pb-2">

            <div className="form-row p-0 m-0" style={{ height: "100vh" }}>
                <div className="col-md-10 p-0 m-0">
                    <div className="title-box col-12 p-0">
                        <section className="triangle">
                            <h4 className="pl-2">Workflow Details</h4>
                        </section>
                    </div>
                    <div className="form-row col-12 p-0 m-0" style={{ height: "100%" }}>
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
                                                <label>Task Name</label>
                                                <span><strong>{element.businessObject.name}</strong></span>
                                            </fieldset>
                                        </div>
                                        <div className="row col-12">
                                            <button type="button" className="btn btn-outline-primary btn-sm text-primary waves-effect waves-light ml-auto mr-auto mt-2">Add/Edit Steps</button>
                                        </div>
                                    </>
                                    :
                                    <span>Please select a task</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WFStatusViewer;
