
<div class="editorDescrOptions">
  <button class="submit-button editorButton editorActiveButton editorWriteButton" type="button" name="writeDescr" onclick="writeText(event)">Write</button>
  <button class="submit-button editorButton editorPreviewButton" type="button" name="previewDescr" onclick="previewText(event)">Preview</button>

  <div class="markdownShortcutWrapper">
      <ul class="editorBarMenu">
        <li class="editorDropdown editorMarkdownIcon">
            <div class="editorDropdownLink" >
              <svg aria-hidden="true" class="octicon octicon-text-size" height="16" version="1.1" viewBox="0 0 18 16" width="18">
                  <path d="M17.97 14h-2.25l-0.95-3.25H10.7l-0.95 3.25H7.5l-0.69-2.33H3.53l-0.7 2.33H0.66l3.3-9.59h2.5l2.17 6.34 2.89-8.75h2.52l3.94 12zM6.36 10.13s-1.02-3.61-1.17-4.11h-0.08l-1.13 4.11h2.38z m7.92-1.05l-1.52-5.42h-0.06l-1.5 5.42h3.08z"></path>
              </svg>
            </div>
            <div class="editorSubMenu headings">
                <ul>
                    <li class="markdownShortcut" markdown-data="heading1"><h1>Heading 1</h1></li>
                    <li class="markdownShortcut" markdown-data="heading2"><h2>Heading 2</h2></li>
                    <li class="markdownShortcut" markdown-data="heading3"><h3>Heading 3</h3></li>
                </ul>
            </div>
        </li>
    </ul>
    <svg aria-hidden="true" class="octicon octicon-bold editorMarkdownIcon markdownShortcut" markdown-data="bold" height="16" version="1.1" viewBox="0 0 10 16" width="10" title="Test">
      <path d="M0 2h3.83c2.48 0 4.3 0.75 4.3 2.95 0 1.14-0.63 2.23-1.67 2.61v0.06c1.33 0.3 2.3 1.23 2.3 2.86 0 2.39-1.97 3.52-4.61 3.52H0V2z m3.66 4.95c1.67 0 2.38-0.66 2.38-1.69 0-1.17-0.78-1.61-2.34-1.61H2.13v3.3h1.53z m0.27 5.39c1.77 0 2.75-0.64 2.75-1.98 0-1.27-0.95-1.81-2.75-1.81H2.13v3.8h1.8z">
      </path>
    </svg>

    <svg aria-hidden="true" class="octicon octicon-italic editorMarkdownIcon markdownShortcut" markdown-data="italic" height="16" version="1.1" viewBox="0 0 6 16" width="6">
      <path d="M2.81 5h1.98L3 14H1l1.81-9z m0.36-2.7c0-0.7 0.58-1.3 1.33-1.3 0.56 0 1.13 0.38 1.13 1.03 0 0.75-0.59 1.3-1.33 1.3-0.58 0-1.13-0.38-1.13-1.03z"></path>
    </svg>


    <svg aria-hidden="true" class="octicon octicon-link editorMarkdownIcon markdownShortcut" markdown-data="link"  height="16" version="1.1" viewBox="0 0 16 16" width="16">
      <path d="M4 9h1v1h-1c-1.5 0-3-1.69-3-3.5s1.55-3.5 3-3.5h4c1.45 0 3 1.69 3 3.5 0 1.41-0.91 2.72-2 3.25v-1.16c0.58-0.45 1-1.27 1-2.09 0-1.28-1.02-2.5-2-2.5H4c-0.98 0-2 1.22-2 2.5s1 2.5 2 2.5z m9-3h-1v1h1c1 0 2 1.22 2 2.5s-1.02 2.5-2 2.5H9c-0.98 0-2-1.22-2-2.5 0-0.83 0.42-1.64 1-2.09v-1.16c-1.09 0.53-2 1.84-2 3.25 0 1.81 1.55 3.5 3 3.5h4c1.45 0 3-1.69 3-3.5s-1.5-3.5-3-3.5z"></path>
    </svg>


     <svg aria-hidden="true" class="octicon octicon-link editorMarkdownIcon markdownShortcut" markdown-data="horizontalLine"  height="16" version="1.1" viewBox="0 0 16 16" width="16">
      <path d="M0 8  L0 10 L64 10 L64 8" />
      </svg>
  </div>
</div>
<div class="editorDescrWrapper">
  <textarea class="editorDescr" name="threadDescr" placeholder="Description"></textarea>
  <div class="editorPreviewText descbox" name="threadDescr" placeholder="Preview" disabled></div>
</div>
