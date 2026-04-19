import React, { useState } from "react"
import { Input, Button } from "@/components/ui"

function LinkModal({ editor, onClose }) {
  const [url, setUrl] = useState("")

  const handleApply = () => {
    if (!url.trim()) return

    editor
      .chain()
      .focus()
      .setLink({ href: url })
      .run()

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-background w-96 rounded-lg shadow-lg p-5 space-y-4">

        <h3 className="text-lg font-semibold">Insert Link</h3>

        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          bgClass="bg-input-bg"
        />

        <div className="flex justify-end gap-2">
          <Button
            buttonName="Cancel"
            bgClass="bg-white"
            textClass="text-black"
            className="p-2 rounded"
            onClick={onClose}
          />

          <Button
            buttonName="Apply"
            onClick={handleApply}
            className="p-2 rounded"
          />
        </div>

      </div>
    </div>
  )
}

export default LinkModal