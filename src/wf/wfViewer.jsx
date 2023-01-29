import React, { useRef, useState, useContext, useEffect } from "react";
import BpmnJS from 'bpmn-js/lib/Viewer';
import axios from "axios";
import sampleData from './sample.xml'
const xml2JS = require('xml2js')

const WFViewer = () => {

  // console.log('useEffect 1')

  const containerRef = useRef({});

  const [xmlData, setXMLData] = useState(null)

  const [bpmnViewer, setBpmnViewer] = useState({})


  useEffect(() => {
    const resp = axios.get(sampleData, {
      "Content-Type": "application/xml; charset=utf-8"
    })
      .then((response) => {
        // console.log('Your xml file as string', response.data);
        setXMLData(response.data)
      });
}, [])

useEffect(() => {

  if(xmlData && xmlData != null) {
    const parser = new xml2JS.Parser(/* options */);
    parser.parseStringPromise(xmlData)
      .then(function (result) {
        // console.log('result', result)
        // console.log('Done', result);
      }).catch(function (err) {
        console.log(err)
      });
  }

}, [xmlData]);

  useEffect(() => {
    // console.log('useEffect 2')

    if(xmlData) {
      // console.log('useEffect 2 Execute')
      const container = containerRef.current

      const bpmnVw = new BpmnJS({ container })
  
      //bpmnVw.importXML('<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_13r76gh" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.7.1">  <bpmn:process id="Process_0x282ee" isExecutable="false">    <bpmn:startEvent id="StartEvent_095xzot">      <bpmn:outgoing>Flow_0vg2u5w</bpmn:outgoing>    </bpmn:startEvent>    <bpmn:exclusiveGateway id="Gateway_028awdq">      <bpmn:incoming>Flow_0vg2u5w</bpmn:incoming>      <bpmn:outgoing>Flow_1a3q971</bpmn:outgoing>    </bpmn:exclusiveGateway>    <bpmn:sequenceFlow id="Flow_0vg2u5w" sourceRef="StartEvent_095xzot" targetRef="Gateway_028awdq" />    <bpmn:intermediateThrowEvent id="Event_0lziccr">      <bpmn:incoming>Flow_1a3q971</bpmn:incoming>    </bpmn:intermediateThrowEvent>    <bpmn:sequenceFlow id="Flow_1a3q971" sourceRef="Gateway_028awdq" targetRef="Event_0lziccr" />  </bpmn:process>  <bpmndi:BPMNDiagram id="BPMNDiagram_1">    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0x282ee">      <bpmndi:BPMNEdge id="Flow_0vg2u5w_di" bpmnElement="Flow_0vg2u5w">        <di:waypoint x="192" y="99" />        <di:waypoint x="295" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNEdge id="Flow_1a3q971_di" bpmnElement="Flow_1a3q971">        <di:waypoint x="345" y="99" />        <di:waypoint x="452" y="99" />      </bpmndi:BPMNEdge>      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_095xzot">        <dc:Bounds x="156" y="81" width="36" height="36" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Gateway_028awdq_di" bpmnElement="Gateway_028awdq" isMarkerVisible="true">        <dc:Bounds x="295" y="74" width="50" height="50" />      </bpmndi:BPMNShape>      <bpmndi:BPMNShape id="Event_0lziccr_di" bpmnElement="Event_0lziccr">        <dc:Bounds x="452" y="81" width="36" height="36" />      </bpmndi:BPMNShape>    </bpmndi:BPMNPlane>  </bpmndi:BPMNDiagram></bpmn:definitions>');

      bpmnVw.importXML(xmlData)
  
      bpmnVw.get('canvas').zoom('fit-viewport');
  
      setBpmnViewer(bpmnVw)
    }

  }, [xmlData]);

return (
  <div ref={containerRef} style={{ height: 300, border: "black 2px solid" }}>

  </div>
);
};

export default WFViewer;
