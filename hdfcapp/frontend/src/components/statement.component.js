import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import axios from 'axios';

export default class Statement extends Component {
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
    axios.get('http://localhost:3000/statement', { headers: authHeader() })
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
                <th scope="col">Balance</th>
                <th scope="col">isDelete</th>
                <th scope="col">TimeStamp</th>
                <th scope="col">txID</th>
              </tr>
            </thead>
            <tbody>
            {data.map(data =>
              <tr>
                <th scope="row">{data.balance}</th>
                <td>{data.isDelete}</td>
                <td>{data.timestamp}</td>
                <td>{data.txId}</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
