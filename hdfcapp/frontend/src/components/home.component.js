import React, { Component } from "react";

import AuthService from "../services/auth.service";
// import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        name: user.firstName,
        accountNo: user.AccountNo,
        accountType: user.AccountType,
        token: user.token
        // showModeratorBoard: user.roles.,
        // showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  render() {
    const { name, accountNo, accountType, token } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="alert alert-success" role="alert">
              User Name : {name} <br></br><br></br>
              Account Access Level : {accountType}
            </div>
          </div>
          <div className="col-md-6">
          <div className="alert alert-info" role="alert">
            Account Number : {accountNo} <br></br><br></br>
            BankName : HDFC
            </div>
        </div>
        Toke : {token}
        </div>
      </div>
    );
  }
}
