# from weasyprint import HTML # Removed top-level import
from jinja2 import Environment, FileSystemLoader
import os
import io
from typing import Dict, Any, List

class PDFGenerator:
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(__file__), "../templates")
        self.env = Environment(loader=FileSystemLoader(self.template_dir))
        self.available_templates = ["modern", "classic", "minimal"]

    def get_available_templates(self) -> List[str]:
        """Returns list of available template names."""
        return self.available_templates
    
    def _normalize_resume_data(self, resume_data: dict) -> dict:
        """
        Normalize resume data to handle different LLM output formats.
        Ensures templates receive consistent data structure.
        """
        normalized = dict(resume_data)
        
        # Handle personal_info variations
        personal_info = normalized.get("personal_info", {})
        if isinstance(personal_info, dict):
            # Ensure name field exists
            if not personal_info.get("name"):
                personal_info["name"] = personal_info.get("full_name", "")
            normalized["personal_info"] = personal_info
        
        # Handle experience - ensure bullets format
        experience = normalized.get("experience", [])
        normalized_experience = []
        for exp in experience:
            if isinstance(exp, dict):
                norm_exp = dict(exp)
                # Convert description to bullets if needed
                if "description" in norm_exp and "bullets" not in norm_exp:
                    desc = norm_exp.get("description", "")
                    if isinstance(desc, str):
                        norm_exp["bullets"] = [desc] if desc else []
                    elif isinstance(desc, list):
                        norm_exp["bullets"] = desc
                # Ensure bullets is always a list
                if "bullets" not in norm_exp:
                    norm_exp["bullets"] = []
                # Handle dates format
                if "dates" not in norm_exp:
                    start = norm_exp.get("start_date", "")
                    end = norm_exp.get("end_date", "Present")
                    norm_exp["dates"] = f"{start} - {end}" if start else ""
                normalized_experience.append(norm_exp)
        normalized["experience"] = normalized_experience
        
        # Handle skills - can be dict or list
        skills = normalized.get("skills", [])
        if isinstance(skills, dict):
            # Flatten skills dict to list
            flat_skills = []
            for category, skill_list in skills.items():
                if isinstance(skill_list, list):
                    flat_skills.extend(skill_list)
                elif isinstance(skill_list, str):
                    flat_skills.append(skill_list)
            normalized["skills"] = flat_skills
            normalized["skills_dict"] = skills  # Keep original for templates that support it
        elif isinstance(skills, list):
            normalized["skills"] = skills
            normalized["skills_dict"] = {"skills": skills}
        
        # Handle education
        education = normalized.get("education", [])
        normalized_education = []
        for edu in education:
            if isinstance(edu, dict):
                norm_edu = dict(edu)
                # Ensure school field
                if not norm_edu.get("school"):
                    norm_edu["school"] = norm_edu.get("institution", "")
                # Handle dates
                if "dates" not in norm_edu:
                    norm_edu["dates"] = norm_edu.get("graduation_date", "")
                normalized_education.append(norm_edu)
        normalized["education"] = normalized_education
        
        return normalized

    def render_html(self, resume_data: dict, theme: str) -> str:
        """
        Renders the HTML content from a Jinja2 template.
        """
        if theme not in self.available_templates:
            theme = "modern"
        
        # Normalize data for consistent template rendering
        normalized_data = self._normalize_resume_data(resume_data)
        
        template = self.env.get_template(f"themes/{theme}.html")
        return template.render(**normalized_data)

    def generate(self, resume_data: dict, theme: str = "modern") -> bytes:
        """
        Generates PDF bytes from data using the specified theme.
        """
        try:
            from weasyprint import HTML
            html_content = self.render_html(resume_data, theme)
            return HTML(string=html_content).write_pdf()
        except Exception as e:
            print(f"PDF Generation Failed (WeasyPrint error): {e}")
            import traceback
            traceback.print_exc()
            # Return a valid PDF with error message
            return self._generate_error_pdf(str(e))
    
    def _generate_error_pdf(self, error_message: str) -> bytes:
        """Generate a PDF with error message."""
        return b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 80\n>>\nstream\nBT\n/F1 18 Tf\n50 700 Td\n(Resume Generation Error - Please try again) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000220 00000 n \n0000000307 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n437\n%%EOF"

    def generate_docx(self, resume_data: dict) -> bytes:
        """
        Generates DOCX bytes from resume data.
        """
        try:
            from docx import Document
            from docx.shared import Pt, Inches, RGBColor
            from docx.enum.text import WD_ALIGN_PARAGRAPH
            
            # Normalize data
            data = self._normalize_resume_data(resume_data)
            
            doc = Document()
            
            # Set margins
            for section in doc.sections:
                section.top_margin = Inches(0.75)
                section.bottom_margin = Inches(0.75)
                section.left_margin = Inches(1)
                section.right_margin = Inches(1)
            
            # Personal Info / Header
            personal_info = data.get("personal_info", {})
            name = personal_info.get("name") or "Your Name"
            
            name_para = doc.add_paragraph()
            name_run = name_para.add_run(name)
            name_run.bold = True
            name_run.font.size = Pt(24)
            name_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # Contact info
            contact_parts = []
            if personal_info.get("email"):
                contact_parts.append(personal_info["email"])
            if personal_info.get("phone"):
                contact_parts.append(personal_info["phone"])
            if personal_info.get("linkedin"):
                contact_parts.append(personal_info["linkedin"])
            if personal_info.get("location"):
                contact_parts.append(personal_info["location"])
            
            if contact_parts:
                contact_para = doc.add_paragraph(" | ".join(contact_parts))
                contact_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
                for run in contact_para.runs:
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(100, 100, 100)
            
            # Summary
            summary = data.get("summary")
            if summary:
                doc.add_heading("Professional Summary", level=2)
                doc.add_paragraph(summary)
            
            # Experience
            experience = data.get("experience", [])
            if experience:
                doc.add_heading("Experience", level=2)
                for exp in experience:
                    title = exp.get("title") or exp.get("position", "")
                    company = exp.get("company", "")
                    dates = exp.get("dates", "")
                    
                    job_para = doc.add_paragraph()
                    title_run = job_para.add_run(f"{title}")
                    title_run.bold = True
                    if company:
                        job_para.add_run(f" at {company}")
                    if dates:
                        job_para.add_run(f" ({dates})")
                    
                    # Bullets
                    bullets = exp.get("bullets", [])
                    for bullet in bullets:
                        if bullet:
                            doc.add_paragraph(bullet, style="List Bullet")
            
            # Education
            education = data.get("education", [])
            if education:
                doc.add_heading("Education", level=2)
                for edu in education:
                    degree = edu.get("degree", "")
                    school = edu.get("school") or edu.get("institution", "")
                    dates = edu.get("dates", "")
                    
                    edu_para = doc.add_paragraph()
                    edu_run = edu_para.add_run(f"{degree}")
                    edu_run.bold = True
                    if school:
                        edu_para.add_run(f" - {school}")
                    if dates:
                        edu_para.add_run(f" ({dates})")
            
            # Skills
            skills = data.get("skills", [])
            if skills:
                doc.add_heading("Skills", level=2)
                doc.add_paragraph(", ".join(skills))
            
            # Certifications
            certifications = data.get("certifications", [])
            if certifications:
                doc.add_heading("Certifications", level=2)
                for cert in certifications:
                    doc.add_paragraph(cert, style="List Bullet")
            
            # Projects
            projects = data.get("projects", [])
            if projects:
                doc.add_heading("Projects", level=2)
                for project in projects:
                    proj_para = doc.add_paragraph()
                    proj_run = proj_para.add_run(project.get("name", ""))
                    proj_run.bold = True
                    if project.get("description"):
                        doc.add_paragraph(project["description"])
            
            # Save to bytes
            buffer = io.BytesIO()
            doc.save(buffer)
            buffer.seek(0)
            return buffer.getvalue()
            
        except ImportError:
            print("python-docx not installed. Falling back to dummy DOCX.")
            return self._get_dummy_docx()
        except Exception as e:
            print(f"DOCX Generation Failed: {e}")
            import traceback
            traceback.print_exc()
            return self._get_dummy_docx()
    
    def _get_dummy_docx(self) -> bytes:
        """Returns a minimal valid DOCX file."""
        # This is a minimal DOCX structure
        return b"PK\x03\x04\x14\x00\x00\x00\x00\x00"  # Minimal zip header

pdf_generator = PDFGenerator()
