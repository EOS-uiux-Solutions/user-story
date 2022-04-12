import CookieConsent from 'react-cookie-consent'

const d = new Date()

function Footer() {
  return (
    <div className='footer-main'>
      <p className='footer-info'>
        <a href='https://userstory.eosdesignsystem.com/'>User Story</a> &#169;
        {d.getFullYear()}. All rights reserved.
      </p>
      <CookieConsent
        debug={true}
        location={'bottom'}
        declineButtonStyle={{
          backgroundColor: 'red',
          padding: '10px',
          borderRadius: '8px'
        }}
        buttonStyle={{
          backgroundColor: 'lightgreen',
          padding: '10px',
          borderRadius: '8px'
        }}
        declineButtonText={'I Decline'}
        buttonText={'I Accept'}
        style={{
          background: '#1E3B51',
          textAlign: 'left',
          padding: '10px',
          color: 'black'
        }}
        enableDeclineButton
        flipButtons
      >
        <div className='footer-main'>
          <a className='link link-default' href='/policies'>
            Cookies and Privacy policy
          </a>
          <p className='strict'>We only use strictly necessary cookies</p>
        </div>
      </CookieConsent>
    </div>
  )
}

export default Footer
