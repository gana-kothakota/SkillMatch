import io
import re

SKILL_DEFINITIONS = {
    'Python': ['python', 'py'],
    'Django': ['django', 'django framework', 'drf'],
    'Flask': ['flask'],
    'FastAPI': ['fastapi', 'fast api'],
    'React': ['react', 'react.js', 'reactjs', 'react native'],
    'JavaScript': ['javascript', 'js', 'ecmascript'],
    'TypeScript': ['typescript', 'ts'],
    'HTML': ['html', 'html5'],
    'CSS': ['css', 'css3'],
    'Tailwind CSS': ['tailwind', 'tailwindcss', 'tailwind css'],
    'Bootstrap': ['bootstrap', 'bootstrap5'],
    'Node.js': ['node', 'node.js', 'nodejs'],
    'Express': ['express', 'expressjs', 'express.js'],
    'Next.js': ['next', 'next.js', 'nextjs'],
    'Vue.js': ['vue', 'vue.js', 'vuejs'],
    'Angular': ['angular', 'angularjs'],
    'Redux': ['redux', 'redux toolkit'],
    'PostgreSQL': ['postgresql', 'postgres', 'psql', 'postgresdb'],
    'MySQL': ['mysql'],
    'MongoDB': ['mongodb', 'mongo'],
    'Redis': ['redis'],
    'SQLite': ['sqlite', 'sqlite3'],
    'Firebase': ['firebase'],
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'AWS': ['aws', 'amazon web services', 'amazon aws'],
    'GCP': ['gcp', 'google cloud', 'google cloud platform'],
    'Azure': ['azure'],
    'Git': ['git'],
    'GitHub': ['github'],
    'GitLab': ['gitlab'],
    'CI/CD': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
    'REST API': ['rest api', 'restful api', 'rest apis', 'restful', 'rest'],
    'GraphQL': ['graphql'],
    'Java': ['java'],
    'Spring Boot': ['spring boot', 'springboot', 'spring'],
    'C++': ['c++', 'cpp'],
    'C#': ['c#', 'csharp', 'c sharp'],
    '.NET': ['.net', 'dotnet', 'asp.net'],
    'Go': ['go', 'golang'],
    'Rust': ['rust'],
    'PHP': ['php'],
    'Laravel': ['laravel'],
    'Ruby': ['ruby', 'ruby on rails', 'rails'],
    'Swift': ['swift'],
    'Kotlin': ['kotlin'],
    'Pandas': ['pandas'],
    'NumPy': ['numpy'],
    'Scikit-learn': ['scikit-learn', 'sklearn'],
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
    'Jest': ['jest'],
    'PyTest': ['pytest'],
    'Cypress': ['cypress'],
    'Webpack': ['webpack'],
    'Vite': ['vite'],
    'Microservices': ['microservices', 'microservice'],
}


def fallback_extract_text_from_pdf(content):
    """Fallback text extractor that decompress zlib streams and finds readable text."""
    extracted_text_blocks = []
    try:
        if not isinstance(content, bytes):
            return ""

        import zlib
        # Find all FlateDecode streams inside PDF binary
        stream_matches = re.findall(rb'stream[\r\n]+(.*?)[\r\n]+endstream', content, re.DOTALL)
        for s in stream_matches:
            try:
                decompressed = zlib.decompress(s.strip())
                # Extract text inside parentheses in PDF text operators (Tj / TJ)
                text_in_parens = re.findall(rb'\((.*?)\)', decompressed)
                if text_in_parens:
                    decoded_lines = [p.decode('utf-8', errors='ignore') for p in text_in_parens if len(p.strip()) > 1]
                    if decoded_lines:
                        extracted_text_blocks.append(" ".join(decoded_lines))
            except Exception:
                continue

        if extracted_text_blocks:
            return "\n".join(extracted_text_blocks)

        # Basic ASCII string fallback if stream decompression found nothing
        text_parts = re.findall(rb'[a-zA-Z0-9\s\.\,\#\+\-\_\@]{3,}', content)
        return " ".join([p.decode('utf-8', errors='ignore') for p in text_parts])
    except Exception as e:
        print(f"Fallback extraction error: {e}")
    return ""


def extract_text_and_skills_from_pdf(file_obj):
    raw_text = ""
    file_bytes = b""

    try:
        if isinstance(file_obj, bytes):
            file_bytes = file_obj
        elif hasattr(file_obj, 'read'):
            if hasattr(file_obj, 'seek'):
                try:
                    file_obj.seek(0)
                except Exception:
                    pass
            file_bytes = file_obj.read()
            if hasattr(file_obj, 'seek'):
                try:
                    file_obj.seek(0)
                except Exception:
                    pass
    except Exception as general_err:
        print(f"File reading error: {general_err}")

    if file_bytes and len(file_bytes) > 0:
        # 1. Try pypdf module
        try:
            import pypdf
            stream = io.BytesIO(file_bytes)
            pdf_reader = pypdf.PdfReader(stream)
            if getattr(pdf_reader, 'is_encrypted', False):
                try:
                    pdf_reader.decrypt('')
                except Exception:
                    pass
            page_texts = []
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text and text.strip():
                    page_texts.append(text.strip())
            if page_texts:
                raw_text = "\n".join(page_texts)
        except Exception as e:
            print(f"pypdf extraction error: {e}")

        # 2. Try PyPDF2 module as fallback
        if not raw_text.strip():
            try:
                import PyPDF2
                stream = io.BytesIO(file_bytes)
                pdf_reader = PyPDF2.PdfReader(stream)
                if getattr(pdf_reader, 'is_encrypted', False):
                    try:
                        pdf_reader.decrypt('')
                    except Exception:
                        pass
                page_texts = []
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text and text.strip():
                        page_texts.append(text.strip())
                if page_texts:
                    raw_text = "\n".join(page_texts)
            except Exception as e:
                print(f"PyPDF2 extraction error: {e}")

        # 3. Try zlib stream decompression fallback if still empty
        if not raw_text.strip():
            raw_text = fallback_extract_text_from_pdf(file_bytes)

    if not raw_text.strip():
        raw_text = "Resume document uploaded successfully."

    extracted_skills = []
    text_lower = raw_text.lower()

    for canonical_name, aliases in SKILL_DEFINITIONS.items():
        for alias in aliases:
            escaped_alias = re.escape(alias.lower()).replace(r'\ ', r'\s+')
            pattern = r'(?<![a-zA-Z0-9])' + escaped_alias + r'(?![a-zA-Z0-9])'
            if re.search(pattern, text_lower):
                if canonical_name not in extracted_skills:
                    extracted_skills.append(canonical_name)
                break

    return raw_text.strip(), extracted_skills
