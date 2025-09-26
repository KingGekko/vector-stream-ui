#!/bin/bash

# Dropdown HTML to replace the simple Use Cases link
DROPDOWN_HTML='                    <div class="relative group">
                        <a href="use-cases.html" class="nav-link flex items-center">
                            Use Cases
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </a>
                        <div class="absolute top-full left-0 mt-2 w-64 glass-strong rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div class="py-2">
                                <a href="intelligence-operations.html" class="block px-4 py-2 text-sm text-white hover:bg-purple-600/20 transition-colors">Intelligence Operations</a>
                                <a href="business-analytics.html" class="block px-4 py-2 text-sm text-white hover:bg-purple-600/20 transition-colors">Business Analytics</a>
                                <a href="creative-industries.html" class="block px-4 py-2 text-sm text-white hover:bg-purple-600/20 transition-colors">Creative Industries</a>
                                <a href="research-development.html" class="block px-4 py-2 text-sm text-white hover:bg-purple-600/20 transition-colors">Research & Development</a>
                            </div>
                        </div>
                    </div>'

# Files to update
FILES=("dashboard.html" "vector-streams.html" "qvb.html" "sustainability.html")

for file in "${FILES[@]}"; do
    echo "Updating $file..."
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Replace the Use Cases link with dropdown
    sed 's|<a href="use-cases.html" class="nav-link">Use Cases</a>|'"$DROPDOWN_HTML"'|g' "$file" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    echo "Updated $file"
done

echo "All files updated successfully!"
