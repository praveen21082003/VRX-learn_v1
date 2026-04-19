import React, { useState } from "react"
import { Button } from "@/components/ui"
import { EDITOR_TOOLBAR_MENU } from "@/config/editorToolBar"
import { useEditorState } from "@tiptap/react"
import LinkModal from "./LinkModal"

function EditorMenu({ editor }) {
    const [isLinkOpen, setIsLinkOpen] = useState(false)

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            h1: editor.isActive("heading", { level: 1 }),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            codeBlock: editor.isActive("codeBlock"),
            link: editor.isActive("link"),
        }),
    })


    if (!editor) return null

    return (
        <header className="flex border-b-2 border-primary-border bg-[#F8F9FA] dark:bg-surface-primary-dark p-2">
            {EDITOR_TOOLBAR_MENU.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className={`flex px-2 ${groupIndex !== 0 ? "border-l border-primary-border" : ""
                        }`}
                >
                    {isLinkOpen && (
                        <LinkModal
                            editor={editor}
                            onClose={() => setIsLinkOpen(false)}
                        />
                    )}
                    {group.map((item, index) => (
                        <Button
                            key={index}
                            frontIconHeight="24px"
                            frontIconWidth="24px"
                            bgClass="bg-none"
                            frontIconName={item.icon}
                            onClick={() => {
                                if (item.type === "link") {
                                    setIsLinkOpen(true)
                                } else {
                                    item.action(editor)
                                }
                            }}
                            textClass={editorState[item.key] && "text-blue-600"}
                        />
                    ))}
                </div>
            ))}
        </header>
    )
}

export default EditorMenu
