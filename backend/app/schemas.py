from typing import List
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    cv_text: str = Field(..., min_length=10)
    jd_text: str = Field(..., min_length=10)


class Recommendation(BaseModel):
    skill: str
    priority: str
    reason: str
    time: str


class AnalyzeResponse(BaseModel):
    match_score: int
    summary: str
    matching_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[Recommendation]
