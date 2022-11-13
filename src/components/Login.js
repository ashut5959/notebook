import React, {useState} from "react";
import { useNavigate} from 'react-router-dom'
const Login = (props) => {
    const [credential, setCredential] = useState({email:"" , password:""})

    // Navigate used to switch between diffent page through request
    let history = useNavigate();

    // API call
    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email: credential.email, password: credential.password})
          });
          const json = await response.json();


          // Login Process
          if(json.success)
          {
            localStorage.setItem('token' , json.authToken)
            props.showAlert("Logged in Successfully" , "success");
            history("/");
          }else {
            props.showAlert("Invalid" , "danger");
          }
    }

    const onChange = (e) => {
        setCredential({...credential, [e.target.name]: e.target.value})
    }
  return (


    //Form
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          name="email"
          value = {credential.email}
          onChange={onChange}
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          value = {credential.password}
          onChange={onChange}
          className="form-control"
          id="password"
        />
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
        <label className="form-check-label" htmlFor="exampleCheck1">
          Check me out
        </label>
      </div>
      <button type="submit"  className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Login;
