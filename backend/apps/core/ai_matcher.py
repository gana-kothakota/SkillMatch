import re

SKILL_ALIASES = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'reactjs': 'react',
    'react.js': 'react',
    'vuejs': 'vue',
    'vue.js': 'vue',
    'nextjs': 'next.js',
    'nodejs': 'node.js',
    'postgres': 'postgresql',
    'postgresdb': 'postgresql',
    'docker': 'docker',
    'aws': 'amazon web services',
    'tailwind': 'tailwindcss',
    'django': 'django',
}

def normalize_skill(skill_str):
    clean = re.sub(r'[^a-zA-Z0-9\.\#\+]', '', skill_str.lower().strip())
    return SKILL_ALIASES.get(clean, clean)

def calculate_ai_match(resume_skills, job_skills):
    """
    Compares candidate resume skills vs job required skills.
    Returns score percentage (0-100), matched skills, missing skills, and personalized recommendations.
    """
    if not job_skills:
        return {
            'score': 100.0,
            'matched_skills': resume_skills,
            'missing_skills': [],
            'recommendations': ["Job lists no specific required skills."]
        }

    norm_resume_map = {normalize_skill(s): s for s in resume_skills}
    norm_job_map = {normalize_skill(s): s for s in job_skills}

    resume_set = set(norm_resume_map.keys())
    job_set = set(norm_job_map.keys())

    matched_keys = resume_set.intersection(job_set)
    missing_keys = job_set.difference(resume_set)

    matched_skills = [norm_job_map[k] for k in matched_keys]
    missing_skills = [norm_job_map[k] for k in missing_keys]

    score = round((len(matched_keys) / len(job_set)) * 100, 1) if job_set else 0.0

    recommendations = []
    if score >= 80:
        recommendations.append("Strong fit! Your profile matches most required technical competencies.")
    elif score >= 50:
        recommendations.append(f"Good potential match. Consider adding or highlighting experience with: {', '.join(missing_skills[:3])}.")
    else:
        recommendations.append(f"Skill gap detected. Adding key technologies like {', '.join(missing_skills[:4])} could significantly boost your match rating.")

    return {
        'score': score,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
        'recommendations': recommendations
    }
