/**
 * @Class of a timeout tracker that constantly checks
 * if the session has expired or not. When the session expires,
 * the user is automatically logged out of the application.
 * @parameters
 * timeout - the time (in seconds) for which the session will be valid
 * onTimeout - callback to be executed when the session is expired
 * onExpired - callback to be executed if the user opens the applciation
 *            after the session has already expired
 */

class IdleTimer {
  constructor({ timeout, onTimeout, onExpired }) {
    this.timeout = timeout
    this.onTimeout = onTimeout

    // Get the expiration time from local storage and
    // check if the session has already expired
    const expiredTime = parseInt(localStorage.getItem('_expiredTime') || 0, 10)

    // If session has already expired, fire the onExpired callback
    if (expiredTime > 0 && expiredTime < Date.now()) {
      onExpired()
      return
    }

    // If the session has not expired, start checking the remaining time periodically
    this.startInterval()
  }

  // Function to check periodically if the session has expires
  startInterval() {
    // Run the check every 1 second
    this.interval = setInterval(() => {
      const expiredTime = parseInt(
        localStorage.getItem('_expiredTime') || 0,
        10
      )

      // Check if the session has expired
      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout()
          this.cleanUp()
        }
      }
    }, 1000)
  }

  // cleanup code for the timeout tracker
  cleanUp() {
    localStorage.removeItem('_expiredTime')
    clearInterval(this.interval)
  }
}
export default IdleTimer
