import { is } from 'bpmn-js/lib/util/ModelUtil';
import alignElements from 'diagram-js/lib/features/align-elements';
import React, { useEffect, useState } from 'react';
import './propertiesView.css';

const PropertiesView = (props) => {

    const modeler = props.modeler

    const [selectedElements, setSelectedElements] = useState([])
    const [element, setElement] = useState([])

    useEffect(() => {
        if (modeler) {
            modeler.on('selection.changed', (e) => {

                setSelectedElements(e.newSelection)
                setElement(e.newSelection[0])

            });

            modeler.on('element.changed', (e) => {

                if (!element) {
                    return
                } else if (e.element.id === element.id) {
                    setElement(e.element)
                }

            });
        }
    }, [modeler])

    return (
        <div>
            {
                selectedElements.length === 1
                && <span>Ready to display properties</span>
            }

            {
                selectedElements.length === 0
                && <span>Please select an element.</span>
            }

            {
                selectedElements.length > 1
                && <span>Please select a single element.</span>
            }
        </div>
    );
}

export default PropertiesView;