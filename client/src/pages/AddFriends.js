import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import FriendReq from '../components/FriendReq';


const AddFriends = () => {

    const [sentReqList, setSentReqList] = useState([]);

    const [recReqList, setRecReqList] = useState([]);

    const sendReq = (e, username) => {
        e.preventDefault();

        return fetch('friend/send', 
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            })
            .then(res => res.json())
            .then(data => {
                if (data.statusCode !== 200) throw new Error(data.message);
                return alert(`You've sent a message to ${username}`);
            })
            .catch(err => alert(err.message))
    }

    useEffect(() => {
        fetch('friend/list', { method: 'GET'})
            .then(res => res.json())
            .then(data => {
                setSentReqList(data.asSender);
                setRecReqList(data.asRecipient);
            })
            .catch(err => console.log(err));
    }, []);
    
    return (
        <div>
            <SearchBar handler={sendReq} placeholderText='username...'/>
            <p>Incoming requests</p>
            { recReqList.map((req, index) => (req.status === 'pending') ? 
                <FriendReq 
                    reqType={req.status} 
                    userSent={false}
                    sender={req.sender.username}
                    recipient={req.recipient.username}
                    id={req._id} 
                    key={index}
                /> : <></>) 
            }
            <p>My requests</p>
            { sentReqList.map((req, index) => <FriendReq 
                reqType={req.status} 
                userSent={true}
                sender={req.sender.username}
                recipient={req.recipient.username}
                id={req._id} 
                key={index}
            />) }
        </div>
  )
}

export default AddFriends;