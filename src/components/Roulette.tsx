import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useSocket } from "./socketProvider";

export default function InfiniteHello() {
    const controls = useAnimation();
    const timerControls = useAnimation();
    const speed = 7.5;
    const ws = useSocket();
    const red = [5, 6, 7, 1, 2, 3, 4]
    const tiles = [11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8, 1,
        14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6,
        9, 7, 8, 1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4, 0,
        11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13,
        3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4, 0];

    const [resultBalls, setResultBalls] = useState([1, 14, 2, 13, 0, 0, 3, 12, 4, 11]);
    const [timerStatus, setTimerStatus] = useState('Preparing to roll...');
    const spin = (rollPx: any) => {
        controls.set({ x: rollPx % 1200 });
        controls.start({
            x: rollPx,
            transition: { duration: speed, ease: [0.16, 1, 0.3, 1] }
        });
    };

    const startTimer = () => {
        timerControls.set({ width: '100%' });
        timerControls.start({
            width: 0
        })
    }

    const playDink = () => {
        const dink = new Audio('/tone.wav')
        dink.play();
    }

    const playBloop = () => {
        const bloop = new Audio('/roll.wav')
        bloop.play();
    }


    useEffect(() => {
        const onMsg = (e: MessageEvent) => {
            const msg = JSON.parse(e.data);
            switch (msg.type) {
                case "spin": {
                    setTimerStatus('Rolling...')
                    playBloop();
                    spin(msg.rollPx);
                    break;
                }
                case "updateResBalls": {
                    setTimerStatus('Preparing to roll...')
                    setResultBalls(msg.resBalls);
                    startTimer();
                    playDink();
                    break;
                }
            }
        };
        ws.addEventListener("message", onMsg);

        return () => ws.removeEventListener("message", onMsg);
    }, [ws]);

    return (
        <div className="flex flex-col justify-center outline-gray-100">
            <div className="w-[1200px] rounded-lg overflow-hidden h-[60px] bg-gray-300">
                <div className="w-[1200px] h-[60px] bg-gray-300 rounded-lg overflow-hidden relative flex justify-center text-black">
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-red-400"
                        initial={{ width: "100%" }}
                        animate={timerControls}
                        transition={{ duration: 7.5, ease: "linear" }}
                    />

                    <div className="flex justify-center items-center z-99 font-bold">
                        {timerStatus}
                    </div>
                </div>
            </div>
            <div className="relative outline-1 rounded-lg outline-gray-100 overflow-hidden w-[1200px] shadow-lg">
                <div className="absolute left-1/2 w-[2.5px] bg-yellow-400 z-20 h-[80px]" />

                <motion.div
                    style={{ display: "inline-block", whiteSpace: "nowrap" }}
                    initial={{ x: 0 }}
                    animate={controls}  // (-3600,-4800) -- edge to middle is 600
                    transition={{ duration: speed, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex">
                        {tiles.map((x) => {
                            return (
                                <div
                                    className={`w-[80px] h-[80px] ${x === 0 ? "bg-green-700" : !red.includes(x) ? "bg-gray-800" : "bg-red-700"
                                        }`}
                                >
                                    <p className=" text-white font-bold text-xl px-2">{x}</p>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

            </div>
            <div className="flex flex-row justify-center items-center mt-2 space-x-1">
                {resultBalls.map((ballNum) => {
                    const color = ballNum === 0 ? "bg-green-700" : !red.includes(ballNum) ? "bg-gray-800" : "bg-red-700";
                    return <div className={`w-[50px] h-[50px] rounded-full ${color}`}>
                        <p className=" text-white font-bold text-xl px-2 flex justify-center items-center mt-2">{ballNum}</p>
                    </div>
                })}
            </div>
        </div>
    );
}