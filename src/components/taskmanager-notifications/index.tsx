import * as React from 'react'

export default class Notifier extends React.Component {

   public componentDidMount(): void {
  
    if (!('Notification' in window) || Notification.permission === 'granted') {
      return
    }
    Notification.requestPermission()
    if (Notification.permission === 'granted') {
      window.setTimeout(() => {
       
        // if (

        //   !('Notification' in window) ||
        //   Notification.permission !== 'granted' ||
        //   document.hasFocus()
        // ) {
        //   notificationAudio.play()
        //   return
        // }
        
        // tslint:disable-next-line no-unused-expression
        new Notification('Nytt meddelande från Taskmanager', {
          silent: true,
          body: "A new ticket has come in for you...",
          icon: null,
        })
      
      }, 1800)  
    } 

  }

  public componentWillReceiveProps( nextProps ): void {

    // if (!nextProps.chatMessages) {
    //   return
    // }

    // const existingMessageIds = this.props.chatMessages.map(({ id }) => id)
    // const newMessages = nextProps.chatMessages.filter(
      // ({ id }) => !existingMessageIds.includes(id),
    // )
    window.setTimeout(() => {
       
        // if (

        //   !('Notification' in window) ||
        //   Notification.permission !== 'granted' ||
        //   document.hasFocus()
        // ) {
        //   notificationAudio.play()
        //   return
        // }
        
        // tslint:disable-next-line no-unused-expression
        new Notification('Nytt meddelande från hedvig', {
          silent: true,
          body: "A message from Somebody",
          icon: null,
        })
      
    }, 1800)
  }



  public render() {
    return null
  }
}