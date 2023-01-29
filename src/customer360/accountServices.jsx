import React from 'react'
import ScrollTabs from './ScrollTabs'

function accountServices() {
    return (
        <div>
            <h4 id="list-item-1">Accounts &amp; Services</h4>
            <hr/>
            <div className='row'>
            <div className='col-md-12'>
            <ScrollTabs/>
            </div>
            </div>
        </div>
    )
}

export default accountServices
