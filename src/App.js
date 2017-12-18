import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import moment from "moment";
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      schedule: [],
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("schedule refresh", (schedule) => {
      this.setState({"schedule": schedule});
    });
  }

  getHumanTime(timestamp) {
    return moment.unix(timestamp).format("h:mm A");
  }

  getStatusClass(status) {
    let statusClass = 'nsinfo-schedule-table-cell'
    if (status === "On Time") {
      statusClass += '--good';
    } else if (status === "Delayed") {
      statusClass += '--bad';
    } else {
      statusClass += '--neutral';
    }
    return statusClass;
  }

  render() {
    
    const now = moment();
    const day = now.format("dddd");
    const date = now.format("M-D-YYYY");
    const time = now.format("h:mm A");

    return (
      <div className="nsinfo">
        <div className="nsinfo-top">
          <div className="nsinfo-header">
            <div className="nsinfo-date">
              <div>{day}</div>
              <div>{date}</div>
            </div>
            <div className="nsinfo-title">
              <h1>MBTA Train Information</h1>
            </div>
            <div className="nsinfo-time">
              <div>Current Time</div>
              <div>{time}</div>
            </div>
          </div>
        </div>
        <div className="nsinfo-bottom">
          <table className="nsinfo-schedule-table">
            <tbody>
              <tr>
                <th>Carrier</th>
                <th>Time</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Train#</th>
                <th>Track#</th>
                <th>Status</th>
              </tr>
              {this.state.schedule.map((row, i) => {

                const statusClass = "nsinfo-schedule-table-cell nsinfo-schedule-table-cell--status " + this.getStatusClass(row[7]);

                return (
                  <tr key={i}>
                    <td className="nsinfo-schedule-table-cell nsinfo-schedule-table-cell--carrier">MBTA</td>
                    <td className="nsinfo-schedule-table-cell nsinfo-schedule-table-cell--time">{this.getHumanTime(row[4])}</td>
                    <td className="nsinfo-schedule-table-cell nsinfo-schedule-table-cell--origin">{row[1]}</td>
                    <td className="nsinfo-schedule-table-cell nsinfo-schedule-table-cell--destination">{row[3]}</td>
                    <td className="nsinfo-schedule-table-cell nsinfo-schedule-table-cell--train">{row[2]}</td>
                    <td className="nsinfo-schedule-table-cell nsinfo-schedule-table-cell--track">{row[6] ? row[6] : "TBD"}</td>
                    <td className={statusClass}>{row[7]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
