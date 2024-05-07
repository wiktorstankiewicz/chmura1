import { useNavigate } from 'react-router-dom'
import { User, useUserStore } from '../stores/user-store';
import { useRef, useState } from 'react';
import { authenticate } from '../utils/cognito';





type Props = {}

function LoginPage({}: Props) {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  function onLoginClick() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    login(email,password,(user) => {
      userStore.setUser(user);
      navigate('/select-game');
    }, (error) => {
      setError(error);
    });
  }

  function login(email: string, password: string, onSuccess?: (user: User) => void, onError?: (error: string) => void){
    authenticate(email, password)
    .then((session) => {
      onSuccess && onSuccess({
        email: email,
        accessToken: session.getAccessToken().getJwtToken(),
        refreshToken: session.getRefreshToken().getToken()
      });
      console.log('success');
      console.log(session);
    })
    .catch((error) => {
      console.log('error');
      console.log(error);
      onError && onError(error.message);
    });
  }

  return (
    <>
    {/* <UsernameInput onInput={handleInput}/> */}
    <p>Login  </p>
    <input type="email" placeholder='email' defaultValue={"user2@example.com"} ref={emailRef} />
    <input type="password" placeholder='password' defaultValue={"123456"} ref={passwordRef} />
    <button onClick={() => onLoginClick()}>Login</button>
    <p>{error}</p>
    <button onClick={() => navigate('/register')}>Go to register</button>
    </>
  )
}

export default LoginPage