export const EDITOR_TOOLBAR_MENU = [
    // Bold & Italic
    [
        {
            icon: "bx:bold",
            key: "bold",
            title: "Bold",
            action: (editor) => editor.chain().focus().toggleBold().run(),
        },
        {
            icon: "majesticons:italic",
            key: "italic",
            title: "Italic",
            action: (editor) => editor.chain().focus().toggleItalic().run(),
        },
    ],

    // Headings
    [
        {
            icon: "heroicons:h1-16-solid",
            key: "h1",
            title: "Heading 1",
            action: (editor) =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            icon: "heroicons:h2-16-solid",
            key: "h2",
            title: "Heading 2",
            action: (editor) =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            icon: "heroicons:h3-16-solid",
            key: "h3",
            title: "Heading 3",
            action: (editor) =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),

        },
    ],

    // Lists
    [
        {
            icon: "pixelarticons:list",
            key: "bulletList",
            title: "Bullet List",
            action: (editor) =>
                editor.chain().focus().toggleBulletList().run(),
        },
        {
            icon: "f7:list-number",
            key: "orderedList",
            title: "Ordered List",
            action: (editor) =>
                editor.chain().focus().toggleOrderedList().run(),

        },
    ],

    // Link & Code
    [
        {
            icon: "si:link-fill",
            key: "link",
            type: "link",
            title: "Insert Link",
        },
        {
            key: "inlineCode",
            icon: "mdi:code-tags",
            title: "Inline Code",
            action: (editor) =>
                editor.chain().focus().toggleCode().run(),
        },
        {
            key: "codeBlock",
            icon: "ci:window-code-block",
            title: "Code Block",
            action: (editor) =>
                editor.chain().focus().toggleCodeBlock().run(),
        },

    ],
]