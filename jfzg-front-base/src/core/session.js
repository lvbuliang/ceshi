export function getSession(sessionName) {
    return sessionStorage.getItem(sessionName)
  }
  
  export function setSession(sessionName, sessionValue) {
    return sessionStorage.setItem(sessionName, sessionValue)
  }
  export function removeSession(sessionName) {
    return sessionStorage.removeItem(sessionName)
  }