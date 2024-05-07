import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/cognito";

type Props = {};

function RegisterPage({}: Props) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  function onRegisterClick() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      return;
    }
    console.log(email, password);
    register(email, password).then(() => {
      alert("User registered");
      navigate("/login");
    });
  }

  function onLoginClick() {
    navigate("/login");
  }

  return (
    <div>
      <p>Register</p>
      <input type="email" placeholder="email" ref={emailRef} />
      <input type="password" placeholder="password" ref={passwordRef} />
      <button onClick={() => onRegisterClick()}>Register</button>
      <div>
        <button onClick={() => onLoginClick()}>Go to login</button>
      </div>
    </div>
  );
}

export default RegisterPage;
