import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import axios from 'axios';

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      data: [{}]
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
    axios.get('http://localhost:3000/allAssets', { headers: authHeader() })
      .then(res => {
        this.setState({ data: res.data });
      })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;
    const { data } = this.state;
    return (
      <div>
        {/* <h1>Dear {currentUser}</h1> */}
        <div className="container">
          <table className="table">
            <thead className="thead-dark">
              <tr>
              <th scope="col">Account ID</th>
                <th scope="col">Account Name</th>
                <th scope="col">Account No</th>
                <th scope="col">Account Type</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            {data ? (   <tbody>
              {data.map(data =>
              <tr>
                <th scope="row">{data.AccountID}</th>
                <td>{data.AccountName}</td>
                <td>{data.AccountNo}</td>
                <td>{data.AccountType}</td>
                <td>{data.CurrentBalance}</td>
              </tr>
              )} 
            </tbody> ) : (<td>"No data fetched (ERROR)"</td>) }
          </table>
        </div>
      </div>
    );
  }
}
