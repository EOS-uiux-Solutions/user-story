import React, { useState } from 'react'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

const mdParser = new MarkdownIt().set({ html: true })

function MarkdownEditor({ value, callback }) {
  const [userInput, setUserInput] = useState('')

  return (
    <MdEditor
      config={{
        view: {
          html: false
        }
      }}
      plugins={[
        'header',
        'font-bold',
        'font-italic',
        'list-unordered',
        'list-ordered',
        'link',
        'mode-toggle'
      ]}
      style={{ height: '350px' }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={({ html, text }) => {
        if (typeof value === typeof undefined) {
          setUserInput(text)
        }
        callback(html, text)
      }}
      value={value ?? userInput}
    />
  )
}

export default MarkdownEditor
