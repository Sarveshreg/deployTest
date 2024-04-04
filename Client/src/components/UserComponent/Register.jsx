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

  const dispatch = useDispatch();
  let navigate=useNavigate();

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
    try {
      // Convert ZipCode from string to integer
      const payload = {
        ...formData,
        ZipCode: parseInt(formData.zipCode, 10) // Ensure ZipCode is an integer
      };
  
      const response = await fetch('http://localhost:3000/api/users/register', {
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
      if (response.ok) {
        console.log('Registration Successful:', data);
        dispatch(setToken(data.token));
        dispatch(setUser(data.user));
        // dispatch(setId(data.user.id));
        navigate("/",{replace:true});
        // Additional actions upon successful registration
      } else {
        console.error('Registration Failed:', data);
        // Handle failed registration
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error in form submission
    }
  };


  return (
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
  );
}

export default Register;

//have the user enter the following to register:
// first name
// last name
// email
// password
// zip code

//and then set up an API call so that these info can be sent to the backend