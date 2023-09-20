import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/index.css";
import { useAppDispatch } from '../../../Redux/hooks/redux-hooks';
import { setUserLoggedIn } from '../../../Redux/store/controllerAction';

const Home = () =>
{
  // const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const dispatch = useAppDispatch();

  const handleClick = (e: any) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    // navigate('/the-chat');
    dispatch(setUserLoggedIn());
  };
  return (
    <form className="home__container">
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        minLength={6}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button className="home__cta" onClick={handleClick}>SIGN IN</button>
    </form>
  );
};

export default Home;
