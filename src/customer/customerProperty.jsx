import React from 'react';

const CustomerProperty = (props) => {
    debugger;
    const { categoryOrClassData } = props.data;
    const { categoryLookup, classLookup } = props.lookupData
    const { setCategoryOrClassData } = props.stateHandlers
    const { error, renderMode } = props;
    return (
        <>
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Customer Property</h5>
                </div>
            </div>
            <div className="form-row pl-2">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="category" className="col-form-label">Category<span>*</span></label>
                        {
                            renderMode !== 'view' ? (
                                <>
                                    <select id="category" value={categoryOrClassData.category} className={`form-control ${(error.category ? "input-error" : "")}`}
                                        onChange={e => {
                                            setCategoryOrClassData({ ...categoryOrClassData, category: e.target.value, categoryDesc: e.target.options[e.target.selectedIndex].label })
                                        }
                                        }>
                                        <option value="">Choose Category</option>
                                        {
                                            categoryLookup.map((e) => (
                                                <option key={e.code} value={e.code}>{e.description}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="errormsg">{error.category ? error.category : ""}</span>
                                </>
                            )
                                : (
                                    <p>{categoryOrClassData.category}</p>
                                )
                        }
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="class" className="col-form-label">Class<span>*</span></label>
                        {
                            renderMode !== 'view' ? (
                                <>
                                    <select id="class" value={categoryOrClassData.class} className={`form-control ${(error.class ? "input-error" : "")}`}
                                        onChange={e => setCategoryOrClassData({ ...categoryOrClassData, class: e.target.value, classDesc: e.target.options[e.target.selectedIndex].label })}>
                                        <option value="">Choose Class</option>
                                        {
                                            classLookup.map((e) => (
                                                <option key={e.code} value={e.code}>{e.description}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="errormsg">{error.class ? error.class : ""}</span>
                                </>
                            )
                                : (
                                    <p>{categoryOrClassData.class}</p>
                                )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerProperty;