import {Route} from "react-router-dom"
import ChatPage from "./Components/ChatPage";
import HomePage from "./Components/HomePage";
import ForgotPassword from "./Components/ResetPassword";


function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route  path="/chats" component={ChatPage} />
      <Route  path="/reset" component={ForgotPassword}/>
    </div>
  );
}

export default App;
