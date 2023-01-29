import { useCallback, useState, useRef, useEffect } from 'react';

const useDropDownArea = (id) => {

    const firstRender = useRef(true)
    const [display, setDisplay] = useState(false)

    const toggleSwitchHandler = useCallback((e) => {
        if (!e.target.matches(`#${id} *`)) {
            setDisplay(() => false)
        }
    }, [id])

    useEffect(() => {
        if (!firstRender.current) {
            const rootContainer = document.getElementById("body");
            if (display) {
                rootContainer.addEventListener("click", toggleSwitchHandler);
            }
            else {
                rootContainer.removeEventListener("click", toggleSwitchHandler);
            }
        }
        else {
            firstRender.current = false
        }
    }, [display, toggleSwitchHandler])

    return [display, setDisplay]
};

export default useDropDownArea;