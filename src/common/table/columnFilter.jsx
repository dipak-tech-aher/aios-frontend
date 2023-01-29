import React, { useState, useEffect } from 'react';
import { useAsyncDebounce } from 'react-table';
import useDropDownArea from "../header/useDropDownArea";

export const ColumnFilter = ({ column, state }) => {
    const { filterValue, setFilter, id } = column;
    const [display, setDisplay] = useDropDownArea('filter')
    const [filterOption, setFilterOption] = useState('contains')
    const [value, setValue] = useState("")

    useEffect(() => {
        setValue(filterValue ? filterValue[0] : "")
    }, [filterValue])

    const handleOnFilterOptionChange = (e) => {
        const { target } = e;
        setFilterOption(target.value)
        if (value)
            setFilter([value, target.value])
    }

    const handleOnChange = useAsyncDebounce(value => {
        if (value) {
            setFilter([value.trim(), filterOption])
        }
        else
            setFilter('')
    }, 1000)

    const handleClear = () => {
        setValue('')
        setFilter('')
    }

    return (
        <span className={`float-right ${filterValue ? 'filtered' : ''} ${display && "show"}`} id="filter">
            <ul className="mb-0">
                <li className="dropdown notification-list topbar-dropdown">
                    <span className="dropdown-toggle waves-effect waves-light cursor-pointer" onClick={() => { setDisplay(!display) }}>
                        <i className="mdi mdi-filter-menu-outline" ></i>
                    </span>
                    <div className={`dropdown-menu dropdown-xs dropdown-bottom ${display && "show"}`} x-placement="bottom-end" style={{ transform: "translate3d(0px, 0px, 0px) !important" }}>
                        {display && (
                            <>
                                <span>Filter</span>
                                <select value={filterOption}
                                    className="form-control input-xs mt-1"
                                    id="example-select"
                                    onChange={handleOnFilterOptionChange}>
                                    <option value="contains">Contains</option>
                                    <option value="notContains">Not Contains</option>
                                </select>

                                <span className="mt-1">
                                    <input value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value)
                                            handleOnChange(e.target.value)
                                        }}
                                        id={id}
                                        name="example-input-small"
                                        className="form-control form-control-sm mt-1"
                                    />
                                </span>
                                <span className="dropdown-item text-center text-primary notify-item notify-all"
                                    onClick={handleClear}>
                                    Clear
                                </span>
                            </>
                        )}
                    </div>
                </li>
            </ul>
        </span>
    );
}