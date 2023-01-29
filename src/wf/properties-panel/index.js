
import ReactDOM from 'react-dom';
import React from 'react';

import PropertiesView from './propertiesView';

const PropertiesPanel = (props) => {

    const modeler = props.modeler

    return(
        <PropertiesView modeler={ modeler } />
    )

}

export default PropertiesPanel;