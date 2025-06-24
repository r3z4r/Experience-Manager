'use client'

import type { Editor } from 'grapesjs'

/**
 * Registers a custom trait type `flow-key` so editors can mark inputs with a
 * context key used by the Flow system. Adds the attribute `data-flow-key` to
 * the component's HTML element.
 */
export function registerFlowKeyTrait(editor: Editor) {
  const tm = editor.TraitManager

  // Avoid double-registration when editor hot-reloads
  if (tm.getType('flow-key')) return

  const TARGET_TAGS = ['input', 'textarea', 'select', 'button'] as const
  type TargetTag = (typeof TARGET_TAGS)[number]

  const ensureTraitOnComponent = (comp: any) => {
    const tag = comp.get('tagName') as TargetTag | string | undefined
    if (!tag || !TARGET_TAGS.includes(tag as TargetTag)) return
    const traits = (comp.get('traits') as any[]) ?? []
    const exists = traits.some((t) => t.get('type') === 'flow-key')
    if (!exists) {
      comp.addTrait({ type: 'flow-key', label: 'Flow Key', name: 'flow-key', changeProp: 1 })
    }
  }

  // When editor loads, walk existing components
  editor.on('load', () => {
    editor.getWrapper().find('*').forEach(ensureTraitOnComponent)
  })

  // Whenever a component is added, check it
  editor.on('component:add', ensureTraitOnComponent)

  tm.addType('flow-key', {
    createInput({ trait }) {
      const el = document.createElement('input')
      el.type = 'text'
      el.placeholder = 'context key (e.g. email)'
      el.value = trait.getValue() as string | ''
      el.addEventListener('input', (ev) => {
        const target = ev.target as HTMLInputElement
        trait.setValue(target.value)
      })

      return el
    },
    onUpdate({ elInput, component, trait }) {
      const value = trait.getValue() as string
      ;(elInput as HTMLInputElement).value = value || ''
      if (value) {
        component.addAttributes({ 'data-flow-key': value })
      } else {
        component.removeAttributes('data-flow-key')
      }
    },
  })

  // Auto-attach trait to common form elements
  const types = ['input', 'textarea', 'select', 'button']
  types.forEach((type) => {
    const dom = editor.DomComponents.getType(type)
    if (!dom) return
    const model = dom.model
    const defaults = model.prototype.defaults as any
    // Avoid adding twice
    const hasTrait = (defaults.traits ?? []).some((t: any) => t?.type === 'flow-key')
    if (!hasTrait) {
      defaults.traits = [
        ...(defaults.traits || []),
        {
          type: 'flow-key',
          name: 'flow-key',
          label: 'Flow Key',
          changeProp: 1,
        },
      ]
    }
  })
}
