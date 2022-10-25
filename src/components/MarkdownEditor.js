import React from 'react'
import 'react-markdown-editor-lite/lib/index.css'
import { CKEditor } from '@ckeditor/ckeditor5-react'
const Editor = require('../ckeditor5/build/ckeditor')

function MarkdownEditor({ value, callback }) {
  return (
    <CKEditor
      editor={Editor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData()
        console.log({ event, editor, data })
        callback(data, data)
      }}
    />
  )
}

export default MarkdownEditor
