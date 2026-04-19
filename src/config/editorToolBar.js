export const EDITOR_TOOLBAR_MENU = [
    // Bold & Italic
    [
        {
            icon: "bx:bold",
            key: "bold",
            action: (editor) => editor.chain().focus().toggleBold().run(),
        },
        {
            icon: "majesticons:italic",
            key: "italic",
            action: (editor) => editor.chain().focus().toggleItalic().run(),
        },
    ],

    // Headings
    [
        {
            icon: "heroicons:h1-16-solid",
            key: "h1",
            action: (editor) =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            icon: "heroicons:h2-16-solid",
            key: "h2",
            action: (editor) =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            icon: "heroicons:h3-16-solid",
            key: "h3",
            action: (editor) =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),

        },
    ],

    // Lists
    [
        {
            icon: "pixelarticons:list",
            key: "bulletList",
            action: (editor) =>
                editor.chain().focus().toggleBulletList().run(),
        },
        {
            icon: "f7:list-number",
            key: "orderedList",
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
        },
        {
            icon: "mdi:code",
            key: "codeBlock",
            action: (editor) =>
                editor.chain().focus().toggleCode().run(),
        },
    ],
]
