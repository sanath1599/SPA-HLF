import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import authHeader from '../services/auth-header';
import axios from 'axios';

export default class Init extends Component {
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
    axios.get('http://localhost:3000/init', { headers: authHeader() })
      .then(res => {
          alert(res.data)
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
        
      </div>
    );
  }
}
