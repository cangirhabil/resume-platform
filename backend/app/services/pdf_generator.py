from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import os
import io

class PDFGenerator:
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(__file__), "../templates")
        self.env = Environment(loader=FileSystemLoader(self.template_dir))

    def generate(self, data: dict, theme: str = "modern") -> bytes:
        """
        Generates PDF bytes from data using the specified theme.
        """
        template = self.env.get_template(f"themes/{theme}.html")
        html_content = template.render(**data)
        
        pdf_file = io.BytesIO()
        HTML(string=html_content).write_pdf(pdf_file)
        pdf_file.seek(0)
        return pdf_file.read()

pdf_generator = PDFGenerator()
