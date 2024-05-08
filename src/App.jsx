import React, { useState } from 'react';
const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState();
  function HandlerShowAddFriend() {
    setShowAddFriend(show => !show);
  }
  function HandlerAddFriend(friend) {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(false);
  }
  function HandlerSelection(friend) {
    setSelectedFriend(curSelected =>
      curSelected?.id != friend.id ? friend : null
    );
    setShowAddFriend(false);
  }
  function HandlerSplitBill(value) {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
    // console.log(value);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          Friends={friends}
          onSelection={HandlerSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={HandlerAddFriend} />}
        <Button onClick={HandlerShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          onSplitBill={HandlerSplitBill}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}
function FriendsList({ Friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {Friends.map(friend => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You ewo {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [imgUrl, setImgUrl] = useState('https://i.pravatar.cc/48');
  function HandlerAddNewFriend(e) {
    e.preventDefault();
    if (!name || !imgUrl) return;
    const id = crypto.randomUUID();
    const newFriend = { name, imgUrl: `${imgUrl}?=${id}`, balance: 0, id };
    onAddFriend(newFriend);
    setName('');
    setImgUrl('https://i.pravatar.cc/48');
  }
  return (
    <form className="form-add-friend" onSubmit={HandlerAddNewFriend}>
      <label>Friend Name :</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>Image URL : </label>
      <input
        type="text"
        value={imgUrl}
        onChange={e => setImgUrl(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const paidByFriend = bill ? bill - paidByUser : '';
  function HandlerSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);

    console.log(selectedFriend);
  }
  return (
    <form className="form-split-bill" onSubmit={HandlerSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>

      <label>💰 Bill value : </label>
      <input
        type="text"
        value={bill}
        onChange={e => setBill(Number(e.target.value))}
      />
      <label>🎅🏻 Your expense : </label>
      <input
        type="text"
        value={paidByUser}
        onChange={e =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🙎🏻‍♂️ {selectedFriend.name}'s expense : </label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill ? </label>
      <select
        value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
