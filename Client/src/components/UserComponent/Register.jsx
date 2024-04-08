import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { setToken,setUser} from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';


function Register() {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    zipCode: '',
  });
  let[emailError,setEmailError]=useState(false);
  let[registerError,setRegisterError]=useState(false);

  const dispatch = useDispatch();
  let navigate=useNavigate();
  let API_Link=import.meta.env.VITE_API_LINK;

  // handles changes to the form submission
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  //handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(true);
    setRegisterError(true)
    try {
      // Convert ZipCode from string to integer
      const payload = {
        ...formData,
        ZipCode: parseInt(formData.zipCode, 10) // Ensure ZipCode is an integer
      };
  
      const response = await fetch(API_Link+'users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: payload.firstName,
          LastName: payload.lastName,
          Email: payload.email,
          Password: payload.password,
          ZipCode: payload.ZipCode, // Use the converted ZipCode
        }),
      });
  
      const data = await response.json();
      if (data.token) {
        dispatch(setToken(data.token));
        dispatch(setUser(data.user));
        setEmailError(false);
        setRegisterError(false)
        navigate("/",{replace:true});
        // Additional actions upon successful registration
      } else if (data.message=="Email is already in use.") {
        // Handle failed registration 
        setRegisterError(true);
        setFormData({...formData,email:"",password:""})
      }
      else{
        formData.password="";
        setEmailError(false);
        setRegisterError(true);
        setFormData({...formData,email:"",password:""})
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error in form submission
    }
  };


  return (
    <>
      {registerError && <p>Unable to register . Try again</p>}
      {emailError && <p>Email already in use</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default Register;

