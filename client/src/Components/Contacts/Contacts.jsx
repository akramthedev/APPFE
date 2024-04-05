import React from 'react'
import './Contacts.css';
import SingleContact from './SingleContact.jsx';

const Contacts = () => {
  return (
    <div className='Contacts'>
        <div className="sponsored">
          Contacts
        </div>
        <div className="AllContact">
          <SingleContact />
          <SingleContact />
          <SingleContact />
          <SingleContact />
          <SingleContact />
        </div>
    </div>
  )
}

export default Contacts