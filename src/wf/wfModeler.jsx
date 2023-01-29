import React, { useRef, useState, useEffect } from "react";
import Modeler from 'bpmn-js/lib/Modeler';
import axios from "axios";
import sampleData from './sample.xml'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// import PropertiesPanel from './properties-panel';
// import CustomContextPad from './custom/customContextPad';
// import ExampleContextPadProvider from './custom/ExampleContextPadProvider';

// import CustomPaletteProvider from './custom/examplePaletteProvider';
// import ExamplePalette from './custom/examplePalette';

import customControlsModule from './custom';

const WFModeler = () => {

  // console.log('useEffect 1')

  const containerRef = useRef(null);

  const propertiesContainerRef = useRef(null);

  const [xmlData, setXMLData] = useState(null)

  const [importDone, setImportDone] = useState(false)

  const [bpmnModeler, setBpmnModeler] = useState(null)

  const [element, setElement] = useState(null)

  useEffect(() => {
    // console.log('useEffect 1')

    if (!bpmnModeler && containerRef.current) {

      // console.log('useEffect 1 X')

      const modeler = new Modeler({
        container: containerRef.current,
        keyboard: {
          bindTo: document
        },
        additionalModules: [
          customControlsModule
        ]
      });

      // const propertiesPanel = new PropertiesPanel({
      //   container: propertiesContainerRef.current,
      //   modeler
      // });

      setBpmnModeler(modeler)
    }

  }, []);

  useEffect(() => {

    // console.log('useEffect 2')

    if (!xmlData) {

      // console.log('useEffect 2 X', xmlData)

      const resp = axios.get(sampleData, {
        "Content-Type": "application/xml; charset=utf-8"
      })
        .then((response) => {
          // console.log('XML data loaded');
          setXMLData(response.data)
        });
    }
  }, [bpmnModeler])

  useEffect(() => {

    // console.log('useEffect 3')

    if (xmlData) {
      // console.log('useEffect 3 X')

      //bpmnVw.importXML('<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_13r76gh" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.7.1">  <bpmn:process id="Process_0x282ee" isExecutable="false">    <bpmn:startEvent id="StartEvent_095xzot">      <bpmn:outgoing>Flow_0vg2u5w</bpmn:outgoing>    </bpmn:startEvent>    <bpmn:exclusiveGateway id="Gateway_028awdq">      <bpmn:incoming>Flow_0vg2u5w</bpmn:incoming>      <bpmn:outgoing>Flow_1a3q971</bpmn:outgoing>    </bpmn:exclusiveGateway>    <bpmn:sequenceFlow id="Flow_0vg2u5w" sourceRef="StartEvent_095xzot" targetRef="Gateway_028awdq" />    <bpmn:intermediateThrowEvent id="Event_0lziccr">      <bpmn:incoming>Flow_1a3q971</bpmn:incoming>    </bpmn:intermediateThrowEvent>    <bpmn:sequenceFlow id="Flow_1a3q971" sourceRef="Gateway_028awdq" targetRef="Event_0lziccr" />  </bpmn:process>  <bpmndi:BPMNDiagram id="BPMNDiagram_1">    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0x282ee">      <bpmndi:BPMNEdge id="Flow_0vg2u5w_di" bpmnElement="Flow_0vg2u5w">        <di:waypoint x="192" y="99" />        <di:waypoint x="295" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_1a3q971_di" bpmnElement="Flow_1a3q971">        <di:waypoint x="345" y="99" />        <di:waypoint x="452" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_095xzot">        <dc:Bounds x="156" y="81" width="36" height="36" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Gateway_028awdq_di" bpmnElement="Gateway_028awdq" isMarkerVisible="true">        <dc:Bounds x="295" y="74" width="50" height="50" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Event_0lziccr_di" bpmnElement="Event_0lziccr">        <dc:Bounds x="452" y="81" width="36" height="36" />      </bpmndi:BPMNShape>    </bpmndi:BPMNPlane>  </bpmndi:BPMNDiagram></bpmn:definitions>');

      bpmnModeler.importXML(xmlData)
        .then((done) => {
          setImportDone(true)
          // console.log('done', done)
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
        'element.hover',
        'element.out',
        'element.click',
        'element.dblclick',
        'element.mousedown',
        'element.mouseup',
        'selection.changed',
        'element.changed'
      ];


      const eventBus = bpmnModeler.get('eventBus');

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
    <>
      <div className="row col-12">
        <div id="paletteContainer" className="col-1" style={{ height: "100vh", border: "black 2px solid" }}>
        </div>

        <div ref={containerRef} className="col-8" style={{ height: "100vh", border: "black 2px solid" }}>
        </div>

        <div ref={propertiesContainerRef} className="col-3" style={{ height: "100vh", border: "black 2px solid" }}>
          <span>Properties Section</span>
          <div className="form-row">
            <fieldset>
              <label>Task Name</label>
              {
                (element && element.businessObject) ?
                  <input type="text" value={element.businessObject.name}></input>
                  :
                  <></>
              }
            </fieldset>
          </div>
        </div>
      </div>
    </>

  );
};

export default WFModeler;
