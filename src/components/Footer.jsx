import CookieConsent from 'react-cookie-consent'
function Footer() {
  return (
    <CookieConsent
      debug={true}
      location={'bottom'}
      declineButtonStyle={{
        backgroundColor: 'red',
        padding: '10px',
        borderRadius: '8px'
      }}
      buttonStyle={{
        backgroundColor: 'grey',
        padding: '10px',
        borderRadius: '8px'
      }}
      declineButtonText={'I Decline'}
      buttonText={'I Accept'}
      style={{
        background: 'white',
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
        <p>We only use strictly necessary cookies</p>
      </div>
    </CookieConsent>
  )
}

export default Footer
