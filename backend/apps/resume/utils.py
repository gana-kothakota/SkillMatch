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

SKILL_DEFINITIONS = {
    'Python': ['python', 'py'],
    'Django': ['django'],
    'React': ['react', 'react.js', 'reactjs'],
    'JavaScript': ['javascript', 'js', 'ecmascript'],
    'TypeScript': ['typescript', 'ts'],
    'HTML': ['html', 'html5'],
    'CSS': ['css', 'css3'],
    'Tailwind CSS': ['tailwind', 'tailwindcss', 'tailwind css'],
    'Bootstrap': ['bootstrap', 'bootstrap5'],
    'Node.js': ['node', 'node.js', 'nodejs'],
    'Express': ['express', 'expressjs', 'express.js'],
    'PostgreSQL': ['postgresql', 'postgres', 'psql', 'postgresdb'],
    'MySQL': ['mysql'],
    'MongoDB': ['mongodb', 'mongo'],
    'Redis': ['redis'],
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'AWS': ['aws', 'amazon web services', 'amazon aws'],
    'GCP': ['gcp', 'google cloud', 'google cloud platform'],
    'Azure': ['azure'],
    'Git': ['git'],
    'GitHub': ['github'],
    'CI/CD': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
    'REST API': ['rest api', 'restful api', 'rest apis', 'restful', 'rest'],
    'GraphQL': ['graphql'],
    'Redux': ['redux', 'redux toolkit'],
    'Next.js': ['next', 'next.js', 'nextjs'],
    'Vue.js': ['vue', 'vue.js', 'vuejs'],
    'Angular': ['angular', 'angularjs'],
    'Java': ['java'],
    'Spring Boot': ['spring boot', 'springboot', 'spring'],
    'C++': ['c++', 'cpp'],
    'C#': ['c#', 'csharp', 'c sharp'],
    '.NET': ['.net', 'dotnet', 'asp.net'],
    'PHP': ['php'],
    'Laravel': ['laravel'],
    'FastAPI': ['fastapi', 'fast api'],
    'Flask': ['flask'],
    'Pandas': ['pandas'],
    'NumPy': ['numpy'],
    'Machine Learning': ['machine learning', 'ml'],
    'Data Science': ['data science'],
    'PyTorch': ['pytorch'],
    'TensorFlow': ['tensorflow', 'tf'],
    'Figma': ['figma'],
    'UI/UX': ['ui/ux', 'ui/ux design', 'user interface', 'user experience'],
    'Agile': ['agile'],
    'Scrum': ['scrum'],
    'SQL': ['sql'],
    'Linux': ['linux', 'ubuntu', 'bash', 'shell'],
}


def fallback_extract_text_from_pdf(file_obj):
    """Fallback text extractor if PyPDF2/pypdf reader module fails."""
    try:
        if hasattr(file_obj, 'seek'):
            file_obj.seek(0)
        content = file_obj.read() if hasattr(file_obj, 'read') else file_obj
        if hasattr(file_obj, 'seek'):
            file_obj.seek(0)

        if isinstance(content, bytes):
            text_parts = re.findall(rb'[a-zA-Z0-9\s\.\,\#\+\-\_\@]{3,}', content)
            return " ".join([p.decode('utf-8', errors='ignore') for p in text_parts])
    except Exception as e:
        print(f"Fallback extraction error: {e}")
    return ""


def extract_text_and_skills_from_pdf(file_obj):
    raw_text = ""

    if hasattr(file_obj, 'seek'):
        file_obj.seek(0)

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

    if hasattr(file_obj, 'seek'):
        file_obj.seek(0)

    if not raw_text.strip():
        raw_text = "Resume document processed."

    extracted_skills = []
    text_lower = raw_text.lower()

    for canonical_name, aliases in SKILL_DEFINITIONS.items():
        for alias in aliases:
            pattern = r'(?<![a-zA-Z0-9])' + re.escape(alias.lower()) + r'(?![a-zA-Z0-9])'
            if re.search(pattern, text_lower):
                if canonical_name not in extracted_skills:
                    extracted_skills.append(canonical_name)
                break

    return raw_text.strip(), extracted_skills
