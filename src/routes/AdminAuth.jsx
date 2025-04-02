import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AdminProtected({children}) {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);

  const authStatus = useSelector((state)=>state.adminAuth.adminStatus);

  
  useEffect(()=>{

    if (!authStatus) {
        navigate("/admin");
    } 
    setLoading(false)

  },[authStatus,navigate])

  return (
    loading?<h1>Loading...</h1>:<>{children}</>
  )
}

export default AdminProtected