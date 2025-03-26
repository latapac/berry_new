const server = "64.227.139.217"

export async function loginService(username, password) {
    try {
        const data = await fetch("http://"+server+":3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // specify the content type
            },
            body: JSON.stringify({
                username,
                password
            }),
        })
        const jsonData = await data.json()
        if (jsonData?.status === true) {
            localStorage.setItem("username", username)
            localStorage.setItem("secret", password)
            return jsonData
        } else if (jsonData?.status === 400) {
            alert("incorrect password");
        } else if (jsonData?.status === 404) {
            alert("no user found");
        } else {
            alert("invalid serer response");
        }
    } catch (error) {
        alert(error);

    }
}

export function checkLoginService(){
    const username = localStorage.getItem("username")
    const password = localStorage.getItem("secret")
    if (username && password) {
        return {username,password}
    } else {
        return false
    }
}

export async function getMachines(cid) {
    try {
        const data = await fetch("http://"+server+":3000/getMachine/"+cid)
        const md = await data.json()
        if (md.status==200) {
            return md.data
        }else{
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }
}

export async function getMachineData(mid) {
    try {
        const response = await fetch("http://"+server+":3000/getMachineData/"+mid);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            
            return false
        }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}



export async function getAuditTrailData(mid) {
    try {
        const response = await fetch("http://"+server+":3000/getAuditTraildata/"+mid);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            
            return false
        }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}



export async function getoee(mid,date,RunningShift) { 
    try {
        console.log('http://'+server+':3000/getoee/'+mid);
        
        const response = await fetch('http://'+server+':3000/getoee/'+mid, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               date:date,
               RunningShift:RunningShift
            })
      })
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            
            return false
        }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}


export async function getBatch(mid,date){ 
    try {
       
        const response = await fetch('http://'+server+':3000/getbatch/'+mid, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               date:date,
            })
      })
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            return false
        }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}



export async function getMachineUser(mid) {
    try {
        const response = await fetch("http://"+server+":3000/getOperator/"+mid);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.user
        }else{
            console.log(data);
            
            return false
        }
  
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}


export async function getSpeedHistory(mid) { 
    const date = new Date()
    const tarik = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`
    try {
        const response = await fetch('http://'+server+':3000/getSpeedHistory/'+mid+'?date='+tarik)
        console.log('http://'+server+':3000/getSpeedHistory/'+mid+'?date='+tarik);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            
            return false
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}

export async function getOeeHistory(mid) { 
    const date = new Date()
    const tarik = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`
    try {
        const response = await fetch('http://'+server+':3000/getOeeHistory/'+mid+'?date='+tarik)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.status==200) {
            return data.data
        }else{
            console.log(data);
            
            return false
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false
    }
}


export async function logoutService() {
    try {     
        localStorage.clear("username")
        localStorage.clear("secret")
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

