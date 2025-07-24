// import { useState } from 'react'
import { Select, MenuItem, Button, TextField } from "@mui/material";
import './App.css'
import Roulette from './components/Roulette';
import BetSection from "./components/BetSection";
import { useEffect, useState } from "react";

function App() {

  const loggy = async () => {
    window.location.href = 'http://74.135.5.230:8080/auth/steam'
  }


  const [balance, setBalance] = useState('Sign in to load');
  const getAcc = async () => {
    const resp = await fetch('/api/me', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    });
    const data = await resp.json();
    console.log("HORNY:", data);

    if (resp.status === 401) return null;
    if (!resp.ok) throw new Error('Failed to load /api/me');

    setBalance(data.balance);

  }

  useEffect(() => {
    getAcc();
  }, [])



  return (
    <main>
      {/* header */}
      <div className='bg-gray-100 text-gray-500 h-12 flex justify-between gap-4 outline-1 outline-gray-200'>
        <div className='flex flex-row items-center'>
          <h2 className='flex items-center'>CSGODouble.com</h2>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Home</Button>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Deposit</Button>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Withdraw</Button>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Provably Fair</Button>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Affiliates</Button>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Free Coins</Button>
          <Button size='small' sx={{ color: "gray" }} className='' variant="text">Support</Button>
        </div>
        <div>
          <Button size='small' sx={{ color: "white" }} onClick={loggy} variant="contained">Login</Button>
        </div>
      </div>


      {/* chat and main window */}
      <div className='flex flex-row w-full h-[calc(100vh-3rem)] bg-white'>

        {/* Chat */}
        <div className='flex-1 bg-gray-100 min-w-[400px] flex flex-col outline-[1px] outline-gray-200 shadow-lg'>
          <div className='p-1'>
            <Select className=' w-full bg-white h-8' size='small'>
              <MenuItem className='' value="1">Main Room</MenuItem>
            </Select>
          </div>
          <div className='bg-white w-full h-[400px] p-2 italic text-sm'>
            <p>{"Generating anal token..."}</p>
            <p>{"Please sign in through Steam to Connect."}</p>
          </div>
          <div className='w-full p-2'>
            <TextField
              slotProps={{
                root: { className: "h-8" },
                input: { className: "py-0 px-2 text-sm h-full" }
              }}
              placeholder='Type here to chat...'
              className='bg-white w-full outline rounded-md outline-gray-200' />
            <p className='text-sm font-bold p-1'>{"Users Online: 0"}</p>
          </div>
        </div>


        {/* main window */}
        <div className=' flex-4 p-2'>
          {/* Roulette */}
          <div className='h-64 bg-gray-100 rounded-md outline outline-gray-200 shadow-sm mb-2 flex justify-center items-center'>
            <Roulette />
          </div>

          <BetSection balance={balance} setBalance={setBalance} />

        </div>
      </div>
    </main>
  )
}

export default App
