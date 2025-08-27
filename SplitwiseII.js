// File: App.jsx
import React, { useState } from "react";
// import { GroupForm } from './components/GroupForm';
// import { ExpenseForm } from './components/ExpenseForm';
// import { Balances } from './components/Balances';

const App = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);

  const createGroup = (group) => {
    setGroups([...groups, { ...group, expenses: [] }]);
  };

  const addExpense = (expense) => {
    const newGroups = [...groups];
    newGroups[selectedGroupIndex].expenses.push(expense);
    setGroups(newGroups);
  };

  const settleUp = (payer, payee, amount) => {
    const newGroups = [...groups];
    newGroups[selectedGroupIndex].expenses.push({
      desc: `Settle up: ${payer} paid ${payee}`,
      amount,
      paidBy: payer,
      splits: { [payee]: amount, [payer]: 0 },
    });
    setGroups(newGroups);
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: 20,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>💸 Split Expenses App</h1>
      <GroupForm onCreate={createGroup} />
      <h3>Groups</h3>
      <ul>
        {groups.map((g, i) => (
          <li key={i}>
            <button
              onClick={() => setSelectedGroupIndex(i)}
              style={{ cursor: "pointer" }}
            >
              {g.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedGroupIndex !== null && (
        <>
          <h2>Group: {groups[selectedGroupIndex].name}</h2>
          <ExpenseForm
            members={groups[selectedGroupIndex].members}
            onAddExpense={addExpense}
          />
          <Balances
            members={groups[selectedGroupIndex].members}
            expenses={groups[selectedGroupIndex].expenses}
            onSettleUp={settleUp}
          />
        </>
      )}
    </div>
  );
};

export default App;

// File: components/Balances.jsx
//import React from 'react';

export const Balances = ({ members, expenses, onSettleUp }) => {
  const balances = {};
  members.forEach((m) => (balances[m] = 0));

  expenses.forEach(({ amount, paidBy, splits }) => {
    Object.entries(splits).forEach(([m, val]) => {
      const share = parseFloat(val);
      if (m === paidBy) {
        balances[m] += amount - share;
      } else {
        balances[m] -= share;
      }
    });
  });

  const getOwesList = () => {
    const owes = [];
    const pos = [],
      neg = [];
    for (const m in balances) {
      const val = Math.round(balances[m] * 100) / 100;
      if (val > 0.009) pos.push([m, val]);
      else if (val < -0.009) neg.push([m, -val]);
    }
    let i = 0,
      j = 0;
    while (i < neg.length && j < pos.length) {
      const [debtor, debt] = neg[i];
      const [creditor, credit] = pos[j];
      const settle = Math.min(debt, credit);
      owes.push({ debtor, creditor, amount: settle });
      neg[i][1] -= settle;
      pos[j][1] -= settle;
      if (neg[i][1] < 0.01) i++;
      if (pos[j][1] < 0.01) j++;
    }
    return owes;
  };

  return (
    <div>
      <h3>Balances</h3>
      <div style={{ marginBottom: 10 }}>
        {members.map((m) => (
          <div key={m}>
            {m}: ${balances[m].toFixed(2)}
          </div>
        ))}
      </div>
      <div>
        <strong>Owes:</strong>
      </div>
      <ul>
        {getOwesList().map(({ debtor, creditor, amount }, i) => (
          <li key={i}>
            {debtor} owes {creditor} ${amount.toFixed(2)}{" "}
            <button
              onClick={() => onSettleUp(debtor, creditor, amount)}
              style={{ marginLeft: 10 }}
            >
              Settle Up
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// File: components/GroupForm.jsx
//import React, { useState } from 'react';

export const GroupForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);

  const addMember = () => {
    if (memberInput && !members.includes(memberInput)) {
      setMembers([...members, memberInput]);
      setMemberInput("");
    }
  };

  const createGroup = () => {
    if (name && members.length > 1) {
      onCreate({ name, members });
      setName("");
      setMembers([]);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div>
        <strong>Create Group</strong>
      </div>
      <input
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Add Member"
        value={memberInput}
        onChange={(e) => setMemberInput(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={addMember}>Add</button>
      <div style={{ margin: "10px 0" }}>
        <strong>Members:</strong> {members.join(", ")}
      </div>
      <button onClick={createGroup}>Create Group</button>
    </div>
  );
};

// File: components/ExpenseForm.jsx
//import React, { useState } from 'react';

export const ExpenseForm = ({ members, onAddExpense }) => {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(members[0]);
  const [isUnequal, setIsUnequal] = useState(false);
  const [splits, setSplits] = useState(() =>
    members.reduce((acc, m) => ({ ...acc, [m]: "" }), {})
  );

  const updateSplit = (member, value) => {
    setSplits({ ...splits, [member]: value });
  };

  const submit = () => {
    const total = parseFloat(amount);
    if (!desc || !total || total <= 0) return;

    let finalSplits;
    if (isUnequal) {
      const values = members.map((m) => parseFloat(splits[m] || "0"));
      const sum = values.reduce((a, b) => a + b, 0);
      if (Math.abs(sum - total) > 0.01)
        return alert("Split amounts must total the full amount");
      finalSplits = { ...splits };
    } else {
      const equal = +(total / members.length).toFixed(2);
      finalSplits = members.reduce((acc, m) => ({ ...acc, [m]: equal }), {});
    }

    onAddExpense({ desc, amount: total, paidBy, splits: finalSplits });
    setDesc("");
    setAmount("");
    setPaidBy(members[0]);
    setSplits(members.reduce((acc, m) => ({ ...acc, [m]: "" }), {}));
    setIsUnequal(false);
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <div>
        <strong>Add Expense</strong>
      </div>
      <input
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        style={{ marginRight: 10 }}
      >
        {members.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <label style={{ display: "block", margin: "10px 0" }}>
        <input
          type="checkbox"
          checked={isUnequal}
          onChange={(e) => setIsUnequal(e.target.checked)}
          style={{ marginRight: 5 }}
        />
        Split Unequally
      </label>
      {isUnequal && (
        <div style={{ marginBottom: 10 }}>
          {members.map((m) => (
            <div key={m}>
              {m}:{" "}
              <input
                type="number"
                value={splits[m]}
                onChange={(e) => updateSplit(m, e.target.value)}
                style={{ width: 60, marginLeft: 5 }}
              />
            </div>
          ))}
        </div>
      )}
      <button onClick={submit}>Add</button>
    </div>
  );
};
