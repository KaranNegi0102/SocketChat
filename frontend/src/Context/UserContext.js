import React,{ useState} from 'react'
import { createContext } from 'react'

export const UserDataContext = createContext();

const UserContext = ({children}) => {


const [userData, setUserData] = useState({
  name: "",
  email: "",
  password: "",
});

  return (
    <UserDataContext.Provider value={{userData,setUserData}}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext
