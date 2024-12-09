import { AssetManagerConfig } from 'grapesjs'
import { PayloadImage, uploadImage } from '@/app/(frontend)/_actions/images'
import type { Editor } from 'grapesjs'

export const getAssetManagerConfig = (images: PayloadImage[] = []): AssetManagerConfig => ({
  assets: images.map((image) => ({
    type: 'image',
    src: `${process.env.NEXT_PUBLIC_APP_URL}${image.url}`,
    height: image.height,
    width: image.width,
    category: image.category,
    name: image.title || image.filename,
    thumbnail: image.sizes?.thumbnail?.url
      ? `${process.env.NEXT_PUBLIC_APP_URL}${image.sizes.thumbnail.url}`
      : `${process.env.NEXT_PUBLIC_APP_URL}${image.url}`,
  })),
  upload: '/api/upload-images',
  uploadFile: async (e: DragEvent | Event) => {
    try {
      const files =
        (e as DragEvent).dataTransfer?.files || (e.target as HTMLInputElement)?.files || []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          const uploadedImage = await uploadImage(file)
          const editor = (e.target as { editor?: Editor })?.editor

          editor?.AssetManager.add({
            type: 'image',
            src: `${process.env.NEXT_PUBLIC_APP_URL}${uploadedImage.url}`,
            height: uploadedImage.height,
            width: uploadedImage.width,
            category: uploadedImage.category,
            name: uploadedImage.title || uploadedImage.filename,
            thumbnail: uploadedImage.sizes?.thumbnail?.url
              ? `${process.env.NEXT_PUBLIC_APP_URL}${uploadedImage.sizes.thumbnail.url}`
              : `${process.env.NEXT_PUBLIC_APP_URL}${uploadedImage.url}`,
          })
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  },
  dropzone: true,
  stylePrefix: 'am-',
  multiUpload: true,
  showUrlInput: true,
  categories: [
    { id: 'hero', label: 'Hero Images' },
    { id: 'doctors', label: 'Doctor Images' },
    { id: 'services', label: 'Service Images' },
    { id: 'logos', label: 'Logos' },
  ],
})
