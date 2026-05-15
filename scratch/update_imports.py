import os
import re

def update_imports(file_path, base_dir):
    with open(file_path, 'r') as f:
        content = f.read()

    # Get the directory of the current file relative to base_dir
    rel_dir = os.path.dirname(os.path.relpath(file_path, base_dir))
    if rel_dir == '.':
        rel_dir = ''

    def replacer(match):
        import_path = match.group(2)
        
        # If it's the root main.ts importing from ./src/
        if file_path.endswith('main.ts') and os.path.dirname(file_path) == base_dir:
            if import_path.startswith('./src/'):
                return f"{match.group(1)}'@/{import_path[6:]}'"
            if import_path.startswith('src/'):
                return f"{match.group(1)}'@/{import_path[4:]}'"
        
        # If it starts with ../ or ./ (but we only want to replace relative ones that point to src)
        if import_path.startswith('.'):
            # Calculate absolute path relative to src
            # Example: file_path = src/level/tile/GrassTile.ts, import_path = ../../engine/Color
            # abs_import = normpath(join(src/level/tile, ../../engine/Color)) = src/engine/Color
            # If abs_import starts with src/, then it becomes @/...
            abs_import = os.path.normpath(os.path.join(os.path.dirname(file_path), import_path))
            src_abs = os.path.join(base_dir, 'src')
            if abs_import.startswith(src_abs):
                rel_to_src = os.path.relpath(abs_import, src_abs)
                return f"{match.group(1)}'@/{rel_to_src}'"
        
        return match.group(0)

    # Regex for import and export statements
    # Handles: import ... from '...'; import type ... from '...'; export ... from '...';
    pattern = re.compile(r"(import\s+.*?\s+from\s+|export\s+.*?\s+from\s+)['\"](.*?)['\"]", re.DOTALL)
    new_content = pattern.sub(replacer, content)

    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

def main():
    base_dir = os.getcwd()
    src_dir = os.path.join(base_dir, 'src')
    
    # Update root main.ts
    main_ts = os.path.join(base_dir, 'main.ts')
    if os.path.exists(main_ts):
        update_imports(main_ts, base_dir)
        
    # Update everything in src/
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.ts', '.js')):
                update_imports(os.path.join(root, file), base_dir)

if __name__ == "__main__":
    main()
