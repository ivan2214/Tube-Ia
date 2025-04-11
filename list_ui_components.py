import os
from pathlib import Path

# Base project directory
BASE_DIR = Path(r"c:\Users\juanb\OneDrive\Desktop\Ivan\Dev\projects\youtube-generator-timeline-ai")
UI_COMPONENTS_DIR = BASE_DIR / "shared" / "components" / "ui"

def list_ui_components():
    """List all UI component files without their extensions"""
    if not UI_COMPONENTS_DIR.exists():
        print(f"Directory not found: {UI_COMPONENTS_DIR}")
        return
    
    print("Individual component installation commands:")
    print("==========================================")
    
    # Get all files with .tsx extension
    component_files = list(UI_COMPONENTS_DIR.glob("*.tsx"))
    
    if not component_files:
        print("No UI components found.")
        return
    
    # Sort alphabetically
    component_files.sort()
    
    # Store component names for combined command
    component_names = []
    
    # Print individual commands
    for file_path in component_files:
        component_name = file_path.stem
        component_names.append(component_name)
        print(f"pnpm dlx shadcn@latest add {component_name}")
    
    # Print combined command
    print("\nCombined installation command:")
    print("==============================")
    print(f"pnpm dlx shadcn@latest add {' '.join(component_names)}")
    
    print(f"\nTotal components: {len(component_files)}")

if __name__ == "__main__":
    list_ui_components()