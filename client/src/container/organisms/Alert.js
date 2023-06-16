import React from 'react'
import { useSelector } from 'react-redux'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'

const Alert = () => {

  const alerts = useSelector(state => state.alert)

  React.useEffect(() => {
    alerts.forEach(alert => {
      switch (alert.alertType) {
        case 'info':
          NotificationManager.info('Info message', alert.msg, 2000)
          break
        case 'success':
          NotificationManager.success('Success message', alert.msg, 2000)
          break
        case 'warning':
          NotificationManager.warning('Warning message', alert.msg, 2000)
          break
        case 'danger':
          NotificationManager.warning('Warning message', alert.msg, 2000)
          break
        case 'error':
          NotificationManager.error('Error message', alert.msg, 2000)
          break
        default:
          break
      }
    })
  }, [alerts])

  return (
    <div>
      <NotificationContainer />
    </div>
  )
}

export default Alert