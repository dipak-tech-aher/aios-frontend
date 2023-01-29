import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';

const TreeNav = (props) => {

    const nodeClick = (currentData) => {
    }
    return (
        <div className="col-lg-3">
            <div className="tree">
                <TreeMenu data={props.treeData} onClickItem={({ key, label, ...props }) => {
                    nodeClick(props)
                    // this.navigate(props.url); // user defined prop
                }}>
                    {({ search, items }) => (
                        <ul>
                            {items.map(({ key, ...props }) => (
                                <ItemComponent key={key} {...props} />
                            ))}
                        </ul>
                    )}
                </TreeMenu>
            </div>
        </div>
    );
};

export default TreeNav;
