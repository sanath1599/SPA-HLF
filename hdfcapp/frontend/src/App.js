import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Statement from "./components/statement.component";
import Account from "./components/account.component"
import Init from "./components/initledger"
import Transfer from "./components/transfer.component"

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
        name : user.firstName
        
        // showModeratorBoard: user.roles.,
        // showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, name, showAdmin } = this.state;
  

    return (
      
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            <img height = "100" src="https://m.hindustantimes.com/rf/image_size_640x362/HT/p2/2016/01/31/Pictures/hdfc-bank-logo-oficial-webiste_6789248c-c840-11e5-88c9-96b817b1d3de.jpg" />
          </Link>
          <div className="navbar-nav mr-auto">
          <li className="nav-item">
              <Link to={"/init"} className="nav-link">
                InitLedger
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/transactions"} className="nav-link">
                Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/account"} className="nav-link">
                All Details
              </Link>
            </li>

            {showAdmin && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            
              <li className="nav-item">
                <Link to={"/transfer"} className="nav-link">
                  Transfer Amount
                </Link>
              </li>

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}
          </div>

          {name ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/"} className="nav-link">
                  {name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/transactions" component={Statement} />
            <Route path="/user" component={Home} />
            <Route path="/init" component={Init} />
            <Route path="/transfer" component={Transfer} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
