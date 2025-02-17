import { AssetManagerConfig } from 'grapesjs'
import { PayloadImage, createImage } from '@/app/(frontend)/_actions/images'
import type { Editor } from 'grapesjs'

export const getAssetManagerConfig = (
  editor: Editor,
  images: PayloadImage[] = [],
): AssetManagerConfig => ({
  assets: images.map((image) => ({
    type: 'image',
    src: image.url,
    height: image.height,
    width: image.width,
    category: image.category,
    name: image.alt,
  })),
  upload: true,
  dropzone: true,
  openAssetsOnDrop: true,
  dropzoneContent: 'Drop files here or click to upload',
  uploadFile: async function (e: DragEvent | Event) {
    try {
      console.log('Upload started')
      const files =
        (e as DragEvent).dataTransfer?.files || (e.target as HTMLInputElement)?.files || []

      console.log('Files to upload:', files.length)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log('Processing file:', file.name, file.type)

        if (file.type.startsWith('image/')) {
          try {
            console.log('Uploading image to server...')
            const uploadedImage = await createImage(file)
            console.log('Server response:', uploadedImage)

            if (uploadedImage && editor?.AssetManager) {
              console.log('Creating asset for GrapesJS...')
              const asset = {
                type: 'image',
                src: uploadedImage.url,
                height: uploadedImage.height || 0,
                width: uploadedImage.width || 0,
                category: uploadedImage.category,
                name: uploadedImage.alt || uploadedImage.filename,
              }
              console.log('Adding asset to AssetManager:', asset)
              editor.AssetManager.add(asset)
              console.log('Refreshing AssetManager view')
              editor.AssetManager.render()
            }
          } catch (uploadError) {
            console.error('Error in image upload:', uploadError)
          }
        }
      }
    } catch (error) {
      console.error('General upload error:', error)
    }
  },
  stylePrefix: 'am-',
  multiUpload: true,
  showUrlInput: true,
})
