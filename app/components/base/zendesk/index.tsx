import { memo } from 'react'
import { IS_CE_EDITION, ZENDESK_WIDGET_KEY } from '@/config'

const Zendesk = () => {
  if (IS_CE_EDITION || !ZENDESK_WIDGET_KEY)
    return null

  return (
    <script
      id="ze-snippet"
      src={`https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_WIDGET_KEY}`}
    />
  )
}

export default memo(Zendesk)
