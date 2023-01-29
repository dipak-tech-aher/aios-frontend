// import { Link } from 'react-scroll';
// import TreeMenu, { defaultChildren, ItemComponent } from 'react-simple-tree-menu';

import CreateOrg from "./createOrg"

const OrgOverview = (props) => {



    return (

        <div className="row mt-1">
            <CreateOrg orgFormData={props.orgFormData}></CreateOrg>
        </div>

    );
};

export default OrgOverview;
