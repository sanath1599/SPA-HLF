import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authHeader from '../services/auth-header';
import axios from 'axios';


import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);

    this.state = {
      to: "",
      amount: "",
      loading: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      to: e.target.value
    });
  }

  onChangeAmount(e) {
    this.setState({
      amount: e.target.value
    });
  }

  handleTransfer(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
        axios.post('http://localhost:3000/transferAmount', {to : this.state.to, amount: this.state.amount} ,{ headers: authHeader() })
        .then(res => {
            alert(res)     
        })
        
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="https://static.thenounproject.com/png/445350-200.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleTransfer}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="username">To</label>
              <Input
                type="text"
                className="form-control"
                name="to"
                value={this.state.to}
                onChange={this.onChangeUsername}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Amount</label>
              <Input
                type="text"
                className="form-control"
                name="amount"
                value={this.state.amount}
                onChange={this.onChangeAmount}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Transfer</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
