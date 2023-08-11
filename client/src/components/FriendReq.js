import React from 'react'

const FriendReq = ({ reqType, userSent, sender, recipient, reqId }) => {

    const handleReq = (type) => fetch(`friend/${type}`, 
        { 
            method: type === 'dismiss' ? 'DELETE' : 'PATCH', 
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: reqId })
        })
        .then(res => {
            if (res.ok && type === 'accept') return alert(`${sender} is now your friend!`);
            if (res.ok) return
        })
        .catch(err => console.log(err));

    return (
        <div>
            <p>{ userSent ? `friend request to ${recipient}` : `friend request from ${sender}`}</p>
            {!userSent ? 
                <>
                    <button onClick={() => handleReq('accept')}>✓</button>
                    <button onClick={() => handleReq('reject')}>x</button>
                </> : <></>}
            {userSent && reqType === 'pending' ? 
                <>
                    <p>pending...</p>
                </> : <></>}
            {userSent && reqType !== 'pending' ?
                <>
                    <p>{reqType}</p>
                    <button onClick={() => handleReq('dismiss')}>✓</button>
                </> : <></>}
        </div>
  )
}

export default FriendReq;