import React, { useState, useEffect } from 'react';
import customtheme from '../common/themes.json'
import { properties } from '../properties';
import { get } from "../util/restUtil";

const Theme = ({ children }) => {

    const [theme, settheme] = useState({});

    useEffect(() => {
        get(properties.THEME_API + "?name=Imagine").then((resp) => {
            if (resp.data) {
                settheme(resp.data.config);
            } else {
                settheme({ ...customtheme });
            }
        })
    }, []);

    return (
        <div style={theme}>
            {children}
        </div>
    );
}

export default Theme;

