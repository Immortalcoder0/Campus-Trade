import docx
import fitz # PyMuPDF
import sys

def extract_docx(filepath, outpath):
    try:
        doc = docx.Document(filepath)
        text = "\n".join([para.text for para in doc.paragraphs])
        with open(outpath, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extracted {filepath} to {outpath}")
    except Exception as e:
        print(f"Error extracting {filepath}: {e}")

def extract_pdf(filepath, outpath):
    try:
        doc = fitz.open(filepath)
        text = ""
        for page in doc:
            text += page.get_text()
        with open(outpath, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extracted {filepath} to {outpath}")
    except Exception as e:
        print(f"Error extracting {filepath}: {e}")

if __name__ == "__main__":
    extract_docx("CampusTrade_TRD.docx", "CampusTrade_TRD.txt")
    extract_pdf("prd.pdf", "prd.txt")
