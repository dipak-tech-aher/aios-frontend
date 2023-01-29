import React, { useState } from 'react';

const TreeNode = (nodes) => {
    const [className, setClassName] = useState("togglable ");
    const [visible, setVisible] = useState(false);


    const toggle = (e) => {
        // if (visible === true) {
        //     setClassName("togglable togglable-down");
        // } else {
        //     setClassName("togglable togglable-up");
        // }
    };

    // if (this.props.node.childNodes != null) {
    //     childNodes = this.props.node.childNodes.map(function (node, index) {
    //         return <li key={index}><TreeNode node={node} /><p>button</p></li>
    //     });

    //     if (this.state.visible) {
    //         className += ' togglable-down';
    //     } else {
    //         className += ' togglable-up';
    //     }
    // }

    var style;
    // if (!this.state.visible) {
    //     style = { display: "none" };
    // }

    return (
        <div>
            {/* {nodes.nodes.map((node,i) => (
                <h5 visible={visible} onClick={(e) => toggle(e)} key={i} className={className}>
                    {node.org}
                </h5>

            ))} */}
            {/* <h5 onClick={this.toggle} className={className}>
                    {this.props.node.title}
                </h5>
                <ul style={style}>
                    {childNodes}
                </ul> */}
        </div>
    );
}



export default TreeNode;