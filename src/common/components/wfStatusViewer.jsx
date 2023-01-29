import React, { useRef, useState, useEffect } from "react";
import WFTaskStatusModal from 'react-modal'
import Viewer from 'bpmn-js/lib/NavigatedViewer';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { showSpinner, hideSpinner } from "../spinner";
import { toast } from "react-toastify";
import { get } from "../../util/restUtil";
import { properties } from "../../properties";
import { convertProcessJSONToBPMNJSON, convertJSONToXML, addHighlights } from '../../wf/wf-utils'
import WFTaskStatusViewer from "./wfTaskStatusViewer"

const WFStatusViewer = (props) => {

    const setIsDialogOpen = props.handler.setIsWFStatusOpen

    const containerRef = useRef(null);

    const [bpmnViewer, setBpmnViewer] = useState(null)

    const [element, setElement] = useState(null)

    const [xmlData, setXMLData] = useState(null)

    const [importDone, setImportDone] = useState(false)

    const [stepConfig, setStepConfig] = useState(null)

    const [wfStatusData, setWFStatusData] = useState(null)

    const [isTaskStatusOpen, setIsTaskStatusOpen] = useState(false)

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

    useEffect(() => {

        // console.log('use Effect 1')

        if (!bpmnViewer && containerRef.current) {

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

        // console.log('use Effect 2', props.data.wfHdrId)
        if (props.data.wfHdrId && props.data.wfHdrId !== null) {
            showSpinner();
            get(properties.WORKFLOW_DEFN_API + '/status' + props.data.wfHdrId)
                .then((resp) => {
                    if (resp && resp.status === 200 && resp.data) {
                        setWFStatusData(resp.data)
                    } else {
                        if (resp && resp.status) {
                            toast.error("Error fetching workflow status - " + resp.status + ', ' + resp.message);
                        } else {
                            toast.error("Unexpected error fetching workflow status");
                        }
                    }
                }).finally(() => {
                    hideSpinner()
                });
        }
    }, [props.data.wfHdrId]);

    useEffect(() => {

        // console.log('use Effect 3')

        if (wfStatusData && wfStatusData !== null && wfStatusData.wfDefnId && wfStatusData.wfDefnId !== null) {
            showSpinner();
            get(properties.WORKFLOW_DEFN_API + '/' + wfStatusData.wfDefnId)
                .then((resp) => {
                    if (resp && resp.status === 200 && resp.data) {

                        const bpmnJSON = convertProcessJSONToBPMNJSON(resp.data)
                        // console.log('bpmnJSON', bpmnJSON)
                        const jsonWithHiglights = addHighlights(bpmnJSON.input.wfDefinition, wfStatusData)
                        // console.log('jsonWithHiglights', jsonWithHiglights)
                        const xml = convertJSONToXML(jsonWithHiglights)
                        setXMLData(xml)
                        setStepConfig(bpmnJSON.stepConfig)

                    } else {
                        if (resp && resp.status) {
                            toast.error("Error fetching workflow defn for status display - " + resp.status + ', ' + resp.message);
                        } else {
                            toast.error("Error fetching workflow defn for status display");
                        }
                    }
                }).finally(() => {
                    hideSpinner()
                });
        }
    }, [wfStatusData]);

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
                'element.dblclick'
            ];

            events.forEach(function (event) {

                eventBus.on(event, function (e) {
                    if (event === 'element.dblclick') {
                        if (e.element && e.element.type !== 'bpmn:Process') {
                            setElement(e.element)
                            setIsTaskStatusOpen(true)
                        } else {
                            setElement(null)
                            setIsTaskStatusOpen(false)
                        }
                    }
                });
            });

        }
    }, [importDone])

    return (
        <>
            <div className="modal-dialog" style={{ margin: "1rem", height: "100%" }}>
                <div className="modal-content" style={{ height: "100%" }}>
                    <div className="modal-header">
                        <h4 className="modal-title" id="myCenterModalLabel">Workflow Status Viewer</h4>
                        <button type="button" className="close" onClick={() => setIsDialogOpen(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row col-12 justify-content-center">
                            <div className="container-fluid pb-2">

                                <div className="form-row p-0 m-0" style={{ height: "100vh" }}>
                                    <div className="col-md-12 p-0 m-0">
                                        <div className="form-row col-12 p-0 m-0" style={{ height: "100%" }}>
                                            <div ref={containerRef} className="flex-fill card p-0 mt-0" style={{ height: "100%" }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer d-flex mt-2 justify-content-center">
                        <button className="btn btn-secondary" onClick={() => setIsDialogOpen(false)} type="button">Close</button>
                    </div>
                </div>
            </div>
            {
                (isTaskStatusOpen) ?
                    <WFTaskStatusModal isOpen={isTaskStatusOpen}
                        onRequestClose={() => setIsTaskStatusOpen(false)}
                        contentLabel="Start Event Configuration"
                        style={customStyles} shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
                        <WFTaskStatusViewer
                            data={{
                                activityId: element.businessObject.id,
                                stepConfig: stepConfig,
                                wfStatusData: wfStatusData
                            }}
                            handler={{
                                setIsTaskStatusOpen: setIsTaskStatusOpen
                            }}
                        />
                    </WFTaskStatusModal>
                    :
                    <></>
            }
        </>
    );
};

export default WFStatusViewer;
