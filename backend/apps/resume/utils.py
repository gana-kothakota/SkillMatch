import io
import re

pypdf_module = None
try:
    import pypdf
    pypdf_module = pypdf
except ImportError:
    try:
        import PyPDF2
        pypdf_module = PyPDF2
    except ImportError:
        pypdf_module = None

COMMON_TECH_SKILLS = [
    'Python', 'Django', 'React', 'React.js', 'JavaScript', 'TypeScript',
    'HTML', 'CSS', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Node.js', 'Express',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS',
    'GCP', 'Azure', 'Git', 'GitHub', 'CI/CD', 'REST API', 'GraphQL', 'Redux',
    'Next.js', 'Vue.js', 'Angular', 'Java', 'Spring Boot', 'C++', 'C#', '.NET',
    'PHP', 'Laravel', 'FastAPI', 'Flask', 'Pandas', 'NumPy', 'Machine Learning',
    'Data Science', 'PyTorch', 'TensorFlow', 'Figma', 'UI/UX', 'Agile', 'Scrum'
]

def fallback_extract_text_from_pdf(file_obj):
    """Fallback text extractor if PyPDF2/pypdf reader module fails."""
    try:
        if hasattr(file_obj, 'read'):
            content = file_obj.read()
            file_obj.seek(0)
        else:
            content = file_obj

        if isinstance(content, bytes):
            # Extract plain text characters from PDF stream
            text_parts = re.findall(rb'[a-zA-Z0-9\s\.\,\#\+\-\_\@]{3,}', content)
            return " ".join([p.decode('utf-8', errors='ignore') for p in text_parts])
    except Exception as e:
        print(f"Fallback extraction error: {e}")
    return ""

def extract_text_and_skills_from_pdf(file_obj):
    raw_text = ""
    
    if pypdf_module is not None:
        try:
            pdf_reader = pypdf_module.PdfReader(file_obj)
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    raw_text += text + "\n"
        except Exception as e:
            print(f"pypdf reader error: {e}")
            raw_text = fallback_extract_text_from_pdf(file_obj)
    else:
        raw_text = fallback_extract_text_from_pdf(file_obj)

    if not raw_text.strip():
        raw_text = "Resume document processed."

    extracted_skills = []
    text_lower = raw_text.lower()

    for skill in COMMON_TECH_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            extracted_skills.append(skill)

    return raw_text, extracted_skills
