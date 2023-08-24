import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import data from './ApiData';

function App() {
  const [loadedData, setloadedData] = useState({});
  const [userRewards, setCalcRewards] = useState({});
  const [custonerTransactions, setCustonerTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [newTransaction, setNewTransaction] = useState({ date: new Date(), amount: 0 });

  useEffect(() => {
    setloadedData({ ...data });
    setUsers([...Object.keys(data)]);
  }, []);


  const userSelect = (value) => {
    setCurrentUser(value);
    let userData = loadedData[value];

    let months = {
      1: {
        amounts: [],
        rewards: 0,
      },
      2: {
        amounts: [],
        rewards: 0,
      },
      3: {
        amounts: [],
        rewards: 0,
      },
    };
    for (let i = 0; i < userData.length; i++) {
      let month = new Date(userData[i]['date']);
      if (month.getMonth() + 1 === 1 || month.getMonth() + 1 === 2 || month.getMonth() + 1 === 3) {
        months[month.getMonth() + 1]['amounts'].push(userData[i]['amount']);
      }
    }
    for (let key in months) {
      let total_month_rewards = 0;
      for (let i = 0; i < months[key]['amounts'].length; i++) {
        let price = months[key]['amounts'][i];

        total_month_rewards = total_month_rewards + calculateRewards(price);
      }
      months[key]['rewards'] = total_month_rewards;
    }
    console.log(months)
    setCalcRewards({ ...months });
    setCustonerTransactions([...userData]);
  };

  const updateInput = (e) => {
    if (e.target.name === "date") {
      setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
    }
    if (e.target.name === "amount") {
      setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
    }
  }

  const btnAddtransaction = () => {
    let data = { ...loadedData };
    let month = new Date(newTransaction['date']);
    if (month.getMonth() + 1 === 1 || month.getMonth() + 1 === 2 || month.getMonth() + 1 === 3) {
      data[currentUser].push(newTransaction);
      console.log(data)
      setloadedData({ ...data });

      userSelect(currentUser);
    }
    setNewTransaction({ date: new Date(), amount: 0 });
  }
  return (
    <div style={{textAlign: 'center'}}> 
      <h2>User Rewards Program</h2>
      <div className="select-style">
        <select onChange={e => userSelect(e.target.value)} value={currentUser} >
          <option value="" disabled>Select User</option>
          {users.map((item, index) => {
            return (
              <option key={index} value={item}> {item.toUpperCase()} </option>
            );
          })}
        </select>
      </div> <br/><br/>
      {Object.keys(userRewards).length > 0 &&
        <div style={{marginLeft: '50px'}}>
          <table className="customers">
            <thead>
              <tr>
                <th>Month</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First Month</td>
                <td>{userRewards[1]["rewards"]}</td>
              </tr>
              <tr>
                <td>Second Month</td>
                <td>{userRewards[2]["rewards"]}</td>
              </tr>
              <tr>
                <td>Third Month</td>
                <td>{userRewards[3]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward</td>
                <td>{userRewards[1]["rewards"] + userRewards[2]["rewards"] + userRewards[3]["rewards"]}</td>
              </tr>
            </tbody>
          </table>
          <h4>User Transactions</h4>
          {custonerTransactions.length > 0 ?
            <table className="customers">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Rewards</th>
                </tr>

              </thead>
              <tbody>
                {custonerTransactions.map((item, index) => {
                  return <tr key={index}>
                    <td>{item["date"]}</td>
                    <td>{item["amount"]}</td>
                    <td>{calculateRewards(item["amount"])}</td>
                  </tr>
                })}
              </tbody>
            </table>
            : <div>No Transactions available</div>}
          <div>
            <h4>Add Transactions</h4>
            <h5>Transactions between 01/01/2023 and 03/31/2023 will be only added</h5>
            <label>Date : </label><input type="date" name="date" value={newTransaction.date} onChange={(e) => updateInput(e)}></input>
            <label>Amount :</label><input type="number" name="amount" value={newTransaction.amount} onChange={(e) => updateInput(e)}></input>
            <button onClick={() => btnAddtransaction()}>Add Transaction</button>
          </div>
        </div>
      }


    </div>
  );
}

export default App;

function calculateRewards(price) {
  let rewards = 0;
  if (price > 100) {
    rewards = (price - 100) * 2;
  }
  if (price > 50) {
    rewards = rewards + (price - 50);
  }
  return rewards;

}
