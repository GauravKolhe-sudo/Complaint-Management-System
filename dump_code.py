
import os

project_root = r"g:\New folder\SGP\Complaint-Management-System"
output_file = os.path.join(project_root, "project_code_dump.txt")

extensions = ['.js', '.jsx', '.css', '.html', '.py', '.json', '.txt']
exclude_dirs = ['node_modules', '.git', '.ipynb_checkpoints', 'dist', 'build', 'coverage', 'data', 'models']

def is_excluded(path):
    for excluded in exclude_dirs:
        if excluded in path.split(os.sep):
            return True
    return False

with open(output_file, 'w', encoding='utf-8') as f_out:
    for root, dirs, files in os.walk(project_root):
        if is_excluded(root):
            continue
            
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                
                # Double check if file is excluded (e.g. package-lock.json if needed, but user might want it)
                if file == 'package-lock.json': 
                    continue # typically too large and not useful for invalidating logic
                
                relative_path = os.path.relpath(file_path, project_root)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f_in:
                        content = f_in.read()
                        
                    f_out.write(f"File Name: {file}\n")
                    f_out.write(f"File Location: {relative_path}\n")
                    f_out.write("-" * 50 + "\n")
                    f_out.write(content + "\n")
                    f_out.write("-" * 50 + "\n\n")
                    print(f"Processed: {relative_path}")
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

print(f"Dump completed to {output_file}")
