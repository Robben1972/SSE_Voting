"use client"
import { useEffect, useState } from "react";
import axios from "axios";
export default function Home() {

  const [votes, setVotes] = useState();
  useEffect(() => {
    const fetchVotes = async() => {
      const {data} = await axios.get('http://localhost:4000/votes')
      setVotes(data)
    }
    const eventSource = new EventSource("http://localhost:4000/events")

    eventSource.onmessage = ({data}) => {
      setVotes(JSON.parse(data))
    }
    fetchVotes()
  }, [])



  const voteHandler = async (candidate: string) => {
    const res  = await axios.post("http://localhost:4000/vote", {candidate})
    console.log(res);
  }

  return (
    <main className="flex gap-4">
      <section className="border-2">
        <img
          className="w-80 h-80"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/TrumpPortrait.jpg/1200px-TrumpPortrait.jpg"
          alt=""
        />
        <h1>Tramp</h1>
        <span className="text-2xl">Votes: {votes?.tramp ?? 0}</span>
        <button onClick={() => voteHandler('tramp')} className="block border-2 hover:cursor-pointer p-2">
          Vote for Trump
        </button>
      </section>
      <section className="border-2">
        <img
          className="w-80 h-80"
          src="https://www.atlanticcouncil.org/wp-content/uploads/2025/04/2025-04-04T121343Z_1102598399_RC2ZQDAXKTHB_RTRMADP_3_RUSSIA-PUTIN-scaled-e1744141887257-1024x764.jpg"
          alt=""
        />
        <h1>Putin</h1>
        <span className="text-2xl">Votes: {votes?.putin ?? 0}</span>
        <button onClick={() => voteHandler('putin')} className="block border-2 hover:cursor-pointer p-2">
          Vote for Putin
        </button>
      </section>
      <section className="border-2">
        <img
          className="w-80 h-80"
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Xi_Jinping_%28November_2024%29_02.jpg"
          alt=""
        />
        <h1>Xi</h1>
        <span className="text-2xl">Votes: {votes?.xi ?? 0}</span>
        <button onClick={() => voteHandler('xi')} className="block border-2 hover:cursor-pointer p-2">
          Vote for Xi
        </button>
      </section>
    </main>
    );
}
