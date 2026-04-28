import json
import os
from typing import Any, Dict

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def _mock_analysis(cv_text: str, jd_text: str) -> Dict[str, Any]:
    cv_lower = cv_text.lower()
    jd_lower = jd_text.lower()

    skills = [
        "react",
        "javascript",
        "typescript",
        "python",
        "fastapi",
        "docker",
        "aws",
        "git",
        "sql",
        "testing",
    ]

    jd_skills = [skill for skill in skills if skill in jd_lower]
    cv_skills = [skill for skill in skills if skill in cv_lower]

    if not jd_skills:
        jd_skills = ["react", "javascript", "git", "typescript", "docker"]

    matching = sorted(set(jd_skills).intersection(cv_skills))
    missing = sorted(set(jd_skills).difference(cv_skills))

    base_score = int((len(matching) / max(len(jd_skills), 1)) * 100)
    score = max(35, min(92, base_score + 18))

    if not matching:
        matching = ["Git", "Teamwork"]
    else:
        matching = [skill.upper() if skill == "sql" else skill.title() for skill in matching]

    if not missing:
        missing = ["Testing", "CI/CD"]
    else:
        missing = [skill.upper() if skill == "aws" else skill.title() for skill in missing]

    recommendations = []
    for skill in missing[:4]:
        recommendations.append(
            {
                "skill": skill,
                "priority": "High" if len(recommendations) < 2 else "Medium",
                "reason": f"JD co nhac den {skill}, nhung CV chua the hien ro kinh nghiem lien quan.",
                "time": "5-7 ngay" if len(recommendations) < 2 else "3-5 ngay",
            }
        )

    return {
        "match_score": score,
        "summary": "CV co nen tang phu hop voi JD, nhung can lam ro hon cac ky nang con thieu va them du an/chung cu cu the.",
        "matching_skills": matching,
        "missing_skills": missing,
        "strengths": [
            "CV co mot so keyword trung voi JD.",
            "Nen tang ky thuat phu hop cho vi tri fresher/junior.",
        ],
        "weaknesses": [
            "Mot so ky nang quan trong trong JD chua xuat hien ro trong CV.",
            "Can them metric, impact va context cho tung project.",
        ],
        "recommendations": recommendations,
    }


async def analyze_cv_vs_jd(cv_text: str, jd_text: str) -> Dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

    if not api_key:
        return _mock_analysis(cv_text, jd_text)

    client = OpenAI(api_key=api_key)

    prompt = f"""
You are a senior recruiter and career coach for students and fresh graduates in Vietnam.

Analyze how well the candidate CV matches the job description.
Be specific, practical, and avoid generic advice.
Return ONLY valid JSON with this exact schema:
{{
  "match_score": 0,
  "summary": "",
  "matching_skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": [
    {{
      "skill": "",
      "priority": "High/Medium/Low",
      "reason": "",
      "time": ""
    }}
  ]
}}

CV:
{cv_text}

JOB DESCRIPTION:
{jd_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You return strict JSON only. No markdown."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    content = response.choices[0].message.content or "{}"
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return _mock_analysis(cv_text, jd_text)
