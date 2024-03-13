import React from 'react'
import { useUserStore } from '../stores/user-store';

type Props = {}

function SelectGamePage({}: Props) {
  const userStore = useUserStore();
  return (
    <div>SelectGame {userStore.user}</div>
  )
}

export default SelectGamePage