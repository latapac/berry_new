import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Protected({children}) {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);

  const authStatus = useSelector((state)=>state.authSlice.userStatus);
  const adminAuthStatus = useSelector((state)=>state.adminAuth.adminStatus);

  useEffect(()=>{

    if (!authStatus && !adminAuthStatus) {
        navigate("/pages/login");
    } 
    setLoading(false)

  },[authStatus,navigate])

  return (
    loading?<h1>Loading...</h1>:<>{children}</>
  )
}

export default Protected