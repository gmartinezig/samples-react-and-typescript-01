import * as React from 'react';
import fire from './fire';

interface Message {
    id: string;
    text: string;
}

interface State {
    messages: Message[]
}

class App extends React.Component<any, State> {
  inputEl: any;

  constructor(props: any) {
    super(props);
    this.state = {messages:[]}; // <- set up react state
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', (snapshot: any) => {
      /* Update React state when message is added at Firebase Database */
       let message = { text: snapshot.val(), id: snapshot.key } as Message;
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }
  addMessage(e: any){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }
  render() {
    return (
      <form onSubmit={this.addMessage.bind(this)}>
         {<input type="text" ref={ el => this.inputEl = el }/>}
         <input type="submit"/>
         <ul>
             { this.state.messages.map( message => <li key={message.id}>{message.text}</li> ) }
         </ul>
      </form>
    );
  }
}

export default App;