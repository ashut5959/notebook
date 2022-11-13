import React, {useState} from "react";
import { useNavigate} from 'react-router-dom'

const SignUp = (props) => {
  const [credential, setCredential] = useState({name: "" ,email:"" , password:"" , cpassword: ""})
    let history = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const {name , email , password}  = credential;
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name , email , password})
      });
      const json = await response.json();
      console.log(json);
      if(json.success)
      {
        localStorage.setItem('token' , json.authToken)
        props.showAlert("Account created Successfully" , "success")
        history("/");
      }
      else {
        props.showAlert("Invalid" , "danger")
      }
}

const onChange = (e) => {
    setCredential({...credential, [e.target.name]: e.target.value})
}
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            onChange={onChange}
            name = "name"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={onChange}
            name = "email"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={onChange}
            name = "password"
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
           Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            onChange={onChange}
            name = "cpassword"
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;
