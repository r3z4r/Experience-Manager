import { AssetManagerConfig } from 'grapesjs'
import { PayloadImage } from '@/app/(frontend)/_actions/images'

export const getAssetManagerConfig = (images: PayloadImage[]): AssetManagerConfig => ({
  assets: (images || []).map((image) => ({
    type: 'image',
    src: image.url,
    height: image.height,
    width: image.width,
    category: image.category,
  })),
  upload: false,
  categories: [
    { id: 'hero', label: 'Hero Images' },
    { id: 'doctors', label: 'Doctor Images' },
    { id: 'services', label: 'Service Images' },
    { id: 'logos', label: 'Logos' },
  ],
})
