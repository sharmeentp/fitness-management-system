import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("user");

const handleRegister = async(e)=>{
e.preventDefault();

try{

await axios.post("http://localhost:5000/api/users/register",{
name,
email,
password,
role
});

alert("Registered Successfully! Waiting for admin approval");

navigate("/");

}catch(error){
alert("Registration Failed");
}

};

return(

<div style={{padding:"30px"}}>

<h2>Register</h2>

<form onSubmit={handleRegister}>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<br/><br/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<label>Select Role</label>

<br/>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
>

<option value="user">User</option>
<option value="trainer">Trainer</option>

</select>

<br/><br/>

<button type="submit">Register</button>

</form>

</div>

);

};

export default Register;
