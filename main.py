from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
from starlette.middleware.cors import CORSMiddleware
import asyncio

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

votes = {"tramp": 0, "putin": 0, "xi": 0}
subscribers = []

@app.get("/votes")
async def get_votes():
    return votes

@app.get("/events")
async def events(request: Request):
    async def event_generator():
        queue = asyncio.Queue()
        subscribers.append(queue)

        try:
            while True:
                if await request.is_disconnected():
                    break
                data = await queue.get()
                yield {"event": "message", "data": data}
        finally:
            subscribers.remove(queue)

    return EventSourceResponse(event_generator())

@app.post("/vote")
async def vote(request: Request):
    data = await request.json()
    candidate = data.get("candidate")
    if candidate in votes:
        votes[candidate] += 1
        for subscriber in subscribers:
            await subscriber.put(votes)
        return JSONResponse(content={"message": "successfully voted!!!"})
    else:
        return JSONResponse(status_code=400, content={"error": "Invalid candidate"})
