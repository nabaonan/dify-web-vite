import type { FC } from 'react'
import React from 'react'
import { IS_CE_EDITION } from '@/config'

export enum GaType {
  admin = 'admin',
  webapp = 'webapp',
}

const gaIdMaps = {
  [GaType.admin]: 'G-DM9497FN4V',
  [GaType.webapp]: 'G-2MFWXK7WYT',
}

export type IGAProps = {
  gaType: GaType
}

const GA: FC<IGAProps> = ({
  gaType,
}) => {
  if (IS_CE_EDITION)
    return null

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaIdMaps[gaType]}`}
      ></script>
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaIdMaps[gaType]}');
          `,
        }}
      >
      </script>
      {/* Cookie banner */}
      <script
        id="cookieyes"
        src='https://cdn-cookieyes.com/client_data/2a645945fcae53f8e025a2b1/script.js'
      ></script>
    </>

  )
}
export default React.memo(GA)
