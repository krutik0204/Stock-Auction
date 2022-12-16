import React, { useEffect } from "react";
import { useState } from "react";
import { getUsersData } from "../features/users/user_service";
import StockUsersContext from "./UserContext";

import { collection, getDocs } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function UserState(props) {
  const [users, setUsers] = useState([]);

  const update = () => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const _users = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        _users.push(doc.data());
      });
      setUsers(_users);
    });
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <StockUsersContext.Provider value={{ users, update }}>
      {props.children}
    </StockUsersContext.Provider>
  );
}

export default UserState;
