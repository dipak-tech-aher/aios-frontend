import { Dropdown } from "bootstrap";
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataBaseTask from "./database";
import ApiTask from "./api";
import WaitTask from "./wait";
import ManualTask from "./manual";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import WFMetaConfig from './wfMetaConfig.json'
import { showSpinner, hideSpinner } from "../../common/spinner";
import { get, put, post } from "../../util/restUtil";
import { properties } from "../../properties";

const StartEventConfig = (props) => {

    const setIsStartEventConfigOpen = props.handler.setIsStartEventConfigOpen

    const [lookups, setLookups] = useState(null)

    const [filter, setFilter] = useState([
        {
            attribute: 'INTXN_TYPE',
            value: ['REQCOMP']
        },
        {
            attribute: 'INTXN_CAT_TYPE',
            value: ['CATADJ']
        },
        {
            attribute: 'PROBLEM_TYPE',
            value: ['CT003']
        }

    ]);

    useEffect(() => {

        showSpinner();

        const lookupTypes = []

        for (let l of WFMetaConfig.startEvent.lookups) {
            lookupTypes.push(l.codeType)
        }

        post(properties.BUSINESS_ENTITY_API, lookupTypes)
            .then((resp) => {
                if (resp.data) {
                    setLookups(resp.data)
                    // console.log('resp.data', resp.data)
                }
            }).finally(hideSpinner);

    }, []);

    return (
        <div className="form-popup" id="myForm-2" >
            <div className="form-container p-0">
                <div className="p-0" role="document">
                    <div className="modal-content">
                        <div className="modal-header p-0 m-0">
                            <h5 className="modal-title p-2" id="scrollableModalTitle">Start Event Configuration</h5>
                            <button type="button" className="close p-0 mr-1 mt-2" aria-label="Close" onClick={() => setIsStartEventConfigOpen(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body pt-0">
                            <div class="pt-2">
                                <table class="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Attribute </th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (filter && filter !== null && filter.length > 0) ?
                                                filter.map((f, idx) => (
                                                    <tr>
                                                        <td>
                                                            <select class="form-control" name="parent" value={f.attribute}>
                                                                <option value="">Select</option>
                                                                {
                                                                    (WFMetaConfig.startEvent.lookups) ?
                                                                        WFMetaConfig.startEvent.lookups.map((l) => {
                                                                            return (
                                                                                <option key={l.codeType} value={l.codeType}>{l.codeTypeDesc}</option>
                                                                            )
                                                                        })
                                                                        :
                                                                        <></>

                                                                }
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select name="child" class="form-control" value={f.value}>
                                                                <option value="">Select</option>
                                                                {
                                                                    (lookups && lookups && lookups !== null && lookups[f.attribute]) ?
                                                                        lookups[f.attribute].map((o) => (
                                                                            <option key={o.code} value={o.code}>{o.description}</option>
                                                                        ))
                                                                        :
                                                                        <></>

                                                                }
                                                            </select>
                                                        </td>
                                                        <td style={{ verticalAlign: "middle;" }}>
                                                            <button type="button" class="btn btn-sm btn-secondary">-</button>
                                                            {
                                                                (idx === (filter.length - 1))?
                                                                    <button type="button" class="ml-2 btn btn-sm btn-primary">+</button>
                                                                    :
                                                                    <></>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <></>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer d-flex mt-2 justify-content-center">
                            <button className="btn btn-secondary" onClick={() => setIsStartEventConfigOpen(false)} type="button">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StartEventConfig;