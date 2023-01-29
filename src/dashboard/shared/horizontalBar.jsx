import React from "react";

const HorizontalBar = (props) => {

    const { title,targetCount, percentage, salesCount, balanceCount, backgroundColor, progressbarColor }= props.data

    return (
        <>
            <table class={backgroundColor} cellPadding="8"
                cellSpacing="8">
                <thead>
                    <tr>
                        <th colspan="2">
                            <h4 class="text-dark">{title} <span
                                class="text-dark">(Target {targetCount})</span>
                            </h4> 
                            <hr style={{border :'1px solid #ccc'}}>
                            </hr>
                        </th>
                    </tr>
                    <tr>
                        <th width="75%">Sales - {salesCount}</th>
                        <th>Balance- ({balanceCount})</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td colspan="2">
                            <div class="progress mb-2">
                                <div class={progressbarColor}
                                    role="progressbar" style={{width: percentage+"%"}}
                                    aria-valuenow={percentage} aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default HorizontalBar;