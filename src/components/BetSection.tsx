import { ButtonGroup, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSocket } from "./socketProvider";

//make an interface

const BetSection = ({ balance, setBalance }: any) => {
    const ws = useSocket();

    const [betAmount, setBetAmount] = useState('');
    const [redBet, setRedBet] = useState(0);
    const [greenBet, setGreenBet] = useState(0);
    const [blackBet, setBlackBet] = useState(0);

    const [redBetTotals, setRedBetTotals] = useState(0);
    const [greenBetTotals, setGreenBetTotals] = useState(0);
    const [blackBetTotals, setBlackBetTotals] = useState(0);

    const [betsLocked, setBetsLocked] = useState(true);


    const handleBetAmountChange = (e: any) => {
        console.log('ads', e.target.value)
        setBetAmount(e.target.value);
    }

    useEffect(() => {
        const onMsg = (e: MessageEvent) => {
            const msg = JSON.parse(e.data);
            // if (msg.type === "balance") {

            switch (msg.type) {
                case "balance": {
                    setBalance(msg.balance);
                    console.log('hiho bally', msg.balance);
                    console.log('bet', msg.color, msg.amount);
                    switch (msg.color) {
                        case "red": setRedBet(redBet + Number(msg.amount));
                            break;
                        case "green": setGreenBet(greenBet + Number(msg.amount));
                            break;
                        case "black": setBlackBet(blackBet + Number(msg.amount));
                            break;
                        default:
                            console.warn("Unknown color", msg.color);
                    }
                    break;
                }
                case "totalBetUpdate": {
                    setRedBetTotals(msg.red)
                    setGreenBetTotals(msg.green)
                    setBlackBetTotals(msg.black)
                    console.log("totals update: ", msg.red, msg.green, msg.black);
                    break;
                }
                case "balanceWin": {
                    setBalance(msg.balance)

                    break;
                }
                case "balanceLoss": {
                    setRedBet(0);
                    setGreenBet(0);
                    setBlackBet(0);
                    break;
                }

                case "betsOpen": {
                    setBetsLocked(false);
                    break;
                }
                case "betsClosed": {
                    setBetsLocked(true);
                    break;
                }

            }

            // }
        };
        ws.addEventListener("message", onMsg);

        return () => ws.removeEventListener("message", onMsg);
    }, [ws, redBet, greenBet, blackBet]);


    const bet = (color: string, amount: string) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "bet", amount: amount, color }));
        } else {
            console.warn("socket not open:", ws.readyState);
        }

    }



    return (
        <>
            {/* Balance/Betting  */}
            <div className='py-3 px-5 bg-gray-100 rounded-md outline outline-gray-200 shadow-sm p-2 space-y-3 mb-2 font-black'>
                <p className='font-bold text-black'>Balance: {balance}</p>
                <ButtonGroup color='inherit' size="small" variant="contained" className=''
                sx={{ '& .MuiButton-root': { color: '#000' } }}>
                    <Button onClick={() => {setBetAmount('')}} className="text-black">Clear</Button>
                    <Button className="text-black">Last</Button>
                    <Button onClick={() => {setBetAmount(String(Number(betAmount) + 1))}} className="text-black">+1</Button>
                    <Button onClick={() => {setBetAmount(String(Number(betAmount) + 10))}} className="text-black">+10</Button>
                    <Button onClick={() => {setBetAmount(String(Number(betAmount) + 100))}} className="text-black">+100</Button>
                    <Button onClick={() => {setBetAmount(String(Number(betAmount) + 1000))}} className="text-black">+1000</Button>
                    <Button onClick={() => {setBetAmount(String(Number(betAmount) / 2))}} className="text-black">1/2</Button>
                    <Button onClick={() => {setBetAmount(String(Number(betAmount) * 2))}} className="text-black">x2</Button>
                    <Button onClick={() => setBetAmount(balance)} className="text-black">Max</Button>
                </ButtonGroup>
                <TextField
                    slotProps={{
                        root: { className: "h-8" },
                        input: { className: "py-0 px-2 text-sm h-full" }
                    }}
                    placeholder='Bet Amount...'
                    className='bg-white w-full outline rounded-md outline-gray-200'
                    value={betAmount}
                    onChange={handleBetAmountChange}
                />
            </div>

            {/* Red/Green/Black */}
            <div className='  flex flex-row space-x-4'>
                {/* Red */}
                <div className='flex flex-col w-1/3 outline outline-gray-200 rounded-lg'>
                    <div className='bg-gray-100 p-3  outline-gray-200'>
                        <Button disabled={betsLocked} sx={{
                            '&.Mui-disabled': {
                                backgroundColor: 'error.main', // keep the green
                                color: 'common.white',
                                opacity: 0.45,                   // just fade it a bit
                            },
                        }} onClick={() => bet("red", betAmount)} color="error" className='w-full' variant='contained'>{"1 to 7"}</Button>
                    </div>
                    <div className='w-full flex justify-center p-2 outline outline-gray-200 text-black'>
                        <p>{redBet}</p>
                    </div>
                    <div className='flex justify-between p-2  text-black'>
                        <p>{"Total Bet"}</p>
                        <p>{redBetTotals}</p>
                    </div>
                </div>

                {/* Green */}
                <div className='flex flex-col w-1/3 outline outline-gray-200 rounded-lg'>
                    <div className='bg-gray-100 p-3  outline-gray-200'>
                        <Button disabled={betsLocked} sx={{
                            '&.Mui-disabled': {
                                backgroundColor: 'success.main', // keep the green
                                color: 'common.white',
                                opacity: 0.45,                   // just fade it a bit
                            },
                        }} onClick={() => bet("green", betAmount)} color="success" className='w-full' variant='contained'>{"0"}</Button>
                    </div>
                    <div className='w-full flex justify-center p-2 outline outline-gray-200 text-black'>
                        <p>{greenBet}</p>
                    </div>
                    <div className='flex justify-between p-2  text-black'>
                        <p>{"Total Bet"}</p>
                        <p>{greenBetTotals}</p>
                    </div>
                </div>

                {/* Black */}
                <div className='flex flex-col w-1/3 outline outline-gray-200 rounded-lg'>
                    <div className='bg-gray-100 p-3  outline-gray-200'>
                        <Button sx={{
                            backgroundColor: "#333",
                            color: "white",
                            "&:hover": { backgroundColor: "#555" },
                            '&.Mui-disabled': {
                                backgroundColor: "#555", // keep the green
                                color: 'common.white',
                                opacity: 0.45,                   // just fade it a bit
                            },
                        }} disabled={betsLocked} onClick={() => bet("black", betAmount)} className='w-full' variant='contained'>{"8 to 14"}</Button>
                    </div>
                    <div className='w-full flex justify-center p-2 outline outline-gray-200 text-black'>
                        <p>{blackBet}</p>
                    </div>
                    <div className='flex justify-between p-2 text-black '>
                        <p>{"Total Bet"}</p>
                        <p>{blackBetTotals}</p>
                    </div>
                </div>


            </div>
        </>
    );
}

export default BetSection;