import UsernameInput from '../components/UsernameInput'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/user-store';

type Props = {}

function LoginPage({}: Props) {
  const navigate = useNavigate();
  const userStore = useUserStore();
  function handleInput(username: string) {
    console.log(username)
    userStore.setUser(username)
    navigate('/select-game')
  }
  return (
    <>
    <UsernameInput onInput={handleInput}/>
    </>
  )
}

export default LoginPage