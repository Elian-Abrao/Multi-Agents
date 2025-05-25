from pydantic import BaseModel

class ChatResponse(BaseModel):
    user: str
    response: str
